import React, { useState, useEffect } from 'react';
import { RefreshCw, Edit3, LogOut, User, PlusCircle, Trash2 } from 'lucide-react';

const BlogDisplay = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authToken = localStorage.getItem('token'); // JWT from login
  const API_URL = 'http://localhost:8080/api/posts';

  // Fetch all posts
  const fetchBlogPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const createBlog = () => {
    window.location.href = '/create';
  };

  const goToMyBlog = async () => {
   window.location.href = '/my-blog';

  };

  const deletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      alert('Post deleted');
      fetchBlogPosts();
    } catch (err) {
      alert(err.message || 'Failed to delete post');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getInitials = (username) => username.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            ✨ Blog Posts
          </h1>
          <div className="flex gap-3">
            <button onClick={createBlog} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300">
              <PlusCircle size={18} />
              Create Blog
            </button>
            <button onClick={goToMyBlog} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300">
              <Edit3 size={18} />
              My Blog
            </button>
            <button onClick={logout} className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 text-center">
            <h3 className="text-red-400 text-xl font-semibold mb-2">⚠️ Error Loading Posts</h3>
            <p className="text-red-300 mb-4">{error}</p>
            <button onClick={fetchBlogPosts} className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300">
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-4 gap-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h2>
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shrink-0">#{post.id}</div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">{getInitials(post.ownerUsername)}</div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <User size={14} />
                  <span className="font-medium">{post.ownerUsername}</span>
                </div>
                <button onClick={() => deletePost(post.id)} className="ml-auto text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Refresh */}
        <button onClick={fetchBlogPosts} className="fixed bottom-8 right-8 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:scale-110 flex items-center justify-center">
          <RefreshCw size={20} className="animate-spin" />
        </button>
      </div>
    </div>
  );
};

export default BlogDisplay;
