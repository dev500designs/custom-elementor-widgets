import React, { forwardRef, useState } from "react";
import "./Dialog.css";

const Dialog = forwardRef(
  ({ className, footer, isOpen, onClose, title, children }, ref) => {
    const [isAnimating, setIsAnimating] = useState(false);

    // Adjust timing to match CSS transition duration
    const handleClose = () => {
      setIsAnimating(true);
      setTimeout(() => {
        onClose();
        setIsAnimating(false);
      }, 300);
    };

    return (
      <div
        className={`${className} dialog ${isOpen ? "open" : ""} ${
          isAnimating ? "animating" : ""
        }`}
        ref={ref}
      >
        <div className="dialog-overlay" onClick={handleClose}></div>
        <div className="dialog-content">
          <div className="dialog-header">
            <h3 className="dialog-header-title">{title}</h3>
            <button className="dialog-close" onClick={handleClose}></button>
          </div>
          <div className="dialog-body">{children}</div>
          <div className="dialog-footer">{footer}</div>
        </div>
      </div>
    );
  }
);

export default Dialog;
