import Image from "next/image";
import {useState, useEffect} from "react";
import Toggle from "../common/Toggle";
import LoadingAnimation from "../common/LoadingAnimation";
import {
    PencilAltIcon as PencilAltIconSolid,
    PlusCircleIcon as PlusCircleIconSolid
} from "@heroicons/react/solid";
import {
    PlusCircleIcon as PlusCircleIconOutline,
    PencilAltIcon as PencilAltIconOutline
} from "@heroicons/react/outline";
import {
    getFlowBalance,
    getStream,
    getSuperTokenBalance,
    subscribe,
    unsubscribe,
    updateSubscription,
    wrap
} from "../../utils/superfluid";
import {useSignerContext} from "../../contexts/Signer";
import {useSuperfluidFrameworkContext} from "../../contexts/SuperfluidFramework";
import BigNumber from "bignumber.js";
import {useRouter} from "next/router";
import {useRentingEnabledContext} from "../../contexts/RentingEnabled";
import {executeQuery} from "../../utils/apolloClient";

const RentController = ({sidebarOpen}) => {
    const router = useRouter();
    const [toggle, setToggle] = useState(false);
    const [toggled, setToggled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [superTokenBalance, setSuperTokenBalance] = useState(0);
    const [inFlowBalance, setInFlowBalance] = useState(0);
    const [outFlowBalance, setOutFlowBalance] = useState(0);
    const [intervalId, setIntervalId] = useState(0);
    const [balanceRunOutDate, setBalanceRunOutDate] = useState(0);
    const [booksTakenOnRentCount, setBooksTakenOnRentCount] = useState(0);
    const [booksGivenOnRentCount, setBooksGivenOnRentCount] = useState(0);

    const {signer} = useSignerContext();
    const {superfluidFramework} = useSuperfluidFrameworkContext();
    const {setRentingEnabled} = useRentingEnabledContext();

    // const handleUpdateFlow = async () => {
    //     setToggled(false);
    //     setLoading(true);
    //     try {
    //         await updateSubscription(superfluidFramework, signer, Number(outFlowBalance) + 5);
    //         await updateFlowBalance(() => {
    //             setLoading(false);
    //             setToggled(true);
    //         });
    //     } catch (error) {
    //         router.reload();
    //     }
    // };

    // const handleWrap = async () => {
    //     setLoading(true);
    //     setToggled(false);
    //     await wrap(superfluidFramework, signer, 0.5);
    //     await updateSuperTokenBalance(false);
    //     setLoading(false);
    //     setToggled(true);
    // };

    const updateSuperTokenBalance = async on => {
        try {
            const [balance, netFlow] = await getSuperTokenBalance(superfluidFramework, signer);
            Number(netFlow) < 0
                ? setBalanceRunOutDate(
                      new Date().getTime() +
                          Number(((Number(balance) / Number(netFlow)) * -1).toFixed(0)) * 1000
                  )
                : setBalanceRunOutDate(-1);

            setSuperTokenBalance(balance);
            if (!on) {
                clearInterval(intervalId);
                return;
            }
            if (on && netFlow != 0) {
                netFlow = netFlow / 100;
                const id = setInterval(() => {
                    setSuperTokenBalance(state => {
                        const x = Number(state) + Number(netFlow);
                        return x;
                    });
                }, 10);
                setIntervalId(id);
            }
        } catch (error) {}
    };

    const updateFlowBalance = async cb => {
        await getFlowBalance(superfluidFramework, signer.address, (outFlow, inFlow) => {
            setInFlowBalance(inFlow);
            setOutFlowBalance(outFlow);
            cb();
        });
    };

    useEffect(() => {
        setToggled(false);
        setToggle(false);
        async function getData() {
            if (signer && superfluidFramework) {
                await updateSuperTokenBalance(false);
                const streams = await getStream(superfluidFramework, signer.address);
                if (streams) {
                    if (streams[1] > 0) {
                        await updateSuperTokenBalance(true);
                        setInFlowBalance(streams[0]);
                        setOutFlowBalance(streams[1]);
                        setToggled(true);
                        setToggle(true);
                    }
                }
                setLoading(false);
            }
        }
        try {
            getData();
        } catch (error) {
            router.reload();
        }
    }, [signer, superfluidFramework]);

    useEffect(() => {
        setRentingEnabled(toggled);
    }, [toggled]);

    useEffect(() => {
        const getData = async () => {
            const booksTakenOnRent = await executeQuery(
                `query{
                    rentRecords(where:{rentedTo: "${signer.address.toLowerCase()}", rentEndDate:null}){
                      id
                    }
                }`
            );
            setBooksTakenOnRentCount(booksTakenOnRent.rentRecords.length);
            const booksGivenOnRent = await executeQuery(
                `query{
                    copies (where: {onRent: true, owner: "${signer.address.toLowerCase()}"}){
                      id
                    }
                }`
            );
            setBooksGivenOnRentCount(booksGivenOnRent.copies.length);
        };

        getData();
    }, [sidebarOpen]);

    useEffect(() => {
        async function getData() {
            if (signer && superfluidFramework) {
                if (!toggled && toggle) {
                    if (Number(new BigNumber(superTokenBalance).shiftedBy(-18)).toFixed(4) >= 0.5) {
                        setLoading(true);
                        await subscribe(superfluidFramework, signer, 5);
                        await updateSuperTokenBalance(true);
                        await updateFlowBalance(() => {
                            setLoading(false);
                            setToggled(true);
                        });
                    } else {
                        alert("Insufficient balance. Required minimum of 0.5 MATICx tokens.");
                        setToggle(false);
                    }
                } else if (toggled && !toggle) {
                    setToggled(false);
                    setLoading(true);
                    await unsubscribe(superfluidFramework, signer);
                    await updateSuperTokenBalance(false);
                    await updateFlowBalance(() => {
                        setLoading(false);
                    });
                }
            }
        }
        try {
            getData();
        } catch (error) {
            console.log("error");
            router.reload();
        }
    }, [toggle]);

    return (
        <div className="w-full px-16 font-medium">
            {booksTakenOnRentCount === 0 && booksGivenOnRentCount === 0 ? (
                <div className="flex w-full items-center justify-center space-x-7 py-4">
                    <span className="text-lg font-semibold">Enable Renting</span>
                    <Toggle loading={loading} toggle={toggle} setToggle={setToggle} />
                </div>
            ) : (
                <div className="pb-2 text-center text-sm font-medium">
                    You have{" "}
                    <span className="font-mono text-lg font-extrabold">
                        {booksGivenOnRentCount}
                    </span>{" "}
                    books given and{" "}
                    <span className="font-mono text-lg font-extrabold">
                        {booksTakenOnRentCount}
                    </span>{" "}
                    books taken on rent. Clear these records to Update or Delete subscription.
                </div>
            )}

            <div className="relative">
                <div className={`mr-10 h-full w-full rounded border-2 border-gray-500/80 py-3`}>
                    <div className="flex items-center justify-around pt-5">
                        {loading ? (
                            <div className="flex w-full flex-col items-center justify-between">
                                <LoadingAnimation />
                            </div>
                        ) : (
                            <>
                                {toggled ? (
                                    <div className="flex w-full flex-col items-center justify-between">
                                        <div
                                            className="group invisible"
                                            onClick={() => {
                                                handleUpdateFlow();
                                            }}>
                                            <PencilAltIconOutline className="mb-1 h-6 w-6 cursor-pointer group-hover:hidden" />
                                            <PencilAltIconSolid className="mb-1 hidden h-6 w-6 cursor-pointer group-hover:flex" />
                                        </div>
                                        <div className="flex items-center justify-between font-mono text-xl font-semibold tracking-wider">
                                            {inFlowBalance}
                                            <span className="text-3xl font-light tracking-widest">
                                                /
                                            </span>
                                            {outFlowBalance}
                                        </div>
                                        <span className="text-center text-sm">
                                            Flow Balance
                                            <br />
                                            <span className="w-min">
                                                <img
                                                    className="inline"
                                                    src="/matic.svg"
                                                    height={14}
                                                    width={14}
                                                />
                                                <span className="text-xs">
                                                    <span className="align-sub">x</span>
                                                    &nbsp;/&nbsp;month
                                                </span>
                                            </span>
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex w-full flex-col items-center justify-between pt-5 text-center font-semibold">
                                        <span>
                                            Not <br /> Subscribed
                                        </span>
                                    </div>
                                )}
                            </>
                        )}

                        <div className="flex h-full w-full flex-col items-center justify-between">
                            <div
                                className="group invisible"
                                onClick={() => {
                                    handleWrap();
                                }}>
                                <PlusCircleIconOutline className="mb-1 h-6 w-6 cursor-pointer group-hover:hidden" />
                                <PlusCircleIconSolid className="mb-1 hidden h-6 w-6 cursor-pointer group-hover:flex" />
                            </div>
                            <div className="flex items-center justify-center font-mono text-xl font-semibold tracking-wider">
                                {Number(new BigNumber(superTokenBalance).shiftedBy(-18)).toFixed(4)}
                            </div>
                            <span className="text-center text-sm">
                                <span className="w-min">
                                    <img
                                        className="inline"
                                        src="/matic.svg"
                                        height={14}
                                        width={14}
                                    />
                                </span>
                                <span className="align-sub">x</span>&nbsp;Balance
                            </span>
                        </div>
                    </div>
                    <div
                        className={` ${
                            Math.abs(balanceRunOutDate - new Date().getTime()) <= 172800000
                                ? "visible"
                                : "invisible"
                        } w-full px-5 pt-5 text-center font-medium text-red-500`}>
                        Your balance is going to run out on &nbsp;
                        {new Date(balanceRunOutDate).toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        })}
                        &nbsp;
                        {Math.abs(
                            new Date(balanceRunOutDate * 1000).getHours() == 12
                                ? new Date(balanceRunOutDate * 1000).getHours()
                                : new Date(balanceRunOutDate * 1000).getHours() % 12
                        )}
                        :{new Date(balanceRunOutDate).getMinutes()}&nbsp;
                        {new Date(balanceRunOutDate).getHours() >= 12 ? "PM" : "AM"}
                    </div>
                    <div className="mt-5 flex items-center justify-center space-x-3 font-semibold tracking-wider text-black">
                        <span>Powered by</span>
                        <a
                            href="https://www.superfluid.finance/home"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center">
                            <Image
                                src="/sf_logo.svg"
                                alt="Superfluid Logo"
                                height={40 * 0.6}
                                width={40 * 0.6}
                                layout="fixed"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentController;
