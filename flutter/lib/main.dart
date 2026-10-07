import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:wakelock_plus/wakelock_plus.dart';

const String supabaseUrl =
    'https://hvhlrbfjloiahbqmnrly.supabase.co';

const String supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aGxyYmZqbG9pYWhicW1ucmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MTMyNjMsImV4cCI6MjEwNTI4OTI2M30.lOrLiuJ3SZ9LtQxZu3aHcVE_e_7eOWVxPoaG36l0f8M';

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

  final SupabaseClient db =
      Supabase.instance.client;

  Timer? heartbeatTimer;

  bool busy = false;
  bool live = false;

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

    if (busy || live) {
      return;
    }

    setState(() {
      busy = true;
      statusText = 'Creating LIVE...';
    });

    try {
      final userName =
          session.user.email?.split('@').first ??
              'Streamer';

      // 1. Create stream in Supabase
      final created = await db.functions.invoke(
        'live-create',
        body: {
          'title': liveTitle,
          'category': 'PUBG',
          'streamer_name': userName,
        },
      );

      final createdData =
          _map(created.data);

      if (createdData['error'] != null) {
        throw Exception(
          createdData['error'].toString(),
        );
      }

      final stream =
          _map(createdData['stream']);

      final createdStreamId =
          stream['id']?.toString();

      if (createdStreamId == null ||
          createdStreamId.isEmpty) {
        throw Exception(
          'live-create did not return stream id',
        );
      }

      streamId = createdStreamId;

      // 2. Get LiveKit publisher token
      setState(() {
        statusText = 'Preparing LiveKit...';
      });

      final tokenResponse =
          await db.functions.invoke(
        'live-token',
        body: {
          'stream_id': streamId,
          'role': 'publisher',
        },
      );

      final tokenData =
          _map(tokenResponse.data);

      if (tokenData['error'] != null) {
        throw Exception(
          tokenData['error'].toString(),
        );
      }

      final token =
          tokenData['token']?.toString();

      final url =
          tokenData['url']?.toString();

      if (token == null || token.isEmpty) {
        throw Exception(
          'LiveKit token is missing',
        );
      }

      if (url == null || url.isEmpty) {
        throw Exception(
          'LiveKit URL is missing',
        );
      }

      // 3. Native Android:
      // microphone permission -> screen capture ->
      // LiveKit connection -> screen + internal audio
      setState(() {
        statusText =
            'Waiting for screen permission...';
      });

      final nativeResult =
          await native.invokeMethod<bool>(
        'startLive',
        {
          'token': token,
          'url': url,
        },
      );

      if (nativeResult != true) {
        throw Exception(
          'Android LiveKit start failed',
        );
      }

      // IMPORTANT:
      // Do NOT update started_at here.
      // That column does not exist in the current
      // live_streams schema.

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
        viewers = 0;
        statusText = 'LIVE is active';
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

    if (id == null || id.isEmpty || !live) {
      return;
    }

    try {
      final response =
          await db.functions.invoke(
        'live-heartbeat',
        body: {
          'stream_id': id,
          'session_id': 'streamer',
        },
      );

      final data =
          _map(response.data);

      final value = data['viewer_count'];

      int count = 0;

      if (value is int) {
        count = value;
      } else if (value is num) {
        count = value.toInt();
      } else if (value != null) {
        count = int.tryParse(
              value.toString(),
            ) ??
            0;
      }

      if (!mounted) return;

      setState(() {
        viewers = count;
      });
    } catch (_) {
      // Heartbeat failure should not stop the LIVE.
    }
  }

  Future<void> endLive() async {
    final id = streamId;

    if (id == null || id.isEmpty || busy) {
      return;
    }

    setState(() {
      busy = true;
      statusText = 'Ending LIVE...';
    });

    try {
      // Stop Android LiveKit first.
      try {
        await native.invokeMethod('stopLive');
      } catch (_) {}

      // Then mark stream ended.
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
        streamId = null;
        viewers = 0;
        statusText = 'LIVE ended';
      });

      showMessage(
        'LIVE ended',
      );
    } catch (e) {
      heartbeatTimer?.cancel();
      heartbeatTimer = null;

      await WakelockPlus.disable();

      if (!mounted) return;

      setState(() {
        live = false;
        busy = false;
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
  }

  Map<String, dynamic> _map(dynamic value) {
    if (value is Map<String, dynamic>) {
      return value;
    }

    if (value is Map) {
      return Map<String, dynamic>.from(value);
    }

    throw Exception(
      'Invalid server response',
    );
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
          backgroundColor:
              error ? Colors.red.shade900 : null,
          content: Text(
            message,
            style: const TextStyle(
              fontSize: 14,
            ),
          ),
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(
            22,
            24,
            22,
            30,
          ),
          child: Column(
            crossAxisAlignment:
                CrossAxisAlignment.stretch,
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
                  borderRadius:
                      BorderRadius.circular(18),
                  border: Border.all(
                    color: live
                        ? Colors.red
                        : Colors.white12,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 14,
                      height: 14,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: live
                            ? Colors.red
                            : Colors.grey,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment:
                            CrossAxisAlignment.start,
                        children: [
                          Text(
                            live
                                ? '🔴 LIVE'
                                : 'OFFLINE',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight:
                                  FontWeight.bold,
                              color: live
                                  ? Colors.red
                                  : Colors.white70,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            statusText,
                            style: const TextStyle(
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (live)
                      Column(
                        crossAxisAlignment:
                            CrossAxisAlignment.end,
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
                              fontWeight:
                                  FontWeight.bold,
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
                textInputAction:
                    TextInputAction.done,
                decoration:
                    InputDecoration(
                  labelText: 'LIVE title',
                  hintText: 'PUBG LIVE',
                  prefixIcon:
                      const Icon(Icons.title),
                  border:
                      const OutlineInputBorder(),
                  filled: true,
                  fillColor:
                      const Color(0xFF111111),
                ),
              ),

              const SizedBox(height: 20),

              if (!live)
                SizedBox(
                  height: 56,
                  child: FilledButton.icon(
                    onPressed:
                        busy ? null : goLive,
                    icon: busy
                        ? const SizedBox(
                            width: 21,
                            height: 21,
                            child:
                                CircularProgressIndicator(
                              strokeWidth: 2,
                            ),
                          )
                        : const Icon(
                            Icons.videocam,
                          ),
                    label: Text(
                      busy
                          ? 'STARTING...'
                          : 'START LIVE',
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),
                  ),
                )
              else
                SizedBox(
                  height: 56,
                  child: FilledButton.icon(
                    onPressed:
                        busy ? null : endLive,
                    icon: const Icon(
                      Icons.stop_circle,
                    ),
                    label: Text(
                      busy
                          ? 'ENDING...'
                          : 'END LIVE',
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),
                  ),
                ),

              const SizedBox(height: 26),

              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFF101010),
                  borderRadius:
                      BorderRadius.circular(14),
                ),
                child: const Column(
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    Text(
                      'STREAM',
                      style: TextStyle(
                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 10),
                    Text(
                      '• PUBG screen capture\n'
                      '• LiveKit WebRTC\n'
                      '• Internal game audio\n'
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
