// server.js (Deno Deploy)
import { serve } from "https://deno.land/std@0.139.0/http/server.ts";

// プロキシサーバーのエントリポイント
serve(async (req) => {
  const url = new URL(req.url);
  const targetUrl = url.searchParams.get("target");

  if (!targetUrl) {
    return new Response("URLが指定されていません", { status: 400 });
  }

  try {
    // ターゲットURLをURLオブジェクトに変換
    const target = new URL(targetUrl);

    // リクエストをターゲットURLに転送
    const response = await fetch(target, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });

    // レスポンスをそのまま返す
    const responseBody = await response.text();
    return new Response(responseBody, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    console.error("エラー:", error);
    return new Response("リクエスト処理中にエラーが発生しました", { status: 500 });
  }
});
