import ftp from "basic-ftp";

export const getFtpClient = async () => {
  const client = new ftp.Client();
  await client.access({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT || 21,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    secure: false,
  });
  return client;
};
