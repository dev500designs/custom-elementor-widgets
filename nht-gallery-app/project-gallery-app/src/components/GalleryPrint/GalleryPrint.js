import React, { forwardRef, useMemo } from "react";
import "./GalleryPrint.css";
import LinkIcon from "../../icons/Link";
import LocationIcon from "../../icons/Location";
import EmailIcon from "../../icons/Email";
import StarIcon from "../../icons/Star";
import useDataAttributes from "../../utils/useDataAttributes";

const GalleryPrint = forwardRef(({ project }, ref) => {
  const { title, data = {} } = project || {};
  const { pluginPath } = useDataAttributes("nht-project-gallery-app-root");
  const parsedDate = useMemo(() => {
    if (!data?.featured_date) return "";
    const date_split = data.featured_date.split("/");
    const month = parseInt(date_split[1]);
    const year = parseInt(date_split[2]);

    const monthDate = new Date();
    monthDate.setMonth(month - 1);
    return `${monthDate.toLocaleString("en-US", {
      month: "short",
    })} ${year}`;
  }, [data.featured_date]);

  return (
    <div style={{ display: "none" }}>
      <div className="gallery-print-container" ref={ref}>
        <img
          className="title"
          src={`${pluginPath}/project-gallery-app/build/DesignLensLogo.png`}
          alt="DesignLenslogo"
          width={200}
        />

        <h1 className="title">{title}</h1>

        <div className="builders-info">
          <span>
            {data?.builders?.map((builder) => (
              <span className="builder" key={builder.term_id}>
                {builder.name}
              </span>
            ))}
          </span>
          <span className="label-with-icon">
            <LocationIcon />
            <span>{data?.address_locality}</span>
          </span>
          <span className="label-with-icon">
            <StarIcon />
            <span>{parsedDate}</span>
          </span>
        </div>

        <img
          className="featured-image"
          src={data?.featured_image}
          alt="Featured gallery"
        />

        <div className="featured-content">
          <h2>Featured name</h2>
          <h2 className="featured-name">{data?.featured_name}</h2>

          <p dangerouslySetInnerHTML={{ __html: data.content }}></p>

          <table>
            <tbody>
              <tr>
                <td>
                  <h3>PRODUCT TYPE</h3>
                </td>
                <td>
                  <p>{data?.product_types?.[0]?.name}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>PRICE AS OF...</h3>
                </td>
                <td>
                  <p>{data?.price}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>SQUARE FOOTAGE</h3>
                </td>
                <td>
                  <p>{data?.square_footage}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>DENSITY</h3>
                </td>
                <td>
                  <p>{data?.sales_as_of}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>SALES START DATE</h3>
                </td>
                <td>
                  <p>{data?.sales_start_date}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>SALES AS OF</h3>
                </td>
                <td>
                  <p>{data?.sales_as_of}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>TARGET MARKET</h3>
                </td>
                <td>
                  <p>{data?.target_market}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <h3>UNIQUE SELLING POSITION</h3>
                </td>
                <td>
                  <p>{data?.unique_selling_position}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="consultants-content">
          <div className="consultant-item">
            <h3>Builders</h3>
            {data?.builders?.map((builder) => (
              <div className="consultant-value">
                <span>{builder.name}</span>
                <span className="label-with-icon">
                  <LinkIcon />
                  <span>{builder.site?.url}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="consultant-item">
            <h3>Architects</h3>
            {data?.architects?.map((architect) => (
              <div className="consultant-value">
                <span>{architect.name}</span>
                <span className="label-with-icon">
                  <LinkIcon />
                  <span>{architect.site?.url}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="consultant-item">
            <h3>Interior Designers</h3>
            {data?.interior_designers?.map((designer) => (
              <div className="consultant-value">
                <span>{designer.name}</span>
                <span className="label-with-icon">
                  <LinkIcon />
                  {designer.site?.url}
                </span>
              </div>
            ))}
          </div>

          <div className="consultant-item">
            <h3>Landscape Architects</h3>
            {data?.landscape_architects?.map((landscape_architect) => (
              <div className="consultant-value">
                <span>{landscape_architect.name}</span>
                <span className="label-with-icon">
                  <LinkIcon />
                  {landscape_architect.site?.url}
                </span>
              </div>
            ))}
          </div>

          <div className="consultant-item">
            <h3>JBREC Consultant</h3>
            {data?.jbrec_consultants?.map((consultant) => (
              <div className="consultant-value">
                <span>{consultant.name}</span>
                <span>{consultant.role}</span>
                <span className="label-with-icon">
                  <LocationIcon />
                  {consultant.location}
                </span>
                <span className="label-with-icon">
                  <EmailIcon />
                  {consultant.email}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="location-info">
          <h3>Location</h3>
          <p className="location-field">
            <span className="location-label"></span>
            <span className="location-value">{data?.address_line1}</span>
          </p>
          <p className="location-field">
            <span className="location-label"></span>
            <span className="location-value">{data?.address_line2}</span>
          </p>
          <p className="location-field">
            <span className="location-label">Phone number:</span>
            <span className="location-value">{data?.address_given_name}</span>
          </p>
          <p className="location-field">
            <span className="location-label">State:</span>
            <span className="location-value">
              {data?.address_regions?.[0]?.name}
            </span>
          </p>
          <p className="location-field">
            <span className="location-label">City:</span>
            <span className="location-value">{data?.address_locality}</span>
          </p>
          <p className="location-field">
            <span className="location-label">Postal code:</span>
            <span className="location-value">{data?.address_postal_code}</span>
          </p>
        </div>
      </div>
    </div>
  );
});

export default GalleryPrint;
