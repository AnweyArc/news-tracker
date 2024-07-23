import { useState } from 'react';
import NewsList from '../components/NewsList';

const Home = ({ initialArticles }) => {
  const [articles, setArticles] = useState(initialArticles || []);
  const [query, setQuery] = useState('');

  // Fetch news articles based on the search query
  const fetchNews = async (searchQuery) => {
    if (!searchQuery) return; // Avoid making requests with empty queries

    const res = await fetch(`/api/news?query=${searchQuery}`);
    const data = await res.json();

    // Filter out articles that are marked as [removed]
    const filteredArticles = (data.articles || []).filter(article => !article.title.includes('[removed]'));

    setArticles(filteredArticles);
  };

  // Fetch initial news or refresh news with the current query
  const refreshNews = () => {
    fetchNews(query);
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
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') fetchNews(query); }}
            className="search-bar"
          />
          <div className="button-container mt-4">
            <button
              onClick={refreshNews}
              className="refresh-button"
            >
              <i className="fas fa-sync-alt"></i> {/* Font Awesome refresh icon */}
            </button>
          </div>
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
