# AIMRELAX Android push notifications

The Android client and server sender are now in the repository. Push delivery needs the production-only credentials below; never commit these credentials or send them in chat.

## One-time Supabase setup

1. In Firebase Console for project **aimrelax**, open **Project settings → Service accounts** and create a private service-account JSON key. Keep it private.
2. In Supabase **Project Settings → Edge Functions → Secrets**, add:
   - Name: `FIREBASE_SERVICE_ACCOUNT_JSON`
   - Value: the entire Firebase service-account JSON file contents.
3. In Supabase **SQL Editor**, run `supabase/migrations/20261017020000_audible_android_push.sql`.
4. In Supabase **Vault**, add a secret:
   - Name: `aimrelax_supabase_service_role_key`
   - Value: the project's **service_role** API key (not the publishable/anon key).
5. Deploy the Edge Function from the repository root with the Supabase CLI:
   ```sh
   supabase link --project-ref hvhlrbfjloiahbqmnrly
   supabase functions deploy aimrelax-push-send
   ```

The database trigger calls the function using the service-role JWT from Vault. The function uses Firebase HTTP v1 and sends notification payloads on the Android channel `aimrelax_push_sound_v2`.

## Android install

Install the newly built APK after the GitHub Actions build finishes. On OPPO, allow notifications and enable **Auto launch / Background activity** and set battery use for AIMRELAX to **Allow background activity**. Android's system-level Force stop can block FCM until the app is opened again; an app cannot override that OS restriction.

## Covered events

- Incoming friend requests and accepted requests
- New private messages (text, audio, image, and file)
- Rows inserted into `user_notifications`
- Rows inserted into `clan_notifications`

FCM tokens are saved per signed-in Android user in `device_push_tokens`. The Firebase service-account JSON and Supabase service-role key must stay out of GitHub source files.
