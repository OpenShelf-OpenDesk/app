import {createContext, useContext} from "react";
const RentingEnabledContext = createContext();

export function useRentingEnabledContext() {
    return useContext(RentingEnabledContext);
}

export default RentingEnabledContext;
