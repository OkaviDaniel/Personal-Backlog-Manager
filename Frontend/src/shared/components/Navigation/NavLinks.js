import React from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = (props) => {
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/add-product" exact="true">
          ADD PRODUCT
        </NavLink>
      </li>
      <li>
        <NavLink id="completed" to="/completed" exact="true">
          COMPLETED
        </NavLink>
      </li>
      <li>
        <NavLink id="current" to="/current" exact="true">
          CURRENT
        </NavLink>
      </li>
      <li>
        <NavLink id="backlog" to="/backlog" exact="true">
          BACKLOG
        </NavLink>
      </li>
      <li>
        <NavLink id="dropped" to="/dropped" exact="true">
          DROPPED
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
