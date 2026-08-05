import { whatsappClient } from "../config/whatsappClient.js";
import { createOrderStatusMessage } from "./whatsappMessage.generate.service.js";
import { formatWhatsAppNumber } from "../../utils/phoneNumberFormat.js";

export async function sendOrderStatusWhatsApp({
  customerName,
  customerPhone,
  orderId,
  orderStatus,
  orderType,
}) {
  // 1. Check if the WhatsApp client is authenticated & ready
  if (!whatsappClient.info || !whatsappClient.info.wid) {
    console.warn(
      `⚠️ WhatsApp Client is not ready yet! Skipping WhatsApp notification for Order #${orderId}.`,
    );
    return null; // Gracefully exit without crashing or throwing
  }

  const message = createOrderStatusMessage({
    customerName,
    orderId,
    orderStatus,
    orderType,
  });

  try {
    // 2. Clean phone number
    const formattedPhone = formatWhatsAppNumber(customerPhone);
    const chatId = formattedPhone.includes("@c.us")
      ? formattedPhone
      : `${formattedPhone.replace(/\D/g, "")}@c.us`;

    // 3. Send message
    const response = await whatsappClient.sendMessage(chatId, message);

    console.log(`📱 WhatsApp notification sent successfully to ${chatId}`);
    return response;
  } catch (error) {
    console.error("❌ WhatsApp Service Error:", error.message || error);
    // Don't throw so the checkout process completes smoothly
    return null;
  }
}
