import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeIn } from '../../utils/motion';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/media';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/api/blogs');
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching blogs', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const dynamicCategories = [...new Set(posts.map((post) => post.category).filter(Boolean))];
    return ['All', ...dynamicCategories];
  }, [posts]);

  const filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="w-full pt-32 pb-16 min-h-[100dvh]">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          variants={fadeIn('up', 'tween', 0, 0.8)}
          initial="hidden"
          animate="show"
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            PST EDGE <span className="text-white">Blog</span>
          </h1>
          <p className="text-xl text-gray-400">Insights, Tips & Trends in Tech & Design</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 text-sm transition-colors border-b-2 ${
                selectedCategory === category
                  ? 'text-white border-white'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF956D]"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex justify-center h-64 text-gray-500">
            No blog posts available for this category.
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post._id}
                variants={fadeIn('up', 'tween', index * 0.1, 0.8)}
                className="group cursor-pointer"
              >
                <div className="relative h-60 overflow-hidden rounded-2xl mb-6">
                  <img
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-gray-800">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 uppercase tracking-wider">
                  <span>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span>•</span>
                  <span>{post.readTime || '5 min read'}</span>
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors text-gray-100">
                  {post.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>

                <Link
                  to={`/blog/${post.slug}`}
                  className="text-sm font-bold text-white uppercase tracking-wider hover:underline underline-offset-4"
                >
                  Read Article
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        <motion.div
          variants={fadeIn('up', 'tween', 0.2, 0.8)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card p-12 rounded-3xl text-center border border-gray-800"
        >
          <h2 className="text-3xl font-bold mb-4">Have a Project in Mind?</h2>
          <p className="text-gray-400 mb-8">Let's turn your idea into a stunning digital product.</p>
          <Link
            to="/contact"
            className="bg-white text-black font-bold rounded-full px-8 py-4 hover:bg-gray-200 transition-colors inline-block"
          >
            Get In Touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;