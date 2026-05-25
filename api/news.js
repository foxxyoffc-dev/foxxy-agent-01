const NEWS_API_KEY = process.env.NEWS_API_KEY;
export default async function handler(req, res) {
    const url = `https://newsapi.org/v2/everything?q=trump+OR+global+economy&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.status(200).json(data);
    } catch(e) { res.status(200).json({ articles: [] }); }
}
