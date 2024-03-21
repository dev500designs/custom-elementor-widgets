import * as React from "react";
const CloseIcon = (props) => (
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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18 18 6m0 12L6 6"
    />
  </svg>
);
export default CloseIcon;
