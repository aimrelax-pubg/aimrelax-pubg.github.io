
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

const String supabaseUrl =
    'https://hvhlrbfjloiahbqmnrly.supabase.co';

const String supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aGxyYmZqbG9pYWhicW1ucmx5Iiwicm9sZSI6MTc4OTcxMzI2MywiZXhwIjoyMTA1Mjg5MjYzfQ.lOrLiuJ3SZ9LtQxZu3aHcVE_e_7eOWVxPoaG36l0f8M';

const MethodChannel native =
    MethodChannel('aimrelax.live/livekit');

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  );

  runApp(const AimrelaxLiveApp());
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
      home: const LiveHome(),
    );
  }
}

class LiveHome extends StatefulWidget {
  const LiveHome({super.key});

  @override
  State<LiveHome> createState() => _LiveHomeState();
}

class _LiveHomeState extends State<LiveHome> {
  final TextEditingController titleController =
      TextEditingController(text: 'PUBG LIVE');

  final SupabaseClient db = Supabase.instance.client;
   StreamSubscription<AuthState>? authSubscription;
bool signingIn = false;
String? authError;

@override
void initState() {
  super.initState();

  authSubscription = db.auth.onAuthStateChange.listen((data) {
    if (!mounted) return;
    setState(() {
      signingIn = false;
      authError = null;
    });
  });
}

Future<void> signInWithGoogle() async {
  if (signingIn) return;

  setState(() {
    signingIn = true;
    authError = null;
  });

  try {
    await db.auth.signInWithOAuth(
      OAuthProvider.google,
      redirectTo: 'io.supabase.aimrelaxlive://login-callback/',
    );
  } catch (e) {
    if (!mounted) return;
    setState(() {
      signingIn = false;
      authError = 'Google մուտքը չհաջողվեց։ $e';
    });
  }
}

Future<void> signOut() async {
  await db.auth.signOut();
} 

  Timer? heartbeatTimer;

  bool busy = false;
  bool live = false;

  // Microphone state
  bool micEnabled = true;

  String? streamId;
  String statusText = 'Ready to go LIVE';

  int viewers = 0;

  @override
  void dispose() {
    heartbeatTimer?.cancel();
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
      final userName =
          session.user.email?.split('@').first ?? 'Streamer';

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
        viewers = 0;
        statusText = 'LIVE is active · Microphone ON';
      });

      heartbeatTimer?.cancel();

      heartbeatTimer = Timer.periodic(
        const Duration(seconds: 15),
        (_) => refreshViewers(),
      );

      await refreshViewers();
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

      await WakelockPlus.disable();

      if (!mounted) return;

      setState(() {
        live = false;
        busy = false;
        micEnabled = true;
        streamId = null;
        viewers = 0;
        statusText = 'LIVE ended';
      });

      showMessage('LIVE ended');
    } catch (e) {
      heartbeatTimer?.cancel();
      heartbeatTimer = null;

      await WakelockPlus.disable();

      if (!mounted) return;

      setState(() {
        live = false;
        busy = false;
        micEnabled = true;
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
