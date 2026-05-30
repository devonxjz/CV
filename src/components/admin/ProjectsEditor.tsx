import { useState, useEffect } from 'react';
import type { ProjectData } from '../../hooks/usePortfolioData';

interface Props {
  data: ProjectData[];
  onSave: (data: ProjectData[]) => void;
}

const emptyProject: ProjectData = {
  title: '',
  description: '',
  image: '',
  dotColor: '#6da4ff',
  tags: [],
  role: '',
  github: '',
  liveUrl: '',
  period: '',
};

export default function ProjectsEditor({ data, onSave }: Props) {
  const [items, setItems] = useState<ProjectData[]>(data);
  const [saved, setSaved] = useState(false);

  useEffect(() => setItems(data), [data]);

  const update = (index: number, patch: Partial<ProjectData>) =>
    setItems(prev => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  const add = () => setItems(prev => [...prev, { ...emptyProject }]);

  const remove = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    onSave(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Projects ({items.length})</h3>
        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={add}>
          + Add Project
        </button>
      </div>

      {items.map((proj, i) => (
        <div className="admin-item" key={i}>
          <div className="admin-item-header">
            <h4>#{i + 1} — {proj.title || 'Untitled'}</h4>
            <div className="admin-item-actions">
              <button
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => remove(i)}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label>Title</label>
              <input
                className="admin-input"
                value={proj.title}
                onChange={e => update(i, { title: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Role</label>
              <input
                className="admin-input"
                value={proj.role}
                onChange={e => update(i, { role: e.target.value })}
                placeholder="e.g. FullStack Developer"
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Description</label>
            <textarea
              className="admin-textarea"
              value={proj.description}
              onChange={e => update(i, { description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label>Image URL</label>
              <input
                className="admin-input"
                value={proj.image}
                onChange={e => update(i, { image: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="admin-field">
              <label>Period</label>
              <input
                className="admin-input"
                value={proj.period}
                onChange={e => update(i, { period: e.target.value })}
                placeholder="e.g. 01/2026 - 03/2026"
              />
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label>Dot Color</label>
              <div className="admin-color-group">
                <input
                  className="admin-color-input"
                  type="color"
                  value={proj.dotColor}
                  onChange={e => update(i, { dotColor: e.target.value })}
                />
                <input
                  className="admin-input admin-color-hex"
                  value={proj.dotColor}
                  onChange={e => update(i, { dotColor: e.target.value })}
                  placeholder="#6da4ff"
                />
              </div>
            </div>
            <div className="admin-field">
              <label>Tags (comma-separated)</label>
              <input
                className="admin-input"
                value={proj.tags.join(', ')}
                onChange={e =>
                  update(i, {
                    tags: e.target.value
                      .split(',')
                      .map(t => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="React, Node.js, MongoDB"
              />
            </div>
          </div>

          <div className="admin-row">
            <div className="admin-field">
              <label>GitHub URL</label>
              <input
                className="admin-input"
                value={proj.github}
                onChange={e => update(i, { github: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="admin-field">
              <label>Live URL</label>
              <input
                className="admin-input"
                value={proj.liveUrl}
                onChange={e => update(i, { liveUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          Save Projects
        </button>
      </div>

      {saved && <div className="admin-toast">✓ Projects saved</div>}
    </div>
  );
}
