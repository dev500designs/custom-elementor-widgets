import React, { useEffect, useRef } from "react";
import "./PhotoTourDialog.css";
import Dialog from "../Dialog";
import Gallery from "react-image-gallery";
import useDataAttributes from "../../utils/useDataAttributes";
import Button from "../Button";
import PlusIcon from "../../icons/Plus";

const PhotoTourDialog = ({
  index = 0,
  onChangeIndex,
  isOpen,
  onClose,
  onSave,
  title,
  images = [],
}) => {
  const galleryRef = useRef(null);
  const { postTitle = "Post Title" } = useDataAttributes(
    "nht-project-gallery-app-root"
  );

  const handleChangeActiveImage = (index) => {
    onChangeIndex(index);
  };

  useEffect(() => {
    galleryRef.current?.slideToIndex(index);
  }, [index]);

  return (
    <Dialog
      className="photo-tour-dialog"
      footer={<></>}
      isOpen={isOpen}
      onClose={onClose}
      title={postTitle}
    >
      {images[index] && (
        <div className="photo-tour-dialog-notes">
          {images[index]?.description ? (
            <p className="description">{images[index]?.description}</p>
          ) : (
            <p className="description-tip">No description available</p>
          )}
          <Button icon={<PlusIcon />} onClick={onSave}>
            Add To My Images
          </Button>
        </div>
      )}
      <Gallery
        additionalClass="photo-tour-gallery"
        items={images}
        infinite={false}
        showIndex
        showFullscreenButton={false}
        showPlayButton={false}
        showThumbnails={false}
        disableThumbnailScroll={true}
        ref={galleryRef}
        onSlide={handleChangeActiveImage}
        renderLeftNav={(onClick, disabled) => (
          <button
            className="image-gallery-nav-btn prev"
            onClick={onClick}
            disabled={disabled}
          />
        )}
        renderRightNav={(onClick, disabled) => (
          <button
            className="image-gallery-nav-btn next"
            onClick={onClick}
            disabled={disabled}
          />
        )}
      />
    </Dialog>
  );
};

export default PhotoTourDialog;
