import React, { useEffect, useState } from 'react';
import { fetchTranslations } from './api/translations';
import AddTranslation from './components/AddTranslation';
import TranslationList from './components/TranslationList';

export default function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (q = '') => {
    setLoading(true);
    try {
      const res = await fetchTranslations(q);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load translations', err);
      alert('Failed to load translations. Check backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container">
      <h1>TMT — Translation Management Tool</h1>

      <section className="top-row">
        <AddTranslation onAdded={() => load(search)} />
        <div className="search-box">
          <input
            placeholder="Search key or any text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => load(search)}>Search</button>
          <button onClick={() => { setSearch(''); load(); }}>Clear</button>
        </div>
      </section>

      <section>
        {loading ? <p>Loading…</p> : <TranslationList items={items} onUpdated={() => load(search)} />}
      </section>
    </div>
  );
}
