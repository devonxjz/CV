import { useState, useEffect } from 'react';
import profileData from '../data/profile.json';
import skillsData from '../data/skills.json';
import milestonesData from '../data/milestones.json';
import projectsData from '../data/projects.json';
import contactData from '../data/contact.json';

export interface Profile {
  tag: string;
  headline: string;
  highlightText: string;
  subtext: string;
  ctaText: string;
  ctaTarget: number;
  avatarUrl: string;
}

export type ProfileData = Profile;

export interface Skill {
  name: string;
  percent: number;
  logo: string;
}

export type SkillData = Skill;

export interface Milestone {
  date: string;
  title: string;
  detail: string;
  side: 'left' | 'right';
  image?: string;
}

export type MilestoneData = Milestone;

export interface Project {
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

export type ProjectData = Project;

export interface ContactInfo {
  github: string;
  linkedin: string;
  email: string;
  facebook: string;
}

export type ContactData = ContactInfo;

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  milestones: Milestone[];
  projects: Project[];
  contact: ContactInfo;
}

const LOCAL_STORAGE_KEY = 'portfolio-data-v4';

const getInitialData = (): PortfolioData => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Auto-refresh projects cache if they contain old MissLost project
      const hasOldProjects = parsed.projects && parsed.projects.some((p: any) => p.title.toLowerCase().includes('misslost'));
      if (hasOldProjects) {
        try {
          localStorage.removeItem('portfolio-data');
          localStorage.removeItem('portfolio-data-v2');
          localStorage.removeItem('portfolio-data-v3');
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {}
        return {
          profile: profileData as Profile,
          skills: skillsData as Skill[],
          milestones: milestonesData as Milestone[],
          projects: projectsData as Project[],
          contact: contactData as ContactInfo,
        };
      }
      return {
        profile: parsed.profile || profileData,
        skills: parsed.skills || skillsData,
        milestones: parsed.milestones || milestonesData,
        projects: parsed.projects || projectsData,
        contact: parsed.contact || contactData,
      };
    }
  } catch {
    // ignore
  }

  return {
    profile: profileData as Profile,
    skills: skillsData as Skill[],
    milestones: milestonesData as Milestone[],
    projects: projectsData as Project[],
    contact: contactData as ContactInfo,
  };
};

export const usePortfolioData = () => {
  const [state, setState] = useState<PortfolioData>(getInitialData);

  useEffect(() => {
    const hasOld = state.projects.some((p: any) => p.title.toLowerCase().includes('misslost'));
    if (hasOld) {
      try {
        localStorage.removeItem('portfolio-data');
        localStorage.removeItem('portfolio-data-v2');
        localStorage.removeItem('portfolio-data-v3');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch {}
      setState(prev => ({
        ...prev,
        projects: projectsData as Project[]
      }));
    }
  }, [state.projects]);


  const updateProfile = (profile: Profile) => {
    setState((prev) => {
      const updated = { ...prev, profile };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateSkills = (skills: Skill[]) => {
    setState((prev) => {
      const updated = { ...prev, skills };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateMilestones = (milestones: Milestone[]) => {
    setState((prev) => {
      const updated = { ...prev, milestones };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateProjects = (projects: Project[]) => {
    setState((prev) => {
      const updated = { ...prev, projects };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateContact = (contact: ContactInfo) => {
    setState((prev) => {
      const updated = { ...prev, contact };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const exportData = () => {
    const downloadJSON = (obj: any, filename: string) => {
      const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    downloadJSON(state.profile, 'profile.json');
    downloadJSON(state.skills, 'skills.json');
    downloadJSON(state.milestones, 'milestones.json');
    downloadJSON(state.projects, 'projects.json');
    downloadJSON(state.contact, 'contact.json');
  };

  const resetData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setState({
      profile: profileData as Profile,
      skills: skillsData as Skill[],
      milestones: milestonesData as Milestone[],
      projects: projectsData as Project[],
      contact: contactData as ContactInfo,
    });
  };

  // Return a hybrid object that satisfies both `const data = usePortfolioData()` (default import)
  // and `const { data, updateProfile } = usePortfolioData()` (named import).
  return {
    data: state,
    profile: state.profile,
    skills: state.skills,
    milestones: state.milestones,
    projects: state.projects,
    contact: state.contact,
    updateProfile,
    updateSkills,
    updateMilestones,
    updateProjects,
    updateContact,
    exportData,
    resetData,
  };
};

export default usePortfolioData;
