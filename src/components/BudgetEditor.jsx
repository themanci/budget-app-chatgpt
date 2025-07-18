import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useBudget } from '../contexts/BudgetContext';
import { db } from '../firebase';

export default function BudgetEditor() {
  const { budget } = useBudget();
  const [data, setData] = useState({});
  const [path, setPath] = useState([]);
  const [newEntry, setNewEntry] = useState({ name: '', amount: '' });
  const [saving, setSaving] = useState(false);

  // Load initial budget data
  useEffect(() => {
    if (budget?.data) {
      setData(budget.data);
    }
  }, [budget]);

  const getNestedData = () => {
    return path.reduce((acc, key) => acc?.[key] || {}, data);
  };

  const handleDrillDown = (key) => {
    setPath([...path, key]);
  };

  const handleGoBack = () => {
    setPath(path.slice(0, -1));
  };

  const handleInputChange = (field, value) => {
    setNewEntry({ ...newEntry, [field]: value });
  };

  const handleAddEntry = () => {
    if (!newEntry.name || !newEntry.amount) return;

    const updatedData = { ...data };
    let target = updatedData;

    // Traverse into the data using path
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (!target[key]) target[key] = {};
      target = target[key];
    }

    if (!Array.isArray(target)) {
      // Convert map to array of entries if necessary
      const existingKeys = Object.keys(target);
      target = existingKeys.map((k) => target[k]);
    }

    const entry = {
      name: newEntry.name,
      amount: parseFloat(newEntry.amount),
    };

    if (Array.isArray(target)) {
      target.push(entry);
    }

    // Save back to data
    let temp = { ...data };
    let current = temp;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = target;

    setData(temp);
    setNewEntry({ name: '', amount: '' });
  };

  const handleSave = async () => {
    if (!budget?.id) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'budgets', budget.id);
      await updateDoc(docRef, { data });
      alert('Budget saved!');
    } catch (err) {
      console.error('Error saving budget:', err);
      alert('Failed to save budget.');
    } finally {
      setSaving(false);
    }
  };

  const displayData = getNestedData();

  return (
    <div>
      <h3>Budget Editor</h3>

      {path.length > 0 && (
        <button onClick={handleGoBack}>← Go Back</button>
      )}

      <ul style={{ marginTop: '1rem' }}>
        {typeof displayData === 'object' && !Array.isArray(displayData) &&
          Object.entries(displayData).map(([key, value]) => (
            <li key={key}>
              <button onClick={() => handleDrillDown(key)}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </button>
            </li>
          ))}

        {Array.isArray(displayData) &&
          displayData.map((item, index) => (
            <li key={index}>
              {item.name}: ${item.amount}
            </li>
          ))}
      </ul>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Name"
          value={newEntry.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newEntry.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
        />
        <button onClick={handleAddEntry}>Add Entry</button>
      </div>

      <button onClick={handleSave} disabled={saving} style={{ marginTop: '1rem' }}>
        {saving ? 'Saving...' : 'Save Budget'}
      </button>
    </div>
  );
}
