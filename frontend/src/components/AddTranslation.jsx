import React, { useState } from 'react';
import { autogenTranslation, createTranslation } from '../api/translations';

export default function AddTranslation({ onAdded }) {
  const [key, setKey] = useState('');
  const [en, setEn] = useState('');
  const [langs, setLangs] = useState(['hi', 'bn']);
  const [loading, setLoading] = useState(false);

  const handleAuto = async () => {
    if (!key.trim() || !en.trim()) return alert('Key and English required');
    setLoading(true);
    try {
      await autogenTranslation({ key: key.trim(), en: en.trim(), langs });
      setKey(''); setEn('');
      onAdded && onAdded();
    } catch (err) {
      console.error('Auto-generate failed', err);
      alert(err?.response?.data?.msg || 'Auto-generate failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!key.trim() || !en.trim()) return alert('Key and English required');
    setLoading(true);
    try {
      await createTranslation({ key: key.trim(), values: { en: en.trim() } });
      setKey(''); setEn('');
      onAdded && onAdded();
    } catch (err) {
      console.error('Create failed', err);
      alert(err?.response?.data?.msg || 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card add-card">
      <h3>Add Translation</h3>
      <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="Key (e.g. welcome_text)" />
      <input value={en} onChange={(e) => setEn(e.target.value)} placeholder="English text" />
      <div className="langs">Generate for: {langs.join(', ')}</div>

      <div className="actions">
        <button onClick={handleAuto} disabled={loading}>Auto-generate</button>
        <button onClick={handleCreate} disabled={loading}>Create (English only)</button>
      </div>
    </div>
  );
}
