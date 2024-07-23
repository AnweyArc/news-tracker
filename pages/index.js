import { useState } from 'react';
import NewsList from '../components/NewsList';

const Home = ({ initialArticles }) => {
  const [articles, setArticles] = useState(initialArticles || []);
  const [query, setQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Fetch news articles based on the search query and selected language
  const fetchNews = async (searchQuery) => {
    let url = `/api/news?query=${searchQuery}`;
    if (selectedLanguage) {
      url += `&language=${selectedLanguage}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    // Filter out articles that are marked as [removed]
    const filteredArticles = (data.articles || []).filter(article => !article.title.includes('[removed]'));

    setArticles(filteredArticles);
  };

  // Handle language selection
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    fetchNews(query);
  };

  // Refresh news with the current query and selected language
  const refreshNews = () => {
    fetchNews(query);
  };

  return (
    <div className="bg-wood-bg min-h-screen flex flex-col">
      {/* Navbar */}
      <nav>
        <ul>
          {['en', 'tl', 'ja', 'es'].map(lang => (
            <li key={lang}>
              <button
                onClick={() => handleLanguageChange(lang)}
                className={`py-2 px-4 rounded ${selectedLanguage === lang ? 'bg-wood-dark text-white' : ''}`}
              >
                {lang === 'en' && 'English'}
                {lang === 'tl' && 'Tagalog'}
                {lang === 'ja' && 'Japanese'}
                {lang === 'es' && 'Español'}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handleLanguageChange('')}
              className={`py-2 px-4 rounded ${!selectedLanguage ? 'bg-wood-dark text-white' : ''}`}
            >
              All News
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 flex-grow">
        <h1 className="text-4xl font-bold mb-4 text-center">News Tracker</h1>
        <div className="text-center">
          <h2 className="search-heading">News Paper</h2>
          <input
            type="text"
            placeholder="Search for news..."
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') fetchNews(e.target.value); }}
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
