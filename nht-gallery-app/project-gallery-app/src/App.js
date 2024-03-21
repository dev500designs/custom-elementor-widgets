import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import { isDev, mapImagesToGallery, wpUrl } from "./utils/helpers";
import "react-image-gallery/styles/css/image-gallery.css";
import useDataAttributes from "./utils/useDataAttributes";
import useFetch from "./utils/useFetch";
import ImageGallery from "./components/ImageGallery";
import FilterDropdown from "./components/FilterDropdown";
import AddImageDialog from "./components/AddImageDialog";
import useMutation from "./utils/useMutation";
import Button from "./components/Button";
import CameraIcon from "./icons/Camera";
import PlusIcon from "./icons/Plus";
import PrintIcon from "./icons/Print";
import ShareIcon from "./icons/Share";
import SocialShare from "./components/SocialShare";
import PhotoTourDialog from "./components/PhotoTourDialog";
import useDialog from "./components/Dialog/useModal";
import GalleryPrint from "./components/GalleryPrint";
import { useReactToPrint } from "react-to-print";
import Loader from "./components/Loader/Loader";

function App() {
  const galleryRef = useRef(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addImageMode, setAddImageMode] = useState("single");
  const [selectedFilter, setSelectedFilter] = useState("0");
  const [printFlag, setPrintFlag] = useState(false);
  const printRef = useRef(null);

  const {
    isOpen: addImageDialogOpen,
    handleClose: closeAddImageDialog,
    handleOpen: openAddImageDialog,
  } = useDialog();
  const {
    isOpen: tourDialogOpen,
    handleClose: closeTourDialog,
    handleOpen: openTourDialog,
  } = useDialog();

  const { postId } = useDataAttributes("nht-project-gallery-app-root");

  const url = useMemo(() => {
    if (selectedFilter === "0") {
      return `${wpUrl}/wp-json/nht/v1/project/${postId}`;
    }
    return `${wpUrl}/wp-json/nht/v1/project/${postId}?image_category=${selectedFilter}`;
  }, [postId, selectedFilter]);

  const { data } = useFetch(url, {
    enabled: !!postId,
  });

  const { mutate: addNewGalleryMutate, loading: addGalleryLoading } =
    useMutation(`${wpUrl}/wp-json/nht/v1/gallery/create`);

  const { mutate: addToGalleryMutate, loading: addImagesLoading } = useMutation(
    `${wpUrl}/wp-json/nht/v1/gallery/add`,
    { method: "PATCH" }
  );

  const { data: imageCategoriesData } = useFetch(
    `${wpUrl}/wp-json/nht/v1/project/${postId}/image_categories`,
    {
      enabled: !!postId,
    }
  );

  const { data: projectPrintData, loading: printLoading } = useFetch(
    `${wpUrl}/wp-json/nht/v1/project-detail/${postId}`,
    { enabled: !isDev && printFlag }
  );

  const handlePrint = useReactToPrint({
    documentTitle: projectPrintData?.title || "Gallery Print",
    removeAfterPrint: true,
  });

  const [galleryImages, setGalleryImages] = useState([]);

  const handleLoadImages = useCallback(async () => {
    if (isDev) {
      import("./mocks/project.js").then(({ projectJson }) => {
        setGalleryImages(mapImagesToGallery(projectJson.images));
      });
      return;
    }
    return setGalleryImages(mapImagesToGallery(data?.images || []));
  }, [data]);

  useEffect(() => {
    handleLoadImages();
  }, [handleLoadImages]);

  const handleFilterChange = useCallback(
    (evt) => {
      console.log("evt", evt);
      setSelectedFilter(evt.target.value);
    },
    [setSelectedFilter]
  );

  const handleOpenAddImageToGallery = useCallback(
    (evt) => {
      setAddImageMode("single");
      openAddImageDialog();
    },
    [openAddImageDialog]
  );

  const handleOpenAddImagesToGallery = useCallback(
    (evt) => {
      setAddImageMode("multiple");
      openAddImageDialog();
    },
    [setAddImageMode, openAddImageDialog]
  );

  const handleSaveToGallery = useCallback(
    async (galleryId, galleryName) => {
      let updateId = galleryId;
      if (updateId === null && galleryName) {
        const galleryData = await addNewGalleryMutate({
          new_gallery_name: galleryName,
        });
        updateId = galleryData.gallery_id;
      }

      let mediaIds = [];
      if (addImageMode === "single") {
        const selectedIndex = galleryRef.current.getCurrentIndex();
        const image = galleryImages[selectedIndex];
        mediaIds.push(image.id);
      } else {
        mediaIds = galleryImages.map((image) => image.id);
      }

      await addToGalleryMutate(
        mediaIds,
        `${wpUrl}/wp-json/nht/v1/gallery/items/add/${updateId}`
      );

      closeAddImageDialog();
    },
    [
      addNewGalleryMutate,
      addToGalleryMutate,
      addImageMode,
      galleryImages,
      closeAddImageDialog,
    ]
  );

  const handleOpenTour = (reset) => () => {
    setActiveImageIndex(reset ? 0 : (galleryRef?.current?.getCurrentIndex() || 0));
    openTourDialog();
  };

  const handleAddImageFromTour = () => {
    // closeTourDialog();
    setAddImageMode("single");
    openAddImageDialog();
  };

  const handleClickPrint = () => {
    setPrintFlag(true);
  };

  const handlePerformPrint = useCallback(async () => {
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
    setPrintFlag(false);
  }, [handlePrint]);

  useEffect(() => {
    if (!printFlag || printLoading || (!projectPrintData?.id && !isDev)) return;
    handlePerformPrint();
  }, [handlePerformPrint, printFlag, printLoading, projectPrintData]);

  useEffect(() => {
    galleryRef.current?.slideToIndex(activeImageIndex);
  }, [activeImageIndex]);

  return (
    <div className="app" data-name="nth app base">
      <div className="wrapper">
        <div className="header">
          <div className="row">
            <Button
              className="primary"
              icon={<CameraIcon />}
              onClick={handleOpenTour(true)}
            >
              Take the Photo Tour
            </Button>
            <Button
              disabled={printFlag || printLoading}
              icon={printFlag || printLoading ? <Loader /> : <PrintIcon />}
              onClick={handleClickPrint}
            >
              Print
            </Button>
            <SocialShare />
          </div>
          <div className="row">
            <FilterDropdown
              items={imageCategoriesData}
              onChange={handleFilterChange}
            />
            <Button
              className="primary"
              onClick={handleOpenAddImagesToGallery}
              icon={<PlusIcon />}
            >
              Add All to my Images
            </Button>
          </div>
        </div>
        <ImageGallery 
          ref={galleryRef}
          items={galleryImages}
          handleOpenTour={handleOpenTour}
          handleOpenAddImageToGallery={handleOpenAddImageToGallery} 
        />
        <AddImageDialog
          isOpen={addImageDialogOpen}
          onClose={closeAddImageDialog}
          onSave={handleSaveToGallery}
          title={
            addImageMode === "multiple"
              ? "Add All To My Images"
              : "Add To My Images"
          }
          loading={addGalleryLoading || addImagesLoading}
        />

        <PhotoTourDialog
          images={galleryImages}
          index={activeImageIndex}
          isOpen={tourDialogOpen}
          onClose={closeTourDialog}
          onChangeIndex={setActiveImageIndex}
          onSave={handleAddImageFromTour}
        />
      </div>

      <GalleryPrint project={projectPrintData} ref={printRef} />
    </div>
  );
}

export default App;
