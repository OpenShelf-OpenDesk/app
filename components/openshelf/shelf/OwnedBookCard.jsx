import {useState, useEffect} from "react";
import {executeQuery} from "../../../utils/apolloClient";
import PreviewBookCoverPage from "../../common/PreviewBookCoverPage";
import LoadingAnimation from "../../common/LoadingAnimation";
import BigNumber from "bignumber.js";
import {putOnRent, removeFromRent} from "../../../controllers/Rentor";
import {lockWith} from "../../../controllers/Edition";
import contractAddresses from "../../../contracts/addresses.json";
import {
    CheckIcon,
    PencilAltIcon,
    ExternalLinkIcon,
    ArrowLeftIcon,
    ChevronRightIcon
} from "@heroicons/react/solid";
import {calculateFlowRate} from "../../../utils/superfluid";
import {useSignerContext} from "../../../contexts/Signer";
import {useLoadingContext} from "../../../contexts/Loading";
import {useRouter} from "next/router";
import {useRentingEnabledContext} from "../../../contexts/RentingEnabled";
import CopyOffersTable from "./CopyOffersTable";
import ProgressStatus from "../../common/ProgressStatus";

const OwnedBookCard = ({editionId, copyUid, owner}) => {
    const router = useRouter();
    const {signer} = useSignerContext();
    const {setLoading: setMainLoading} = useLoadingContext();
    const {rentingEnabled} = useRentingEnabledContext();
    const [copy, setCopy] = useState();
    const [rentRecords, setRentRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRentRevenue, setTotalRentRevenue] = useState(0);
    const [intervalId, setIntervalId] = useState(0);
    const [editFlowRate, setEditFlowRate] = useState(false);
    const [editFlowRateReq, setEditFlowRateReq] = useState(false);
    const [showOffers, setShowOffers] = useState(false);
    const [newFlowRate, setNewFlowRate] = useState(0);
    const [progressStatusPutOnRent, setProgressStatusPutOnRent] = useState(0);
    const [progressStatusRemoveFromRent, setProgressStatusRemoveFromRent] = useState(0);
    const [progressStatusAcceptOffer, setProgressStatusAcceptOffer] = useState(0);

    const setProgressStatusPutOnRentCB = statusCode => {
        setProgressStatusPutOnRent(statusCode);
    };

    const statusTagsPutOnRent = [
        "Transaction Initiated",
        "Locking Book",
        "Putting Book on Rent",
        "Transaction Successful"
    ];

    const setProgressStatusRemoveFromRentCB = statusCode => {
        setProgressStatusRemoveFromRent(statusCode);
    };

    const statusTagsRemoveFromRent = [
        "Transaction Initiated",
        "Removing Book from Rent",
        "Transaction Successful"
    ];

    const setProgressStatusAcceptOfferCB = statusCode => {
        setProgressStatusAcceptOffer(statusCode);
    };

    const statusTagsAcceptOffer = [
        "Transaction Initiated",
        "Paying Royalty to Author",
        "Transfer Complete",
        "Collecting Offer Price",
        "Transaction Successful"
    ];

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
                        royalty
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
                        }
                    }
                    rentRecord{
                    	rentStartDate
                        rentEndDate
                    	flowRate
                    }
                    onRent
                    flowRate
                    offers(orderBy:offerPrice, orderDirection:desc){
                        offerer
                        offerPrice
                    }
                }
                rentRecords(where: { edition: "${editionId}",  copyUid: "${copyUid}", rentedFrom: "${owner}", rentEndDate_not: null}){
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
    }, [owner, copyUid, editionId]);

    useEffect(() => {
        console.log(copy, rentRecords);
        if (rentRecords.length > 0) {
            calculateTotalRentRevenue();
        }
        if (copy) {
            copy.onRent &&
                copy.rentRecord &&
                copy.rentRecord.rentStartDate &&
                !copy.rentEndDate &&
                calculateCurrentRentRevenue(true);
        }
        console.log(totalRentRevenue);
    }, [copy, rentRecords]);

    const calculateTotalRentRevenue = () => {
        let rentRevenue = 0;
        for (let i = 0; i < rentRecords.length; i++) {
            rentRevenue +=
                (rentRecords[i].rentEndDate - rentRecords[i].rentStartDate) *
                rentRecords[i].flowRate;
        }
        setTotalRentRevenue(rentRevenue);
    };

    const calculateCurrentRentRevenue = async on => {
        if (!on) {
            clearInterval(intervalId);
            return;
        }
        if (on) {
            let flowRate = copy.rentRecord.flowRate / 1000; // flowRate in /mSec.
            const currentInFlowSoFar =
                (new Date().getTime() - copy.rentRecord.rentStartDate * 1000) * flowRate;
            setTotalRentRevenue(state => {
                return currentInFlowSoFar;
            });
            const id = setInterval(() => {
                setTotalRentRevenue(state => {
                    const x = state + flowRate * 100;
                    return x;
                });
            }, 100);
            setIntervalId(id);
        }
    };

    return (
        <ProgressStatus status={progressStatusPutOnRent} statusTags={statusTagsPutOnRent}>
            <ProgressStatus
                status={progressStatusRemoveFromRent}
                statusTags={statusTagsRemoveFromRent}>
                <ProgressStatus
                    status={progressStatusAcceptOffer}
                    statusTags={statusTagsAcceptOffer}>
                    <div className="group relative w-[28%]">
                        <div
                            className={`absolute inset-0 flex h-[300px] w-full items-center justify-center rounded border-2 border-gray-500 transition-all duration-300 ease-in-out ${
                                loading ? "z-10 opacity-100" : "-z-10 opacity-0"
                            }`}>
                            <LoadingAnimation />
                        </div>
                        <div
                            className={`h-[300px] snap-start rounded bg-transparent transition duration-500 ease-in-out ${
                                !loading ? "z-10 opacity-100" : "-z-10 opacity-0"
                            }`}>
                            {!loading && (
                                <div>
                                    <div className="absolute top-2 z-10 flex w-[63%] items-center justify-between space-x-5 px-5">
                                        <ArrowLeftIcon
                                            className={`h-4 w-4 cursor-pointer ${
                                                showOffers ? "visible" : "invisible"
                                            }`}
                                            onClick={() => {
                                                setShowOffers(false);
                                            }}
                                        />
                                        <div
                                            className={`relative cursor-pointer text-sm font-medium text-gray-700 hover:font-semibold hover:text-gray-900 ${
                                                showOffers ? "invisible" : "visible"
                                            }`}
                                            onClick={() => {
                                                setShowOffers(true);
                                            }}>
                                            Offers{" "}
                                            {copy.offers.length > 0 && (
                                                <span className="text-sm font-semibold">
                                                    ({copy.offers.length})
                                                </span>
                                            )}
                                            <ChevronRightIcon
                                                className={`absolute top-0.5 -right-4 h-4 w-4`}
                                            />
                                        </div>
                                    </div>
                                    {showOffers ? (
                                        <div className="flex h-[300px] w-full items-center rounded border-2 border-gray-500 p-5">
                                            <CopyOffersTable
                                                editionId={editionId}
                                                copyUid={copyUid}
                                                setShowOffers={setShowOffers}
                                                royalty={copy.edition.royalty}
                                                setProgressStatusCB={setProgressStatusAcceptOfferCB}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div
                                                className={`absolute h-[300px] w-60 origin-top-left overflow-visible rounded opacity-100 shadow-md transition duration-300 ease-in-out group-hover:opacity-0`}>
                                                <div className="h-full w-full">
                                                    <PreviewBookCoverPage
                                                        src={copy.edition.editionMetadata.coverPage}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex h-[300px] items-center justify-start rounded border-2 border-gray-500">
                                                <div className="h-full w-60">
                                                    <div className="flex h-full flex-col justify-center p-3 text-gray-700">
                                                        <p className="break-all font-semibold leading-tight">
                                                            {copy.edition.editionMetadata.title
                                                                .length > 45
                                                                ? `${copy.edition.editionMetadata.title.substring(
                                                                      0,
                                                                      45
                                                                  )}...`
                                                                : copy.edition.editionMetadata
                                                                      .title}
                                                        </p>
                                                        {copy.edition.contributions[0].contributor
                                                            .name && (
                                                            <p className="mt-1 flex-wrap self-end text-sm font-semibold">
                                                                ~&nbsp;
                                                                {
                                                                    copy.edition.contributions[0]
                                                                        .contributor.name
                                                                }
                                                            </p>
                                                        )}
                                                        <p className="mt-3 break-all text-justify text-sm font-medium leading-tight">
                                                            {copy.edition.editionMetadata
                                                                .description.length > 300
                                                                ? `${copy.edition.editionMetadata.description.substring(
                                                                      0,
                                                                      300
                                                                  )}...`
                                                                : copy.edition.editionMetadata
                                                                      .description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="relative flex h-full flex-1 flex-col justify-between space-y-3 py-5 px-10">
                                                    <ExternalLinkIcon
                                                        className="invisible absolute top-2 right-2 h-4 w-4 cursor-pointer text-gray-700 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100"
                                                        onClick={() => {
                                                            setMainLoading(true);
                                                            router.push(
                                                                `/openshelf/book/${editionId}`
                                                            );
                                                        }}
                                                    />
                                                    <div className="flex h-full flex-col items-center justify-center space-y-3">
                                                        <div className="flex w-full items-center justify-between">
                                                            <span className="text-xs font-medium">
                                                                Purchased On
                                                            </span>
                                                            <div className="rounded py-0.5 font-mono text-base font-semibold">
                                                                {new Date(
                                                                    parseInt(copy.purchasedOn) *
                                                                        1000
                                                                ).toLocaleString("en-US", {
                                                                    year: "numeric",
                                                                    month: "numeric",
                                                                    day: "numeric"
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="flex w-full items-center justify-between">
                                                            <span className="text-xs font-medium">
                                                                Purchase Price
                                                            </span>
                                                            <div className="flex items-center space-x-2 rounded font-mono text-base font-semibold">
                                                                <span>
                                                                    {new BigNumber(
                                                                        parseInt(copy.originalPrice)
                                                                    )
                                                                        .shiftedBy(-18)
                                                                        .toFixed(3)}
                                                                </span>
                                                                <span>
                                                                    <img
                                                                        src="/matic.svg"
                                                                        height={14}
                                                                        width={14}
                                                                        alt="Matic Token Symbol"
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex w-full items-center justify-between">
                                                            <span className="relative text-xs font-medium">
                                                                Flow Rate
                                                                {!editFlowRate && (
                                                                    <PencilAltIcon
                                                                        className="invisible absolute -right-4 -top-1 h-3.5 w-3.5 cursor-pointer opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100"
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
                                                                                setNewFlowRate(
                                                                                    e.target.value
                                                                                );
                                                                            }}
                                                                            required={
                                                                                editFlowRateReq
                                                                            }
                                                                        />
                                                                        <span className="peer-input-text">
                                                                            {"|"}
                                                                        </span>
                                                                        <CheckIcon
                                                                            className="absolute top-1/2 -right-5 h-4 w-4 cursor-pointer"
                                                                            onClick={() => {
                                                                                setEditFlowRateReq(
                                                                                    true
                                                                                );
                                                                                if (
                                                                                    newFlowRate > 0
                                                                                ) {
                                                                                    setNewFlowRate(
                                                                                        state => {
                                                                                            return new BigNumber(
                                                                                                state
                                                                                            ).shiftedBy(
                                                                                                18
                                                                                            );
                                                                                        }
                                                                                    );
                                                                                    setEditFlowRate(
                                                                                        false
                                                                                    );
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center rounded font-mono text-base font-semibold">
                                                                    <span>
                                                                        {new BigNumber(newFlowRate)
                                                                            .shiftedBy(-18)
                                                                            .toFixed(3)}
                                                                    </span>
                                                                    <span className="w-full pl-2">
                                                                        <img
                                                                            className="inline"
                                                                            src="/matic.svg"
                                                                            height={14}
                                                                            width={14}
                                                                            alt="Matic Token Symbol"
                                                                        />
                                                                        <span className="text-xs">
                                                                            <span className="align-sub">
                                                                                x
                                                                            </span>
                                                                            /month
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex w-full items-center justify-between">
                                                            <span className="text-xs font-medium">
                                                                Rental Revenue
                                                            </span>
                                                            <div className="flex items-center space-x-2 rounded font-mono text-base font-semibold">
                                                                <span>
                                                                    {new BigNumber(
                                                                        parseInt(totalRentRevenue)
                                                                    )
                                                                        .shiftedBy(-18)
                                                                        .toFixed(8)}
                                                                </span>
                                                                <span>
                                                                    <img
                                                                        src="/matic.svg"
                                                                        height={14}
                                                                        width={14}
                                                                        alt="Matic Token Symbol"
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="invisible flex justify-between space-x-2 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100">
                                                        {copy.onRent && copy.rentRecord ? (
                                                            copy.rentRecord.rentStartDate ? (
                                                                <div className="w-full cursor-pointer rounded border border-gray-400/50 bg-gray-100 py-0.5 px-3 text-center text-sm font-semibold text-gray-400">
                                                                    On Rent
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        className={`${
                                                                            rentingEnabled
                                                                                ? "button-os bg-orange-400 px-3 text-xs hover:bg-orange-500"
                                                                                : "button-disabled text-sm"
                                                                        }`}
                                                                        disabled={!rentingEnabled}
                                                                        onClick={async () => {
                                                                            await removeFromRent(
                                                                                signer.signer,
                                                                                editionId,
                                                                                copyUid,
                                                                                setProgressStatusRemoveFromRentCB
                                                                            );
                                                                            setTimeout(() => {
                                                                                setProgressStatusRemoveFromRentCB(
                                                                                    4
                                                                                );
                                                                            }, 700);
                                                                            setTimeout(() => {
                                                                                setLoading(true);
                                                                                router.reload();
                                                                            }, 1000);
                                                                        }}>
                                                                        Remove From Rent
                                                                    </button>
                                                                    <button
                                                                        className="button-od bg-gray-600 px-3 text-xs hover:bg-gray-700"
                                                                        onClick={() => {
                                                                            setMainLoading(true);
                                                                            router.push({
                                                                                pathname: `/openshelf/bookReader`,
                                                                                query: {
                                                                                    editionAddress:
                                                                                        editionId,
                                                                                    copyUid: copyUid
                                                                                }
                                                                            });
                                                                        }}>
                                                                        Read
                                                                    </button>
                                                                </>
                                                            )
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className={`${
                                                                        rentingEnabled
                                                                            ? "button-os bg-orange-400 px-3 text-xs hover:bg-orange-500"
                                                                            : "button-disabled"
                                                                    }`}
                                                                    disabled={!rentingEnabled}
                                                                    onClick={async () => {
                                                                        await lockWith(
                                                                            signer.signer,
                                                                            editionId,
                                                                            contractAddresses.rentor,
                                                                            copyUid,
                                                                            setProgressStatusPutOnRentCB
                                                                        );
                                                                        await putOnRent(
                                                                            signer.signer,
                                                                            editionId,
                                                                            copyUid,
                                                                            calculateFlowRate(
                                                                                new BigNumber(
                                                                                    newFlowRate
                                                                                ).shiftedBy(-18)
                                                                            ),
                                                                            setProgressStatusPutOnRentCB
                                                                        );
                                                                        setTimeout(() => {
                                                                            setProgressStatusPutOnRentCB(
                                                                                5
                                                                            );
                                                                        }, 700);
                                                                        setTimeout(() => {
                                                                            setLoading(true);
                                                                            router.reload();
                                                                        }, 1000);
                                                                    }}>
                                                                    Put On Rent
                                                                </button>
                                                                <button
                                                                    className="button-od bg-gray-600 px-3 text-xs hover:bg-gray-700"
                                                                    onClick={() => {
                                                                        setMainLoading(true);
                                                                        router.push(
                                                                            {
                                                                                pathname: `/openshelf/reader`,
                                                                                query: {
                                                                                    editionAddress:
                                                                                        editionId,
                                                                                    copyUid: copyUid
                                                                                }
                                                                            },
                                                                            `/openshelf/reader`
                                                                        );
                                                                    }}>
                                                                    Read
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </ProgressStatus>
            </ProgressStatus>
        </ProgressStatus>
    );
};

export default OwnedBookCard;
