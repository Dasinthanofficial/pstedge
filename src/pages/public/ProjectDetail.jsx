import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import api from '../../utils/api';
import { getImageUrl } from '../../utils/media';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/api/projects/slug/${slug}`);
        setProject(data);
      } catch (error) {
        console.error('Error fetching project', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return <div className="pt-32 pb-16 text-center text-gray-500">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="pt-32 pb-16 text-center text-gray-500">
        <p>Project not found.</p>
        <Link to="/portfolio" className="inline-block mt-4 text-white hover:underline">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-16 min-h-[100dvh]">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/portfolio" className="inline-block mb-8 text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Portfolio
          </Link>

          <div className="mb-6">
            <span className="bg-gray-900/80 px-3 py-1 rounded-full border border-gray-800 text-xs text-white uppercase tracking-wider">
              {project.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
            {project.title}
          </h1>

          <p className="text-lg text-gray-400 leading-relaxed mb-10">
            {project.description}
          </p>

          {project.thumbnail && (
            <div className="rounded-3xl overflow-hidden border border-gray-800 mb-10">
              <img
                src={getImageUrl(project.thumbnail)}
                alt={project.title}
                className="w-full h-auto max-h-[560px] object-cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">The Challenge</h2>
              <p className="text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">
                {project.challenge}
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">The Solution</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.solution}
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies?.map((tech) => (
                  <span key={tech} className="text-sm text-gray-300 border border-gray-700 px-3 py-1 rounded-full">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Live Demo <ExternalLink size={16} />
                  </a>
                )}

                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-900 transition-colors"
                  >
                    GitHub <Github size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {project.testimonial?.quote && (
            <div className="glass-card p-8 md:p-10 rounded-3xl border border-gray-800">
              <p className="text-xl md:text-2xl text-gray-200 italic leading-relaxed mb-4">
                “{project.testimonial.quote}”
              </p>
              {project.testimonial.author && (
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  {project.testimonial.author}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;