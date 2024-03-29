import React from "react";
import Card from "../../shared/components/UIElements/Card";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import BlurredBackground from "./BlurredBackground";
import "./ProductItem.css";

const ProductItemCurrent = (props) => {
  const [formState, inputHandler] = useForm({});
  const { isLoading, sendRequest } = useHttpClient();

  const onRatingFormClicked = async (event) => {
    event.preventDefault();
    // console.log(formState);
    try {
      await sendRequest(
        `http://localhost:4000/api/products/current/${props.id}`,
        "DELETE",
        null
      );
      let obj = {
        productId: props.productSiteId,
        type: props.type,
        rating: formState.inputs.prod_rating.value,
      };

      await sendRequest(
        "http://localhost:4000/api/products/completed",
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

  const onDropFormClicked = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:4000/api/products/current/${props.id}`,
        "DELETE",
        null
      );

      //prod-reason-drop 
      let obj = {
        productId: props.productSiteId,
        type: props.type,
        reason: formState.inputs.prod_reason_drop.value,
      };

      await sendRequest(
        "http://localhost:4000/api/products/dropped",
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

            <div>
              <form
                className="rating-area__form"
                onSubmit={onRatingFormClicked}
              >
                <Input
                  id="prod_rating"
                  element="input"
                  type="number"
                  min="0"
                  max="10"
                  initialValue="0"
                  label="My Rating"
                  onInput={inputHandler}
                  inputArea="input-area"
                  required={true}
                />
                <Button type="submit">RATE</Button>
              </form>
              <form className="drop-area__form" onSubmit={onDropFormClicked}>
                <Input
                  id="prod_reason_drop"
                  element="input"
                  type="text"
                  onInput={inputHandler}
                  placeholder="Why I dropped"
                  required={true}
                />
                <Button type="submit">DROP</Button>
              </form>
            </div>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ProductItemCurrent;
