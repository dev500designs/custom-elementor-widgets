export const wpUrl = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')
  ? process.env.REACT_APP_LOCAL_WP_URL
  : `${window.location.protocol}//${window.location.hostname}`;

console.debug("wpUrl: " + wpUrl);

export const isDev = process.env.NODE_ENV === "development";

export const mapImagesToGallery = (images) => {
  return images.map((image) => {
    const isDescriptionString = typeof image?.image_description === "string";
    return {
      id: image.id,
      original: image.large,
      thumbnail: image.thumbnail,
      description:
        isDescriptionString && image.image_description.trim() ? (
          <div dangerouslySetInnerHTML={{ __html: image.image_description }} />
        ) : null,
    };
  });
};

export const decodeHtmlEntities = (html) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = html;
  return textArea.value;
};