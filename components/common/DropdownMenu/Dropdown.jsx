import {Menu, Transition} from "@headlessui/react";
import {Fragment} from "react";
import {useThemeContext} from "../../../contexts/Theme";

const Dropdown = ({buttonComponent, children}) => {
    const {theme} = useThemeContext();

    return (
        <Menu as="div" className="group relative text-left">
            <Menu.Button
                className={`flex w-full items-center rounded focus:outline-none ${
                    theme === "os" ? "os-border-with-shadow" : "od-border-with-shadow"
                }`}>
                {buttonComponent}
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items
                    className={`absolute right-0 z-10 mt-2 min-h-max w-56 min-w-max origin-top-right rounded bg-white shadow-md focus:outline-none lg:w-72`}>
                    <div className="p-0.5">{children}</div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default Dropdown;
