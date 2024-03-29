import React from "react";

import "./BlurredBackground.css";

const BlurredBackground = (props) => {
  return <img className="blurred-image" src={props.image} alt={props.title}/>;
};

export default BlurredBackground;
