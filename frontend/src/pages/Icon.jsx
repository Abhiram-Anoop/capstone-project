import React from 'react';

// This is a placeholder component.
// Replace with your preferred icon library (e.g., Font Awesome, React Icons)
export const Icon = ({ name }) => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ccc', borderRadius: '4px' }}>
      {/* For demo, we'll just show the first letter */}
      <span style={{ color: 'skyblue' }}>{name.charAt(0).toUpperCase()}</span> 
    </div>
  );
};