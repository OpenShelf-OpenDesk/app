import {executeQuery} from "../../../utils/apolloClient";
import {useThemeContext} from "../../../contexts/Theme";
import {useLoadingContext} from "../../../contexts/Loading";
import {useState, useEffect} from "react";
import {useRouter} from "next/router";
import PreviewBookCoverPage from "../../../components/common/PreviewBookCoverPage";
import Layout from "../../../components/common/Layout";
import Identicon from "../../../components/common/Identicon";
import {useSignerContext} from "../../../contexts/Signer";
import {ChevronRightIcon, ShareIcon as ShareIconSolid} from "@heroicons/react/solid";
import {RefreshIcon, ShareIcon as ShareIconOutline} from "@heroicons/react/outline";
import BigNumber from "bignumber.js";
import {buy} from "../../../controllers/Edition";
import ProgressStatus from "../../../components/common/ProgressStatus";
import {takeOnRent} from "../../../controllers/Rentor";

const DynamicAddressPage = () => {
    const {setTheme} = useThemeContext();
    const {loading, setLoading} = useLoadingContext();
    const {signer} = useSignerContext();
    const router = useRouter();
    const {address} = router.query;
    const [req, setReq] = useState(false);
    const [edition, setEdition] = useState({});
    const [rentData, setRentData] = useState([]);
    const [progressStatus, setProgressStatus] = useState(0);
    const [refresh, setRefresh] = useState(1);
    const [refreshStatus, setRefreshStatus] = useState(false);

    const statusTags = ["Request Initiated", "Printing Your Copy", "Transaction Successful"];

    const setProgressStatusCB = statusCode => {
        setProgressStatus(statusCode);
    };
    const getData = async () => {
        const editionData = await executeQuery(`
        query{
            edition(id: "${address}"){
                id
                bookId
                editionMetadata{
                    title
                    subtitle
                    description
                    coverPage
                    copyrights
                    language
                    genres
                    keywords
                }
                price
                royalty
                supplyLimited
                pricedBookSupplyLimit
                pricedBookPrinted
                revisedOn
                contributions(orderBy:share, orderDirection:desc){
                    role
                    contributor{
                        id
                        name
                    }
                }
            }
        }`);
        const rentRecords = await executeQuery(`
        query{
            rentRecords (where:{edition: "${address}", rentedTo : null}, orderBy: flowRate, orderDirection:asc){
              copyUid
              flowRate
            }
        }`);
        setEdition(editionData.edition);
        setRentData(rentRecords.rentRecords);
        setTimeout(() => {
            !refreshStatus && setLoading(false);
            refreshStatus && setRefreshStatus(false);
        }, 1000);
    };

    useEffect(() => {
        setTheme("os");
        if (address) {
            getData();
        }
        return () => {
            !refreshStatus && setLoading(true);
        };
    }, [address]);

    useEffect(() => {
        if (address) {
            getData();
        }
    }, [refresh]);

    return (
        !loading && (
            <ProgressStatus status={progressStatus} statusTags={statusTags}>
                <Layout>
                    <div className="mx-auto h-full w-full px-36 py-7">
                        <div className="flex h-full w-full justify-around space-x-24">
                            <div className="flex w-[367.2px] flex-col">
                                <div className="h-[475.2px] w-[367.2px] rounded shadow-lg">
                                    <PreviewBookCoverPage src={edition.editionMetadata.coverPage} />
                                </div>
                                <span className="group flex cursor-pointer items-center justify-end space-x-2 self-end py-2 text-sm font-medium tracking-wide text-os-500 transition duration-100 ease-in-out">
                                    Preview Sample
                                    <ChevronRightIcon className="h-5 w-5 scale-0 text-os-500 transition duration-100 ease-in-out group-hover:scale-100" />
                                </span>
                                <div className="mt-5 flex flex-col space-y-3">
                                    <div>
                                        <p className="mb-0.5 text-sm font-medium">Language</p>
                                        <div className="h-min w-min rounded border border-os-500 py-0.5 px-2 text-xs font-medium text-os-500">
                                            {edition.editionMetadata.language}
                                        </div>
                                    </div>
                                    {edition.editionMetadata.genres.length > 0 && (
                                        <div>
                                            <p className="mb-0.5 text-sm font-medium">Genres</p>
                                            <div className="flex flex-wrap gap-x-2 gap-y-1">
                                                {edition.editionMetadata.genres.map(
                                                    (genre, index) => {
                                                        return (
                                                            <span
                                                                key={index}
                                                                className={`h-min w-min rounded border border-os-500 py-0.5 px-2 text-xs font-medium text-os-500`}>
                                                                {genre}
                                                            </span>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {edition.editionMetadata.keywords.length > 0 && (
                                        <div>
                                            <p className="mb-0.5 text-sm font-medium">Keywords</p>
                                            <div className="flex flex-wrap gap-x-2 gap-y-1">
                                                {edition.editionMetadata.keywords.map(
                                                    (keyword, index) => {
                                                        return (
                                                            <span
                                                                key={index}
                                                                className={`h-min rounded border border-os-500 py-0.5 px-2 text-xs font-medium text-os-500`}>
                                                                {keyword}
                                                            </span>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <p className="pt-5 text-justify text-sm font-medium text-gray-600">
                                        {edition.editionMetadata.copyrights}
                                    </p>
                                </div>
                            </div>
                            <div className="flex w-2/3 flex-col items-start justify-start">
                                <div className="flex w-full items-center justify-between pb-5">
                                    <div className="flex items-center justify-start space-x-10 ">
                                        <div
                                            className="group cursor-pointer"
                                            onClick={() => {
                                                navigator.clipboard.writeText(router.asPath);
                                            }}>
                                            <ShareIconOutline className="absolute h-5 w-5 text-os-500 transition duration-200 ease-in-out group-hover:scale-0" />
                                            <ShareIconSolid className="absolute h-5 w-5 scale-0 text-os-500 transition duration-200 ease-in-out group-hover:scale-100" />
                                        </div>
                                        <div className="group cursor-pointer">
                                            <RefreshIcon
                                                className={`absolute h-5 w-5 text-os-500 transition duration-200 ease-in-out ${
                                                    refreshStatus
                                                        ? "animate-spin"
                                                        : "group-hover:rotate-180"
                                                }`}
                                                onClick={() => {
                                                    setRefreshStatus(true);
                                                    setRefresh(state => {
                                                        return state + 1;
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <span className="flex items-center justify-end text-sm">
                                        Launched on&nbsp;
                                        <span className="font-semibold">
                                            {new Date(edition.revisedOn * 1000).toLocaleString(
                                                "en-US",
                                                {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric"
                                                }
                                            )}
                                        </span>
                                    </span>
                                </div>

                                <h1 className="text-2xl font-semibold">
                                    {edition.editionMetadata.title}
                                </h1>
                                <h2 className="text-lg">{edition.editionMetadata.subtitle}</h2>
                                <div className="flex w-full space-x-8 py-7">
                                    {edition.contributions.map((contribution, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="group flex cursor-pointer snap-start flex-col items-center justify-center text-sm"
                                                onClick={() => {}}>
                                                <div className="relative mb-1">
                                                    <Identicon
                                                        seed={contribution.contributor.id}
                                                        scale={7}
                                                        className="transition duration-200 ease-in-out group-hover:scale-95"
                                                    />
                                                </div>
                                                <span className="text-center font-medium">
                                                    {contribution.contributor.name
                                                        ? contribution.contributor.name
                                                        : contribution.contributor.id.substring(
                                                              0,
                                                              5
                                                          )}
                                                    ....
                                                    {contribution.contributor.id.substring(
                                                        contribution.contributor.id.length - 5
                                                    )}
                                                </span>
                                                <span className="text-center font-medium">
                                                    {contribution.role}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-justify">
                                    {edition.editionMetadata.description}
                                </p>
                                <div className="mt-16 grid w-full grid-cols-4 grid-rows-2 gap-3">
                                    <div className="col-span-1 row-span-1 flex flex-col justify-between rounded border-2 border-gray-500 py-5 px-5">
                                        <div className="self-end pt-2">
                                            <span className="text-2xl font-semibold">
                                                {new BigNumber(edition.price)
                                                    .shiftedBy(-18)
                                                    .toFixed(4)}
                                            </span>
                                            &nbsp;
                                            <span className="align-top text-sm font-medium">
                                                MATIC
                                            </span>
                                        </div>
                                        <div>
                                            <div className="mt-8 flex flex-col">
                                                <span>
                                                    {edition.supplyLimited && (
                                                        <span className="text-sm leading-3">
                                                            Limited Sale! <br /> Only&nbsp;
                                                            <span className="text-base font-semibold">
                                                                {edition.pricedBookSupplyLimit -
                                                                    edition.pricedBookPrinted}
                                                            </span>
                                                            &nbsp;copies left
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <button
                                                className="button-os mt-5 w-full"
                                                onClick={async () => {
                                                    await buy(
                                                        signer.signer,
                                                        edition.id,
                                                        edition.price,
                                                        setProgressStatusCB
                                                    );
                                                    setTimeout(() => {
                                                        router.push(`/openshelf/shelf`);
                                                    }, 1000);
                                                }}>
                                                Buy
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-span-1 row-span-1 flex flex-col justify-between rounded border-2 border-gray-500 py-5 px-5">
                                        {rentData.length === 0 ? (
                                            <div className="flex h-full items-center justify-center">
                                                <span className="px-5 text-center text-lg font-medium">
                                                    No copies available for rent
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="self-end pt-2">
                                                    <span className="text-2xl font-semibold">
                                                        {new BigNumber(
                                                            rentData[0].flowRate * 60 * 60 * 24 * 30
                                                        )
                                                            .shiftedBy(-18)
                                                            .toFixed(3)}
                                                    </span>
                                                    &nbsp;
                                                    <span className="align-top text-sm font-medium">
                                                        MATIC / month
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="flex flex-col">
                                                        <span>
                                                            {edition.supplyLimited && (
                                                                <span className="text-sm leading-3">
                                                                    <span className="text-base font-semibold">
                                                                        {rentData.length}
                                                                    </span>
                                                                    &nbsp;copies available for rent
                                                                </span>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <button
                                                        className="button-os mt-4 w-full bg-orange-400 hover:bg-orange-500"
                                                        onClick={async () => {
                                                            await takeOnRent(
                                                                signer.signer,
                                                                edition.id,
                                                                rentData[0].copyUid
                                                            );
                                                        }}>
                                                        Rent
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="col-span-2 row-span-2 flex flex-col rounded border-2 border-gray-500 py-5 px-5"></div>
                                    <div className="col-span-2 row-span-1 flex flex-col space-y-1 rounded border-2 border-gray-500 py-5 px-5">
                                        <span className="self-center text-lg font-semibold">
                                            Enter Voucher Details
                                        </span>
                                        <div className="flex flex-col-reverse">
                                            <textarea
                                                name="voucher"
                                                type="text"
                                                placeholder="Voucher Signature"
                                                title="Enter Voucher Signature of the book."
                                                className="input-text peer h-16"
                                                autoComplete="off"
                                                required={req}
                                            />
                                            <span className="peer-input-text">{"|"}</span>
                                        </div>
                                        <div className="flex w-full flex-row space-x-2 pb-3">
                                            <div className="flex w-full flex-col-reverse">
                                                <input
                                                    name="voucherPrice"
                                                    type="number"
                                                    placeholder="Voucher Price"
                                                    title="Enter Voucher Price of the book."
                                                    className="input-text peer w-full"
                                                    autoComplete="off"
                                                    required={req}
                                                    step="any"
                                                    min="0"
                                                />
                                                <span className="peer-input-text">{"|"}</span>
                                            </div>
                                            <div className="flex w-2/5 flex-col-reverse">
                                                <input
                                                    name="currency"
                                                    type="text"
                                                    placeholder="Currency"
                                                    className="input-text peer text-center font-semibold uppercase"
                                                    value="Matic"
                                                    autoComplete="off"
                                                    disabled
                                                />
                                                <span className="peer-input-text">{"|"}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="button-od"
                                            onClick={async () => {
                                                setReq(true);
                                            }}>
                                            Redeem
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Layout>
            </ProgressStatus>
        )
    );
};

export default DynamicAddressPage;
