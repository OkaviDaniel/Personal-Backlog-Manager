import React, { useContext } from "react";
import Button from "../FormElements/Button";
import { TypeContext } from "../../context/current-type";

import "./TypeNavigation.css";

const TypeNavigation = (props) => {
  const t = useContext(TypeContext);

  const clickHandler = (event) => {
    t.changeType(event.target.name);
  };

  return (
    <div className="type-navigation">
      <div className="type-navigation__buttons">
        <Button name="games" onClick={clickHandler}>
          GAMES
        </Button>
        <Button name="videos" onClick={clickHandler}>
          VIDEOS
        </Button>
        {/* <Button name="comics" onClick={clickHandler}>COMICS</Button>
        <Button name="books" onClick={clickHandler}>BOOKS</Button> */}
      </div>
    </div>
  );
};

export default TypeNavigation;
