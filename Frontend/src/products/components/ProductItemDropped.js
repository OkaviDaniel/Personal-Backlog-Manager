import React from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import BlurredBackground from "./BlurredBackground";
import "./ProductItem.css";

const ProductItemDropped = (props) => {
  const { sendRequest } = useHttpClient();

  const onTryAgainHandler = async (event) => {
    // console.log("try again!");
    try {
      await sendRequest(
        `http://localhost:4000/api/products/dropped/${props.id}`,
        "DELETE",
        null
      );

      let obj = {
        productId: props.productSiteId,
        type: props.type,
      };

      await sendRequest(
        "http://localhost:4000/api/products/current",
        "POST",
        JSON.stringify(obj),
        {
          "Content-Type": "application/json",
        }
      );
    } catch (err) {
      console.log(err);
    }
    props.onDelete(props.id);
  };

  return (
    <React.Fragment>
      <li className="product-item">
        <Card className="product-item__content">
          <div className="product-item__image">
            <img className="product-item__image-image" src={`http://localhost:4000/${props.image}`} alt={props.title} />
            <BlurredBackground image={`http://localhost:4000/${props.image}`} title={props.title}/>
          </div>

          <div className="product-item__info">
            <a href={props.url}>
              <h2>{props.title}</h2>
            </a>

            <div className="temp-margin">
              <h3 className="product-item__info-reason">{`Reason: ${props.reason}`}</h3>
            </div>
            <Button onClick={onTryAgainHandler}>TRY AGAIN</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ProductItemDropped;
