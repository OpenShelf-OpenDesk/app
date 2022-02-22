import Wallet from "./Wallet";
import Dropdown from "./DropdownMenu/Dropdown";
import Item from "./DropdownMenu/Item";
import {
    UserIcon as UserIconSolid,
    CreditCardIcon as CreditCardIconSolid,
    BellIcon as BellIconSolid,
    SearchIcon
} from "@heroicons/react/solid";
import {
    UserIcon as UserIconOutline,
    CreditCardIcon as CreditCardIconOutline,
    BellIcon as BellIconOutline
} from "@heroicons/react/outline";
import {useThemeContext} from "../contexts/Theme";
import {useSignerContext} from "../contexts/Signer";

const Navbar = ({isSidebarOpen}) => {
    const {theme} = useThemeContext();
    const {signer} = useSignerContext();

    return (
        <nav
            className={`sticky top-0 z-20 flex w-full items-center justify-end space-x-3 bg-transparent py-5 px-4 backdrop-blur-sm transition duration-200 ease-in-out lg:space-x-5 lg:px-6 ${
                isSidebarOpen ? "opacity-80" : "opacity-100"
            }`}>
            <div
                className={`flex h-10 w-10 cursor-pointer items-center justify-center space-x-2 overflow-x-auto rounded lg:cursor-default ${
                    theme === "os" ? "os-border-with-shadow" : "od-border-with-shadow"
                } font-medium lg:w-96 lg:justify-start lg:p-2`}>
                <SearchIcon className={`h-6 w-6 ${theme === "os" ? "os-icon" : "od-icon"}`} />
                <input
                    type="text"
                    placeholder="Enter text to search..."
                    className="hidden w-full min-w-max bg-transparent outline-none ring-0 placeholder:text-sm placeholder:text-gray-400 lg:inline-flex"
                />
            </div>
            <button
                className={`group flex h-10 w-10 items-center justify-center rounded ${
                    theme === "os" ? "os-border-with-shadow" : "od-border-with-shadow"
                }`}>
                <BellIconSolid
                    className={`hidden h-6 w-6 group-hover:inline-flex ${
                        theme === "os" ? "os-icon" : "od-icon"
                    }`}
                />
                <BellIconOutline
                    className={`h-6 w-6 group-hover:hidden ${
                        theme === "os" ? "os-icon" : "od-icon"
                    }`}
                />
            </button>
            <Dropdown buttonComponent={<Wallet seed={signer.address} />} theme={theme}>
                <Item
                    name="Profile Settings"
                    activeIcon={<UserIconSolid className="h-4 w-4" />}
                    inactiveIcon={
                        <UserIconOutline
                            className={`h-4 w-4 ${theme === "os" ? "os-icon" : "od-icon"}`}
                        />
                    }
                    theme={theme}
                />
                <Item
                    name="Wallet Address"
                    activeIcon={<CreditCardIconSolid className="h-4 w-4" />}
                    inactiveIcon={
                        <CreditCardIconOutline
                            className={`h-4 w-4 ${theme === "os" ? "os-icon" : "od-icon"}`}
                        />
                    }
                    theme={theme}
                />
            </Dropdown>
        </nav>
    );
};

export default Navbar;
