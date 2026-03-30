import React, { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button className="dark-toggle" onClick={() => setDark(d => !d)} title="Toggle dark mode">
      {dark ? '☀️' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;
