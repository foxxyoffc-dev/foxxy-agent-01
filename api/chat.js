const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { message, history, maxMode } = req.body;
    if (!GROQ_API_KEY) return res.status(500).json({ reply: 'GROQ_API_KEY not set' });
    try {
        const messages = [{ role: 'system', content: maxMode ? 'Anda adalah asisten intelijen super cerdas mode maksimal, respons singkat padat dan informatif.' : 'Anda asisten ramah bernama Foxxy, respons singkat dan jelas.' }];
        if (history) history.forEach(h => messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content }));
        messages.push({ role: 'user', content: message });
        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: 'llama3-70b-8192', messages, temperature: 0.7, max_tokens: 300 })
        });
        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (err) { res.status(500).json({ reply: 'AI sedang sibuk, coba lagi nanti.' }); }
}
