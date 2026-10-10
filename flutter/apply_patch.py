from pathlib import Path
import sys
root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
mf, pf = root / "lib/main.dart", root / "pubspec.yaml"
if not mf.exists() or not pf.exists():
    raise SystemExit("Run this script from the flutter project folder.")
main, pub = mf.read_text(encoding="utf-8"), pf.read_text(encoding="utf-8")
if "package:webview_flutter/webview_flutter.dart" not in main:
    main = main.replace("import 'package:wakelock_plus/wakelock_plus.dart';",
      "import 'package:wakelock_plus/wakelock_plus.dart';\nimport 'package:webview_flutter/webview_flutter.dart';")
if "import 'dart:convert';" not in main:
    main = main.replace("import 'dart:async';", "import 'dart:async';\nimport 'dart:convert';")
main = main.replace("home: const LiveHome(),", "home: const AppShell(),")
if "class AppShell extends StatefulWidget" not in main:
    shell = r'''
class AppShell extends StatefulWidget {
  const AppShell({super.key});
  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  static const siteUrl = 'https://aimrelax-pubg.github.io/';
  late final WebViewController _web;
  Timer? _syncTimer;
  int _tab = 0;
  bool _pageReady = false, _syncing = false;

  @override
  void initState() {
    super.initState();
    _web = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel('AimrelaxAuth',
        onMessageReceived: (m) => _acceptWebsiteSession(m.message))
      ..setNavigationDelegate(NavigationDelegate(onPageFinished: (_) {
        _pageReady = true;
        _readWebsiteSession();
      }))
      ..loadRequest(Uri.parse(siteUrl));
    _syncTimer = Timer.periodic(const Duration(seconds: 3), (_) {
      if (_pageReady && !_syncing) _readWebsiteSession();
    });
  }

  Future<void> _readWebsiteSession() async {
    if (!_pageReady || _syncing) return;
    _syncing = true;
    try {
      await _web.runJavaScript(r"""
        (() => {
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (!k || !k.includes('auth-token')) continue;
              const raw = localStorage.getItem(k);
              if (!raw) continue;
              const s = JSON.parse(raw);
              if (s && s.refresh_token) {
                AimrelaxAuth.postMessage(JSON.stringify({refresh_token:s.refresh_token}));
                return;
              }
            }
          } catch (_) {}
        })();
      """);
    } catch (_) {} finally { _syncing = false; }
  }

  Future<void> _acceptWebsiteSession(String message) async {
    try {
      final data = jsonDecode(message) as Map<String, dynamic>;
      final token = data['refresh_token'] as String?;
      if (token == null || token.isEmpty) return;
      final auth = Supabase.instance.client.auth;
      if (auth.currentSession?.refreshToken == token) return;
      await auth.setSession(token);
    } catch (_) {}
  }

  @override
  void dispose() {
    _syncTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(child: IndexedStack(index: _tab, children: [
      WebViewWidget(controller: _web),
      const LiveHome(),
    ])),
    bottomNavigationBar: NavigationBar(
      selectedIndex: _tab,
      onDestinationSelected: (i) => setState(() => _tab = i),
      destinations: const [
        NavigationDestination(icon: Icon(Icons.language), label: 'Կայք'),
        NavigationDestination(icon: Icon(Icons.live_tv), label: 'LIVE'),
      ],
    ),
  );
}
'''
    main = main.replace("class LiveHome extends StatefulWidget", shell + "\nclass LiveHome extends StatefulWidget")
if "webview_flutter:" not in pub:
    pub = pub.replace("  wakelock_plus: ^1.4.0", "  wakelock_plus: ^1.4.0\n  webview_flutter: ^4.13.0")
mf.write_text(main, encoding="utf-8")
pf.write_text(pub, encoding="utf-8")
print("Patch applied.")
