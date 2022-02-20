import {useState} from "react";
import Identicon from "../components/Identicon";
import Wallet from "../components/Wallet";
import Dropdown from "../components/DropdownMenu/Dropdown";
import Item from "../components/DropdownMenu/Item";

import {
    UserIcon as UserIconSolid,
    CreditCardIcon as CreditCardIconSolid
} from "@heroicons/react/solid";
import {
    UserIcon as UserIconOutline,
    CreditCardIcon as CreditCardIconOutline
} from "@heroicons/react/outline";
import ChipInputField from "../components/ChipInputField";
import List from "../components/List";
import Modal from "../components/Modal";
import {useLoadingContext} from "../contexts/Loading";
import Layout from "../components/Layout";

export default function Home() {
    const options = [
        "Wade Cooper",
        "Arlene Mccoy",
        "Devon Webb",
        "Tom Cook",
        "Tanya Fox",
        "Hellen Schmidt",
        "Tom Cook",
        "Tanya Fox",
        "Hellen Schmidt"
    ];

    const [req, setReq] = useState(false);
    const [chips, setChips] = useState([]);
    const [selected, setSelected] = useState(options[0]);
    const {setLoading} = useLoadingContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <Layout>
            <div>
                <div className="mx-auto mt-10 flex w-64 flex-col items-center space-y-6">
                    <Dropdown
                        buttonComponent={
                            <Wallet seed={"0xBa5499261078989158fFA53BgFFaBA60aB1BbDA"} />
                        }>
                        <Item
                            name="Profile Settings"
                            activeIcon={<UserIconSolid className="h-4 w-4" />}
                            inactiveIcon={<UserIconOutline className="os-icon h-4 w-4" />}
                        />
                        <Item
                            name="Wallet Address"
                            activeIcon={<CreditCardIconSolid className="h-4 w-4" />}
                            inactiveIcon={<CreditCardIconOutline className="os-icon h-4 w-4" />}
                        />
                    </Dropdown>
                    <List selected={selected} setSelected={setSelected} options={options} />

                    <ChipInputField
                        chips={chips}
                        setChips={setChips}
                        placeholder={"Enter genre here .."}
                    />
                    <Identicon
                        seed="0xBa5499261078989158fFA53BgFFaBA60aB1BbDA"
                        scale={10}
                        className="p-0.5"
                    />
                    {/* <Spinner /> */}
                    <button
                        className="button-os"
                        onClick={() => {
                            setIsModalOpen(true);
                        }}>
                        OpenShelf
                    </button>
                </div>
                <form
                    className=" form-control mx-auto flex max-w-sm flex-col justify-center space-y-10 py-16 accent-os-500"
                    onSubmit={e => {
                        e.preventDefault();
                        setReq(true);
                    }}>
                    <div className="flex flex-col space-y-2">
                        <div className="flex flex-col-reverse">
                            <input
                                name="textField1"
                                type="text"
                                placeholder="Type Something here ..."
                                className="input-text peer"
                                autoComplete="off"
                                required={req}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div className="flex flex-col-reverse">
                            <input
                                name="textField1"
                                type="text"
                                placeholder="Type Something here ..."
                                className="input-text  peer"
                                autoComplete="off"
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div className="flex flex-col-reverse">
                            <input
                                name="textField1"
                                type="email"
                                placeholder="Type Something here ..."
                                className="input-text peer"
                                autoComplete="off"
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div className="flex flex-col-reverse">
                            <input
                                name="textField1"
                                type="email"
                                placeholder="Type Something here ..."
                                className="input-text peer"
                                autoComplete="off"
                                required={req}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input id="abc" name="checkbox1" type="checkbox" className="text-lg" />
                        <label htmlFor="abc">sacac</label>
                    </div>
                    <button
                        className="button-od"
                        type="Submit"
                        onClick={() => {
                            setInterval(() => setLoading(state => !state), 3000);
                        }}>
                        OpenDesk
                    </button>
                </form>
                <Modal
                    isOpen={isModalOpen}
                    setOpen={setIsModalOpen}
                    title={"Payment Successful"}
                    description={
                        "Your payment has been successfully submitted. We’ve sent you an email with all of the details of your order. Your payment has been successfully submitted. We’ve sent you an email with all of the details of your order."
                    }
                    buttonText="Okay"
                />
            </div>
        </Layout>
    );
}

// tabs
// table
// navbar
// footer
// sidebar
// home (os)
// shelf
// book visitors page
// publish page
// dashboard (od)
// book managers page
