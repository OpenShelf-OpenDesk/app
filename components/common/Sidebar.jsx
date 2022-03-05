import React from "react";
import Identicon from "./Identicon";
import {DuplicateIcon as DuplicateIconSolid, XIcon, MenuAlt2Icon} from "@heroicons/react/solid";
import {DuplicateIcon as DuplicateIconOutline} from "@heroicons/react/outline";
import {useThemeContext} from "../../contexts/Theme";
import RentController from "../openshelf/RentController";
import {useRouter} from "next/router";

const Sidebar = ({open, setOpen, signer}) => {
    const {theme} = useThemeContext();
    const router = useRouter();

    return (
        <section
            className={`fixed top-0 h-full w-24 transition-all duration-500
            ease-in-out`}>
            <div className={`flex h-full w-full items-center`}>
                <div className="z-40 flex h-full w-24 items-center bg-white">
                    <MenuAlt2Icon
                        className={`absolute inset-7 h-8 w-8 cursor-pointer transition-all duration-500 ease-in-out ${
                            open ? "scale-0" : "scale-100"
                        } ${theme === "os" ? "os-icon" : "od-icon"}`}
                        onClick={() => {
                            setOpen(true);
                        }}
                    />
                    <XIcon
                        className={`absolute inset-7 h-8 w-8 cursor-pointer transition-all duration-500 ease-in-out ${
                            open ? "scale-100" : "scale-0"
                        } ${theme === "os" ? "os-icon" : "od-icon"}`}
                        onClick={() => {
                            setOpen(false);
                        }}
                    />
                    <div className="absolute bottom-[30%] flex origin-top-left -rotate-90 items-center px-2 pt-7">
                        <div
                            className={`cursor-pointer text-3xl font-semibold tracking-wider ${
                                theme === "os" ? "text-os-500" : "text-od-500"
                            } lg:text-4xl`}
                            onClick={() => {
                                router.push(`/${theme === "os" ? "openshelf" : "opendesk"}`);
                            }}>
                            {theme === "os" ? "OpenShelf" : "OpenDesk"}
                        </div>
                    </div>
                </div>
                <div
                    className={`absolute z-10 ${
                        open ? "left-0" : "-left-[480px]"
                    } ml-20 flex h-full w-[480px] transform-gpu flex-col items-center overflow-hidden bg-white pt-10 shadow-2xl transition-all duration-300 ease-in-out ${
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
                                theme === "os" ? "hover:text-os-600" : "hover:text-od-600"
                            }`}>
                            <span className="mr-6 font-medium tracking-wider lg:mr-8">
                                {signer.address.substring(0, 8)}.....
                                {signer.address.substring(signer.address.length - 8)}
                            </span>
                            <DuplicateIconOutline
                                className={`absolute right-0 h-5 w-5 transition duration-100 ease-in-out group-hover:scale-0 ${
                                    theme === "os" ? "os-icon" : "od-icon"
                                }`}
                            />
                            <DuplicateIconSolid
                                className={`absolute right-0 h-5 w-5 scale-0 transition duration-100 ease-in-out group-hover:scale-100 ${
                                    theme === "os" ? "os-icon" : "od-icon"
                                }`}
                            />
                        </div>
                    </div>
                    {theme === "os" ? (
                        <div className="flex h-full w-full flex-col justify-around">
                            <div className="flex w-full flex-col items-center space-y-3 text-lg">
                                <div
                                    className={`cursor-pointer text-os-500 ${
                                        router.pathname === "/openshelf"
                                            ? "scale-110 font-bold tracking-wider"
                                            : "font-medium hover:font-semibold"
                                    }`}
                                    onClick={() => {
                                        router.pathname !== "/openshelf" &&
                                            router.push("/openshelf");
                                    }}>
                                    Home
                                </div>
                                <div
                                    className={`cursor-pointer text-os-500 ${
                                        router.pathname === "/openshelf/shelf"
                                            ? "scale-110 font-bold tracking-wider"
                                            : "font-medium hover:font-semibold"
                                    }`}
                                    onClick={() => {
                                        router.pathname !== "/openshelf/shelf" &&
                                            router.push("/openshelf/shelf");
                                    }}>
                                    Shelf
                                </div>
                                <div
                                    className={`cursor-pointer text-os-500 ${
                                        router.pathname === "/openshelf/about"
                                            ? "scale-110 font-bold tracking-wider"
                                            : "font-medium hover:font-semibold"
                                    }`}
                                    onClick={() => {
                                        router.pathname !== "/openshelf/about" &&
                                            router.push("/openshelf/about");
                                    }}>
                                    About
                                </div>
                                <div
                                    className={`flex w-1/3 cursor-pointer justify-center border-t-2 pt-3 font-medium text-od-500`}
                                    onClick={() => {
                                        router.push("/opendesk");
                                    }}>
                                    OpenDesk
                                </div>
                            </div>
                            <div className="w-full">
                                <RentController />
                            </div>
                        </div>
                    ) : (
                        <div className="mt-20 flex h-full w-full flex-col items-center justify-start space-y-5 text-lg">
                            <div
                                className={`cursor-pointer text-od-500 ${
                                    router.pathname === "/opendesk"
                                        ? "scale-110 font-bold tracking-wider"
                                        : "font-medium hover:font-semibold"
                                }`}
                                onClick={() => {
                                    router.pathname !== "/opendesk" && router.push("/opendesk");
                                }}>
                                Home
                            </div>
                            <div
                                className={`cursor-pointer text-od-500 ${
                                    router.pathname === "/opendesk/desk"
                                        ? "scale-110 font-bold tracking-wider"
                                        : "font-medium hover:font-semibold"
                                }`}
                                onClick={() => {
                                    router.pathname !== "/opendesk/desk" &&
                                        router.push("/opendesk/shelf");
                                }}>
                                Desk
                            </div>
                            <div
                                className={`cursor-pointer pb-5 text-od-500 ${
                                    router.pathname === "/opendesk/about"
                                        ? "scale-110 font-bold tracking-wider"
                                        : "font-medium hover:font-semibold"
                                }`}
                                onClick={() => {
                                    router.pathname !== "/opendesk/about" &&
                                        router.push("/opendesk/about");
                                }}>
                                About
                            </div>
                            <div
                                className={`flex w-1/3 cursor-pointer justify-center border-t-2 pt-10  font-medium text-os-500`}
                                onClick={() => {
                                    router.push("/openshelf");
                                }}>
                                OpenShelf
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Sidebar;
