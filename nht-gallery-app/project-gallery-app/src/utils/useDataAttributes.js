import { useState, useEffect } from "react";

const useDataAttributes = (parentId) => {
  const [dataAttributes, setDataAttributes] = useState({});

  useEffect(() => {
    const parentElement = document.getElementById(parentId);
    if (!parentElement) {
      console.error(`Element with ID '${parentId}' not found`);
      return;
    }

    const attributes = parentElement.dataset;
    setDataAttributes(attributes);
  }, [parentId]);

  return dataAttributes;
};

export default useDataAttributes;
