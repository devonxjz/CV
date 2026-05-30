import { useState, useEffect } from 'react';
import type { SkillData } from '../../hooks/usePortfolioData';

interface Props {
  data: SkillData[];
  onSave: (data: SkillData[]) => void;
}

const emptySkill: SkillData = { name: '', percent: 50, logo: '' };

export default function SkillsEditor({ data, onSave }: Props) {
  const [items, setItems] = useState<SkillData[]>(data);
  const [saved, setSaved] = useState(false);

  useEffect(() => setItems(data), [data]);

  const update = (index: number, patch: Partial<SkillData>) =>
    setItems(prev => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  const add = () => setItems(prev => [...prev, { ...emptySkill }]);

  const remove = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    setItems(prev => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = () => {
    onSave(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Skills ({items.length})</h3>
        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={add}>
          + Add Skill
        </button>
      </div>

      {items.map((skill, i) => (
        <div className="admin-item" key={i}>
          <div className="admin-item-header">
            <h4>#{i + 1} — {skill.name || 'Untitled'}</h4>
            <div className="admin-item-actions">
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                title="Move up"
              >
                ↑
              </button>
              <button
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                title="Move down"
              >
                ↓
              </button>
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
              <label>Name</label>
              <input
                className="admin-input"
                value={skill.name}
                onChange={e => update(i, { name: e.target.value })}
                placeholder="e.g. TypeScript"
              />
            </div>
            <div className="admin-field">
              <label>Logo URL</label>
              <input
                className="admin-input"
                value={skill.logo}
                onChange={e => update(i, { logo: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="admin-field">
            <label>Proficiency</label>
            <div className="admin-range-group">
              <input
                className="admin-range"
                type="range"
                min={0}
                max={100}
                value={skill.percent}
                onChange={e => update(i, { percent: Number(e.target.value) })}
              />
              <span className="admin-range-value">{skill.percent}%</span>
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          Save Skills
        </button>
      </div>

      {saved && <div className="admin-toast">✓ Skills saved</div>}
    </div>
  );
}
