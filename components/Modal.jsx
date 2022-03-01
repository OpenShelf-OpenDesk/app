import {Dialog, Transition} from "@headlessui/react";
import {Fragment} from "react";
import {useThemeContext} from "../contexts/Theme";

import React from "react";

const Modal = ({
    isOpen,
    setOpen,
    title,
    description,
    buttonText,
    onClick = () => {
        return true;
    }
}) => {
    const {theme} = useThemeContext();

    async function closeModal() {
        const result = await onClick();
        result && setOpen(false);
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className={`fixed inset-0 z-[90] overflow-y-auto transition duration-200 ease-in-out ${
                    isOpen ? "backdrop-blur-md" : "backdrop-blur-none"
                }`}
                onClose={() => {}}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95">
                        <div
                            className={`my-8 inline-block w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow ${
                                theme === "os" ? "shadow-os-500/50" : "shadow-os-500/50"
                            } transition-all`}>
                            <Dialog.Title as="h3" className="text-lg font-semibold leading-6">
                                {title}
                            </Dialog.Title>
                            <div className="mt-2">
                                <p className="text-gray-800">{description}</p>
                            </div>

                            <div className="mt-8">
                                <button
                                    autoFocus={false}
                                    className={`${theme === "os" ? "button-os" : "button-od"}`}
                                    onClick={closeModal}>
                                    {buttonText}
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default Modal;
