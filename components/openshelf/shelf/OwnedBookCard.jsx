import {useState, useEffect} from "react";
import {executeQuery} from "../../../utils/apolloClient";
import PreviewBookCoverPage from "../../common/PreviewBookCoverPage";
import LoadingAnimation from "../../common/LoadingAnimation";
import BigNumber from "bignumber.js";
import {putOnRent} from "../../../controllers/Rentor";
import {lockWith} from "../../../controllers/Edition";
import contractAddresses from "../../../contracts/addresses.json";
import {CheckIcon, PencilAltIcon} from "@heroicons/react/solid";
import {calculateFlowRate} from "../../../utils/superfluid";
import {useSignerContext} from "../../../contexts/Signer";

const OwnedBookCard = ({editionId, copyUid, owner}) => {
    const {signer} = useSignerContext();
    const [copy, setCopy] = useState();
    const [rentRecords, setRentRecords] = useState();
    const [loading, setLoading] = useState(true);
    const [totalRentRevenue, setTotalRentRevenue] = useState(0);
    const [intervalId, setIntervalId] = useState(0);
    const [editFlowRate, setEditFlowRate] = useState(false);
    const [editFlowRateReq, setEditFlowRateReq] = useState(false);
    const [newFlowRate, setNewFlowRate] = useState(0);

    useEffect(() => {
        const getData = async () => {
            const book = await executeQuery(`
            query{
                copy(id : "${copyUid + editionId}"){
                    copyUid
                    purchasedOn
                    originalPrice
                    edition{
                        id
                        contributions(orderBy:share, orderDirection:desc, first:1){
                            role
                            contributor{
                                id
                                name
                            }
                        }
                        editionMetadata{
                            title
                            subtitle
                            description
                            coverPage
                            currency
                        }
                    }
                    rentRecord{
                    	rentStartDate
                    	flowRate
                    }
                    onRent
                    flowRate
                }
                rentRecords(where: {rentedFrom: "${owner}", copyId: "${copyUid}", edition: "${editionId}", rentEndDate_not: null}){
                    id
                    flowRate
    				rentStartDate
    				rentEndDate
                }
            }`);
            setCopy(book.copy);
            setRentRecords(book.rentRecords);
            setNewFlowRate(book.copy.flowRate * 60 * 60 * 24 * 30);
            setLoading(false);
        };
        getData();
    }, []);

    useEffect(() => {
        if ((rentRecords && rentRecords.length > 0) || (copy && copy.rentRecord)) {
            calculateTotalRentRevenue();
        }
        if (copy) {
            copy.onRent && copy.rentRecord && calculateCurrentRentRevenue(true);
        }
    }, []);

    const calculateTotalRentRevenue = () => {
        let rentRevenue = 0;
        for (let i = 0; i < rentRecords.length; i++) {
            rentRevenue +=
                (parseInt(rentRecords[i].rentEndDate) - parseInt(rentRecords[i].rentStartDate)) *
                rentRecords[i].flowRate;
        }
        rentRevenue = new BigNumber(parseInt(rentRevenue)).shiftedBy(-18).toFixed(3);
        setTotalRentRevenue(rentRevenue);
    };

    const calculateCurrentRentRevenue = async on => {
        if (!on) {
            clearInterval(intervalId);
            return;
        }
        let flowRate = copy.rentRecord.flowRate;
        const currentInFlowSoFar =
            ((parseInt(copy.rentRecord.rentEndDate * 1000) - new Date().getTime()) / 1000) *
            flowRate;

        setTotalRentRevenue(state => {
            return Number(state) + Number(currentInFlowSoFar);
        });

        if (on && currentInFlowSoFar != 0) {
            flowRate = flowRate / 100;
            const id = setInterval(() => {
                setTotalRentRevenue(state => {
                    const x = Number(state) + Number(flowRate);
                    return x;
                });
            }, 10);
            setIntervalId(id);
        }
    };

    return !loading ? (
        <div className="group h-[300px] snap-start rounded bg-transparent">
            <div
                className={`absolute h-[300px] w-60 origin-top-left overflow-visible rounded opacity-100 shadow-md transition duration-300 ease-in-out group-hover:opacity-0`}>
                <div className="h-full w-full">
                    <PreviewBookCoverPage src={copy.edition.editionMetadata.coverPage} />
                </div>
            </div>
            <div className="flex h-[300px] items-center justify-start rounded border-2 border-gray-500">
                <div className="h-full w-60">
                    <div className="flex h-full flex-col justify-center p-3 text-gray-700">
                        <p className="break-all font-semibold leading-tight">
                            {copy.edition.editionMetadata.title.length > 70
                                ? `${copy.edition.editionMetadata.title.substring(0, 45)}...`
                                : copy.edition.editionMetadata.title}
                        </p>
                        {copy.edition.contributions[0].contributor.name && (
                            <p className="mt-1 flex-wrap self-end text-sm font-semibold">
                                ~&nbsp;
                                {copy.edition.contributions[0].contributor.name}
                            </p>
                        )}
                        <p className="mt-3 break-all text-justify text-sm font-medium leading-tight">
                            {copy.edition.editionMetadata.description.length > 115
                                ? `${copy.edition.editionMetadata.description.substring(0, 300)}...`
                                : copy.edition.editionMetadata.description}
                        </p>
                    </div>
                </div>
                <div className="flex h-full flex-1 flex-col justify-between space-y-3 py-7 px-10">
                    <div className="flex h-full flex-col items-center justify-center space-y-3">
                        <div className="flex w-full items-center justify-between">
                            <span className="text-xs font-medium">Purchased On</span>
                            <div className="rounded py-0.5 font-mono text-base font-semibold">
                                {new Date(parseInt(copy.purchasedOn) * 1000).toLocaleString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric"
                                    }
                                )}
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <span className="text-xs font-medium">Purchase Price</span>
                            <div className="flex items-center space-x-2 rounded font-mono text-base font-semibold">
                                <span>
                                    {new BigNumber(parseInt(copy.originalPrice))
                                        .shiftedBy(-18)
                                        .toFixed(3)}
                                </span>
                                <span>
                                    <img src="/matic.svg" height={14} width={14} />
                                </span>
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <span className="relative text-xs font-medium">
                                Flow Rate
                                {!editFlowRate && (
                                    <PencilAltIcon
                                        className="absolute -right-4 -top-1 h-3.5 w-3.5 cursor-pointer"
                                        onClick={() => {
                                            setNewFlowRate(0);
                                            setEditFlowRate(true);
                                        }}
                                    />
                                )}
                            </span>
                            {editFlowRate ? (
                                <div className="flex w-[45%] items-center">
                                    <div className="relative flex flex-col-reverse">
                                        <input
                                            name="newFlowRate"
                                            type="number"
                                            placeholder="Flow rate"
                                            className="input-text peer w-full py-0.5 px-1.5 text-xs font-semibold"
                                            title="Enter rent flowRate Price of the book."
                                            autoComplete="off"
                                            step="any"
                                            min="0"
                                            value={newFlowRate}
                                            onChange={e => {
                                                setNewFlowRate(e.target.value);
                                            }}
                                            required={editFlowRateReq}
                                        />
                                        <span className="peer-input-text">{"|"}</span>
                                        <CheckIcon
                                            className="absolute top-1/2 -right-5 h-4 w-4 cursor-pointer"
                                            onClick={() => {
                                                setEditFlowRateReq(true);
                                                if (newFlowRate > 0) {
                                                    setNewFlowRate(state => {
                                                        return new BigNumber(state).shiftedBy(18);
                                                    });
                                                    setEditFlowRate(false);
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center rounded font-mono text-base font-semibold">
                                    <span>
                                        {new BigNumber(newFlowRate).shiftedBy(-18).toFixed(3)}
                                    </span>
                                    <span className="w-full pl-2">
                                        <img
                                            className="inline"
                                            src="/matic.svg"
                                            height={14}
                                            width={14}
                                        />
                                        <span className="text-xs">
                                            <span className="align-sub">x</span>/month
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex w-full items-center justify-between">
                            <span className="text-xs font-medium">Rental Revenue</span>
                            <div className="flex items-center space-x-2 rounded font-mono text-base font-semibold">
                                {rentRecords.length > 0 || copy.rentRecord ? (
                                    <span>{totalRentRevenue}</span>
                                ) : (
                                    <span>0.00</span>
                                )}
                                <span>
                                    <img src="/matic.svg" height={14} width={14} />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="invisible flex justify-between space-x-2 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100">
                        {copy.onRent ? (
                            copy.rentRecord ? (
                                <div className="w-full cursor-pointer rounded border border-gray-400/50 bg-gray-100 py-0.5 px-3 text-center text-sm font-semibold text-gray-400">
                                    On Rent
                                </div>
                            ) : (
                                <>
                                    <button className="button-os bg-orange-400 px-3 text-xs hover:bg-orange-500">
                                        Remove From Rent
                                    </button>
                                    <button
                                        className="button-od bg-gray-600 px-3 text-xs hover:bg-gray-700"
                                        onClick={() => {
                                            router.push({
                                                pathname: `/openshelf/bookReader`,
                                                query: {editionAddress: editionId, copyUid: copyUid}
                                            });
                                        }}>
                                        Read
                                    </button>
                                </>
                            )
                        ) : (
                            <>
                                <button
                                    className="button-os bg-orange-400 px-4 text-xs hover:bg-orange-500"
                                    onClick={async () => {
                                        await lockWith(
                                            signer.signer,
                                            editionId,
                                            contractAddresses.rentor,
                                            copyUid
                                        );
                                        await putOnRent(
                                            signer.signer,
                                            editionId,
                                            copyUid,
                                            calculateFlowRate(
                                                new BigNumber(newFlowRate).shiftedBy(-18)
                                            )
                                        );
                                    }}>
                                    Put On Rent
                                </button>
                                <button
                                    className="button-od bg-gray-600 px-3 text-xs hover:bg-gray-700"
                                    onClick={() => {
                                        router.push({
                                            pathname: `/openshelf/bookReader`,
                                            query: {editionAddress: editionId, copyUid: copyUid}
                                        });
                                    }}>
                                    Read
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex h-[300px] w-[480px] items-center justify-center rounded border-2 border-gray-500">
            <LoadingAnimation />
        </div>
    );
};

export default OwnedBookCard;
