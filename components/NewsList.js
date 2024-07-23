import React from 'react';

const NewsList = ({ articles = [] }) => {
  if (articles.length === 0) {
    return <p className="text-center">No news available.</p>;
  }

  // Sort articles by publishedAt date in descending order
  const sortedArticles = articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return (
    <div className="container p-6">
      <ul className="space-y-4">
        {sortedArticles.map((article) => (
          <li key={article.url} className="news-item bg-ffc18c text-563232">
            <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
            <p className="news-date">Posted on: {new Date(article.publishedAt).toLocaleDateString()}</p>
            <p className="mb-4">{article.description}</p>
            <a
              href={article.url}
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;
