import React from 'react';
import SearchProductItem from './SearchProductItem';
import "./SearchProductList.css";

const SearchProductList = (props) => {
    return <ul className="search-product-list">
        {props.products.map((item, index) => {
            return (<SearchProductItem 
                key={index}
                id={index}
                title={item.title}
                image={item.image}
                productId={item.productId}
                platform={item.platform}
                onClick={props.onItemClick}
                choosenProductIndex={props.choosenProductIndex}
            />);
        })}
    </ul>
};

export default SearchProductList;