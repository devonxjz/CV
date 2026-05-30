import { useState, useEffect } from 'react';
import type { ProfileData } from '../../hooks/usePortfolioData';

interface Props {
  data: ProfileData;
  onSave: (data: ProfileData) => void;
}

export default function ProfileEditor({ data, onSave }: Props) {
  const [form, setForm] = useState<ProfileData>(data);
  const [saved, setSaved] = useState(false);

  useEffect(() => setForm(data), [data]);

  const set = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setForm((prev: ProfileData) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Build preview headline with highlight
  const renderPreview = () => {
    const { headline, highlightText } = form;
    if (!highlightText || !headline.includes(highlightText)) {
      return <h1>{headline}</h1>;
    }
    const parts = headline.split(highlightText);
    return (
      <h1>
        {parts[0]}
        <span className="highlight">{highlightText}</span>
        {parts.slice(1).join(highlightText)}
      </h1>
    );
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Profile / Hero Section</h3>
      </div>

      <div className="admin-field">
        <label>Tag Line</label>
        <input
          className="admin-input"
          value={form.tag}
          onChange={e => set('tag', e.target.value)}
          placeholder="e.g. BACKEND DEVELOPER · SECURITY ENTHUSIAST"
        />
      </div>

      <div className="admin-field">
        <label>Headline</label>
        <textarea
          className="admin-textarea"
          value={form.headline}
          onChange={e => set('headline', e.target.value)}
          placeholder="Main headline text (use \n for line breaks)"
          rows={3}
        />
      </div>

      <div className="admin-field">
        <label>Highlight Text</label>
        <input
          className="admin-input"
          value={form.highlightText}
          onChange={e => set('highlightText', e.target.value)}
          placeholder="Part of headline to highlight in accent color"
        />
      </div>

      <div className="admin-field">
        <label>Subtext</label>
        <textarea
          className="admin-textarea"
          value={form.subtext}
          onChange={e => set('subtext', e.target.value)}
          rows={2}
        />
      </div>

      <div className="admin-row">
        <div className="admin-field">
          <label>CTA Button Text</label>
          <input
            className="admin-input"
            value={form.ctaText}
            onChange={e => set('ctaText', e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label>CTA Target Section (0-4)</label>
          <input
            className="admin-input"
            type="number"
            min={0}
            max={4}
            value={form.ctaTarget}
            onChange={e => set('ctaTarget', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="admin-field">
        <label>Avatar URL</label>
        <input
          className="admin-input"
          value={form.avatarUrl}
          onChange={e => set('avatarUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* Live Preview */}
      <div className="admin-preview">
        <div className="admin-preview-label">Live Preview</div>
        {renderPreview()}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          Save Profile
        </button>
      </div>

      {saved && <div className="admin-toast">✓ Profile saved</div>}
    </div>
  );
}
