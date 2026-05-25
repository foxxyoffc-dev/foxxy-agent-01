export default async function handler(req, res) {
  const dummyNews = {
    articles: [
      { title: "Trump: 'Kesepakatan Iran hampir rampung'", source: { name: "Reuters" }, publishedAt: new Date().toISOString() },
      { title: "Pasar saham AS menguat", source: { name: "Bloomberg" }, publishedAt: new Date().toISOString() },
      { title: "Bitcoin menyentuh $50.000", source: { name: "CoinDesk" }, publishedAt: new Date().toISOString() }
    ]
  };
  res.status(200).json(dummyNews);
}
