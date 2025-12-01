import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { updateTranslation } from '../api/translations';

Modal.setAppElement('#root');

export default function EditModal({ item, onClose, onSaved }) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const v = item.values && typeof item.values === 'object' ? Object.fromEntries(Object.entries(item.values)) : {};
    setValues(v);
  }, [item]);

  const handleChange = (lang, val) => {
    setValues((prev) => ({ ...prev, [lang]: val }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateTranslation(item._id, { values });
      onSaved && onSaved();
    } catch (err) {
      console.error('Save failed', err);
      alert(err?.response?.data?.msg || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLang = () => {
    const newLang = prompt('New language code (e.g. ta, fr, es):');
    if (!newLang) return;
    if (values[newLang]) return alert('Language already present');
    setValues((prev) => ({ ...prev, [newLang]: '' }));
  };

  return (
    <Modal isOpen={true} onRequestClose={onClose} contentLabel="Edit Translation" className="modal" overlayClassName="overlay">
      <h3>Edit: {item.key}</h3>

      <div className="modal-body">
        {Object.entries(values).map(([lang, text]) => (
          <div className="modal-row" key={lang}>
            <div className="modal-lang">{lang}</div>
            <input value={text || ''} onChange={(e) => handleChange(lang, e.target.value)} />
          </div>
        ))}

        <div className="modal-actions">
          <button onClick={handleAddLang}>Add language</button>
          <div className="spacer" />
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </Modal>
  );
}
