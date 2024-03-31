import React from "react";
import Card from "../../shared/components/UIElements/Card";
import BlurredBackground from "./BlurredBackground";
import "./ProductItem.css";

const ProductItem = (props) => {
  let ratingColor;
  if(props.rating >= 0 && props.rating <= 4)
  {
    ratingColor = "red-border";
  }else if(props.rating >= 5 && props.rating <= 7){
    ratingColor = "orange-border";
  }else{
    ratingColor = "green-border";
  }

  return (
    <React.Fragment>
      <li className="product-item">
        {/* <Card className="product-item__content"> */}
        <Card className={`product-item__content ${ratingColor}`}>
          <div className="product-item__image">
            <img
              className="product-item__image-image"
              src={`http://localhost:4000/${props.image}`}
              alt={props.title}
            />
            {/* <img className="product-item__image-background" src={`http://localhost:4000/${props.image}`} alt={props.title} /> */}
            <BlurredBackground
              image={`http://localhost:4000/${props.image}`}
              title={props.title}
            />
          </div>

          <div className="product-item__info">
            <a href={props.url}>
              <h2>{props.title}</h2>
            </a>
            <h3>{`My Rating: ${props.rating}`}</h3>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ProductItem;
