import {useState} from "react";
import {Tab} from "@headlessui/react";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Tabs({tabs, panels}) {
    return (
        <div className="w-full">
            <Tab.Group>
                <Tab.List className="ml-1 flex w-1/3 space-x-1 rounded border-2 border-os-500 p-1">
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            className={({selected}) =>
                                classNames(
                                    "w-full rounded py-2 text-sm font-medium leading-5 tracking-wider transition duration-300 ease-in-out",
                                    selected
                                        ? "bg-os-500 font-bold text-white"
                                        : "text-os-500 hover:bg-os-500/[0.1]"
                                )
                            }>
                            {tab}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className={"mt-2"}>
                    {panels.map((panel, index) => (
                        <Tab.Panel key={index}>{panel}</Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
}
