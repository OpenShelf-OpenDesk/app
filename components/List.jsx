import {Fragment} from "react";
import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, SelectorIcon} from "@heroicons/react/solid";
import {useThemeContext} from "../contexts/Theme";

const List = ({selected, setSelected, options}) => {
    const {theme} = useThemeContext();

    return (
        <div className="w-full">
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative w-full">
                    <Listbox.Button className="flex w-full flex-row justify-between gap-x-5 rounded border-2 border-gray-300 py-2 px-3 font-medium focus-within:border-blue-300 focus-within:shadow focus-within:shadow-blue-300/50 focus-within:outline-none focus-within:ring-0 hover:border-blue-300 hover:shadow hover:shadow-blue-300/50">
                        <span>{selected}</span>
                        <SelectorIcon className="h-5 w-5 text-gray-400" />
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full origin-top-right overflow-auto rounded bg-white p-1 shadow-md shadow-blue-300/50 focus:outline-none">
                            {options.map((option, optionIdx) => (
                                <Listbox.Option
                                    key={optionIdx}
                                    className={() =>
                                        `group relative flex cursor-default select-none justify-start rounded py-2 pl-10 hover:text-white ${
                                            theme === "os" ? "hover:bg-os-500" : "hover:bg-od-500"
                                        }`
                                    }
                                    value={option}>
                                    {({selected}) => (
                                        <>
                                            <span
                                                className={`${
                                                    selected ? "font-semibold" : "font-normal"
                                                } group-hover:font-semibold`}>
                                                {selected && (
                                                    <CheckIcon
                                                        className={`absolute left-3 h-5 w-5 ${
                                                            theme === "os" ? "os-icon" : "od-icon"
                                                        } group-hover:text-white`}
                                                    />
                                                )}
                                                {option}
                                            </span>
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};

export default List;
