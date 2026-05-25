const GROQ_API_KEY = process.env.GROQ_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message } = req.body;
  if (!GROQ_API_KEY) return res.status(200).json({ reply: "GROQ_API_KEY belum diset. Siap membantu, Komandan!" });
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'mixtral-8x7b-32768', messages: [{ role: 'user', content: message }], temperature: 0.7 })
    });
    const data = await response.json();
    res.status(200).json({ reply: data.choices?.[0]?.message?.content || "Maaf, AI sibuk." });
  } catch (error) {
    res.status(200).json({ reply: "Error API, tapi saya tetap siap membantu." });
  }
}
