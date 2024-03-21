import React, { useEffect, useMemo, useRef, useState } from "react";
import Dropdown from "react-dropdown";
import "./GalleryDetail.css";
import useFetch from "../../utils/useFetch";
import { isDev, wpUrl, decodeHtmlEntities } from "../../utils/helpers";
import { useDialog } from "../Dialog";
import ImageViewDialog from "../ImageViewDialog";
import Button from "../Button";
import useMutation from "../../utils/useMutation";
import EditIcon from "../../icons/Edit";
import CopyIcon from "../../icons/Copy";
import ReorderIcon from "../../icons/Reorder";
import TrashIcon from "../../icons/Trash";
import AddGalleryDialog from "../AddGalleryDialog";
import PlayIcon from "../../icons/Play";
import ConfirmDialog from "../ConfirmDialog";
import useAlert from "../AlertDialog/useAlert";
import SortableList, { SortableItem } from "react-easy-sort";
import CloseIcon from "../../icons/Close";
import PrintIcon from "../../icons/Print";
import Loader from "../Loader";
import ImagesPrint from "../ImagesPrint/ImagesPrint.js";
import usePagination from "../../utils/usePagination.js";
import { useReactToPrint } from "react-to-print";
import PlusIcon from "../../icons/Plus.js";
import "react-dropdown/style.css";

const GalleryDetail = ({ className, id, ...props }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mode, setMode] = useState("none"); // reorder || remove-images
  const [duplicateMode, setDuplicateMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState("gallery");
  const [filterSort, setFilterSort] = useState({
    filter: "all",
    sort: "default",
  });

  const { isOpen, handleOpen, handleClose } = useDialog();
  const {
    isOpen: nameDialogOpen,
    handleOpen: openNameDialog,
    handleClose: closeNameDialog,
  } = useDialog();

  const { alert, AlertDialog } = useAlert();

  const {
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    currentPage,
    totalPages,
    setTotalPages,
    handlePageChange,
  } = usePagination();

  const galleryFetchUrl = useMemo(() => {
    const url = new URL(`${wpUrl}/wp-json/nht/v1/gallery/${id}`);
    url.searchParams.append("page", currentPage);
    if (filterSort.filter !== "all") {
      url.searchParams.append("filter_by_category", filterSort.filter);
    }
    if (filterSort.sort !== "default") {
      url.searchParams.append("sort_by_date", filterSort.sort);
    }

    return url.href;
  }, [id, currentPage, filterSort]);

  const { data, refetch, loading } = useFetch(galleryFetchUrl, {
    enabled: !!id,
  });

  const { data: allGalleryData, loading: allGalleryLoading } = useFetch(
    `${wpUrl}/wp-json/nht/v1/all-gallery-images/${id}`,
    {
      enabled: mode === "reorder",
    }
  );

  useEffect(() => {
    setTotalPages(data?.total_pages || 1);
  }, [data, setTotalPages]);

  const {
    isOpen: confirmDialogOpen,
    handleOpen: openConfirmDialog,
    handleClose: closeConfirmDialog,
  } = useDialog();

  const [checkedItems, setCheckedItems] = useState({});
  const [galleryData, setGalleryData] = useState(null);
  const prevOrderItemsRef = useRef([]);
  const [orderItems, setOrderItems] = useState(null);
  const printRef = useRef(null);

  useEffect(() => {
    if (isDev) {
      import("../../mocks/gallery.js").then(({ gallery }) => {
        setGalleryData(gallery);
      });
      return;
    }
    setGalleryData(data);
  }, [data]);

  useEffect(() => {
    if (!allGalleryData?.length) return;
    prevOrderItemsRef.current = [...allGalleryData];
    setOrderItems(allGalleryData);
  }, [allGalleryData]);

  const { mutate: mutateDeleteGallery } = useMutation(
    `${wpUrl}/wp-json/nht/v1/gallery/delete/${id}`,
    { method: "DELETE" }
  );

  const { mutate: mutateRemoveImages, loading: removeImagesLoading } =
    useMutation(`${wpUrl}/wp-json/nht/v1/gallery/items/remove/${id}`, {
      method: "PATCH",
    });

  const { mutate: mutateReorderItems, loading: reorderLoading } = useMutation(
    `${wpUrl}/wp-json/nht/v1/gallery/items/replace/${id}`,
    { method: "PUT" }
  );

  const handleCheck = (e, id) => {
    e.stopPropagation();
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedItemsLength = useMemo(() => {
    return Object.keys(checkedItems).filter((key) => checkedItems[key]).length;
  }, [checkedItems]);

  useEffect(() => {
    if (checkedItemsLength === 0) {
      setMode("none");
      return;
    }
    setMode("remove-images");
  }, [checkedItemsLength]);

  const handleOpenImage = (index) => {
    setActiveImageIndex(index);
    handleOpen();
  };

  const handleRenameGallery = () => {
    setDuplicateMode(false);
    openNameDialog();
  };

  const handleClickDeleteGallery = () => {
    setDeleteMode("gallery");
    openConfirmDialog();
  };

  const handleClickRemoveImages = () => {
    setDeleteMode("remove-images");
    if (!Object.keys(checkedItems).some((key) => checkedItems[key])) {
      alert("No items selected to delete.");
      return;
    }
    openConfirmDialog();
  };

  const handleRemoveImages = async () => {
    const toDelete = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );
    await mutateRemoveImages(toDelete);
    setCheckedItems({});
    closeConfirmDialog();
    refetch();
  };

  const handleDeleteGallery = async () => {
    await mutateDeleteGallery(galleryData.id);
    closeConfirmDialog();
    window.location.href = "/my-images";
  };

  const handleDuplicate = () => {
    setDuplicateMode(true);
    openNameDialog();
  };

  const handleSuccessAddGallery = (mode, data) => {
    refetch();
    closeNameDialog();

    if (mode === "duplicate") {
      // Redirect to the new gallery
      window.location.href = data.clone_url;
    }
  };

  const handleSortEnd = (oldIndex, newIndex) => {
    setOrderItems((array) => {
      const newArray = array.slice();
      newArray.splice(newIndex, 0, newArray.splice(oldIndex, 1)[0]);
      return newArray;
    });
  };

  const handleStartReorder = () => {
    setMode("reorder");
  };

  const handleCancelReorder = () => {
    setOrderItems(prevOrderItemsRef.current);
    setMode("none");
  };

  const handleCancelRemoveImages = () => {
    setCheckedItems({});
    setMode("none");
  };

  const handleSaveOrder = async () => {
    await mutateReorderItems(orderItems.map((item) => item.id));
    await refetch();
    setMode("none");
  };

  const handleApplyNote = (index, value) => {
    setGalleryData((prev) => {
      const newGalleryData = { ...prev };
      newGalleryData.gallery_images[index].image_notes = value;
      return newGalleryData;
    });
  };

  const handlePrint = useReactToPrint({
    documentTitle: "document",
    removeAfterPrint: true,
  });

  const handlePerformPrint = async () => {
    const el = printRef.current;

    const images = el.querySelectorAll("img");
    const promises = Array.from(images).map((image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.onload = resolve;
      });
    });

    await Promise.all(promises);
    handlePrint(null, () => printRef.current);
  };

  const filterOptions = useMemo(() => {
    const categories = galleryData?.all_images_categories || [];

    return [
      { value: "all", label: "All" },
      ...categories.map((category) => ({
        value: category,
        label: category,
      })),
    ];
  }, [galleryData]);

  const handleChangeFilter = (option) => {
    setFilterSort((prev) => ({ ...prev, filter: option.value }));
  };

  const handleChangeSort = (option) => {
    setFilterSort((prev) => ({ ...prev, sort: option.value }));
  };

  const Element = mode === "reorder" ? "div" : "button";

  useEffect(() => {
    document.getElementById("");
  }, [orderItems]);

  const renderItems = useMemo(() => {
    if (mode === "reorder") {
      return orderItems;
    }
    return galleryData?.gallery_images;
  }, [mode, galleryData, orderItems]);

  const isLoading = loading || allGalleryLoading;

  return (
    <div className="gallery-detail-container">
      <div className="gallery-top-tooolbar">
        <div>
          <h2 className="gallery-header">
            {decodeHtmlEntities(galleryData?.title)}
          </h2>
        </div>
        <div className="gallery-tools">
          <div className="gallery-tool-option">
            <label>Filter</label>
            <Dropdown
              className="filter-dropdown dropdown"
              options={filterOptions}
              value={filterSort.filter}
              onChange={handleChangeFilter}
            />
          </div>
          <div className="gallery-tool-option">
            <label>Sort by</label>
            <Dropdown
              className="dropdown"
              value={filterSort.sort}
              options={[
                { value: "default", label: "Default" },
                { value: "desc", label: "Newest" },
                { value: "asc", label: "Oldest" },
              ]}
              onChange={handleChangeSort}
            />
          </div>
        </div>
      </div>

      <div className={`gallery-toolbar ${mode}-mode`}>
        <div className="gallery-toolbar-left">
          {mode === "none" ? (
            <>
              <h4>Gallery</h4>
              <div className="actions">
                <Button icon={<ReorderIcon />} onClick={handleStartReorder}>
                  Reorder
                </Button>
                <Button icon={<EditIcon />} onClick={handleRenameGallery}>
                  Rename
                </Button>
                <Button icon={<CopyIcon />} onClick={handleDuplicate}>
                  Duplicate
                </Button>
                <Button icon={<TrashIcon />} onClick={handleClickDeleteGallery}>
                  Delete
                </Button>
              </div>
            </>
          ) : mode === "reorder" ? (
            <h4>Drag items to reorder</h4>
          ) : mode === "remove-images" ? (
            <h4>{checkedItemsLength} selected image(s)</h4>
          ) : null}
        </div>
        {mode === "remove-images" ? (
          <div className="actions">
            <Button
              icon={<CloseIcon />}
              className="secondary"
              onClick={handleCancelRemoveImages}
            >
              Cancel
            </Button>
            <Button
              className="primary"
              icon={removeImagesLoading ? <Loader /> : <ReorderIcon />}
              onClick={handleClickRemoveImages}
            >
              Remove Images from Gallery
            </Button>
          </div>
        ) : mode === "reorder" ? (
          <div className="actions">
            <Button
              icon={<CloseIcon />}
              className="secondary"
              onClick={handleCancelReorder}
            >
              Cancel
            </Button>
            <Button
              className="primary"
              icon={reorderLoading ? <Loader /> : <ReorderIcon />}
              onClick={handleSaveOrder}
            >
              Save New Order
            </Button>
          </div>
        ) : (
          <div className="print-slideshow-actions">
            <Button onClick={handlePerformPrint} icon={<PrintIcon />}>
              Print
            </Button>
            <Button icon={<PlayIcon />} className="primary" onClick={() => handleOpenImage(0)}>
              Slideshow
            </Button>

          </div>
        )}
      </div>
      {isLoading && (
        <div className="gallery-loading">
          <Loader />
        </div>
      )}
      {Array.isArray(renderItems) && renderItems.length === 0 && !isLoading && (
        <div className="gallery-no-images">
          <h3>Your gallery is empty.</h3>
          <a href="/search">
            <Button className="primary" icon={<PlusIcon />}>
              Add Images
            </Button>
          </a>
        </div>
      )}
      {renderItems?.length > 0 && !isLoading && (
        <SortableList
          className="gallery-images"
          allowDrag={mode === "reorder"}
          onSortEnd={handleSortEnd}
          draggedItemClassName="dragged-image-item"
        >
          {renderItems.map((image, index) => (
            <SortableItem key={image.id}>
              <Element
                key={id}
                className={`gallery-images-item${mode === "reorder" ? " reorder" : ""
                  }`}
                onClick={() => handleOpenImage(index)}
              >
                <input
                  className="gallery-images-checkbox"
                  type="checkbox"
                  onClick={(e) => handleCheck(e, image.id)}
                  checked={checkedItems[image.id]}
                />
                <div className="gallery-images-container">
                  <img
                    src={image.thumbnail}
                    className="gallery-images-thumbnail"
                    alt="Gallery Thumbnail"
                    draggable={false}
                    width="307"
                    height="230"
                  />
                </div>
                <span className="gallery-images-order">{index + 1}</span>
              </Element>
            </SortableItem>
          ))}
        </SortableList>
      )}

      {mode === "none" && totalPages !== 1 && (
        <div className="gallery-pagination">
          <Button className="plain" onClick={prevPage} disabled={!hasPrevPage}>
            &lt;
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button className="plain" onClick={nextPage} disabled={!hasNextPage}>
            &gt;
          </Button>
        </div>
      )}

      <ImageViewDialog
        isOpen={isOpen}
        onClose={handleClose}
        images={galleryData?.gallery_images || []}
        index={activeImageIndex}
        onChangeIndex={setActiveImageIndex}
        onSaveNote={handleApplyNote}
      />

      <AddGalleryDialog
        isOpen={nameDialogOpen}
        onClose={closeNameDialog}
        previousValue={data?.title}
        galleryId={id}
        duplicateMode={duplicateMode}
        onSuccess={handleSuccessAddGallery}
      />

      <ConfirmDialog
        isOpen={confirmDialogOpen}
        onClose={closeConfirmDialog}
        onConfirm={
          deleteMode === "gallery" ? handleDeleteGallery : handleRemoveImages
        }
        title={
          deleteMode === "gallery" ? "Confirm Delete" : "Confirm Remove Images"
        }
        content={
          deleteMode === "gallery"
            ? "Are you sure you want to delete this gallery? This action cannot be undone."
            : "Are you sure you want to remove the selected images? This action cannot be undone."
        }
      />

      <ImagesPrint items={renderItems || []} ref={printRef} />

      {AlertDialog}
    </div>
  );
};

export default GalleryDetail;
