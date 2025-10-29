

module.exports = async (req, res) => {
  console.log('--- API call ontvangen ---');
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request');
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    console.log('Niet-POST request:', req.method);
    res.status(405).json({ error: 'Alleen POST toegestaan' });
    return;
  }
  console.log('POST request ontvangen');
  let body = {};
  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    body = JSON.parse(data);
    console.log('Body succesvol geparsed:', body);
  } catch (err) {
    console.error('Fout bij body parsing:', err);
    res.status(400).json({ error: 'Body niet leesbaar of geen geldige JSON', details: err.message });
    return;
  }
  const prompt = body.prompt;
  console.log('Prompt:', prompt);
  const OPENAI_KEY = process.env.OPENAI_KEY;
  if (!OPENAI_KEY) {
    console.error('Geen OpenAI key gevonden in environment variables!');
  }
  if (!OPENAI_KEY) {
    res.status(500).json({ error: 'Geen OpenAI key geconfigureerd' });
    return;
  }
  try {
    console.log('Verstuur request naar OpenAI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    console.log('Response ontvangen van OpenAI, status:', response.status);
    const data = await response.json();
    console.log('Data van OpenAI:', data);
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Fout bij OpenAI request:', err);
    res.status(500).json({ error: 'Fout bij OpenAI request', details: err.message });
  }
};