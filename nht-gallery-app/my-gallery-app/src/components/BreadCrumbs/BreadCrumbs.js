import React from 'react';
import './BreadCrumbs.css'; 

const BreadcrumbItem = ({ text, href }) => {
  return href ? (
    <li className="nht-breadcrumb-item">
      <a href={href}>{text}</a>
    </li>
  ) : (
    <li className="nht-breadcrumb-item">
      <span>{text}</span>
    </li>
  );
};

const Breadcrumbs = ({ currentPageTitle }) => {
  const siteUrl = window.location.origin;
  const path = window.location.pathname;
  const isOnMyImagesPage = path === '/my-images' || path === '/my-images/';
  const isUnderMyCollection = path.startsWith('/my_collection/');

  const items = [
    { text: 'Home', href: siteUrl },
  ];

  if (!isOnMyImagesPage) {
    items.push({ text: 'My Images', href: `${siteUrl}/my-images` });
  } else {
    items.push({ text: 'My Images', href: '' }); 
  }

  if (isUnderMyCollection && currentPageTitle) {
    items.push({ text: currentPageTitle, href: '' }); 
  }

  return (
    <nav aria-label="breadcrumb">
      <ol className="nht-breadcrumbs">
        {items.map((item, index) => (
          <BreadcrumbItem key={index} text={item.text} href={item.href ? item.href : null} />
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
