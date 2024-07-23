import { useState } from 'react';
import NewsList from '../components/NewsList';

const Home = ({ initialArticles }) => {
  const [articles, setArticles] = useState(initialArticles || []);

  const fetchNews = async (query) => {
    if (!query) return; // Avoid making requests with empty queries

    const res = await fetch(`/api/news?query=${query}`);
    const data = await res.json();
    
    // Filter out articles that are not in the fetched results
    setArticles(data.articles || []);
  };

  return (
    <div className="bg-wood-bg min-h-screen flex items-center justify-center">
      <div className="container">
        <h1 className="text-4xl font-bold mb-4 text-center">News Tracker</h1>
        <div className="text-center">
          <h2 className="search-heading">News Paper</h2>
          <input
            type="text"
            placeholder="Search for news..."
            onChange={(e) => fetchNews(e.target.value)}
            className="search-bar"
          />
        </div>
        <NewsList articles={articles} />
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  try {
    const res = await fetch(`http://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
    const data = await res.json();
    return {
      props: {
        initialArticles: data.articles || [], // Ensure initialArticles is an array
      },
    };
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return {
      props: {
        initialArticles: [], // Return an empty array on error
      },
    };
  }
}

export default Home;
