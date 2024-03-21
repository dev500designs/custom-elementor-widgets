import React from "react";
import "./Loader.css";

const Loader = ({ className, icon, onClick, children, ...props }) => {
  return (
    <div className={`${className} nht-loading`} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16px"
        height="16px"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke="#006a71"
          strokeWidth="3"
          r="35"
          strokeDasharray="164.93361431346415 56.97787143782138"
          transform="matrix(1,0,0,1,0,0)"
        ></circle>
      </svg>
    </div>
  );
};

export default Loader;
