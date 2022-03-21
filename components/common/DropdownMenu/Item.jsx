import {Menu} from "@headlessui/react";
import {useThemeContext} from "../../../contexts/Theme";

const Item = ({name, activeIcon, inactiveIcon}) => {
    const {theme} = useThemeContext();

    return (
        <Menu.Item>
            {({active}) => (
                <button
                    className={`flex w-full justify-start gap-x-4 py-2 px-3 ${
                        active
                            ? theme == "os"
                                ? "rounded bg-os-500 text-white"
                                : "rounded bg-od-500 text-white"
                            : "text-gray-600"
                    } group flex w-full items-center font-medium`}>
                    {active ? activeIcon : inactiveIcon}
                    <span>{name}</span>
                </button>
            )}
        </Menu.Item>
    );
};

export default Item;
