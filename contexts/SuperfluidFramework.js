import {createContext, useContext} from "react";
const SuperfluidFrameworkContext = createContext();

export function useSuperfluidFrameworkContext() {
    return useContext(SuperfluidFrameworkContext);
}

export default SuperfluidFrameworkContext;
