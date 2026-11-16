const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "mahal123";
const WHATSAPP_TOKEN = "PASTE_YOUR_TOKEN_HERE";
const PHONE_NUMBER_ID = "PASTE_YOUR_PHONE_ID_HERE";

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];
    if (message) {
      const from = message.from;
      const text = message.text?.body?.toLowerCase() || "";
      let reply = "Assalamu Alaikum! Mahal Bot il ninnum swagatham.";
      if (text.includes('hi') || text.includes('hello') || text.includes('salam')) {
        reply = "Assalamu Alaikum! Mahal WhatsApp Bot ready aanu. Engane sahayikkam?";
      }
      await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
        messaging_product: "whatsapp",
        to: from,
        text: { body: reply }
      }, {
        headers: { 'Authorization': `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
      });
    }
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(200);
  }
});

app.get('/', (req, res) => res.send('Mahal Webhook Running'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on ' + PORT));
