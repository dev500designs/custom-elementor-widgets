import React from "react";
import "./AlertDialog.css";
import Dialog from "../Dialog";

const AlertDialog = ({ isOpen, onClose, title = "Alert", okText }) => {
  return (
    <Dialog
      className="alert-dialog"
      footer={
        <>
          <button className="secondary" onClick={onClose}>
            {okText || "OK"}
          </button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      title="Alert"
    >
      {title}
    </Dialog>
  );
};

export default AlertDialog;
