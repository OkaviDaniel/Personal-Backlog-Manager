import React, {useState, useCallback} from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";

import NewProduct from "./products/pages/NewProduct";
import Products from "./products/pages/Products";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { TypeContext } from "./shared/context/current-type";

function App() {
  const [type, setType] = useState("games");

  const changeType = useCallback(t => {
    setType(t);
  }, []);

  

  return (
    <TypeContext.Provider value={{activeType: type, changeType: changeType}}>
      <React.Fragment>
        <Router>
          <MainNavigation />
          <Routes>
            <Route path="/completed" element={<Products activeStatus="completed"/>} exact />
            <Route path="/current" element={<Products activeStatus="current"/>} exact />
            <Route path="/backlog" element={<Products activeStatus="backlog"/>} exact />
            <Route path="/dropped" element={<Products activeStatus="dropped"/>} exact />
            <Route path="/add-product" element={<NewProduct />} exact/>
            <Route path="*" element={<Navigate to="/completed" />} />
          </Routes>
        </Router>
      </React.Fragment>
    </TypeContext.Provider>
  );
}

export default App;
