// Dit bestand is nu .cjs zodat require werkt
const Ably = require('ably');

const key = 'H3LWaQ.Qbnu2w:KcmI489GiU84-ndFq8IiVtCb6ZwUQyKFJCXOfq5kuHs'; // <-- Vul hier je Ably key in
console.log('Testen met ABLY_API_KEY:', key ? '[ingesteld]' : '[leeg]', key.length);

const rest = new Ably.Rest({ key });

rest.auth.createTokenRequest({ clientId: 'test' }, (err, token) => {
  if (err) {
    console.error('FOUT:', err);
  } else {
    console.log('TokenRequest gelukt:', token);
  }
});
