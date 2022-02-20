import {createContext, useContext} from "react";
const NetworkContext = createContext();

export function useNetworkContext() {
    return useContext(NetworkContext);
}

export default NetworkContext;
