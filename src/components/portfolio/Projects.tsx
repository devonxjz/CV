import vibeImg from '../../assets/4.jpg';
import agentImg from '../../assets/agent.jpg';
import spkImg from '../../assets/SPK.png';
import heroImg from '../../assets/hero.png';
import cvAgentImg from '../../assets/cv-agent.png';

interface Project {
  title: string;
  description: string;
  image: string;
  dotColor: string;
  tags: string[];
  role: string;
  github: string;
  liveUrl: string;
  period: string;
}

interface ProjectsProps {
  projects: Project[];
}

const getProjectImage = (title: string, jsonImage?: string) => {
  if (jsonImage && jsonImage !== '') return jsonImage;
  const cleanTitle = title.toLowerCase();
  if (cleanTitle.includes('vibe') || cleanTitle.includes('chemlab')) return vibeImg;
  if (cleanTitle.includes('smart') || cleanTitle.includes('office')) return agentImg;
  if (cleanTitle.includes('osint')) return spkImg;
  if (cleanTitle.includes('cv-agent') || cleanTitle.includes('cv agent') || cleanTitle.includes('cv analyzer')) return cvAgentImg;
  return heroImg;
};

const Projects = ({ projects }: ProjectsProps) => {
  return (
    <div className="projects-content">
      <h2 className="projects-heading">Selected projects</h2>
      <div className="projects-grid">
        {projects.map((project) => {
          const projectLink = project.liveUrl || project.github;
          const imgSrc = getProjectImage(project.title, project.image);
          return (
            <div className="project-card-square" key={project.title}>
              {/* Top Half: Demo Image */}
              <div className="project-square-image-wrapper">
                <img src={imgSrc} alt={project.title} className="project-square-image" />
                <div className="project-square-image-overlay" />
                <div
                  className="project-square-dot"
                  style={{ backgroundColor: project.dotColor }}
                />
              </div>

              {/* Bottom Half: Info Section */}
              <div className="project-square-info">
                <div className="project-square-meta-header">
                  <h3 className="project-square-title">{project.title}</h3>
                  {project.period && (
                    <span className="project-square-period">{project.period}</span>
                  )}
                </div>

                <p className="project-square-desc">{project.description}</p>
                
                <div className="project-square-tags">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span className="project-square-tag" key={tag}>{tag}</span>
                  ))}
                </div>

                {projectLink && (
                  <a
                    className="project-square-view-btn"
                    href={projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ '--project-color': project.dotColor } as React.CSSProperties}
                  >
                    View Project
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M6 2h8v8M14 2L6 10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
