import React, { useRef, useState } from "react";
import "./AddImageDialog.css";
import Dialog from "../Dialog";
import useDataAttributes from "../../utils/useDataAttributes";
import useFetch from "../../utils/useFetch";
import { wpUrl } from "../../utils/helpers";
import Loader from "../Loader";

const AddImageDialog = ({ isOpen, onClose, onSave, title, loading }) => {
  const newGalleryNameInputRef = useRef(null);
  const { userId } = useDataAttributes("nht-project-gallery-app-root");

  const { data: galleriesData = [] } = useFetch(
    `${wpUrl}/wp-json/nht/v1/galleries/${userId}`,
    { enabled: !!userId && isOpen }
  );

  const [selectedGallery, setSelectedGallery] = useState(null);
  const handleChangeGallery = (evt) => {
    setSelectedGallery(evt.target.value === "0" ? null : evt.target.value);
  };

  const handleSaveImage = () => {
    const newGalleryValue = newGalleryNameInputRef?.current?.value;
    if (selectedGallery === null && !newGalleryValue) {
      return;
    }
    onSave(selectedGallery, newGalleryValue);
  };

  return (
    <Dialog
      className="add-image-dialog"
      footer={
        <>
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary"
            onClick={handleSaveImage}
            icon={loading ? <Loader /> : null}
          >
            Save Image
          </button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <select onChange={handleChangeGallery}>
        <option value="0">Add New</option>
        {galleriesData?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title}
          </option>
        ))}
      </select>
      {selectedGallery === null && (
        <>
          <input ref={newGalleryNameInputRef} placeholder="Gallery Title" />
          <span className="tip">Enter the new name of your collection.</span>
        </>
      )}
    </Dialog>
  );
};

export default AddImageDialog;
