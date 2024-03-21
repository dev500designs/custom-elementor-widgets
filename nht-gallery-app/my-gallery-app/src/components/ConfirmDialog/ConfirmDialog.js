import React from "react";
import "./ConfirmDialog.css";
import Dialog from "../Dialog";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  content = "Are you sure you want to proceed?",
}) => {
  return (
    <Dialog
      className="confirm-dialog"
      footer={
        <>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" onClick={onConfirm}>
            Confirm
          </button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      {content}
    </Dialog>
  );
};

export default ConfirmDialog;
