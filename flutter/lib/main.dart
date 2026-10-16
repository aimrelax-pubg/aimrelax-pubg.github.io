
import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:wakelock_plus/wakelock_plus.dart';
import 'package:webview_flutter/webview_flutter.dart';

const String supabaseUrl =
    'https://hvhlrbfjloiahbqmnrly.supabase.co';

const String supabaseAnonKey =
    'sb_publishable_EcZUkLdUCVv3qWDD7jlvhg_OjTYu1jA';

const MethodChannel native =
    MethodChannel('aimrelax.live/livekit');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  final messaging = FirebaseMessaging.instance;
  final notificationSettings = await messaging.requestPermission(
    alert: true,
    badge: true,
    sound: true,
  );
  debugPrint('AIMRELAX FCM permission: ${notificationSettings.authorizationStatus}');
  final fcmToken = await messaging.getToken();
  if (fcmToken != null) {
    debugPrint('AIMRELAX FCM TOKEN: $fcmToken');
  }
  FirebaseMessaging.onMessage.listen((RemoteMessage message) {
    debugPrint('AIMRELAX foreground push: ${message.notification?.title ?? message.data}');
  });
  FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
    debugPrint('AIMRELAX push opened: ${message.messageId}');
  });

  await Supabase.initialize(
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  );

  runApp(const AimrelaxLiveApp());
}

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  debugPrint('AIMRELAX background push: ${message.messageId}');
}

class AimrelaxLiveApp extends StatelessWidget {
  const AimrelaxLiveApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'AIMRELAX LIVE',
      theme: ThemeData(
        brightness: Brightness.dark,
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFF080808),
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.orange,
          brightness: Brightness.dark,
        ),
      ),
      home: const AppShell(),
    );
  }
}


/// Hosts the website and LIVE panel in one app and keeps their Supabase
/// sessions synchronized. The website sends only its refresh token over a
/// JavaScript channel available inside this app's WebView.
class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  final GlobalKey<SitePageState> _siteKey = GlobalKey<SitePageState>();
  final SupabaseClient _db = Supabase.instance.client;
  StreamSubscription<AuthState>? _authSubscription;
  StreamSubscription<String>? _fcmTokenSubscription;
  int _selectedTab = 0;
  String? _lastSyncedRefreshToken;

  @override
  void initState() {
    super.initState();
    _fcmTokenSubscription = FirebaseMessaging.instance.onTokenRefresh.listen((token) {
      final userId = _db.auth.currentUser?.id;
      if (userId != null) _savePushToken(userId, token);
    });
    _authSubscription = _db.auth.onAuthStateChange.listen((state) {
      final session = state.session;
      if (session != null) {
        _syncSessionToWebsite(session);
        _registerPushToken(session.user.id);
      } else if (state.event == AuthChangeEvent.signedOut) {
        // Only clear the website after an explicit sign-out. INITIAL_SESSION
        // with no native session must not erase a valid website login.
        _lastSyncedRefreshToken = null;
        _siteKey.currentState?.clearSession();
      }
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final session = _db.auth.currentSession;
      if (session != null) _syncSessionToWebsite(session);
    });
  }

  Future<void> _registerPushToken(String userId) async {
    try {
      final token = await FirebaseMessaging.instance.getToken();
      if (token != null && token.isNotEmpty) await _savePushToken(userId, token);
    } catch (error) {
      debugPrint('AIMRELAX push token registration failed: $error');
    }
  }

  Future<void> _savePushToken(String userId, String token) async {
    try {
      await _db.from('device_push_tokens').upsert({
        'user_id': userId,
        'token': token,
        'platform': 'android',
        'updated_at': DateTime.now().toUtc().toIso8601String(),
      }, onConflict: 'token');
    } catch (error) {
      // This needs the device_push_tokens table and its RLS policy in Supabase.
      debugPrint('AIMRELAX push token could not be saved to Supabase: $error');
    }
  }

  Future<void> _syncSessionToWebsite(Session session) async {
    final refreshToken = session.refreshToken;
    if (refreshToken == null ||
        refreshToken.isEmpty ||
        refreshToken == _lastSyncedRefreshToken) return;
    final synced = await _siteKey.currentState?.syncSession(session) ?? false;
    // Keep it pending if the WebView is still loading; page-ready will retry.
    if (synced) _lastSyncedRefreshToken = refreshToken;
  }

  Future<void> _handleWebsiteAuthMessage(String message) async {
    try {
      final decoded = jsonDecode(message);
      if (decoded is! Map) return;
      final event = decoded['event']?.toString();
      if (event == 'SIGNED_OUT') {
        if (_db.auth.currentSession != null) await _db.auth.signOut();
        return;
      }
      final refreshToken = decoded['refresh_token']?.toString();
      if (refreshToken == null || refreshToken.isEmpty) return;
      if (_db.auth.currentSession?.refreshToken == refreshToken) return;
      await _db.auth.setSession(refreshToken);
    } catch (_) {
      // Ignore malformed bridge messages; normal website navigation continues.
    }
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    _fcmTokenSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedTab,
        children: [
          SitePage(
            key: _siteKey,
            onAuthMessage: _handleWebsiteAuthMessage,
            onPageReady: () {
              final session = _db.auth.currentSession;
              if (session != null) _syncSessionToWebsite(session);
            },
          ),
          LiveHome(onOpenWebsite: () => setState(() => _selectedTab = 0)),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedTab,
        onDestinationSelected: (index) =>
            setState(() => _selectedTab = index),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.language),
            label: 'Կայք',
          ),
          NavigationDestination(
            icon: Icon(Icons.videocam),
            label: 'LIVE',
          ),
        ],
      ),
    );
  }
}

class SitePage extends StatefulWidget {
  const SitePage({
    super.key,
    required this.onAuthMessage,
    required this.onPageReady,
  });

  final Future<void> Function(String message) onAuthMessage;
  final VoidCallback onPageReady;

  @override
  State<SitePage> createState() => SitePageState();
}

class SitePageState extends State<SitePage> {
  static const String _siteUrl = 'https://aimrelax-pubg.github.io/';
  static const String _storageKey =
      'sb-hvhlrbfjloiahbqmnrly-auth-token';
  late final WebViewController _controller;
  bool _loading = true;
  bool _pageReady = false;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'AuthBridge',
        onMessageReceived: (message) {
          widget.onAuthMessage(message.message);
        },
      )
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) {
            if (mounted) setState(() => _loading = true);
            _pageReady = false;
          },
          onPageFinished: (_) async {
            _pageReady = true;
            await _installAuthBridge();
            if (mounted) setState(() => _loading = false);
            widget.onPageReady();
          },
          onWebResourceError: (_) {
            if (mounted) setState(() => _loading = false);
          },
        ),
      )
      ..loadRequest(Uri.parse(_siteUrl));
  }

  Future<void> _refreshSite() async {
    if (!mounted) return;
    setState(() => _loading = true);
    try {
      // Clear cached web resources so the latest published site is fetched.
      await _controller.clearCache();
      await _controller.reload();
    } catch (error) {
      if (mounted) setState(() => _loading = false);
      debugPrint('AIMRELAX site refresh failed: $error');
    }
  }

  Future<void> _installAuthBridge() async {
    // Do not send a token back to Flutter after Flutter has just written the
    // session into WebView storage. For normal site logins, forward the token.
    await _controller.runJavaScript('''
      (function() {
        const key = '$_storageKey';
        if (window.__aimrelaxAuthBridgeInstalled) return;
        window.__aimrelaxAuthBridgeInstalled = true;
        const originalSetItem = Storage.prototype.setItem;
        const originalRemoveItem = Storage.prototype.removeItem;
        window.__aimrelaxNativeSessionWrite = false;
        function sendCurrentSession() {
          if (window.__aimrelaxNativeSessionWrite) return;
          try {
            const raw = localStorage.getItem(key);
            if (!raw) return;
            const session = JSON.parse(raw);
            if (session && session.refresh_token) {
              AuthBridge.postMessage(JSON.stringify({
                event: 'SIGNED_IN',
                refresh_token: session.refresh_token
              }));
            }
          } catch (_) {}
        }
        Storage.prototype.setItem = function(k, v) {
          originalSetItem.call(this, k, v);
          if (k === key && this === localStorage) sendCurrentSession();
        };
        Storage.prototype.removeItem = function(k) {
          originalRemoveItem.call(this, k);
          if (k === key && this === localStorage &&
              !window.__aimrelaxNativeSessionWrite) {
            AuthBridge.postMessage(JSON.stringify({event: 'SIGNED_OUT'}));
          }
        };
        if (sessionStorage.getItem('__aimrelax_skip_initial_auth_bridge') === '1') {
          sessionStorage.removeItem('__aimrelax_skip_initial_auth_bridge');
        } else {
          sendCurrentSession();
        }
      })();
    ''');
  }

  Future<bool> syncSession(Session session) async {
    final refreshToken = session.refreshToken;
    if (!_pageReady || refreshToken == null || refreshToken.isEmpty) return false;
    final sessionJson = jsonEncode(session.toJson());
    final encoded = jsonEncode(sessionJson);
    await _controller.runJavaScript('''
      (function() {
        try {
          window.__aimrelaxNativeSessionWrite = true;
          sessionStorage.setItem('__aimrelax_skip_initial_auth_bridge', '1');
          localStorage.setItem('$_storageKey', $encoded);
          window.__aimrelaxNativeSessionWrite = false;
          location.reload();
        } catch (_) {
          window.__aimrelaxNativeSessionWrite = false;
        }
      })();
    ''');
    return true;
  }

  Future<void> clearSession() async {
    if (!_pageReady) return;
    await _controller.runJavaScript('''
      (function() {
        try {
          window.__aimrelaxNativeSessionWrite = true;
          localStorage.removeItem('$_storageKey');
          window.__aimrelaxNativeSessionWrite = false;
          location.reload();
        } catch (_) {
          window.__aimrelaxNativeSessionWrite = false;
        }
      })();
    ''');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            WebViewWidget(controller: _controller),
            if (_loading)
              const Align(
                alignment: Alignment.topCenter,
                child: LinearProgressIndicator(),
              ),
            Positioned(
              top: 8,
              left: 8,
              child: Material(
                color: Colors.black.withValues(alpha: 0.72),
                shape: const CircleBorder(),
                elevation: 4,
                child: IconButton(
                  tooltip: 'Թարմացնել կայքը',
                  onPressed: _loading ? null : _refreshSite,
                  icon: const Icon(Icons.refresh, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class LiveHome extends StatefulWidget {
  const LiveHome({super.key, required this.onOpenWebsite});
  final VoidCallback onOpenWebsite;

  @override
  State<LiveHome> createState() => _LiveHomeState();
}

class _LiveHomeState extends State<LiveHome> {
  final TextEditingController titleController =
      TextEditingController(text: 'PUBG LIVE');

  final SupabaseClient db = Supabase.instance.client;

  Timer? heartbeatTimer;
  Timer? commentRefreshTimer;
  bool commentsRefreshBusy = false;
  StreamSubscription<List<Map<String, dynamic>>>? commentSubscription;
  List<String> recentComments = [];

  bool busy = false;
  bool live = false;

  // Microphone state
  bool micEnabled = true;
  bool overlayVisible = false;
  bool livePaused = false;

  String? streamId;
  String statusText = 'Ready to go LIVE';

  int viewers = 0;

  @override
  void initState() {
    super.initState();
    native.setMethodCallHandler((call) async {
      if (call.method == 'overlayMicChanged' && mounted) {
        final value = call.arguments;
        if (value is bool) setState(() => micEnabled = value);
      } else if (call.method == 'overlayPauseChanged' && mounted) {
        final value = call.arguments == true;
        setState(() {
          livePaused = value;
          statusText = value ? 'LIVE is paused' : 'LIVE is active';
        });
        final id = streamId;
        if (id != null && id.isNotEmpty) {
          try {
            await db.from('live_streams')
                .update({'status': value ? 'paused' : 'live'})
                .eq('id', id);
          } catch (_) {
            if (mounted) {
              setState(() {
                statusText = value
                    ? 'LIVE paused, but viewer status could not sync'
                    : 'LIVE resumed, but viewer status could not sync';
              });
            }
          }
        }
      } else if (call.method == 'overlayStopRequested' && mounted) {
        await endLive();
      }
    });
  }

  @override
  void dispose() {
    heartbeatTimer?.cancel();
    commentRefreshTimer?.cancel();
    commentSubscription?.cancel();
    titleController.dispose();
    WakelockPlus.disable();
    super.dispose();
  }

  // Toggle microphone without stopping the game-audio stream.
  // Native Android code must implement "setMicEnabled".
  Future<void> toggleMic() async {
    if (!live || busy) return;

    final bool nextValue = !micEnabled;

    setState(() {
      busy = true;
      statusText = nextValue
          ? 'Enabling microphone...'
          : 'Muting microphone...';
    });

    try {
      final result = await native.invokeMethod<bool>(
        'setMicEnabled',
        <String, dynamic>{
          'enabled': nextValue,
        },
      );

      if (result != true) {
        throw Exception('Android did not confirm microphone state');
      }

      if (!mounted) return;

      setState(() {
        micEnabled = nextValue;
        busy = false;
        statusText = micEnabled
            ? 'LIVE is active · Microphone ON'
            : 'LIVE is active · Microphone OFF';
      });
      await updateOverlay();
    } catch (e) {
      if (!mounted) return;

      setState(() {
        busy = false;
        statusText = 'Microphone error: $e';
      });

      showMessage(
        'Microphone error:\n$e',
        error: true,
      );
    }
  }

  void startLiveComments() {
    commentSubscription?.cancel();
    commentRefreshTimer?.cancel();
    final id = streamId;
    if (id == null || id.isEmpty) return;

    // Realtime stream for instant updates.
    commentSubscription = db
        .from('live_comments')
        .stream(primaryKey: ['id'])
        .eq('stream_id', id)
        .order('created_at')
        .listen((rows) {
      _applyRecentComments(rows);
    }, onError: (error) {
      debugPrint('LIVE comments realtime error: $error');
    });

    // Polling fallback also works if the table is missing from supabase_realtime.
    refreshRecentComments();
    commentRefreshTimer = Timer.periodic(
      const Duration(seconds: 3),
      (_) => refreshRecentComments(),
    );
  }

  void _applyRecentComments(List<Map<String, dynamic>> rows) {
    final next = rows
        .skip(rows.length > 3 ? rows.length - 3 : 0)
        .map((row) {
          final author = row['author_name']?.toString() ?? 'Viewer';
          final message = row['message']?.toString() ?? '';
          return '$author: $message';
        })
        .toList();
    if (next.join('\\n') == recentComments.join('\\n')) return;
    recentComments = next;
    updateOverlay();
  }

  Future<void> refreshRecentComments() async {
    final id = streamId;
    if (id == null || id.isEmpty || !live || commentsRefreshBusy) return;
    commentsRefreshBusy = true;
    try {
      final rows = await db
          .from('live_comments')
          .select('id,author_name,message,created_at')
          .eq('stream_id', id)
          .order('created_at', ascending: false)
          .limit(3);
      final latest = List<Map<String, dynamic>>.from(rows).reversed.toList();
      _applyRecentComments(latest);
    } catch (error) {
      debugPrint('LIVE comments polling error: $error');
    } finally {
      commentsRefreshBusy = false;
    }
  }

  Future<void> showOverlay() async {
    if (!live) return;
    try {
      final shown = await native.invokeMethod<bool>('showOverlay', {
        'viewers': viewers,
        'mic': micEnabled,
        'paused': livePaused,
        'comments': recentComments,
      });
      if (shown != true) {
        showMessage('Միացրու «Display over other apps» թույլտվությունը, հետո նորից սեղմիր կոճակը։');
      } else {
        overlayVisible = true;
        await updateOverlay();
        showMessage('Լողացող LIVE պատուհանը միացված է։');
      }
    } catch (e) {
      showMessage('Չհաջողվեց բացել LIVE պատուհանը։ $e', error: true);
    }
  }

  Future<void> updateOverlay() async {
    if (!live || !overlayVisible) return;
    try {
      await native.invokeMethod('updateOverlay', {
        'viewers': viewers,
        'mic': micEnabled,
        'paused': livePaused,
        'comments': recentComments,
      });
    } catch (_) {}
  }

  Future<void> goLive() async {
    final session = db.auth.currentSession;

    if (session == null) {
      showMessage(
        'Մուտք գործիր AIMRELAX հաշիվ',
        error: true,
      );
      return;
    }

    final liveTitle = titleController.text.trim();

    if (liveTitle.isEmpty) {
      showMessage(
        'Գրիր LIVE-ի անունը',
        error: true,
      );
      return;
    }

    if (busy || live) return;

    setState(() {
      busy = true;
      statusText = 'Creating LIVE...';
    });

    try {
      // Prefer the public profile nickname; only fall back to Auth metadata/email.
      var userName = (session.user.userMetadata?['nickname'] ?? '').toString().trim();
      try {
        final profile = await db
            .from('profiles')
            .select('nickname')
            .eq('id', session.user.id)
            .maybeSingle();
        final profileNickname = (profile?['nickname'] ?? '').toString().trim();
        if (profileNickname.isNotEmpty) userName = profileNickname;
      } catch (_) {
        // Auth metadata/email fallback below keeps LIVE start working if profile lookup fails.
      }
      if (userName.isEmpty) {
        userName = session.user.email?.split('@').first ?? 'Streamer';
      }

      // 1. Create stream in Supabase.
      final created = await db.functions.invoke(
        'live-create',
        body: {
          'title': liveTitle,
          'category': 'PUBG',
          'streamer_name': userName,
        },
      );

      final createdData = _map(created.data);

      if (createdData['error'] != null) {
        throw Exception(createdData['error'].toString());
      }

      final stream = _map(createdData['stream']);
      final createdStreamId = stream['id']?.toString();

      if (createdStreamId == null || createdStreamId.isEmpty) {
        throw Exception('live-create did not return stream id');
      }

      streamId = createdStreamId;

      // 2. Get LiveKit publisher token.
      setState(() {
        statusText = 'Preparing LiveKit...';
      });

      final tokenResponse = await db.functions.invoke(
        'live-token',
        body: {
          'stream_id': streamId,
          'role': 'publisher',
        },
      );

      final tokenData = _map(tokenResponse.data);

      if (tokenData['error'] != null) {
        throw Exception(tokenData['error'].toString());
      }

      final token = tokenData['token']?.toString();
      final url = tokenData['url']?.toString();

      if (token == null || token.isEmpty) {
        throw Exception('LiveKit token is missing');
      }

      if (url == null || url.isEmpty) {
        throw Exception('LiveKit URL is missing');
      }

      // 3. Start native Android LIVE.
      setState(() {
        statusText = 'Waiting for screen permission...';
      });

      final nativeResult = await native.invokeMethod<bool>(
        'startLive',
        {
          'token': token,
          'url': url,
        },
      );

      if (nativeResult != true) {
        throw Exception('Android LiveKit start failed');
      }

      // Mark the stream as live.
      await db
          .from('live_streams')
          .update({
            'status': 'live',
          })
          .eq('id', streamId!);

      await WakelockPlus.enable();

      if (!mounted) return;

      setState(() {
        live = true;
        busy = false;
        micEnabled = true;
        livePaused = false;
        viewers = 0;
        statusText = 'LIVE is active · Microphone ON';
      });

      heartbeatTimer?.cancel();

      heartbeatTimer = Timer.periodic(
        const Duration(seconds: 15),
        (_) => refreshViewers(),
      );

      await refreshViewers();
      startLiveComments();
    } catch (e) {
      await cleanupFailedStart();

      if (!mounted) return;

      setState(() {
        busy = false;
        live = false;
        micEnabled = true;
        statusText = 'LIVE failed';
      });

      showMessage(
        'LIVE start error:\n${e.toString()}',
        error: true,
      );
    }
  }

  Future<void> refreshViewers() async {
    final id = streamId;

    if (id == null || id.isEmpty || !live) return;

    try {
      final response = await db.functions.invoke(
        'live-heartbeat',
        body: {
          'stream_id': id,
          'session_id': 'streamer',
        },
      );

      final data = _map(response.data);
      final value = data['viewer_count'];

      int count = 0;

      if (value is int) {
        count = value;
      } else if (value is num) {
        count = value.toInt();
      } else if (value != null) {
        count = int.tryParse(value.toString()) ?? 0;
      }

      if (!mounted) return;

      setState(() {
        viewers = count;
      });
      await updateOverlay();
    } catch (_) {
      // Heartbeat errors must not stop LIVE.
    }
  }

  Future<void> endLive() async {
    final id = streamId;

    if (id == null || id.isEmpty || busy) return;

    setState(() {
      busy = true;
      statusText = 'Ending LIVE...';
    });

    try {
      // Stop Android LiveKit first.
      try {
        await native.invokeMethod('hideOverlay');
      } catch (_) {}
      overlayVisible = false;
      try {
        await native.invokeMethod('stopLive');
      } catch (_) {}

      // Mark stream ended.
      try {
        await db.functions.invoke(
          'live-end',
          body: {
            'stream_id': id,
          },
        );
      } catch (_) {}

      heartbeatTimer?.cancel();
      heartbeatTimer = null;
      commentRefreshTimer?.cancel();
      commentRefreshTimer = null;
      await commentSubscription?.cancel();
      commentSubscription = null;
      recentComments = [];

      await WakelockPlus.disable();

      if (!mounted) return;

      setState(() {
        live = false;
        busy = false;
        micEnabled = true;
        livePaused = false;
        overlayVisible = false;
        streamId = null;
        viewers = 0;
        statusText = 'LIVE ended';
      });

      showMessage('LIVE ended');
    } catch (e) {
      heartbeatTimer?.cancel();
      heartbeatTimer = null;
      commentRefreshTimer?.cancel();
      commentRefreshTimer = null;
      await commentSubscription?.cancel();
      commentSubscription = null;

      await WakelockPlus.disable();

      if (!mounted) return;

      setState(() {
        live = false;
        busy = false;
        micEnabled = true;
        livePaused = false;
        streamId = null;
        viewers = 0;
        statusText = 'LIVE ended';
      });

      showMessage(
        'LIVE stopped with warning:\n$e',
        error: true,
      );
    }
  }

  Future<void> cleanupFailedStart() async {
    heartbeatTimer?.cancel();
    heartbeatTimer = null;
    commentRefreshTimer?.cancel();
    commentRefreshTimer = null;
    await commentSubscription?.cancel();
    commentSubscription = null;

    try {
      await native.invokeMethod('stopLive');
    } catch (_) {}

    final id = streamId;

    if (id != null && id.isNotEmpty) {
      try {
        await db.functions.invoke(
          'live-end',
          body: {
            'stream_id': id,
          },
        );
      } catch (_) {}
    }

    await WakelockPlus.disable();

    streamId = null;
    viewers = 0;
    micEnabled = true;
  }

  Map<String, dynamic> _map(dynamic value) {
    if (value is Map<String, dynamic>) {
      return value;
    }

    if (value is Map) {
      return Map<String, dynamic>.from(value);
    }

    throw Exception('Invalid server response');
  }

  void showMessage(
    String message, {
    bool error = false,
  }) {
    if (!mounted) return;

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          duration: const Duration(seconds: 5),
          backgroundColor: error ? Colors.red.shade900 : null,
          content: Text(
            message,
            style: const TextStyle(fontSize: 14),
          ),
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    if (db.auth.currentSession == null) {
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.videocam, size: 76, color: Colors.orange),
                  const SizedBox(height: 20),
                  const Text('AIMRELAX LIVE', style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 12),
                  const Text('Մուտք գործիր միայն «Կայք» բաժնից՝ կայքի և LIVE-ի համար։', textAlign: TextAlign.center),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: FilledButton.icon(
                      onPressed: widget.onOpenWebsite,
                      icon: const Icon(Icons.language),
                      label: const Text('ԲԱՑԵԼ ԿԱՅՔԻ ԲԱԺԻՆԸ'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(22, 24, 22, 30),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                'AIMRELAX LIVE',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.5,
                ),
              ),

              const SizedBox(height: 6),

              const Text(
                'PUBG LIVE STREAMING',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),

              const SizedBox(height: 30),

              // LIVE STATUS CARD
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFF121212),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: live ? Colors.red : Colors.white12,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: live ? Colors.red : Colors.grey,
                      ),
                    ),

                    const SizedBox(width: 12),

                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            live ? '🔴 LIVE' : 'OFFLINE',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: live ? Colors.red : Colors.white70,
                            ),
                          ),

                          const SizedBox(height: 3),

                          Text(
                            statusText,
                            style: const TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
                    ),

                    if (live)
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          const Text(
                            'VIEWERS',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 10,
                            ),
                          ),

                          Text(
                            '$viewers',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              TextField(
                controller: titleController,
                enabled: !live && !busy,
                textInputAction: TextInputAction.done,
                decoration: const InputDecoration(
                  labelText: 'LIVE title',
                  hintText: 'PUBG LIVE',
                  prefixIcon: Icon(Icons.title),
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Color(0xFF111111),
                ),
              ),

              const SizedBox(height: 20),

              if (!live)
                SizedBox(
                  height: 56,
                  child: FilledButton.icon(
                    onPressed: busy ? null : goLive,
                    icon: busy
                        ? const SizedBox(
                            width: 21,
                            height: 21,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                            ),
                          )
                        : const Icon(Icons.videocam),
                    label: Text(
                      busy ? 'STARTING...' : 'START LIVE',
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                )
              else
                SizedBox(
                  height: 56,
                  child: FilledButton.icon(
                    onPressed: busy ? null : endLive,
                    icon: const Icon(Icons.stop_circle),
                    label: Text(
                      busy ? 'ENDING...' : 'END LIVE',
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),

              // TikTok-style floating overlay controls.
              if (live) ...[
                const SizedBox(height: 12),
                SizedBox(
                  height: 54,
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: showOverlay,
                    icon: const Icon(Icons.picture_in_picture_alt),
                    label: const Text('SHOW CONTROLS OVER GAME'),
                  ),
                ),
              ],

              // MICROPHONE ON / OFF BUTTON
              if (live) ...[
                const SizedBox(height: 12),

                SizedBox(
                  height: 54,
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    onPressed: busy ? null : toggleMic,
                    icon: Icon(
                      micEnabled ? Icons.mic : Icons.mic_off,
                    ),
                    label: Text(
                      micEnabled
                          ? 'MICROPHONE ON'
                          : 'MICROPHONE OFF',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      foregroundColor:
                          micEnabled ? Colors.orange : Colors.redAccent,
                      side: BorderSide(
                        color: micEnabled ? Colors.orange : Colors.redAccent,
                      ),
                    ),
                  ),
                ),
              ],

              const SizedBox(height: 26),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF101010),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'STREAM',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),

                    SizedBox(height: 10),

                    Text(
                      '• PUBG screen capture\n'
                      '• LiveKit WebRTC\n'
                      '• Internal game audio\n'
                      '• Microphone ON/OFF\n'
                      '• Viewer counter\n'
                      '• Android 10+',
                      style: TextStyle(
                        color: Colors.grey,
                        height: 1.6,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
