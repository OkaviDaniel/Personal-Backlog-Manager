import React from "react";

import "./SearchProductItem.css";

const SearchProductItem = (props) => {

  const onClickHandler = () => {
    props.onClick(props.id);
    
  }

  return (
    <li className={`search-product-list__item ${props.choosenProductIndex === props.id && "active-prod-search"}`} onClick={onClickHandler}>
      <img src={props.image} alt={props.title} />
      <div className="search-product-list__item-info">
        <h3>{props.title}</h3>
        {!!props.platform && <h4>{props.platform}</h4>}
      </div>
    </li>
  );
};

export default SearchProductItem;
