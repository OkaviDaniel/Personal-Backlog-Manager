import React from "react";
import ProductItem from "./ProductItem";
import Card from "../../shared/components/UIElements/Card";
import "./ProductsList.css";
import ProductItemCurrent from "./ProductItemCurrent";
import ProductItemDropped from "./ProductItemDropped";
import ProductItemBacklog from "./ProductItemBacklog";

const ProductsList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="product-list center">
        <Card>
          <h2>No products found. maybe create one?</h2>
        </Card>
      </div>
    );
  }

  // console.log(props.items);

  return (
    <>
    <div className="info-tab">
        <Card className="number-of-items">
          <h2>
            Size: <span>{props.items.length}</span>
          </h2>
        </Card>
      </div>
      <ul className="product-list">
        {props.activeStatus === "completed" &&
          props.items.map((product) => (
            <ProductItem
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              rating={product.rating || -1}
              url={product.website || "http://www.google.com"}
              type={product.type}
              onDelete={props.onDeleteProduct}
              productSiteId={product.productSiteId}
            />
          ))}
        {props.activeStatus === "current" &&
          props.items.map((product) => (
            <ProductItemCurrent
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              url={product.website || "http://www.google.com"}
              type={product.type}
              onDelete={props.onDeleteProduct}
              productSiteId={product.productSiteId}
            />
          ))}
        {props.activeStatus === "backlog" &&
          props.items.map((product) => (
            <ProductItemBacklog
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              url={product.website || "http://www.google.com"}
              type={product.type}
              onDelete={props.onDeleteProduct}
              productSiteId={product.productSiteId}
            />
          ))}
        {props.activeStatus === "dropped" &&
          props.items.map((product) => (
            <ProductItemDropped
              key={product.id}
              id={product.id}
              image={product.image}
              title={product.title}
              reason={product.reason || ""}
              url={product.website || "http://www.google.com"}
              type={product.type}
              onDelete={props.onDeleteProduct}
              productSiteId={product.productSiteId}
            />
          ))}
      </ul>
      
    </>
  );
};

export default ProductsList;
