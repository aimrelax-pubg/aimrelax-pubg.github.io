import webpush from "npm:web-push";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://hvhlrbfjloiahbqmnrly.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const PUSH_API_KEY = Deno.env.get("PUSH_API_KEY");
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY");
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY");

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error("Missing VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY");
} else {
  webpush.setVapidDetails("mailto:aimrelax@example.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

async function supabaseSelect(table: string, params: URLSearchParams) {
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!response.ok) throw new Error(`Supabase ${table} query failed: ${response.status} ${await response.text()}`);
  return await response.json();
}

async function supabaseDelete(table: string, id: string) {
  if (!SUPABASE_SERVICE_ROLE_KEY) return;
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") return Response.json({ok:false,error:"POST required"},{status:405});
    if (!PUSH_API_KEY) return Response.json({ok:false,error:"PUSH_API_KEY is missing"},{status:500});
    if (req.headers.get("x-push-secret") !== PUSH_API_KEY) {
      return Response.json({ok:false,error:"Unauthorized"},{status:401});
    }
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return Response.json({ok:false,error:"VAPID keys are missing"},{status:500});
    }

    const payload = await req.json();
    const record = payload?.record || {};
    const table = payload?.table || "";

    const isPrivate = table === "private_messages" || !!record.sender_id && !!record.receiver_id;
    const isClan = table === "clan_notifications" || (!!record.user_id && !record.receiver_id && !record.sender_id);

    if (!isPrivate && !isClan) return Response.json({ok:true,skipped:true,reason:"unsupported_record"});

    const receiverId = isPrivate ? record.receiver_id : record.user_id;
    if (!receiverId) return Response.json({ok:true,skipped:true,reason:"no_receiver"});

    const params = new URLSearchParams({
      select: "id,endpoint,p256dh,auth",
      user_id: `eq.${receiverId}`,
    });
    const subscriptions = await supabaseSelect("push_subscriptions", params);

    let title: string;
    let body: string;
    let url: string;
    let type: string;
    let tag: string;
    let chatId: string | null = null;

    if (isPrivate) {
      title = record.message_type === "audio" ? "🎤 AIMRELAX-PUBG" : "💬 AIMRELAX-PUBG";
      body = record.message_type === "audio" ? "Դուք ստացել եք ձայնային հաղորդագրություն" : (record.message || "Նոր հաղորդագրություն");
      chatId = record.sender_id;
      url = `https://aimrelax-pubg.github.io/?chat=${encodeURIComponent(record.sender_id)}`;
      type = "private_chat";
      tag = `aimrelax-chat-${record.sender_id}`;
    } else {
      title = record.title || "🔔 AIMRELAX-PUBG";
      body = record.body || "Նոր կլանային ծանուցում";
      url = "https://aimrelax-pubg.github.io/?clan=1#clan";
      type = "clan_notification";
      tag = `aimrelax-clan-${record.id || Date.now()}`;
    }

    const results = await Promise.allSettled((subscriptions || []).map(async (sub: any) => {
      try {
        const notification = {title, body, url, type, tag, ...(chatId ? {chatId} : {})};
        await webpush.sendNotification(
          {endpoint: sub.endpoint, keys:{p256dh:sub.p256dh, auth:sub.auth}},
          JSON.stringify(notification),
          {TTL: 86400}
        );
        return {ok:true,id:sub.id};
      } catch (error: any) {
        const statusCode = error?.statusCode;
        console.error("Push send error:", error);
        if (statusCode === 404 || statusCode === 410) await supabaseDelete("push_subscriptions", String(sub.id));
        return {ok:false,id:sub.id,statusCode};
      }
    }));

    return Response.json({
      ok:true,
      type,
      subscriptions: subscriptions?.length || 0,
      sent: results.filter((x:any)=>x.status === "fulfilled" && x.value?.ok).length,
    });
  } catch (error:any) {
    console.error("send-push error:", error);
    return Response.json({ok:false,error:String(error?.message || error)},{status:500});
  }
});
