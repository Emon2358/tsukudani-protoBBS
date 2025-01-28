import { serve } from "https://deno.land/std@0.139.0/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("target");

  if (!targetUrl) {
    return new Response("URLが指定されていません", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  try {
    const target = new URL(targetUrl);

    // リクエストをターゲットURLに転送
    const response = await fetch(target, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });

    // レスポンスを返す（CORSヘッダーを含む）
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        ...corsHeaders,
        "X-Original-URL": targetUrl // オリジナルのURLを追加
      },
    });
  } catch (error) {
    console.error("エラー:", error);
    return new Response("リクエスト処理中にエラーが発生しました", { 
      status: 500,
      headers: corsHeaders 
    });
  }
});
