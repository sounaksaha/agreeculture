import fs from "fs";
import { getFtpClient } from "../config/ftpClient.js";

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const uniqueName = Date.now() + '-' + req.file.originalname;
  const localPath = req.file.path;

  try {
    const client = await getFtpClient();

    // ✅ Debug FTP login path
    const rootPath = await client.pwd();
    console.log("📁 Logged into:", rootPath); // should show / (meaning public_html)

    // ✅ IMPORTANT: ONLY cd to 'assets' directly — NOT public_html/assets
    await client.cd("assets");

    // ✅ Upload directly into 'assets'
    await client.uploadFrom(localPath, uniqueName);

    // ✅ Cleanup
    await client.close();
    fs.unlinkSync(localPath);

    // ✅ Build public URL
    const fileUrl = `${process.env.FTP_PUBLIC_URL}/${uniqueName}`;
    console.log("✅ Uploaded:", fileUrl);
    res.status(200).json({ fileUrl });
  } catch (err) {
    console.error("❌ FTP Upload Error:", err);
    res.status(500).json({ error: "File upload failed", detail: err.message });
  }
};
