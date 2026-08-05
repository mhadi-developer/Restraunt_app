export const orderStatusEmailTemplate = ({
  customerName,
  customerEmail,
  orderId,
  orderStatus,
  orderType,
}) => {
  const statusColor = {
    PENDING: "#f59e0b",
    ACCEPTED: "#22c55e",
    PREPARING: "#3b82f6",
    "OUT FOR DELIVERY": "#8b5cf6",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
  };

  const statusIcon = {
    PENDING: "⏳",
    ACCEPTED: "✅",
    PREPARING: "👨‍🍳",
    "OUT FOR DELIVERY": "🛵",
    DELIVERED: "🎉",
    CANCELLED: "❌",
  };

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Order Status Update</title>
</head>

<body style="
margin:0;
padding:40px;
background:#120707;
font-family:Arial,Helvetica,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table
width="650"
style="
background:linear-gradient(135deg,#1a0000 0%,#2d0000 100%);
border:1px solid #4a3228;
border-radius:18px;
overflow:hidden;
">

<!-- Header -->
<tr>
<td
style="
padding:40px;
text-align:center;
border-bottom:1px solid #4a3228;
">

<h1
style="
margin:0;
color:#e85d30;
font-size:34px;
">
🍔 Ember Foods
</h1>

<p
style="
margin-top:10px;
color:#d0d0d0;
font-size:15px;
">
Order Status Update
</p>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<h2
style="
margin:0;
color:#ffffff;
">
Hello ${customerName},
</h2>

<h3
style="
margin:0;
color:#ffffff;
">
Order Type : ${orderType},
</h3>

<p
style="
margin-top:18px;
line-height:1.8;
color:#d6d6d6;
">
We're writing to inform you that the status of your order has been updated.
</p>

<table
width="100%"
style="
margin-top:30px;
background:#241510;
border:1px solid #4a3228;
border-radius:12px;
padding:20px;
">

<tr>
<td style="padding:10px 0;color:#ffffff;">
<strong>Order ID</strong>
</td>

<td align="right" style="color:#e85d30;">
<strong>#${orderId}</strong>
</td>
</tr>

<tr>
<td style="padding:10px 0;color:#ffffff;">
<strong>Email</strong>
</td>

<td align="right" style="color:#d0d0d0;">
${customerEmail}
</td>
</tr>

<tr>
<td style="padding:10px 0;color:#ffffff;">
<strong>Status</strong>
</td>

<td align="right">

<span
style="
display:inline-block;
padding:10px 18px;
border-radius:999px;
background:${statusColor[orderStatus] || "#6b7280"};
color:white;
font-weight:bold;
">

${statusIcon[orderStatus] || "📦"} ${orderStatus}

</span>

</td>
</tr>

</table>

<p
style="
margin-top:35px;
line-height:1.8;
color:#d6d6d6;
">

Thank you for choosing
<strong style="color:#e85d30;">
Restaurant App
</strong>.

We'll continue to keep you updated until your order has been completed.

</p>

<div style="text-align:center;margin-top:40px;">

<a
href=${ process.env.CLIENT_URL }/orders/${orderId}
style="
display:inline-block;
padding:14px 30px;
background:#e85d30;
color:white;
text-decoration:none;
font-weight:bold;
border-radius:8px;
">

Track Order

</a>

</div>

</td>
</tr>

<!-- Footer -->

<tr>
<td
style="
padding:25px;
background:#241510;
border-top:1px solid #4a3228;
text-align:center;
">

<p
style="
margin:0;
color:#bdbdbd;
font-size:14px;
">
© ${new Date().getFullYear()} Restaurant App. All Rights Reserved.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};
