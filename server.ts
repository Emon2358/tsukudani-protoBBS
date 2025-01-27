import { serve } from "https://deno.land/std@0.184.0/http/server.ts";

const rooms = new Map<string, { offer?: string; answer?: string }>();

serve(async (req) => {
  const { pathname, searchParams } = new URL(req.url);

  // 部屋を作成または取得
  if (pathname === "/create-room") {
    const roomId = crypto.randomUUID();
    rooms.set(roomId, {});
    return new Response(roomId, { status: 200 });
  }

  // オファーを保存
  if (pathname === "/set-offer") {
    const roomId = searchParams.get("roomId");
    const offer = await req.text();
    if (!roomId || !rooms.has(roomId)) return new Response("Room not found", { status: 404 });

    rooms.get(roomId)!.offer = offer;
    return new Response("Offer saved", { status: 200 });
  }

  // オファーを取得
  if (pathname === "/get-offer") {
    const roomId = searchParams.get("roomId");
    if (!roomId || !rooms.has(roomId)) return new Response("Room not found", { status: 404 });

    const offer = rooms.get(roomId)!.offer;
    return offer ? new Response(offer, { status: 200 }) : new Response("No offer yet", { status: 404 });
  }

  // アンサーを保存
  if (pathname === "/set-answer") {
    const roomId = searchParams.get("roomId");
    const answer = await req.text();
    if (!roomId || !rooms.has(roomId)) return new Response("Room not found", { status: 404 });

    rooms.get(roomId)!.answer = answer;
    return new Response("Answer saved", { status: 200 });
  }

  // アンサーを取得
  if (pathname === "/get-answer") {
    const roomId = searchParams.get("roomId");
    if (!roomId || !rooms.has(roomId)) return new Response("Room not found", { status: 404 });

    const answer = rooms.get(roomId)!.answer;
    return answer ? new Response(answer, { status: 200 }) : new Response("No answer yet", { status: 404 });
  }

  return new Response("Not found", { status: 404 });
});
