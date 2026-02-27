import { useState, useEffect, useCallback } from "react";
import "./App.css";

function App() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [likedQuotes, setLikedQuotes] = useState(() => {
    const saved = localStorage.getItem("likedQuotes");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch quote
  const fetchQuote = useCallback(async () => {
  setLoading(true);

  try {
    const response = await fetch("https://api.adviceslip.com/advice");
    const data = await response.json();

    setQuote(data.slip.advice);
    setAuthor("Advice API");
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  fetchQuote();
}, [fetchQuote]);

  // Save liked quotes to localStorage
  useEffect(() => {
    localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  // Like unlike
  const handleLike = () => {
    const exists = likedQuotes.find(
      (item) => item.quote === quote
    );

    if (exists) {
      // Remove if already liked
      setLikedQuotes(
        likedQuotes.filter((item) => item.quote !== quote)
      );
    } else {
      // Add new liked quote
      setLikedQuotes([
        ...likedQuotes,
        { quote, author },
      ]);
    }
  };

  const isLiked = likedQuotes.some(
    (item) => item.quote === quote
  );

  return (
  <div className="container">
    <h1>🌞 Daily Motivation Dashboard</h1>

    {loading ? (
      <p>Loading...</p>
    ) : (
      <>
        <h2>"{quote}"</h2>
        <p>- {author}</p>
      </>
    )}

    <div className="buttons">
      <button onClick={fetchQuote} disabled={loading}>
        New Quote
      </button>

      <button onClick={handleLike}>
        {isLiked ? "Unlike 💔" : "Like ❤️"}
      </button>
    </div>

    <h3>Total Likes: {likedQuotes.length}</h3>

    {/* Search Input */}
    <input
      type="text"
      placeholder="Search liked quotes..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    {/* Liked Quotes List */}
    <div className="liked-list">
      {likedQuotes
        .filter((item) =>
          item.quote.toLowerCase().includes(search.toLowerCase())
        )
        .map((item, index) => (
          <div key={index} className="liked-item">
            <p>"{item.quote}"</p>
            <small>- {item.author}</small>
          </div>
        ))}

      {likedQuotes.length === 0 && (
        <p>No liked quotes yet.</p>
      )}
    </div>
  </div>
);
}

export default App;