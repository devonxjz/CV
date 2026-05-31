import { useState } from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import AdminLayout from '../components/admin/AdminLayout';
import ProfileEditor from '../components/admin/ProfileEditor';
import SkillsEditor from '../components/admin/SkillsEditor';
import MilestonesEditor from '../components/admin/MilestonesEditor';
import ProjectsEditor from '../components/admin/ProjectsEditor';
import ContactEditor from '../components/admin/ContactEditor';
import '../styles/admin.css';

type Section = 'profile' | 'skills' | 'milestones' | 'projects' | 'contact';

export default function Admin() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const {
    profile,
    skills,
    milestones,
    projects,
    contact,
    setProfile,
    setSkills,
    setMilestones,
    setProjects,
    setContact,
    exportData,
    resetData,
  } = usePortfolioData();

  const renderEditor = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileEditor data={profile} onSave={setProfile} />;
      case 'skills':
        return <SkillsEditor data={skills} onSave={setSkills} />;
      case 'milestones':
        return <MilestonesEditor data={milestones} onSave={setMilestones} />;
      case 'projects':
        return <ProjectsEditor data={projects} onSave={setProjects} />;
      case 'contact':
        return <ContactEditor data={contact} onSave={setContact} />;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onExport={exportData}
      onReset={resetData}
    >
      {renderEditor()}
    </AdminLayout>
  );
}
