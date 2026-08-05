import {whatsappTheme} from "../template/whatsappThemeMessage.js";

export function createOrderStatusMessage({
  customerName,
  orderId,
    orderStatus,
  orderType,
}) {
  const status = whatsappTheme.status[orderStatus] || {
    icon: "📦",
    title: "Order Updated",
  };

  return `

${status.icon} ${status.title}

Hello ${customerName} 👋

Your order has been updated.

━━━━━━━━━━━━━━

🧾 Order ID:
#${orderId}

Order Type:
${orderType}

📌 Status:
${status.title}
━━━━━━━━━━━━━━
Thank you for choosing 
${whatsappTheme.restaurant.name} ❤️

We appreciate your trust.

    `.trim();
}
