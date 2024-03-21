import React, { useEffect, useMemo, useRef } from "react";
import "./AddGalleryDialog.css";
import Dialog from "../Dialog";
import { wpUrl } from "../../utils/helpers";
import useMutation from "../../utils/useMutation";
import Loader from "../Loader";

const AddGalleryDialog = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  // If rename mode
  galleryId,
  previousValue,
  duplicateMode = false,
}) => {
  const mode = duplicateMode
    ? "duplicate"
    : !!previousValue && galleryId
    ? "rename"
    : "add";

  const newGalleryNameInputRef = useRef(null);

  const actionName = useMemo(() => {
    if (mode === "duplicate") return "Duplicate";
    if (mode === "rename") return "Rename";
    return "Add";
  }, [mode]);

  const url = useMemo(() => {
    if (mode === "duplicate")
      return `${wpUrl}/wp-json/nht/v1/gallery/clone/${galleryId}`;
    if (mode === "rename")
      return `${wpUrl}/wp-json/nht/v1/gallery/rename/${galleryId}`;
    return `${wpUrl}/wp-json/nht/v1/gallery/create`;
  }, [galleryId, mode]);

  const { mutate: mutatePost, loading: postLoading } = useMutation(url, {
    method: "POST",
  });
  const { mutate, loading: patchLoading } = useMutation(url, {
    method: "PATCH",
  });

  const handleSaveImage = async () => {
    const newGalleryValue = newGalleryNameInputRef?.current?.value;
    if (!newGalleryValue) {
      return;
    }
    let data;
    if (mode === "duplicate") {
      data = await mutatePost({ name_for_clone: newGalleryValue });
    } else if (mode === "rename") {
      data = await mutate({ name: newGalleryValue });
    } else {
      data = await mutatePost({ new_gallery_name: newGalleryValue });
    }
    onSuccess(mode, data);
  };

  useEffect(() => {
    newGalleryNameInputRef.current?.focus();
    if (
      !isOpen ||
      !newGalleryNameInputRef.current ||
      !previousValue?.trim() ||
      duplicateMode
    ) {
      newGalleryNameInputRef.current.value = "";
      return;
    }
    newGalleryNameInputRef.current.value = previousValue;
  }, [isOpen, previousValue, duplicateMode]);

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
            disabled={postLoading || patchLoading}
            icon={postLoading || patchLoading ? <Loader /> : null}
          >
            {actionName}
          </button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      title={`${actionName} Gallery`}
    >
      <input
        autoFocus
        ref={newGalleryNameInputRef}
        placeholder="Gallery Title"
      />
      {mode === "add" && (
        <span className="tip">Enter the new name of your collection.</span>
      )}
      {mode === "duplicate" && (
        <span className="tip">
          Enter the name of the duplicated collection.
        </span>
      )}
    </Dialog>
  );
};

export default AddGalleryDialog;
