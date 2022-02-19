import React from "react";
import Identicon from "./Identicon";
import {DuplicateIcon as DuplicateIconSolid, XIcon, MenuAlt2Icon} from "@heroicons/react/solid";
import {DuplicateIcon as DuplicateIconOutline} from "@heroicons/react/outline";
import {useThemeContext} from "../contexts/Theme";

const Sidebar = ({open, setOpen}) => {
    const {theme} = useThemeContext();

    return (
        <section className={`fixed z-40 h-full w-full lg:w-1/4`}>
            <div className={`relative z-30 flex h-full w-full items-center`}>
                <div className="relative z-40 flex h-full w-[76px] items-center bg-white lg:w-24">
                    <MenuAlt2Icon
                        className={`os-icon absolute inset-6 z-40 h-6 w-6 cursor-pointer transition duration-300 ease-in-out  lg:inset-7 lg:h-8 lg:w-8 ${
                            open ? "scale-0" : "scale-100"
                        }`}
                        onClick={() => {
                            setOpen(true);
                        }}
                    />
                    <XIcon
                        className={`os-icon absolute inset-6 z-40 h-6 w-6 cursor-pointer transition duration-300 ease-in-out lg:inset-7 lg:h-8 lg:w-8 ${
                            open ? "scale-100" : "scale-0"
                        }`}
                        onClick={() => {
                            setOpen(false);
                        }}
                    />
                    <div className="absolute bottom-[30%] z-40 flex  origin-top-left -rotate-90 items-center px-2 pt-5 lg:pt-7">
                        <div className="text-3xl font-semibold tracking-wider text-os-500 lg:text-4xl">
                            OpenShelf
                        </div>
                    </div>
                </div>
                <div
                    className={`absolute z-10 ${
                        open ? "-left-[38px] lg:left-0" : "-left-full"
                    } ml-[76px] flex h-full w-full flex-col items-center bg-white pt-12 shadow-xl transition-all duration-300 ease-in-out lg:ml-24 lg:pt-20 ${
                        theme === "os" ? "shadow-os-500/50" : "shadow-od-500/50"
                    }`}>
                    <div className="flex flex-col items-center justify-between space-y-3 py-12 px-8">
                        <Identicon
                            seed="0xBa5499261078989158fFA53BgFFaBA60aB1BbDA"
                            scale={12}
                            className="p-2 hover:cursor-pointer"
                        />
                        <div className="group relative flex cursor-pointer items-center justify-between gap-x-2 font-semibold text-gray-700 hover:text-os-500">
                            <span className="mr-6 font-medium lg:mr-8">0xBa54992...0aB1BbDA</span>
                            <DuplicateIconOutline className="absolute right-0 h-4 w-4 transition duration-100 ease-in-out group-hover:scale-0 lg:h-5 lg:w-5" />
                            <DuplicateIconSolid className="absolute right-0 h-4 w-4 scale-0 transition duration-100 ease-in-out group-hover:scale-100 lg:h-5 lg:w-5" />
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
