import * as React from "react";
const CameraIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    aria-hidden="true"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 18V8c0-.6.4-1 1-1h1.5l1.7-1.7c.2-.2.4-.3.7-.3h6.2c.3 0 .5.1.7.3L17.5 7H19c.6 0 1 .4 1 1v10c0 .6-.4 1-1 1H5a1 1 0 0 1-1-1Z"
    />
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);
export default CameraIcon;
