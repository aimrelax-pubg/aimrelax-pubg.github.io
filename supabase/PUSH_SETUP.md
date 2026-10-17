# AIMRELAX Android push notifications

The Android client and server sender are now in the repository. Push delivery needs the production-only credentials below; never commit these credentials or send them in chat.

## One-time Supabase setup

1. In Firebase Console for project **aimrelax**, open **Project settings → Service accounts** and create a private service-account JSON key. Keep it private.
2. The existing Edge Function secrets `PUSH_API_KEY` and `FIREBASE_SERVICE_ACCOUNT` are reused; do not place either value in GitHub source.
3. In Supabase **Vault**, add a secret named `aimrelax_push_api_key` with the exact same value as the existing Edge Function secret `PUSH_API_KEY`.
4. In Supabase **SQL Editor**, run `supabase/migrations/20261017020000_audible_android_push.sql`.
5. Deploy the new Edge Function from the repository root with the Supabase CLI:
   ```sh
   supabase link --project-ref hvhlrbfjloiahbqmnrly
   supabase functions deploy aimrelax-push-send
   ```

The database triggers call the new function using the shared `x-push-secret`. The existing `send-push` webhook for `private_messages` is left intact. The new function uses Firebase HTTP v1 and sends notification payloads on the Android channel `default`.

## Android install

Install the newly built APK after the GitHub Actions build finishes. On OPPO, allow notifications and enable **Auto launch / Background activity** and set battery use for AIMRELAX to **Allow background activity**. Android's system-level Force stop can block FCM until the app is opened again; an app cannot override that OS restriction.

## Covered events

- Incoming friend requests and accepted requests
- New private messages (text, audio, image, and file)
- Rows inserted into `user_notifications`
- Rows inserted into `clan_notifications`

FCM tokens are saved per signed-in Android user in `device_push_tokens`. The Firebase service-account JSON and Supabase service-role key must stay out of GitHub source files.
