import { useState, useEffect } from 'react';
import type { MilestoneData } from '../../hooks/usePortfolioData';

interface Props {
  data: MilestoneData[];
  onSave: (data: MilestoneData[]) => void;
}

const emptyMilestone: MilestoneData = { date: '', title: '', detail: '', side: 'left' };

export default function MilestonesEditor({ data, onSave }: Props) {
  const [items, setItems] = useState<MilestoneData[]>(data);
  const [saved, setSaved] = useState(false);

  useEffect(() => setItems(data), [data]);

  const update = (index: number, patch: Partial<MilestoneData>) =>
    setItems(prev => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));

  const add = () => setItems(prev => [...prev, { ...emptyMilestone }]);

  const remove = (index: number) => setItems(prev => prev.filter((_, i) => i !== index));

  const handleSave = () => {
    onSave(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Milestones ({items.length})</h3>
        <button className="admin-btn admin-btn-primary admin-btn-sm" onClick={add}>
          + Add Milestone
        </button>
      </div>

      {items.map((ms, i) => (
        <div className="admin-item" key={i}>
          <div className="admin-item-header">
            <h4>#{i + 1} — {ms.title || 'Untitled'}</h4>
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
              <label>Date</label>
              <input
                className="admin-input"
                value={ms.date}
                onChange={e => update(i, { date: e.target.value })}
                placeholder="e.g. 2024"
              />
            </div>
            <div className="admin-field">
              <label>Side</label>
              <select
                className="admin-select"
                value={ms.side}
                onChange={e => update(i, { side: e.target.value as 'left' | 'right' })}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div className="admin-field">
            <label>Title</label>
            <input
              className="admin-input"
              value={ms.title}
              onChange={e => update(i, { title: e.target.value })}
            />
          </div>

          <div className="admin-field">
            <label>Detail</label>
            <textarea
              className="admin-textarea"
              value={ms.detail}
              onChange={e => update(i, { detail: e.target.value })}
              rows={2}
            />
          </div>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          Save Milestones
        </button>
      </div>

      {saved && <div className="admin-toast">✓ Milestones saved</div>}
    </div>
  );
}
