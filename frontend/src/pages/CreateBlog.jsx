import React, { useState } from 'react';
import { ArrowLeft, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:8080/api/posts';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in both title and content fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Get token from localStorage
      const authToken = localStorage.getItem('token');
      
      if (!authToken) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Success
      setSuccess(true);
      setFormData({ title: '', content: '' });
      
      // Auto redirect after 2 seconds
      setTimeout(() => {
        goBack();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    // Navigate back to blog list
    window.history.back();
    // Or if using React Router: navigate(-1) or navigate('/blogs');
  };

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setError('');
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 text-center max-w-md">
              <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Blog Created!</h2>
              <p className="text-gray-600 mb-6">Your blog post has been successfully created and published.</p>
              <div className="text-sm text-gray-500">Redirecting you back...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ✍️ Create New Blog
            </h1>
          </div>
        </header>

        {/* Create Blog Form */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="text-red-500 shrink-0" size={20} />
              <div>
                <h4 className="text-red-700 font-semibold">Error</h4>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-3">
                Blog Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter your blog title..."
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm"
                disabled={loading}
              />
            </div>

            {/* Content Field */}
            <div>
              <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-3">
                Blog Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog content here..."
                rows={12}
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-all duration-300 text-lg bg-white/80 backdrop-blur-sm resize-y"
                disabled={loading}
              />
            </div>

            {/* Character Counts */}
            <div className="flex justify-between text-sm text-gray-500">
              <span>Title: {formData.title.length} characters</span>
              <span>Content: {formData.content.length} characters</span>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Blog...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Create Blog Post
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Form
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <h3 className="text-lg font-semibold text-emerald-800 mb-3">💡 Writing Tips</h3>
            <ul className="text-emerald-700 space-y-2 text-sm">
              <li>• Write a compelling title that grabs attention</li>
              <li>• Structure your content with clear paragraphs</li>
              <li>• Use engaging language that connects with your readers</li>
              <li>• Preview your post before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;