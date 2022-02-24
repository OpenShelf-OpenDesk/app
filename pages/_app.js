import "../styles/globals.css";
import ThemeContext from "../contexts/Theme";
import LoadingContext from "../contexts/Loading";
import SignerContext from "../contexts/Signer";
import SuperfluidFrameworkContext from "../contexts/SuperfluidFramework";
import {useState, useEffect} from "react";
import LoadingView from "../components/LoadingView";
import {connectToWallet} from "../utils/metamask";
import Modal from "../components/Modal";
import {initializeSF} from "../utils/superfluid";

function MyApp({Component, pageProps}) {
    const [theme, setTheme] = useState("os");
    const [loading, setLoading] = useState(false);
    const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [network, setNetwork] = useState(undefined);
    const [superfluidFramework, setSuperfluidFramework] = useState(undefined);
    const [signer, setSigner] = useState({
        signer: undefined,
        address: "0x0000000000000000000000000000000000000000"
    });

    const walletConnect = async () => {
        const provider = await connectToWallet(
            network => {
                setNetwork(network);
            },
            (signer_, address_) => {
                setSigner({signer: signer_, address: address_});
            }
        );
        const sf = await initializeSF(provider);
        setSuperfluidFramework(sf);
    };

    useEffect(() => {
        walletConnect()
            .then(() => {
                return true;
            })
            .catch(error => {
                if (error.code === 4001) {
                    console.log("Unlock Metamask and try again!");
                }
                return false;
            });
    }, []);

    useEffect(() => {
        if (network) {
            console.log(network);
            setIsConnectModalOpen(false);
            if (network.chainId === 80001) {
                setIsSwitchModalOpen(false);
            } else {
                setIsSwitchModalOpen(true);
            }
        } else {
            setIsConnectModalOpen(true);
        }
    }, [network]);

    useEffect(() => {
        if (signer.signer) {
            console.log(signer);
        } else {
            setIsConnectModalOpen(true);
        }
    }, [signer]);

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <LoadingContext.Provider value={{loading, setLoading}}>
                <SignerContext.Provider value={{signer, setSigner}}>
                    <SuperfluidFrameworkContext.Provider
                        value={{superfluidFramework, setSuperfluidFramework}}>
                        <LoadingView loading={loading} />
                        <div
                            className={`transition duration-500 ease-in-out ${
                                loading && "blur-md"
                            } ${isSwitchModalOpen && "blur-md"} ${
                                isConnectModalOpen && "blur-md"
                            }`}>
                            <Component {...pageProps} />
                            <Modal
                                isOpen={isSwitchModalOpen}
                                setOpen={setIsSwitchModalOpen}
                                title={"Switch to Polygon Mumbai Testnet"}
                                description={`Your currently selected network is ${
                                    network && network.name
                                }. Switch to polygon mumbai testnet.`}
                                buttonText="Switch"
                                onClick={async () => {
                                    if (network && network.chainId === 80001) {
                                        return true;
                                    } else {
                                        await window.ethereum
                                            .request({
                                                method: "wallet_switchEthereumChain",
                                                params: [{chainId: "0x13881"}]
                                            })
                                            .catch(error => {
                                                console.log("Network change request rejected!");
                                            });
                                    }
                                    return false;
                                }}
                            />
                            <Modal
                                isOpen={isConnectModalOpen}
                                setOpen={setIsConnectModalOpen}
                                title={"Connect Metamask wallet"}
                                description={`Connect to Polygon Mumbai Testnet.`}
                                buttonText="Connect"
                                onClick={async () => {
                                    return await walletConnect()
                                        .then(() => {
                                            return true;
                                        })
                                        .catch(error => {
                                            if (error.code === 4001) {
                                                console.log("Unlock Metamask and try again!");
                                            }
                                            return false;
                                        });
                                }}
                            />
                        </div>
                    </SuperfluidFrameworkContext.Provider>
                </SignerContext.Provider>
            </LoadingContext.Provider>
        </ThemeContext.Provider>
    );
}

export default MyApp;

// TODO
// remove network context
// remove network context
// remove network context
