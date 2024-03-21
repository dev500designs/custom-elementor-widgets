import * as React from "react";
const CopyIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    aria-hidden="true"
    className="w-6 h-6 text-gray-800 dark:text-white"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 4v3c0 .6-.4 1-1 1h-3m4 10v1c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V9c0-.6.4-1 1-1h2m11-3v10c0 .6-.4 1-1 1h-7a1 1 0 0 1-1-1V7.9c0-.3 0-.5.2-.7l2.5-2.9c.2-.2.5-.3.8-.3H18c.6 0 1 .4 1 1Z"
    />
  </svg>
);
export default CopyIcon;
