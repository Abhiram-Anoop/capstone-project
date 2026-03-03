import React from 'react';

export function Checkbox({ id, icon, label, badge, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-0 bg-white cursor-pointer rounded-lg"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="appearance-none h-5 w-5 border-2 border-sky-400 rounded-sm 
                   checked:bg-sky-500 checked:border-sky-500 
                   cursor-pointer 
                   checked:after:content-['✔'] 
                   checked:after:text-white 
                   checked:after:text-xs 
                   checked:after:block 
                   checked:after:text-center 
                   checked:after:leading-5"
      />
      <div className="flex items-center gap-0 text-sm font-medium text-gray-900">
        {icon}
        {label}
        {badge && <span className="ml-1">{badge}</span>}
      </div>
    </label>
  );
}
