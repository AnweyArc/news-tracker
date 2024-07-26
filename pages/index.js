import { useState, useEffect } from 'react';
import NewsList from '../components/NewsList';

const Home = ({ initialArticles }) => {
  const [articles, setArticles] = useState(initialArticles || []);
  const [query, setQuery] = useState('');

  // Fetch news articles based on the search query
  const fetchNews = async (searchQuery) => {
    if (!searchQuery) return; // Avoid making requests with empty queries

    try {
      const res = await fetch(`/api/news?query=${searchQuery}`);
      const data = await res.json();

      // Filter out articles that are marked as [removed] and published before 1980
      const filteredArticles = (data.articles || [])
        .filter(article => {
          const publishedDate = new Date(article.publishedAt);
          return !article.title.includes('[removed]') && publishedDate.getFullYear() >= 1980;
        });

      // Add frequency count of the search query in each article
      const articlesWithCount = filteredArticles.map(article => {
        const titleCount = (article.title.match(new RegExp(searchQuery, 'gi')) || []).length;
        const descriptionCount = (article.description ? (article.description.match(new RegExp(searchQuery, 'gi')) || []).length : 0);
        return { ...article, count: titleCount + descriptionCount };
      });

      // Sort articles by mention count (descending) and publishedAt date (descending)
      const sortedArticles = articlesWithCount.sort((a, b) => b.count - a.count || new Date(b.publishedAt) - new Date(a.publishedAt));

      setArticles(sortedArticles);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    }
  };

  // Fetch initial news or refresh news with the current query
  const refreshNews = () => {
    fetchNews(query);
  };

  useEffect(() => {
    setArticles(initialArticles); // Ensuring client and server have the same initial data
  }, [initialArticles]);

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

    // Filter out articles that are marked as [removed] and published before 1980
    const filteredArticles = (data.articles || [])
      .filter(article => {
        const publishedDate = new Date(article.publishedAt);
        return !article.title.includes('[removed]') && publishedDate.getFullYear() >= 1980;
      });

    // Sort articles by publishedAt date in descending order
    const sortedArticles = filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return {
      props: {
        initialArticles: sortedArticles, // Ensure initialArticles is an array
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
