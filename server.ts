import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const files = new Map(); // メモリ内でファイルを管理

serve(async (req) => {
  const url = new URL(req.url);

  // ファイルアップロードの処理
  if (req.method === "POST" && url.pathname === "/upload") {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (file) {
      const fileId = crypto.randomUUID(); // 一意のIDを生成
      files.set(fileId, file);

      const shareUrl = `${url.origin}/download/${fileId}`;
      return new Response(JSON.stringify({ url: shareUrl }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("ファイルが見つかりません", { status: 400 });
  }

  // ファイルダウンロードの処理
  if (req.method === "GET" && url.pathname.startsWith("/download/")) {
    const fileId = url.pathname.split("/").pop();
    const file = files.get(fileId);

    if (file) {
      return new Response(file.stream(), {
        headers: {
          "Content-Disposition": `attachment; filename="${file.name}"`,
          "Content-Type": file.type,
        },
      });
    }

    return new Response("ファイルが存在しません", { status: 404 });
  }

  // その他のリクエストは404
  return new Response("Not Found", { status: 404 });
});
