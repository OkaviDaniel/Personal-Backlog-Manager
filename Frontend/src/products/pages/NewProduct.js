import React, { useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/form-hook";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";
import SearchProductList from "../components/SearchProductList.js";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner.js";
import "./NewProduct.css";

const NewProduct = () => {
  const [menuStatus, setMenuStatus] = useState("completed");
  const [loadedProducts, setLoadedProducts] = useState();
  const [choosenProduct, setChoosenProduct] = useState();

  const history = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm({
    product_id: {
      value: "",
    },
  });

  const productSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(choosenProduct);
    // console.log(formState.inputs);
    // console.log(loadedProducts[choosenProduct].productId);
    try {
      let obj;
      obj = {
        productId: (choosenProduct !== undefined && loadedProducts[choosenProduct].productId) || formState.inputs.product_id.value,
        type: formState.inputs.prod_type.value,
      };
      const currentStatus = formState.inputs.prod_status.value;
      if (currentStatus === "completed") {
        obj = { ...obj, rating: formState.inputs.prod_rating.value };
      } else if (currentStatus === "dropped") {
        obj = { ...obj, reason: formState.inputs.prod_dropped_reason.value };
      }
      // const response = await fetch(
      //   "http://localhost:4000/api/products/" + currentStatus,
      //   {
      //     method: "POST",
      //     body: JSON.stringify(obj),
      //     headers: {
      //       'Content-Type': 'application/json',
      //     }
      //   }
      // );
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/products/" + currentStatus,
        "POST",
        JSON.stringify(obj),
        {
          "Content-Type": "application/json",
        }
      );

      // console.log(response);
      // if (!response.ok) {
      //   const errorMessage = await response.text(); // or response.json() if the error details are in JSON format
      //   console.error("Error:", errorMessage);
      // }
      history("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  const updateStateValue = (statusName) => {
    setMenuStatus(statusName);
  };

  const onSearchProduct = async (event) => {
    event.preventDefault();
    setChoosenProduct(null);
    const productId = formState.inputs.product_id.value
      .replaceAll(" ", "%20")
      .toLowerCase();
    if (productId.length >= 2) {
      const type = formState.inputs.prod_type.value;
      console.log("type = " + type);
      console.log("Product name = " + productId);
      const res = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/products/search/${type}/${productId}`
      );
      if (res.products.length > 0) {
        setLoadedProducts(res.products);
      } else {
        setLoadedProducts(null);
      }
    } else {
      console.log("Please write the name of the product.");
    }
  };

  const itemOnClickHandler = (index) => {
    setChoosenProduct(index);
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <form className="product-form" onSubmit={productSubmitHandler}>
        <Input
          id="product_id"
          element="input"
          type="text"
          label="Product ID"
          placeholder="PID / Product name"
          onInput={inputHandler}
          required
        />

        <Button type="submit" onClick={onSearchProduct}>
          SEARCH PRODUCT
        </Button>

        <Input
          id="prod_type"
          element="dropdown"
          type="text"
          label="Product type"
          onInput={inputHandler}
          dropdownValues={["games", "videos" /*, "comics", "books"*/]}
          initialValue="games"
          updateDD={updateStateValue}
        />

        {!!loadedProducts && (
          <SearchProductList
            products={loadedProducts}
            onItemClick={itemOnClickHandler}
            choosenProductIndex={choosenProduct}
          />
        )}
        {/* <ul className="search-product-list">
            {loadedProducts.map((item, index) => {
              return (
                <li className={`search-product-list__item`} onClick={itemOnClickHandler} id={index}>
                  <img src={item.image} alt={item.title} />
                  <div className="search-product-list__item-info">
                    <h3>{item.title}</h3>
                    {!!item.platform && <h4>{item.platform}</h4>}
                  </div>
                </li>
              );
            })}
          </ul> */}

        <Input
          id="prod_status"
          element="dropdown"
          type="text"
          label="Product status"
          onInput={inputHandler}
          dropdownValues={["completed", "current", "backlog", "dropped"]}
          initialValue="completed"
          updateDD={updateStateValue}
        />

        {menuStatus === "completed" && (
          <Input
            id="prod_rating"
            element="input"
            type="number"
            min="0"
            max="10"
            label="My Rating"
            onInput={inputHandler}
            inputArea="input-area"
            required={true}
          />
        )}

        {menuStatus === "dropped" && (
          <Input
            id="prod_dropped_reason"
            element="input"
            type="text"
            label="Why I dropped the product"
            onInput={inputHandler}
          />
        )}
        <Button type="submit">ADD PRODUCT</Button>
      </form>
    </React.Fragment>
  );
};

export default NewProduct;
