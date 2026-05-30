import { useState, useEffect } from 'react';
import type { ContactData } from '../../hooks/usePortfolioData';

interface Props {
  data: ContactData;
  onSave: (data: ContactData) => void;
}

export default function ContactEditor({ data, onSave }: Props) {
  const [form, setForm] = useState<ContactData>(data);
  const [saved, setSaved] = useState(false);

  useEffect(() => setForm(data), [data]);

  const set = <K extends keyof ContactData>(key: K, value: string) =>
    setForm((prev: ContactData) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Contact Links</h3>
      </div>

      <div className="admin-field">
        <label>GitHub URL</label>
        <input
          className="admin-input"
          value={form.github}
          onChange={e => set('github', e.target.value)}
          placeholder="https://github.com/username"
        />
      </div>

      <div className="admin-field">
        <label>LinkedIn URL</label>
        <input
          className="admin-input"
          value={form.linkedin}
          onChange={e => set('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <div className="admin-field">
        <label>Email</label>
        <input
          className="admin-input"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <div className="admin-field">
        <label>Facebook URL</label>
        <input
          className="admin-input"
          value={form.facebook}
          onChange={e => set('facebook', e.target.value)}
          placeholder="https://facebook.com/username"
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          Save Contact
        </button>
      </div>

      {saved && <div className="admin-toast">✓ Contact saved</div>}
    </div>
  );
}
