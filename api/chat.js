export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
 
  try {
    const { system, user, model } = req.body;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_KEY || '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'
      },
      body: JSON.stringify({
        model: model || 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: system || '',
        messages: [{ role: 'user', content: user }]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(400).json({error: data.error.message});
    return res.status(200).json({text: data.content[0].text});
  } catch(e) {
    return res.status(500).json({error: e.message});
  }
}
 
