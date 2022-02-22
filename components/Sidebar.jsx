import React from "react";
import Identicon from "./Identicon";
import {DuplicateIcon as DuplicateIconSolid, XIcon, MenuAlt2Icon} from "@heroicons/react/solid";
import {DuplicateIcon as DuplicateIconOutline} from "@heroicons/react/outline";
import {useThemeContext} from "../contexts/Theme";
import {useSignerContext} from "../contexts/Signer";

const Sidebar = ({open, setOpen}) => {
    const {theme} = useThemeContext();
    const {signer} = useSignerContext();

    return (
        <section className={`fixed top-0 h-full w-full lg:w-1/4`}>
            <div className={`flex h-full w-full items-center`}>
                <div className="z-40 flex h-full w-[76px] items-center bg-white lg:w-24">
                    <MenuAlt2Icon
                        className={`absolute inset-6 h-6 w-6 cursor-pointer transition duration-300 ease-in-out  lg:inset-7 lg:h-8 lg:w-8 ${
                            open ? "scale-0" : "scale-100"
                        } ${theme === "os" ? "os-icon" : "od-icon"}`}
                        onClick={() => {
                            setOpen(true);
                        }}
                    />
                    <XIcon
                        className={`absolute inset-6 h-6 w-6 cursor-pointer transition duration-300 ease-in-out lg:inset-7 lg:h-8 lg:w-8 ${
                            open ? "scale-100" : "scale-0"
                        } ${theme === "os" ? "os-icon" : "od-icon"}`}
                        onClick={() => {
                            setOpen(false);
                        }}
                    />
                    <div className="absolute bottom-[30%] flex origin-top-left -rotate-90 items-center px-2 pt-5 lg:pt-7">
                        <div
                            className={`text-3xl font-semibold tracking-wider ${
                                theme === "os" ? "text-os-500" : "text-od-500"
                            } lg:text-4xl`}>
                            {theme === "os" ? "OpenShelf" : "OpenDesk"}
                        </div>
                    </div>
                </div>
                <div
                    className={`absolute z-10 ${
                        open ? "-left-[38px] lg:left-0" : "-left-full"
                    } ml-[76px] flex h-full w-full transform-gpu flex-col items-center overflow-hidden bg-white pt-12 shadow-2xl transition-all duration-200 ease-in-out lg:ml-24 lg:pt-20 ${
                        theme === "os" ? "shadow-os-500/30" : "shadow-od-500/20"
                    }`}>
                    <div className="flex flex-col items-center justify-between space-y-3 py-12 px-8">
                        <Identicon
                            seed={signer.address}
                            scale={12}
                            className="p-2 hover:cursor-pointer"
                        />
                        <div
                            className={`group relative flex cursor-pointer items-center justify-between gap-x-2 font-semibold text-gray-700 ${
                                theme === "os" ? "hover:text-os-500" : "hover:text-od-500"
                            }`}>
                            <span className="mr-6 font-medium tracking-wider lg:mr-8">
                                {signer.address.substring(0, 8)}.....
                                {signer.address.substring(signer.address.length - 8)}
                            </span>
                            <DuplicateIconOutline
                                className={`absolute right-0 h-4 w-4 transition duration-100 ease-in-out group-hover:scale-0 lg:h-5 lg:w-5 ${
                                    theme === "os" ? "os-icon" : "od-icon"
                                }`}
                            />
                            <DuplicateIconSolid
                                className={`absolute right-0 h-4 w-4 scale-0 transition duration-100 ease-in-out group-hover:scale-100 lg:h-5 lg:w-5 ${
                                    theme === "os" ? "os-icon" : "od-icon"
                                }`}
                            />
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sidebar;

//Sidebar :
//   - logo vertical
//   - superfluid native dashboard
//     - wallet balance and date of empty
//     - flow balance (from contract/ to contract)
//     - subscribe(to contract), increment, decrement, unsubscribe
//     - link to app.superfluid.finance
//   - shelf link
//   - toggle dark mode
