import { useState } from "react";
import Alert from "./AlertDialog";

const useAlert = (options = {}) => {
  const { title: previousTitle } = options;
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(previousTitle || "");

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const alert = (newTitle) => {
    if (newTitle?.trim()) setTitle(newTitle);
    handleOpen();
  };

  const AlertDialog = (
    <Alert isOpen={isOpen} onClose={handleClose} title={title} />
  );

  return { isOpen, handleOpen, handleClose, alert, AlertDialog };
};

export default useAlert;
