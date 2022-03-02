import Image from "next/image";
import {useState, useEffect} from "react";
import Toggle from "./Toggle";
import LoadingAnimation from "./LoadingAnimation";
import {
    PencilAltIcon as PencilAltIconSolid,
    PlusCircleIcon as PlusCircleIconSolid,
    StarIcon
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
} from "../utils/superfluid";
import {useSignerContext} from "../contexts/Signer";
import {useSuperfluidFrameworkContext} from "../contexts/SuperfluidFramework";

const RentController = () => {
    const [toggle, setToggle] = useState(false);
    const [toggled, setToggled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [superTokenBalance, setSuperTokenBalance] = useState(0.0);
    const [inFlowBalance, setInFlowBalance] = useState(0);
    const [outFlowBalance, setOutFlowBalance] = useState(0);

    const {signer} = useSignerContext();
    const {superfluidFramework} = useSuperfluidFrameworkContext();

    const handleUpdateFlow = async () => {
        setLoading(true);
        setToggled(false);
        await updateSubscription(superfluidFramework, signer, 1.5);
        const balance = await getSuperTokenBalance(signer);
        setSuperTokenBalance(balance);
        await getFlowBalance(superfluidFramework, signer.address, (outFlow, inFlow) => {
            setInFlowBalance(inFlow);
            setOutFlowBalance(outFlow);
            setLoading(false);
            setToggled(true);
        });
    };

    const handleWrap = async () => {
        setLoading(true);
        setToggled(false);
        await wrap(superfluidFramework, signer, 0.8);
        const balance = await getSuperTokenBalance(signer);
        setSuperTokenBalance(balance);
        setLoading(false);
        setToggled(true);
    };

    useEffect(() => {
        async function getData() {
            if (signer && superfluidFramework) {
                const balance = await getSuperTokenBalance(signer);
                setSuperTokenBalance(balance);
                const streams = await getStream(superfluidFramework, signer.address);
                if (streams) {
                    setInFlowBalance(streams[0]);
                    setOutFlowBalance(streams[1]);
                    if (streams[1] > 0) {
                        setToggled(true);
                        setToggle(true);
                    }
                }
            }
        }
        getData();
    }, [signer]);

    useEffect(() => {
        async function getData() {
            if (signer && superfluidFramework) {
                console.log(toggle, toggled);
                if (!toggled && toggle) {
                    setLoading(true);
                    await subscribe(superfluidFramework, signer, 0.5);
                    const balance = await getSuperTokenBalance(signer);
                    setSuperTokenBalance(balance);
                    await getFlowBalance(superfluidFramework, signer.address, (outFlow, inFlow) => {
                        setInFlowBalance(inFlow);
                        setOutFlowBalance(outFlow);
                        setLoading(false);
                        setToggled(true);
                    });
                } else if (toggled && !toggle) {
                    setLoading(true);
                    setToggled(false);
                    await unsubscribe(superfluidFramework, signer);
                    setLoading(false);
                }
            }
        }
        getData();
    }, [toggle]);

    return (
        <div className="w-full px-16 font-medium">
            <div className="flex w-full items-center justify-center space-x-7 py-4">
                <span className="text-lg font-semibold">Enable Renting</span>
                <Toggle loading={loading} toggle={toggle} setToggle={setToggle} />
            </div>

            <div className="relative">
                <div
                    className={`mr-10 h-full w-full rounded border-2 border-gray-500/80 py-3 ${
                        !toggled && "blur-[3px]"
                    }`}>
                    <div className="flex items-center justify-around pt-5">
                        <div className="flex flex-col items-center justify-between">
                            <div
                                className="group"
                                onClick={() => {
                                    handleUpdateFlow();
                                }}>
                                <PencilAltIconOutline className="mb-1 h-6 w-6 cursor-pointer group-hover:hidden" />
                                <PencilAltIconSolid className="mb-1 hidden h-6 w-6 cursor-pointer group-hover:flex" />
                            </div>
                            <div className="flex items-center justify-between text-xl font-semibold">
                                {inFlowBalance}
                                <span className="text-3xl font-light tracking-widest">/</span>
                                {outFlowBalance}
                            </div>
                            <span className="text-center text-sm">
                                Flow Balance
                                <br />
                                (MATICx)
                            </span>
                        </div>
                        <div className="flex h-full flex-col items-center justify-between">
                            <div
                                className="group"
                                onClick={() => {
                                    handleWrap();
                                }}>
                                <PlusCircleIconOutline className="mb-1 h-6 w-6 cursor-pointer group-hover:hidden" />
                                <PlusCircleIconSolid className="mb-1 hidden h-6 w-6 cursor-pointer group-hover:flex" />
                            </div>
                            <div className="flex items-center justify-center text-xl font-semibold">
                                {superTokenBalance}
                            </div>
                            <span className="text-center text-sm">
                                MATICx
                                <br />
                                Balance
                            </span>
                        </div>
                    </div>

                    <div className="mt-10 flex items-center justify-center space-x-3 font-semibold tracking-wider text-black">
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
                {!toggled && (
                    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-transparent">
                        {loading && <LoadingAnimation />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RentController;

//Sidebar :
//   - logo vertical
//   - superfluid native dashboard
//     - wallet balance and date of empty
//     - flow balance (from contract/ to contract)
//     - subscribe(to contract), increment, decrement, unsubscribe
//     - link to app.superfluid.finance
//   - shelf link
//   - toggle dark mode
//   - toggle dark mode
//   - toggle dark mode
//   - toggle dark mode
//   - toggle dark mode
//   - toggle dark mode
