import fetch from 'node-fetch';

export default async function handler(req, res) {
  const user = req.query.user;
  if (!user) return res.status(400).json({ error: 'Missing user' });

  const r = await fetch(
    `https://api.dify.ai/v1/conversations?user=${encodeURIComponent(user)}`,
    { headers: { Authorization: `Bearer ${process.env.DIFY_API_KEY}` } }
  );
  if (!r.ok) return res.status(r.status).send(await r.text());
  const list = await r.json();
  res.status(200).json(list);
}
