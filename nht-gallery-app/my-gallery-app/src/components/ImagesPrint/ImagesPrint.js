import { Fragment, forwardRef } from "react";
import './ImagePrint.css';
import useDataAttributes from "../../utils/useDataAttributes";


const ImagesPrint = forwardRef(({items}, ref) => {
  const { pluginPath } = useDataAttributes("nht-my-gallery-app-root");

  return (
    <div style={{ display: "none" }}>
      <div className="images-print-container" ref={ref}>
        <img
          className="title"
          src={`${pluginPath}my-gallery-app/build/dl-logo.png`}
          alt="DesignLensLogo"
          width={200}
        />
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <div key={item.id} className="image-container">
              <img className="image-src" src={item.large} alt={item.title} />
              <h6 className="image-header">{item.project_title}</h6>
              <div className="image-info">
                <div>
                  <h3>Location</h3>
                  <span>{item.address_locality}{item.address_regions && `, ${item.address_regions[0]?.name}`}</span>
                </div>
                <div>
                  <h3>Architect</h3>
                  <span>
                    {item.architects?.map(a => a.name).join(", ") ?? "-"}
                  </span>
                </div>
                <div>
                  <h3>Builder</h3>
                  <span>{item.builders?.map(a => a.name).join(", ") ?? "-"}</span>
                </div>
              </div>
              <hr />
            </div>
            {index !== items.length -1 && <div className="pagebreak" />}
          </Fragment>
        ))}
      </div>
    </div>
  );
})

export default ImagesPrint;
