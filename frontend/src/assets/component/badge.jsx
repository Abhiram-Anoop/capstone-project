// component/badge.jsx
import React from 'react';

export function Badge({ className = "", variant = "default", ...props }) {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variantClasses = {
    default:
      "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline:
      "border border-gray-300 text-gray-800 hover:bg-gray-50",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return <div className={classes} {...props} />;
}
