import {useState} from "react";
import {Switch} from "@headlessui/react";
import {useThemeContext} from "../contexts/Theme";

const Toggle = ({toggle, setToggle, loading}) => {
    const {theme} = useThemeContext();

    return (
        <Switch
            checked={toggle}
            onChange={loading ? () => {} : setToggle}
            className={`${
                toggle ? "border-black bg-black" : "border-black bg-white"
            } relative inline-flex h-5 w-10 items-center rounded-full border-2 transition duration-150 ease-in-out`}>
            <span className="sr-only">Enable notifications</span>
            <span
                className={`${
                    toggle ? "translate-x-5 bg-white" : "translate-x-0.5 bg-black"
                } inline-block h-3.5 w-3.5 transform rounded-full transition duration-150 ease-in-out`}
            />
        </Switch>
    );
};

export default Toggle;
