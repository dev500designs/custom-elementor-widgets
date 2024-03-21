import { useMemo, useState } from "react";
import "./App.css";
import { isDev, wpUrl, decodeHtmlEntities } from "./utils/helpers";
import useDataAttributes from "./utils/useDataAttributes";
import useFetch from "./utils/useFetch";
import useStyleClosestAppParent from "./utils/useStyleClosestAppParent";
import Breadcrumbs from "./components/BreadCrumbs";
import Button from "./components/Button";
import GalleryDetail from "./components/GalleryDetail";
import AddGalleryDialog from "./components/AddGalleryDialog";
import { useDialog } from "./components/Dialog";

function App() {
  const { postId, userId, postTitle, pluginPath } = useDataAttributes(
    "nht-my-gallery-app-root"
  );
  const { data, refetch } = useFetch(
    `${wpUrl}/wp-json/nht/v1/galleries/${userId}`,
    {
      enabled: !!userId,
    }
  );
  const [galleries, setGalleries] = useState([]);

  const { isOpen, handleOpen, handleClose } = useDialog();

  useStyleClosestAppParent(".e-con-inner", { maxWidth: "none" });

  useMemo(async () => {
    if (isDev) {
      import("./mocks/galleries.js").then(({ galleries }) => {
        console.log("mock", galleries);
        setGalleries(galleries);
      });
      return;
    }
    setGalleries(data);
  }, [data]);

  const galleryPostName = useMemo(() => {
    const url = new URL(window.location.href);
    if (url.pathname.includes("my_collection")) {
      const paths = url.pathname.split("/");
      return paths[2];
    }
    return null;
  }, []);

  const handleSuccessfulAdd = () => {
    refetch();
    handleClose();
  };

  return (
    <div className="app">
      <Breadcrumbs currentPageTitle={postTitle} />
      <header className="app-header-container">
        <div className="app-header">
          <h1>My Images</h1>
          <Button className="add-gallery-btn light" onClick={handleOpen}>
            New Gallery
          </Button>
        </div>
      </header>

      <div className="content-container">
        {galleryPostName ? (
          <GalleryDetail id={postId} />
        ) : (
          <div className="galleries-main-container">
            <div className="galleries-container">
              {galleries?.map(
                ({ id, first_image_thumbnail, images_count, title, url }) => (
                  <a key={id} className="gallery-item-container" href={url}>
                    <div className="gallery-item">
                      <div className="gallery-thumbnail-container">
                        <img
                          src={
                            first_image_thumbnail ||
                            `${pluginPath}my-gallery-app/build/placeholder.jpeg`
                          }
                          className="gallery-thumbnail"
                          alt="Gallery Thumbnail"
                          width="307"
                          height="230"
                        />
                        <span className="gallery-item-count">
                          {images_count}
                        </span>
                      </div>
                    </div>
                    <span className="gallery-name">
                      {decodeHtmlEntities(title)}
                    </span>
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <AddGalleryDialog
        isOpen={isOpen}
        onClose={handleClose}
        onSuccess={handleSuccessfulAdd}
      />
    </div>
  );
}

export default App;
