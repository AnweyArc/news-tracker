import { useState } from 'react';
import NewsList from '../components/NewsList';

const Home = ({ initialArticles }) => {
  const [articles, setArticles] = useState(initialArticles);

  const fetchNews = async (query) => {
    const res = await fetch(`/api/news?query=${query}`);
    const data = await res.json();
    setArticles(data.articles);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">News Tracker</h1>
      <input
        type="text"
        placeholder="Search for news..."
        onChange={(e) => fetchNews(e.target.value)}
        className="p-2 border rounded mb-4 w-full"
      />
      <NewsList articles={articles} />
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch(`http://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
  const data = await res.json();
  return {
    props: {
      initialArticles: data.articles,
    },
  };
}

export default Home;
