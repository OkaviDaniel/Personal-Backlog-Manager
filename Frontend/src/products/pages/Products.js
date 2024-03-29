import React, { useState, useContext, useEffect } from "react";
import ProductsList from "../components/ProductsList";
import { TypeContext } from "../../shared/context/current-type";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Products = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedProducts, setloadedProducts] = useState();
  const t = useContext(TypeContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const responseData = await sendRequest(
          // because we send an http get request we don't need to send any additional data.
          `${process.env.REACT_APP_BACKEND_URL}/products/${props.activeStatus}`
        );
        setloadedProducts(
          responseData.products.map((p) => {
            return {
              ...p.product_id,
              rating: p.rating || -1,
              reason: p.reason || "",
            };
          })
        );
      } catch (err) {}
    };
    fetchProducts();
  }, [props.activeStatus, sendRequest, t.activeStatus]);

  const productDeleteHandler = (deletedProductId) => {
    setloadedProducts((prevProducts) => {
      return prevProducts.filter((p) => p.id !== deletedProductId);
    });
  };

  return (
    <React.Fragment>
      {!isLoading && loadedProducts && (
        <ProductsList
          items={loadedProducts.filter((prod) => {
            return prod.type === t.activeType;
          })}
          activeStatus={props.activeStatus}
          onDeleteProduct={productDeleteHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Products;
