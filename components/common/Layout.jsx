import Head from "next/head";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {useEffect, useState} from "react";
import {useThemeContext} from "../../contexts/Theme";
import {useSignerContext} from "../../contexts/Signer";
import {useLoadingContext} from "../../contexts/Loading";

const Layout = ({title, children}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const {theme} = useThemeContext();
    const {signer} = useSignerContext();

    useEffect(() => {}, [signer]);

    return (
        <div>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content="A NFT MarketPlace for censorship-resistant authorship."
                />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>
            <div
                className={`transition duration-200 ${
                    isSidebarOpen && `${theme === "os" ? "bg-os-100/10" : "bg-od-200/10"} blur-sm`
                } pl-[76px] lg:pl-24`}
                onClick={() => setSidebarOpen(false)}>
                <Navbar isSidebarOpen={isSidebarOpen} signer={signer} />
                {children}
            </div>
            <Sidebar setOpen={setSidebarOpen} open={isSidebarOpen} signer={signer} />
        </div>
    );
};

export default Layout;
