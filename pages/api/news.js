export default async function handler(req, res) {
    const { query } = req.query;
    const apiKey = process.env.NEWS_API_KEY;
  
    const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`);
    const data = await response.json();
  
    res.status(200).json(data);
  }
  