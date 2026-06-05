export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = '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';

  try {
    const body = req.body;

    // Поддержка обоих форматов: полный (messages) и упрощённый (user/system)
    let anthropicBody;
    if (body.messages) {
      // Полный формат от нашего приложения
      anthropicBody = {
        model: body.model || 'claude-sonnet-4-20250514',
        max_tokens: body.max_tokens || 1000,
        messages: body.messages,
      };
      if (body.system) anthropicBody.system = body.system;
    } else {
      // Упрощённый формат от старого chat.js
      anthropicBody = {
        model: body.model || 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: body.user || '' }],
      };
      if (body.system) anthropicBody.system = body.system;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(anthropicBody),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
