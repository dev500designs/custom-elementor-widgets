import React, { forwardRef } from "react";
import "./FilterDropdown.css";

const FilterDropdown = forwardRef(({ items, onChange }, ref) => {
  return (
    <div className="filter-dropdown">
      <span>Filter images by</span>
      <select ref={ref} onChange={onChange}>
        <option value="0">All</option>
        {items?.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
});

export default FilterDropdown;
