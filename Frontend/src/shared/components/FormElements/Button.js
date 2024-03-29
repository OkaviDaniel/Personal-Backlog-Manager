import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { TypeContext } from "../../context/current-type";

import "./Button.css";

const Button = (props) => {
  const t = useContext(TypeContext);

  if (props.href) {
    return (
      <a
        className={`button button--${props.size || "default"} ${
          props.inverse && "button--inverse"
        } ${props.danger && "button--danger"}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }

  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`button button--${props.size || "default"} ${
          props.inverse && "button--inverse"
        } ${props.danger && "button--danger"}`}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      className={`button button--${props.size || "default"} ${
        props.inverse && "button--inverse"
      } ${props.danger && "button--danger"} ${props.name === t.activeType ? 'active-temp' : ''}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      name={props.name}
    >
      {props.children}
    </button>
  );
};

export default Button;
