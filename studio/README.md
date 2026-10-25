# AiMRELAX Studio — Phase 1

A mobile-first, free browser video-editor prototype hosted as a static page on GitHub Pages.

## Preview URL after deployment

https://aimrelax-pubg.github.io/studio/

## Included in phase 1
- Responsive editor shell for mobile and desktop
- Local video file selection and playback
- Start/end trim controls and seek-to-current-position buttons
- Title overlay preview and title-size control
- Best-effort WebM export using Canvas capture + MediaRecorder where supported
- Save settings to this browser's localStorage
- Export/import a JSON project settings file

## Current limitations
- Media files stay on the user's device; they are not uploaded.
- The JSON project file saves edit settings and the media filename, not the actual video.
- Projects are not yet synced across devices.
- WebM export depends on browser MediaRecorder, canvas capture, and audio capture support; mobile browser support varies.
- This phase does not modify the existing homepage or Flutter app.

## Planned phases
1. **Phase 1:** Static web editor prototype (this folder).
2. **Phase 2:** Connect Supabase Auth and create separate Studio project tables and storage policies; keep video access private by default.
3. **Phase 3:** Add a shared project format/API and sync metadata across web and Flutter.
4. **Phase 4:** Integrate the editor screen into the Flutter Android app and build APK via GitHub Actions.
5. **Phase 5:** Expand editing tools, test on real Android devices, and improve export reliability.

## Deployment
The repository's GitHub Pages site serves this page at `/studio/` once the branch changes are merged into the published branch. This change is currently isolated in a feature branch and should be reviewed before merging.
