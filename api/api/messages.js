import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { user, conversation_id, query } = req.body;
  if (!user || !query) {
    return res.status(400).json({ error: 'Missing user or query' });
  }

  const apiRes = await fetch('https://api.dify.ai/v1/chat-messages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user,
      conversation_id,
      query,
      response_mode: 'streaming'
    })
  });

  if (!apiRes.ok) {
    const err = await apiRes.text();
    return res.status(apiRes.status).send(err);
  }

  // Stream the SSE back to the client
  res.setHeader('Content-Type', 'text/event-stream');
  apiRes.body.pipe(res);
}
