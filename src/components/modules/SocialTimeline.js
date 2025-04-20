import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';

function SocialTimeline() {
  const { t } = useTranslation();
  const { user, role } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Initialize with some mock data
  useEffect(() => {
    const initialPosts = [
      {
        id: 1,
        author: 'Lakshmi Sundar',
        role: 'Principal',
        content: 'Congratulations to our 10th grade students for achieving 95% pass rate in the state exams! We are proud of your hard work and dedication.',
        timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
        likes: 15,
        liked: false,
        comments: [
          {
            id: 1,
            author: 'Ramesh Krishnan',
            role: 'Teacher',
            content: 'Very proud of our students! They worked incredibly hard this year.',
            timestamp: new Date(Date.now() - 3600000 * 24 * 1).toISOString(), // 1 day ago
          }
        ],
        image: null
      },
      {
        id: 2,
        author: 'Deepa Venkat',
        role: 'Teacher',
        content: 'Science project exhibition will be held next Friday. All students from grades 8-10 are encouraged to participate. Please register your projects by Wednesday.',
        timestamp: new Date(Date.now() - 3600000 * 24 * 1).toISOString(), // 1 day ago
        likes: 8,
        liked: false,
        comments: [],
        image: null
      },
      {
        id: 3,
        author: 'Admin User',
        role: 'Admin',
        content: 'The school will remain closed tomorrow due to heavy rainfall warning. Stay safe everyone!',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
        likes: 23,
        liked: true,
        comments: [
          {
            id: 1,
            author: 'Sunil Venu',
            role: 'Teacher',
            content: 'Will the staff meeting be rescheduled?',
            timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
          },
          {
            id: 2,
            author: 'Admin User',
            role: 'Admin',
            content: 'Yes, the staff meeting will be held online at the same time. Link will be shared via email.',
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
          }
        ],
        image: null
      }
    ];
    
    setPosts(initialPosts);
  }, []);

  // Format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Check if user can post
  const canPost = ['admin', 'teacher', 'principal'].includes(role?.toLowerCase());

  // Handle post submission
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim() && !previewImage) return;
    
    const newPostObj = {
      id: posts.length + 1,
      author: user?.name || 'Anonymous',
      role: role || 'User',
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
      image: previewImage
    };
    
    setPosts([newPostObj, ...posts]);
    setNewPost('');
    setPreviewImage(null);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFileInput(e.target);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove file
  const handleRemoveFile = () => {
    setPreviewImage(null);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle like action
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLiked = !post.liked;
        return {
          ...post,
          liked: newLiked,
          likes: newLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  // Handle adding a comment
  const handleAddComment = (postId, commentText) => {
    if (!commentText.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: post.comments.length + 1,
          author: user?.name || 'Anonymous',
          role: role || 'User',
          content: commentText,
          timestamp: new Date().toISOString()
        };
        
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  return (
    <div className="social-timeline">
      <h1>{t('social.title', 'School Community Feed')}</h1>
      
      {canPost && (
        <div className="post-form-container">
          <form onSubmit={handlePostSubmit} className="post-form">
            <div className="post-form-header">
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} 
                alt={user?.name || 'User'} 
                className="user-avatar"
              />
              <div className="post-form-info">
                <span className="post-author-name">{user?.name || 'Anonymous'}</span>
                <span className="post-author-role">{role || 'User'}</span>
              </div>
            </div>
            <textarea
              placeholder={t('social.postPlaceholder', "What's happening in school today?")}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="post-input"
            />
            
            {previewImage && (
              <div className="preview-image-container">
                <img src={previewImage} alt="Preview" className="preview-image" />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={handleRemoveFile}
                >
                  ×
                </button>
              </div>
            )}
            
            <div className="post-form-actions">
              <div className="post-form-attachments">
                <label className="attachment-btn">
                  <span className="attachment-icon">📷</span>
                  <span className="attachment-text">Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <button 
                type="submit" 
                className="post-submit-btn"
                disabled={!newPost.trim() && !previewImage}
              >
                {t('social.post', 'Post')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="timeline-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <img 
                src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} 
                alt={post.author} 
                className="post-avatar"
              />
              <div className="post-meta">
                <div className="post-author">
                  <span className="post-author-name">{post.author}</span>
                  <span className="post-author-role">{post.role}</span>
                </div>
                <div className="post-time">{formatTime(post.timestamp)}</div>
              </div>
            </div>
            
            <div className="post-content">
              <p>{post.content}</p>
              {post.image && (
                <div className="post-image-container">
                  <img src={post.image} alt="Post attachment" className="post-image" />
                </div>
              )}
            </div>
            
            <div className="post-actions">
              <button 
                className={`like-btn ${post.liked ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <span className="like-icon">{post.liked ? '❤️' : '🤍'}</span>
                <span className="like-count">{post.likes}</span>
              </button>
              
              <div className="comments-count">
                <span className="comments-icon">💬</span>
                <span>{post.comments.length}</span>
              </div>
            </div>
            
            {post.comments.length > 0 && (
              <div className="comments-section">
                {post.comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`} 
                      alt={comment.author} 
                      className="comment-avatar"
                    />
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-role">{comment.role}</span>
                        <span className="comment-time">{formatTime(comment.timestamp)}</span>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <CommentForm postId={post.id} onAddComment={handleAddComment} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Comment Form Component
function CommentForm({ postId, onAddComment }) {
  const [comment, setComment] = useState('');
  const { t } = useTranslation();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment(postId, comment);
    setComment('');
  };
  
  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input 
        type="text"
        placeholder={t('social.commentPlaceholder', 'Write a comment...')}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="comment-input"
      />
      <button 
        type="submit" 
        className="comment-submit-btn"
        disabled={!comment.trim()}
      >
        {t('social.comment', 'Comment')}
      </button>
    </form>
  );
}

export default SocialTimeline;