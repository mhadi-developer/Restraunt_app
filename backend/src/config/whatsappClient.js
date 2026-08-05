import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;

export const whatsappClient = new Client({
  authStrategy: new LocalAuth({
    clientId: "restaurant-bot",
  }),

  // Lock stable WhatsApp Web version to prevent execution hangs
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1018940428-alpha.html",
  },

  puppeteer: {
    headless: true,
    protocolTimeout: 0, // Disable protocol timeouts completely
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  },
});

whatsappClient.on("qr", (qr) => {
  console.log("[WA Service] Scan QR Code:");
  qrcode.generate(qr, { small: true });
});

whatsappClient.on("ready", () => {
  console.log("[WA Service] WhatsApp Client is ready!");
});

whatsappClient.on("disconnected", (reason) => {
  console.warn(`[WA Service] Client disconnected: ${reason}`);
  whatsappClient.initialize();
});
