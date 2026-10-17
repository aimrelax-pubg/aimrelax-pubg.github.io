import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type JsonRecord = Record<string, unknown>;

let cachedAccessToken: { value: string; expiresAt: number } | null = null;

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function encodeJson(value: unknown): string {
  return base64Url(new TextEncoder().encode(JSON.stringify(value)));
}

function pemToBytes(pem: string): Uint8Array {
  const clean = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
  const binary = atob(clean);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function getFirebaseAccessToken(account: JsonRecord): Promise<string> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.value;
  }

  const email = String(account.client_email ?? "");
  const privateKeyPem = String(account.private_key ?? "").replace(/\\n/g, "\n");
  if (!email || !privateKeyPem) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing client_email/private_key.");
  }

  const now = Math.floor(Date.now() / 1000);
  const unsigned = [
    encodeJson({ alg: "RS256", typ: "JWT" }),
    encodeJson({
      iss: email,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  ].join(".");

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBytes(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned)),
  );
  const assertion = unsigned + "." + base64Url(signature);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const tokenResult = await response.json();
  if (!response.ok || !tokenResult.access_token) {
    throw new Error("Google OAuth token request failed: " + JSON.stringify(tokenResult));
  }

  cachedAccessToken = {
    value: String(tokenResult.access_token),
    expiresAt: Date.now() + Number(tokenResult.expires_in ?? 3600) * 1000,
  };
  return cachedAccessToken.value;
}

function cleanText(value: unknown, fallback: string, max = 180): string {
  const text = String(value ?? "").trim();
  return (text || fallback).slice(0, max);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    // This endpoint is called by trusted database triggers using the existing PUSH_API_KEY.
    const expectedSecret = Deno.env.get("PUSH_API_KEY");
    if (!expectedSecret || request.headers.get("x-push-secret") !== expectedSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await request.json() as { table?: string; event?: string; record?: JsonRecord; old_record?: JsonRecord };
    const table = String(body.table ?? "");
    const record = body.record ?? {};
    const event = String(body.event ?? "INSERT");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const firebaseJson = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON") ??
      Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
    if (!supabaseUrl || !serviceRoleKey || !firebaseJson) {
      throw new Error("Required server secrets are not configured. Expected SUPABASE_SERVICE_ROLE_KEY and FIREBASE_SERVICE_ACCOUNT.");
    }

    const account = JSON.parse(firebaseJson) as JsonRecord;
    const projectId = String(account.project_id ?? "");
    if (!projectId) throw new Error("Firebase service account has no project_id.");

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let userId = "";
    let title = "AIMRELAX";
    let messageBody = "Դուք նոր ծանուցում ունեք։";
    let type = "notification";
    let url = "https://aimrelax-pubg.github.io/";
    let chatId = "";

    if (table === "user_notifications") {
      const notificationType = String(record.type ?? "").toLowerCase();
      // Friend, clan, and private-message events are sent by their own database
      // triggers/webhook. Avoid a duplicate when the site also writes a feed row.
      if (["friend_request", "friend_accepted", "clan_notification", "clan_application", "private_chat"].includes(notificationType)) {
        return new Response(JSON.stringify({ ok: true, skipped: "event sent by its dedicated trigger" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = String(record.user_id ?? "");
      title = cleanText(record.title, "AIMRELAX");
      messageBody = cleanText(record.body, "Դուք նոր ծանուցում ունեք։", 900);
      type = cleanText(record.type, "notification", 80);
      const data = (record.data && typeof record.data === "object" ? record.data : {}) as JsonRecord;
      url = cleanText(data.url, url, 500);
      chatId = String(data.chatId ?? data.chat_id ?? "");
    } else if (table === "friend_requests") {
      const status = String(record.status ?? "");
      if (event === "INSERT" && status === "pending") {
        userId = String(record.addressee_id ?? "");
        const { data: profile } = await admin.from("profiles")
          .select("nickname").eq("id", String(record.requester_id ?? "")).maybeSingle();
        title = "Նոր ընկերության հայտ 👥";
        messageBody = cleanText(profile?.nickname, "Օգտատերը") + " ուղարկել է ընկերության հայտ։";
        type = "friend_request";
        url = "https://aimrelax-pubg.github.io/";
      } else if (event === "UPDATE" && status === "accepted" &&
          String(body.old_record?.status ?? "") !== "accepted") {
        userId = String(record.requester_id ?? "");
        title = "Ընկերության հայտը ընդունվել է ✅";
        messageBody = "Ձեր ընկերության հայտը ընդունվել է։";
        type = "friend_accepted";
      } else {
        return new Response(JSON.stringify({ ok: true, skipped: "friend request event not notified" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else if (table === "private_messages") {
      userId = String(record.receiver_id ?? "");
      chatId = String(record.sender_id ?? "");
      const { data: profile } = await admin.from("profiles")
        .select("nickname").eq("id", chatId).maybeSingle();
      const sender = cleanText(profile?.nickname, "Ընկեր", 80);
      title = sender + " · AIMRELAX";
      const kind = String(record.message_type ?? "text");
      messageBody = kind === "audio" ? "Ուղարկել է ձայնային հաղորդագրություն 🎤"
        : kind === "image" ? "Ուղարկել է նկար 🖼️"
        : kind === "file" ? "Ուղարկել է ֆայլ 📎"
        : cleanText(record.message, "Նոր հաղորդագրություն", 900);
      type = "private_chat";
      url = "https://aimrelax-pubg.github.io/?chat=" + encodeURIComponent(chatId);
    } else if (table === "clan_notifications") {
      userId = String(record.user_id ?? "");
      title = cleanText(record.title, "Կլանի ծանուցում");
      messageBody = cleanText(record.body, "Կլանի հայտի թարմացում։", 900);
      type = "clan_notification";
      url = "https://aimrelax-pubg.github.io/#clan";
    } else {
      return new Response(JSON.stringify({ error: "Unsupported table", table }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!userId) {
      return new Response(JSON.stringify({ ok: true, skipped: "no recipient" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: devices, error: deviceError } = await admin
      .from("device_push_tokens")
      .select("token")
      .eq("user_id", userId)
      .eq("platform", "android");
    if (deviceError) throw deviceError;
    if (!devices?.length) {
      return new Response(JSON.stringify({ ok: true, sent: 0, reason: "no Android tokens" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = await getFirebaseAccessToken(account);
    const dataPayload: Record<string, string> = { type, url };
    if (chatId) dataPayload.chatId = chatId;
    const results = await Promise.all(devices.map(async (device) => {
      const token = String(device.token ?? "");
      if (!token) return { ok: false, skipped: true };
      const fcmResponse = await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token,
              notification: { title, body: messageBody },
              data: dataPayload,
              android: {
                priority: "HIGH",
                notification: {
                  channel_id: "default",
                  sound: "default",
                  default_sound: true,
                  default_vibrate_timings: true,
                  tag: type + "-" + (chatId || userId),
                },
              },
            },
          }),
        },
      );
      const result = await fcmResponse.json().catch(() => ({}));
      if (!fcmResponse.ok) {
        const details = JSON.stringify(result);
        if (details.includes("UNREGISTERED")) {
          await admin.from("device_push_tokens").delete().eq("token", token);
        }
        return { ok: false, status: fcmResponse.status, error: result };
      }
      return { ok: true };
    }));

    return new Response(JSON.stringify({
      ok: true,
      recipient: userId,
      sent: results.filter((item) => item.ok).length,
      failed: results.filter((item) => !item.ok).length,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("AIMRELAX push sender failed:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
