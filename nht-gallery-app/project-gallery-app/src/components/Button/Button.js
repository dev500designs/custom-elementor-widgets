import React from "react";
import "./Button.css";

const Button = ({ className, icon, onClick, children, ...props }) => {
  return (
    <button className={`${className} nht-button`} onClick={onClick} {...props}>
      <p className="icon">{icon}</p>
      <div>{children}</div>
    </button>
  );
};

export default Button;
