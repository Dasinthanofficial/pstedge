import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/media';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/api/blogs/slug/${slug}`);
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="pt-32 pb-16 text-center text-gray-500">Loading article...</div>;
  }

  if (!post) {
    return (
      <div className="pt-32 pb-16 text-center text-gray-500">
        <p>Article not found.</p>
        <Link to="/blog" className="inline-block mt-4 text-white hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-16 min-h-[100dvh]">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/blog" className="inline-block mb-8 text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Blog
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-gray-500 uppercase tracking-wider">
            <span className="bg-gray-900/80 px-3 py-1 rounded-full border border-gray-800 text-white">
              {post.category}
            </span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.readTime || '5 min read'}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            {post.title}
          </h1>

          <p className="text-lg text-gray-400 leading-relaxed mb-10">
            {post.excerpt}
          </p>

          {post.featuredImage && (
            <div className="rounded-3xl overflow-hidden border border-gray-800 mb-10">
              <img
                src={getImageUrl(post.featuredImage)}
                alt={post.title}
                className="w-full h-auto max-h-[520px] object-cover"
              />
            </div>
          )}

          <div className="glass-card p-8 md:p-10 rounded-3xl border border-gray-800">
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail;