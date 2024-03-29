import { createContext } from "react";

export const TypeContext = createContext({
    activeType: "games",
    activeStatus: "completed",
    changeType: (t) => {},
    changeStatus: (s) => {}
});