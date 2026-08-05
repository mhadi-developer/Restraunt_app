export function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];

  const token = req.query["hub.verify_token"];

  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("Webhook Verified");

    return res.status(200).send(challenge);
  }

  return res.status(403).send("Forbidden");
}

// *****************************************************
export function receiveWebhook(req, res) {
  const body = req.body;

  console.log(JSON.stringify(body, null, 2));

  /*
       Handle:

       messages
       statuses
    */

  return res.sendStatus(200);
}