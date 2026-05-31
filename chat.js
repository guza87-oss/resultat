export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  try {
    const body = req.body || {};
    const system = body.system || '';
    const user = body.user || '';
    const model = body.model || 'claude-haiku-4-5-20251001';
    
    const anthropicBody = {
      model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: user }]
    };
    if (system) anthropicBody.system = system;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': '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'
      },
      body: JSON.stringify(anthropicBody)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } 
    catch(e) { return res.status(500).json({error: 'Invalid JSON from Anthropic: ' + text.substring(0,200)}); }

    if (!response.ok) return res.status(response.status).json({error: data?.error?.message || text});
    if (data.error) return res.status(400).json({error: data.error.message});
    if (!data.content || !data.content[0]) return res.status(500).json({error: 'No content in response'});
    
    return res.status(200).json({text: data.content[0].text});
  } catch(e) {
    return res.status(500).json({error: e.message});
  }
}
