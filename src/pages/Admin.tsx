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
    data,
    updateProfile,
    updateSkills,
    updateMilestones,
    updateProjects,
    updateContact,
    exportData,
    resetData,
  } = usePortfolioData();

  const renderEditor = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileEditor data={data.profile} onSave={updateProfile} />;
      case 'skills':
        return <SkillsEditor data={data.skills} onSave={updateSkills} />;
      case 'milestones':
        return <MilestonesEditor data={data.milestones} onSave={updateMilestones} />;
      case 'projects':
        return <ProjectsEditor data={data.projects} onSave={updateProjects} />;
      case 'contact':
        return <ContactEditor data={data.contact} onSave={updateContact} />;
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
