import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Star } from 'lucide-react';
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
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return <div className="pt-40 pb-20 text-center text-gray-500 min-h-screen bg-white">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="pt-40 pb-20 text-center text-gray-500 min-h-screen bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
        <Link to="/projects" className="text-blue-600 hover:underline">Return to Projects</Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pt-32 pb-24 min-h-[100dvh] selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-5xl mx-auto px-6">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-10">
            <ArrowLeft size={16} /> Back to all projects
          </Link>

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4">{project.category}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            {project.title}
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-12 max-w-3xl">
            {project.description}
          </p>
        </motion.div>

        {project.thumbnail && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="bento-card overflow-hidden border border-gray-200 mb-16">
              <img src={getImageUrl(project.thumbnail)} alt={project.title} className="w-full h-auto max-h-[600px] object-cover" />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            {project.challenge && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">The Challenge</h2>
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">{project.challenge}</p>
              </section>
            )}
            
            {project.solution && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">The Solution</h2>
                <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">{project.solution}</p>
              </section>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="bento-card p-8 bg-[#F9FAFB] border border-gray-200 sticky top-32">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-6">Technologies</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.technologies?.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                {project.liveDemo && (
                  <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                    Visit Live Site <ExternalLink size={18} />
                  </a>
                )}
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    View Source <Github size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {project.testimonial?.quote && (
          <div className="mt-20 bento-card p-10 md:p-16 bg-blue-50/50 border border-blue-100 text-center">
            <div className="flex justify-center mb-6"><Star className="text-blue-400" size={32} fill="currentColor" /></div>
            <p className="text-2xl md:text-3xl font-medium text-gray-900 leading-snug mb-8">
              "{project.testimonial.quote}"
            </p>
            {project.testimonial.author && (
              <p className="font-bold text-gray-900">{project.testimonial.author}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;