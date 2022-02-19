import React from "react";
import {ChevronDownIcon} from "@heroicons/react/solid";
import Identicon from "./Identicon";
import {useThemeContext} from "../contexts/Theme";

const Wallet = ({className, seed}) => {
    const {theme} = useThemeContext();

    return (
        <div
            className={`flex items-center justify-between space-x-6 rounded pr-1 lg:space-x-10 lg:pr-2 ${className}`}>
            <div className="flex items-center justify-start">
                <Identicon
                    seed={seed}
                    theme={theme}
                    scale={4}
                    className="m-0 border-0 p-0 lg:hidden"
                />
                <Identicon
                    seed={seed}
                    theme={theme}
                    scale={5}
                    className="m-0 hidden border-0 p-0 lg:inline"
                />
                <div
                    className={`ml-1 flex flex-col items-start justify-between text-xs font-semibold lg:text-sm ${
                        theme == "os" ? "text-os-500" : "text-od-500"
                    }`}>
                    <span>Personal Wallet</span>
                    <span>0x4794......45525c</span>
                </div>
            </div>
            <ChevronDownIcon className={`h-4 w-4 ${theme == "os" ? "os-icon" : "od-icon"}`} />
        </div>
    );
};

export default Wallet;
