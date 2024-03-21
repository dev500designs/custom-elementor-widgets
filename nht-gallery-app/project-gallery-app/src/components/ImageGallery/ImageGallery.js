import React, { forwardRef } from "react";
import Gallery from "react-image-gallery";
import "./ImageGallery.css";
import Button from "../Button";
import PlusIcon from "../../icons/Plus";
import CameraIcon from "../../icons/Camera";

const ImageGallery = forwardRef(({ items, onAddToImage, handleOpenTour, handleOpenAddImageToGallery }, ref) => {

  const renderCustomControls = () => (
    <div className="bottom-actions">
      <Button
          className="secondary"
          icon={<CameraIcon />}
          onClick={handleOpenTour(false)}
        >
          Enlarge / More Info
        </Button>
      <Button
        className="add-to-images-button"
        onClick={handleOpenAddImageToGallery}
        icon={<PlusIcon />}
      >
        Add To My Images
      </Button>
    </div>
  )

  return (
    <Gallery
      additionalClass="project-image-gallery"
      ref={ref}
      items={items}
      infinite={false}
      thumbnailPosition="right"
      showIndex
      showFullscreenButton={false}
      showPlayButton={false}
      disableThumbnailScroll={true}
      renderCustomControls={renderCustomControls}
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
  );
});

export default ImageGallery;
