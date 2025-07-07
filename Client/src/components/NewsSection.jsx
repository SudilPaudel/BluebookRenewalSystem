import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function NewsSection() {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/news/public/active?limit=5`);
      if (response.ok) {
        const data = await response.json();
        setNews(data.result || []);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto change image every 3s
  useEffect(() => {
    if (news.length === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [index, news.length]);

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % news.length);
  };

  if (loading) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-nepal-blue mb-4">📰 Latest News</h2>
        <div className="w-full h-120 rounded-lg bg-gray-200 animate-pulse"></div>
      </section>
    );
  }

  if (news.length === 0) {
    return (
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-nepal-blue mb-4">📰 Latest News</h2>
        <div className="w-full h-120 rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500 text-lg">No news available at the moment</p>
        </div>
      </section>
    );
  }

  const current = news[index];

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-bold text-nepal-blue mb-4">📰 Latest News</h2>

      <div className="relative w-full h-120 rounded-lg overflow-hidden shadow-lg border border-nepal-blue">
        <img
          src={`${import.meta.env.VITE_API_URL}/public/uploads/news/${current.image}`}
          alt="news"
          className="w-full h-[600px] object-cover transition-opacity duration-1000"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NzM4NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
          }}
        />

        {/* Overlay text */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="p-4 text-white">
            <div className="text-lg font-semibold mb-2">{current.title}</div>
            <div className="text-sm opacity-90">{current.content.substring(0, 150)}...</div>
          </div>
        </div>

        {/* Left Arrow */}
        {news.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-80 transition"
        >
          <FaChevronLeft />
        </button>
        )}

        {/* Right Arrow */}
        {news.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-80 transition"
        >
          <FaChevronRight />
        </button>
        )}

        {/* Dots indicator */}
        {news.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {news.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition ${
                  i === index ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default NewsSection;
