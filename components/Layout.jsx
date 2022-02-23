import Head from "next/head";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useThemeContext } from "../contexts/Theme";

const Layout = ({ title, children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { theme } = useThemeContext();

    return (
        <div className="relative">
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content="A NFT MarketPlace for censorship-resistant authorship."
                />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>
            <div
                className={`transition duration-200 ${isSidebarOpen && `${theme === "os" ? "bg-os-100/10" : "bg-od-200/10"} blur-sm`
                    } pl-[76px] lg:pl-24`} onClick={() => setSidebarOpen(false)}>
                <Navbar isSidebarOpen={isSidebarOpen} />
                {children}
            </div>
            <Sidebar setOpen={setSidebarOpen} open={isSidebarOpen} />
        </div >
    );
};

export default Layout;
