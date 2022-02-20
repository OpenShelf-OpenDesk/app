import "../styles/globals.css";
import ThemeContext from "../contexts/Theme";
import LoadingContext from "../contexts/Loading";
import NetworkContext from "../contexts/Network";
import SignerContext from "../contexts/Signer";
import {useState, useEffect} from "react";
import LoadingView from "../components/LoadingView";
import {connectToWallet} from "../utils/metamask";
import Modal from "../components/Modal";

function MyApp({Component, pageProps}) {
    const [theme, setTheme] = useState("os");
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [network, setNetwork] = useState(null);
    const [signer, setSigner] = useState({address: "0x"});

    useEffect(() => {
        const walletConnect = async () => {
            await connectToWallet(
                network => {
                    setNetwork(network);
                },
                (signer, address) => {
                    setSigner({signer, address});
                }
            );
        };
        walletConnect();
    }, []);

    useEffect(() => {
        console.log(network);
        if (network) {
            if (network.chainId === 80001) {
                setIsModalOpen(false);
            } else {
                setIsModalOpen(true);
            }
        }
    }, [network]);

    useEffect(() => {
        console.log(signer);
    }, [signer]);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <LoadingContext.Provider value={{loading, setLoading}}>
                <NetworkContext.Provider value={{network, setNetwork}}>
                    <SignerContext.Provider value={{signer, setSigner}}>
                        <LoadingView loading={loading} />
                        <div
                            className={`transition duration-500 ease-in-out ${
                                loading && "blur-md"
                            } ${isModalOpen && "blur-md"}`}>
                            <Component {...pageProps} />
                            <Modal
                                isOpen={isModalOpen}
                                setOpen={setIsModalOpen}
                                title={"Switch to Polygon Mumbai Testnet"}
                                description={`Your currently selected network is ${
                                    network && network.name
                                }. Switch to polygon mumbai testnet.`}
                                buttonText="Switch"
                                onClick={async () => {
                                    if (network && network.chainId === 80001) {
                                        return true;
                                    } else {
                                        try {
                                            await window.ethereum.request({
                                                method: "wallet_switchEthereumChain",
                                                params: [{chainId: "0x13881"}]
                                            });
                                        } catch (error) {
                                            console.error(error);
                                        }
                                    }
                                    return false;
                                }}
                            />
                        </div>
                    </SignerContext.Provider>
                </NetworkContext.Provider>
            </LoadingContext.Provider>
        </ThemeContext.Provider>
    );
}

export default MyApp;

// TODO
// remove network context
