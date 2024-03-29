import React, { useReducer, useEffect } from "react";
import "./Input.css";

// the reducer need a function
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        // first we pass all the previous key and value pairs from the previous state
        ...state,
        value: action.val,
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value } = inputState;

  useEffect(() => {
    onInput(id, value);
  }, [id, onInput, value]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
    });

    if(props.id === 'prod_status'){
        props.updateDD(event.target.value);
    }
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };


  let element;
  switch(props.element){
    case "input":
        element = (
            <input
              className={`${props.inputArea || ""}`}
              id={props.id}
              type={props.type}
              placeholder={props.placeholder}
              onChange={changeHandler}
              onBlur={touchHandler}
              value={inputState.value}
              min={props.min || null}
              max={props.max || null}
              required={props.required || null}
            />
          );
          break;
    case "textarea":
        element = (
            <textarea
              id={props.id}
              rows={props.rows || 3}
              onChange={changeHandler}
              onBlur={touchHandler}
              value={inputState.value}
            />
          );
          break;
    case "dropdown":
        element = (
            <select className='dropdown-menu'
                id={props.id}
                onChange={changeHandler}
                value={inputState.value}
            >
                {props.dropdownValues.map((val, index) => {
                    return <option key={index} value={val}>{val.toUpperCase()}</option>;
                })}
            </select>
        );
        break;
    default:
        break;
  }
  
  return (
    <div className={`form-control`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
    </div>
  );
};

export default Input;
