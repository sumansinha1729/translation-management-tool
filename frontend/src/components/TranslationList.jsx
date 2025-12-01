import React, { useState } from 'react';
import EditModal from './EditModal';
import { deleteTranslation } from '../api/translations';

export default function TranslationList({ items = [], onUpdated }) {
  const [editing, setEditing] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Delete this translation?')) return;
    try {
      await deleteTranslation(id);
      onUpdated && onUpdated();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  if (!items.length) {
    return <p>No translations yet. Add one above.</p>;
  }

  return (
    <div className="list">
      {items.map((it) => {
        const vals = it.values && typeof it.values === 'object' && !Array.isArray(it.values)
          ? (
            Object.entries(it.values).length ? Object.fromEntries(Object.entries(it.values)) : {}
          )
          : it.values;

        return (
          <div className="item" key={it._id}>
            <div className="item-header">
              <strong>{it.key}</strong>
              <div className="meta">
                <small>Updated: {new Date(it.updatedAt).toLocaleString()}</small>
                <button onClick={() => setEditing(it)}>Edit</button>
                <button onClick={() => handleDelete(it._id)}>Delete</button>
              </div>
            </div>

            <div className="value-grid">
              {Object.entries(vals || {}).map(([lang, text]) => (
                <div className="value" key={lang}>
                  <div className="lang">{lang}</div>
                  <div className="text">{text}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {editing && (
        <EditModal
          item={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onUpdated && onUpdated(); }}
        />
      )}
    </div>
  );
}
