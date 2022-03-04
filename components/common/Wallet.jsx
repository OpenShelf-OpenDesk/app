import React from "react";
import {ChevronDownIcon} from "@heroicons/react/solid";
import Identicon from "./Identicon";
import {useThemeContext} from "../../contexts/Theme";

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
                    className={`ml-1 flex flex-col items-start justify-between text-xs font-semibold text-gray-600 lg:text-sm`}>
                    <span>Personal Wallet</span>
                    <span>
                        {seed.substring(0, 6)}.....{seed.substring(seed.length - 6)}
                    </span>
                </div>
            </div>
            <ChevronDownIcon className={`h-4 w-4 ${theme == "os" ? "os-icon" : "od-icon"}`} />
        </div>
    );
};

export default Wallet;
