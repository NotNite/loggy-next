import { getLogManager } from "@/logs";
import crypto from "crypto";
import JSZip from "jszip";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (file == null) {
    return new Response("No file provided", { status: 400 });
  }

  if (!(file instanceof Blob)) {
    return new Response("File isn't a blob", { status: 400 });
  }

  const blob = file as Blob;
  const name = blob.name;
  if (!name.endsWith(".log") && !name.endsWith(".tspack")) {
    return new Response("Invalid file type", { status: 400 });
  }

  if (blob.size > 10_000_000) {
    return new Response("File is too large", { status: 400 });
  }

  const buf = await blob.arrayBuffer();
  const isNormalLog = blob.name.endsWith(".log");
  const id = await crypto.subtle.digest("SHA-256", buf).then((hash) => {
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  });

  const logManager = await getLogManager();
  await logManager.createLog(id);

  if (isNormalLog) {
    await logManager.writeFile(
      id,
      name,
      new TextDecoder("utf-8").decode(new Uint8Array(buf))
    );
  } else {
    const zip = new JSZip();
    await zip.loadAsync(buf);

    for (const [filename, file] of Object.entries(zip.files)) {
      const contents = await file.async("text");
      await logManager.writeFile(id, filename, contents);
    }
  }

  return new Response(id);
}
