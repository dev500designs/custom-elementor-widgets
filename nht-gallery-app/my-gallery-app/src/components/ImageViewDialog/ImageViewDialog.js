import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ImageViewDialog.css";
import Dialog from "../Dialog";
import Gallery from "react-image-gallery";
import Button from "../Button";
import useMutation from "../../utils/useMutation";
import {
  decodeHtmlEntities,
  mapImagesToGallery,
  wpUrl,
} from "../../utils/helpers";
import Loader from "../Loader";
import "react-image-gallery/styles/css/image-gallery.css";
import EditIcon from "../../icons/Edit";
import CloseIcon from "../../icons/Close";

const ImageViewDialog = ({
  index = 0,
  onChangeIndex,
  isOpen,
  onClose,
  onSaveNote,
  title,
  images = [],
}) => {
  const galleryRef = useRef(null);
  const notesTextRef = useRef(null);
  const [editNotesEnabled, setEditNotesEnabled] = useState(false);
  const { mutate, loading } = useMutation(
    `${wpUrl}/wp-json/nht/v1/media/update-notes/${images[index]?.id}`
  );

  const handleChangeActiveImage = (index) => {
    onChangeIndex(index);
  };

  useEffect(() => {
    galleryRef.current?.slideToIndex(index);
  }, [index]);

  const handleEditNotes = () => {
    setEditNotesEnabled(!editNotesEnabled);
  };

  const handleSaveNote = async () => {
    const value = notesTextRef.current?.value;
    const url = new URL(
      `${wpUrl}/wp-json/nht/v1/media/update-notes/${images[index]?.id}`
    );
    url.searchParams.append("image_notes", value);
    await mutate(null, url.href);
    setEditNotesEnabled(false);
    onSaveNote(index, value);
  };

  const galleryImages = useMemo(() => {
    return mapImagesToGallery(images);
  }, [images]);

  const handleClose = () => {
    setEditNotesEnabled(false);
    onClose();
  };

  const location = useMemo(() => {
    const { address_locality, address_regions } = images[index] || {};
    if (!address_locality || !address_regions?.[0]?.name) return "";
    return `${decodeHtmlEntities(address_locality || "")}, ${decodeHtmlEntities(address_regions?.[0]?.name) || ""
      }`;
  }, [images, index]);

  return (
    <Dialog
      className="image-view-dialog"
      footer={<></>}
      isOpen={isOpen}
      onClose={handleClose}
      title={images[index]?.project_title}
    >
      {images[index] && (
        <div className="image-view-notes">
          <div className="image-details">
            <div className="image-detail">
              <span className="detail-label">Location</span>
              <span className="detail-value">{location || "-"}</span>
            </div>
            <div className="image-detail">
              <span className="detail-label">Architect</span>
              <span className="detail-value">
                {decodeHtmlEntities(images[index].architects?.[0]?.name || "-")}
              </span>
            </div>
            <div className="image-detail">
              <span className="detail-label">Builder</span>
              <span className="detail-value">
                {decodeHtmlEntities(images[index].builders?.[0]?.name || "-")}
              </span>
            </div>
          </div>

          <div className="image-notes">
            <div className="image-notes-header">
              <span className="detail-label">Notes:</span>
              <div className="image-notes-buttons">
                {editNotesEnabled && (
                  <Button
                    className="cancel-notes-btn"
                    icon={<CloseIcon />}
                    onClick={handleEditNotes}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  className="edit-notes-btn"
                  icon={loading ? <Loader /> : <EditIcon />}
                  onClick={editNotesEnabled ? handleSaveNote : handleEditNotes}
                  disabled={loading}
                >
                  {editNotesEnabled ? "Save" : "Edit"}
                </Button>
              </div>
            </div>
            {editNotesEnabled ? (
              <textarea
                ref={notesTextRef}
                defaultValue={images[index].image_notes}
                autoFocus
              />
            ) : (
              <p className="notes-value">
                {decodeHtmlEntities(images[index].image_notes || "-")}
              </p>
            )}
          </div>
        </div>
      )}
      <Gallery
        additionalClass="image-view-gallery"
        items={galleryImages}
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

export default ImageViewDialog;
