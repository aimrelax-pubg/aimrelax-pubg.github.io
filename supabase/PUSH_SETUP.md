# AIMRELAX Android push notifications

The Android client and server sender are now in the repository. Push delivery needs the production-only credentials below; never commit these credentials or send them in chat.

## One-time Supabase setup

1. Reuse the existing Edge Function secrets `PUSH_API_KEY` and `FIREBASE_SERVICE_ACCOUNT`; do not generate or commit another key unless `FIREBASE_SERVICE_ACCOUNT` is missing.
2. In Supabase **Vault**, add a secret named `aimrelax_push_api_key` with the exact same value as the existing Edge Function secret `PUSH_API_KEY`.
3. In Supabase **SQL Editor**, run `supabase/migrations/20261017020000_audible_android_push.sql`.
4. Deploy the new Edge Function from the repository root with the Supabase CLI:
   ```sh
   supabase link --project-ref hvhlrbfjloiahbqmnrly
   supabase functions deploy aimrelax-push-send
   ```

The database triggers use the shared `x-push-secret`: friend requests and clan notifications go to the already-deployed `send-push` function, while `user_notifications` go to `aimrelax-push-send`. The existing `private-messages-push` webhook remains unchanged. The new function uses Firebase HTTP v1 and sends notification payloads on the Android channel `default`.

## Android install

Install the newly built APK after the GitHub Actions build finishes. On OPPO, allow notifications and enable **Auto launch / Background activity** and set battery use for AIMRELAX to **Allow background activity**. Android's system-level Force stop can block FCM until the app is opened again; an app cannot override that OS restriction.

## Covered events

- Incoming friend requests and accepted requests
- New private messages (text, audio, image, and file)
- Rows inserted into `user_notifications`
- Rows inserted into `clan_notifications`

FCM tokens are saved per signed-in Android user in `device_push_tokens`. The Firebase service-account JSON and all webhook keys must stay out of GitHub source files.
