import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Save, X, RefreshCw, User, AlertCircle, CheckCircle } from 'lucide-react';

const MyBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const API_URL = 'http://localhost:8080/api/posts';

  const MY_POSTS_URL = 'http://localhost:8080/api/posts/mine';

  // Sample data for demonstration
  const samplePosts = [
  
  ];

  const fetchMyPosts = async () => {
  setLoading(true);
  setError('');
  
  try {
    const authToken = localStorage.getItem('token'); // your JWT token key
    if (!authToken) {
      throw new Error('No authentication token found. Please login.');
    }

    const response = await fetch(MY_POSTS_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // include cookies if needed
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized! Please login again.');
      } else {
        throw new Error(`Failed to fetch posts. Status: ${response.status}`);
      }
    }

    const data = await response.json();
    setPosts(data);

  } catch (err) {
    setError(err.message || 'Failed to fetch your blog posts');
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (post) => {
    setEditingPost(post);
    setEditForm({ title: post.title, content: post.content });a

  };

 const handleEditSubmit = async () => {
  if (!editForm.title.trim() || !editForm.content.trim()) {
    setError('Please fill in both title and content fields.');
    return;
  }

  setEditLoading(true);
  setError('');

  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) throw new Error('No authentication token found. Please login.');

    const response = await fetch(`${API_URL}/${editingPost.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: editForm.title.trim(),
        content: editForm.content.trim(),
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized! Please login again.');
      } else {
        throw new Error(`Failed to update post. Status: ${response.status}`);
      }
    }

    const updatedPost = await response.json();

    // Update local state
    setPosts(posts.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    ));

    setEditingPost(null);
    setSuccessMessage('Blog post updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);

  } catch (err) {
    setError(err.message || 'Failed to update blog post');
  } finally {
    setEditLoading(false);
  }
};


  const handleDelete = async (postId) => {
  if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
    return;
  }

  setDeleteLoading(postId);
  setError('');

  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) throw new Error('No authentication token found. Please login.');

    const response = await fetch(`${API_URL}/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized! Please login again.');
      } else {
        throw new Error(`Failed to delete post. Status: ${response.status}`);
      }
    }

    // Remove deleted post from local state
    setPosts(posts.filter(post => post.id !== postId));
    setSuccessMessage('Blog post deleted successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);

  } catch (err) {
    setError(err.message || 'Failed to delete blog post');
  } finally {
    setDeleteLoading(null);
  }
};


  const goBack = () => {
    window.history.back();
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <p className="text-white text-xl font-semibold">Loading your blog posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📝 My Blog Posts
              </h1>
            </div>
            <button
              onClick={fetchMyPosts}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </header>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="text-green-500 shrink-0" size={20} />
            <p className="text-green-400 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <AlertCircle className="text-red-400" size={24} />
              <h3 className="text-red-400 text-xl font-semibold">Error</h3>
            </div>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchMyPosts}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all duration-300"
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                </div>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold shrink-0">
                  #{post.id}
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-600 mb-4 line-clamp-4">
                {post.content}
              </p>

              {/* Post Author */}
              <div className="flex items-center gap-3 mb-4 pt-4 border-t border-gray-100">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(post.ownerUsername)}
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <User size={14} />
                  <span className="font-medium">{post.ownerUsername}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(post)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleteLoading === post.id}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === post.id ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white/80 text-xl mb-4">📝 No blog posts found</div>
            <p className="text-white/60 mb-6">You haven't created any blog posts yet.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300"
            >
              Create Your First Post
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Edit Blog Post</h3>
              <button
                onClick={() => setEditingPost(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-300 text-lg"
                  disabled={editLoading}
                />
              </div>

              {/* Content Field */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Content *
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all duration-300 text-lg resize-y"
                  disabled={editLoading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleEditSubmit}
                  disabled={editLoading || !editForm.title.trim() || !editForm.content.trim()}
                  className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={() => setEditingPost(null)}
                  disabled={editLoading}
                  className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlog;