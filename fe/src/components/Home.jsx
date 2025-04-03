import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [batchBookmarks, setBatchBookmarks] = useState([{ title: '', link: '' }]);
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = React.useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/bookmarks/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  }, [API_URL]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    const catarr = [category];
    const token = localStorage.getItem('user');
    console.log(token, JSON.parse(token));
    
    const user_id = 2;
    try{
      await axios.post(
        `${API_URL}/bookmarks`,
        { user_id, title, link, catarr },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchBookmarks();
      setTitle('');
      setLink('');
      setCategory('');
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const handleFetchByCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/bookmarks/category/${category}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setBookmarks(response.data);
    } catch (error) {
      console.error('Error fetching bookmarks by category:', error);
    }
  };

  const handleBatchInputChange = (index, field, value) => {
    const newBatchBookmarks = [...batchBookmarks];
    newBatchBookmarks[index][field] = value;
    setBatchBookmarks(newBatchBookmarks);
  };

  const handleAddBatchField = () => {
    setBatchBookmarks([...batchBookmarks, { title: '', link: '' }]);
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/bookmarks/batch`,
        { bookmarks: batchBookmarks },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchBookmarks();
      setBatchBookmarks([{ title: '', link: '' }]);
    } catch (error) {
      console.error('Error adding batch bookmarks:', error);
    }
  };

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="home-container">
        <div>
        <button onClick={handleLoginClick}>Login</button>
        <button onClick={handleRegisterClick}>Register</button>
      </div>
      <h2>Bookmark Manager</h2>

      {/* Add Bookmark */}
      <section>
        <h3>Add Bookmark</h3>
        <form onSubmit={handleAddBookmark}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Link:
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </label>
          <label>
            Category:
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </label>
          <button type="submit">Add Bookmark</button>
        </form>
      </section>

      {/* Fetch Bookmarks by Category */}
      <section>
        <h3>Fetch Bookmarks by Category</h3>
        <form onSubmit={handleFetchByCategory}>
          <label>
            Category:
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </label>
          <button type="submit">Fetch Bookmarks</button>
        </form>
      </section>

      {/* Batch Add Bookmarks */}
      <section>
        <h3>Batch Add Bookmarks</h3>
        <form onSubmit={handleBatchSubmit}>
          {batchBookmarks.map((bookmark, index) => (
            <div key={index}>
              <label>
                Title:
                <input
                  type="text"
                  value={bookmark.title}
                  onChange={(e) => handleBatchInputChange(index, 'title', e.target.value)}
                  required
                />
              </label>
              <label>
                Link:
                <input
                  type="url"
                  value={bookmark.link}
                  onChange={(e) => handleBatchInputChange(index, 'link', e.target.value)}
                  required
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={handleAddBatchField}>
            Add Another Bookmark
          </button>
          <button type="submit">Add Bookmarks</button>
        </form>
      </section>

      {/* Display Bookmarks */}
      <section>
        <h3>All Bookmarks</h3>
        <ul>
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <a href={bookmark.link} target="_blank" rel="noopener noreferrer">
                {bookmark.title}
              </a>
              {bookmark.categories && bookmark.categories.length > 0 && (
                <p>Categories: {bookmark.categories.join(', ')}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;
