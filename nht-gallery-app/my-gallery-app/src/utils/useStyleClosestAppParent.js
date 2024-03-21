import { useEffect } from 'react';

const useStyleClosestAppParent = (parentSelector, styles) => {
  useEffect(() => {

    const rootElement = document.getElementById('nht-my-gallery-app-root');

    if (rootElement) {
      const closestParent = rootElement.closest(parentSelector);

      if (closestParent) {
        Object.assign(closestParent.style, styles);
      }
    }
    return () => {
      if (rootElement) {
        const closestParent = rootElement.closest(parentSelector);
        if (closestParent) {

          Object.keys(styles).forEach(style => {
            closestParent.style[style] = '';
          });
        }
      }
    };
  }, [parentSelector, styles]);
};

export default useStyleClosestAppParent;
