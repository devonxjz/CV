import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Section = 'profile' | 'skills' | 'milestones' | 'projects' | 'contact';

interface AdminLayoutProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  onExport: () => void;
  onReset: () => void;
  children: ReactNode;
}

const NAV_ITEMS: { key: Section; label: string; icon: string }[] = [
  { key: 'profile', label: 'Profile', icon: '👤' },
  { key: 'skills', label: 'Skills', icon: '⚡' },
  { key: 'milestones', label: 'Milestones', icon: '🏆' },
  { key: 'projects', label: 'Projects', icon: '📁' },
  { key: 'contact', label: 'Contact', icon: '📧' },
];

export default function AdminLayout({
  activeSection,
  onSectionChange,
  onExport,
  onReset,
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-root">
      {/* Mobile overlay */}
      <div
        className={`admin-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <h2>⚙ Admin</h2>
          <span>Portfolio Manager</span>
        </div>

        <ul className="admin-sidebar-nav">
          {NAV_ITEMS.map(item => (
            <li key={item.key}>
              <button
                className={`admin-nav-link ${activeSection === item.key ? 'active' : ''}`}
                onClick={() => {
                  onSectionChange(item.key);
                  setSidebarOpen(false);
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="admin-sidebar-back">
          <Link to="/">← Back to Portfolio</Link>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-burger"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <span className="admin-topbar-title">
            {NAV_ITEMS.find(n => n.key === activeSection)?.label} Editor
          </span>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={onReset}>
            Reset to Default
          </button>
          <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={onExport}>
            Export All JSON
          </button>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
