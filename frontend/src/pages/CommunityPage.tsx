import React, { useState, useEffect } from 'react';
import { getCommunityPosts, createCommunityPost, likePost, getPostComments, createComment, type CommunityPost, type Comment } from '../api';
import { MessageSquare, ThumbsUp, Tag, Plus, Send } from 'lucide-react';
import CreatePostModal from '../components/CreatePostModal';

interface CreatePostData {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [postComments, setPostComments] = useState<{ [key: number]: any[] }>({});

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getCommunityPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };
    loadPosts();
  }, []);

  const categories = [
    'all',
    'announcements',
    'discussions',
    'success-stories',
    'questions',
    'events'
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const handleCreatePost = async (postData: CreatePostData) => {
    try {
      const newPost = await createCommunityPost(postData);
      console.log('New post from server:', newPost);
      const updatedPosts = await getCommunityPosts();
      setPosts(updatedPosts);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await likePost(postId);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: response.likes_count }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: number) => {
    try {
      const content = commentInputs[postId];
      if (!content?.trim()) return;

      await createComment(postId, content);
      
      // Refresh the post to get updated comment count
      const updatedPosts = await getCommunityPosts();
      setPosts(updatedPosts);
      
      // Clear input
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const toggleComments = async (postId: number) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      try {
        const comments = await getPostComments(postId);
        setPostComments(prev => ({ ...prev, [postId]: comments }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Connect with fellow volunteers and share your experiences
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Post
        </button>
      </div>

      <div className="mt-4 flex space-x-2 px-4 sm:px-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4 px-4 sm:px-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <div className="flex items-center space-x-3">
              <img
                src={post.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}`}
                alt={post.author.name}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{post.title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{post.content}</p>
            <div className="mt-4 flex items-center space-x-4">
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500"
              >
                <ThumbsUp className="h-5 w-5 mr-1" />
                {post.likes}
              </button>
              <button 
                onClick={() => toggleComments(post.id)}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500"
              >
                <MessageSquare className="h-5 w-5 mr-1" />
                {post.comments?.length || 0}
              </button>
              <div className="flex items-center space-x-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {expandedPost === post.id && (
              <div className="mt-4 border-t pt-4">
                <div className="space-y-4">
                  {postComments[post.id]?.map((comment: Comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}`}
                        alt={comment.author.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{comment.author.name}</p>
                        <p>{comment.content}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs(prev => ({ 
                      ...prev, 
                      [post.id]: e.target.value 
                    }))}
                    placeholder="Write a comment..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default CommunityPage; 