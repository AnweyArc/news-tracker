import React from 'react';

const NewsList = ({ articles = [] }) => {
  if (articles.length === 0) {
    return <p className="text-center">No news available.</p>;
  }

  return (
    <div className="container p-6">
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.url} className="news-item bg-ffc18c text-563232">
            <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
            <p className="news-date italic text-gray-500 text-sm">
              Posted on: {new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="mb-4">{article.description}</p>
            {article.content ? (
              <p className="news-summary mb-4">{article.content}</p>
            ) : (
              <p className="news-summary mb-4">Summary not available.</p>
            )}
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
