import React from 'react';

const NewsList = ({ articles = [] }) => {
  return (
    <div className="p-4">
      {articles.length === 0 ? (
        <p>No news available.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.title} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold">{article.title}</h2>
              <p>{article.description}</p>
              <a href={article.url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsList;
