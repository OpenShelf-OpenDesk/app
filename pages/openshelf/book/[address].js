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
import {buy, redeem} from "../../../controllers/Edition";
import ProgressStatus from "../../../components/common/ProgressStatus";
import {takeOnRent} from "../../../controllers/Rentor";
import EditionOffersTable from "../../../components/openshelf/EditionOffersTable";
import {useRentingEnabledContext} from "../../../contexts/RentingEnabled";
import {ethers} from "ethers";

const DynamicAddressPage = () => {
    const {setTheme} = useThemeContext();
    const {loading, setLoading} = useLoadingContext();
    const {rentingEnabled} = useRentingEnabledContext();
    const {signer} = useSignerContext();
    const router = useRouter();
    const {address} = router.query;
    const [req, setReq] = useState(false);
    const [edition, setEdition] = useState({});
    const [rentData, setRentData] = useState([]);
    const [progressStatusBuy, setProgressStatusBuy] = useState(0);
    const [refresh, setRefresh] = useState(1);
    const [voucherSignature, setVoucherSignature] = useState();
    const [voucherPrice, setVoucherPrice] = useState(0);
    const [refreshStatus, setRefreshStatus] = useState(false);
    const [progressStatusRent, setProgressStatusRent] = useState(0);
    const [progressStatusPlaceOffer, setProgressStatusPlaceOffer] = useState(0);
    const [progressStatusDeleteOffer, setProgressStatusDeleteOffer] = useState(0);
    const [progressStatusRedeem, setProgressStatusRedeem] = useState(0);

    const setProgressStatusRedeemCB = statusCode => {
        setProgressStatusRedeem(statusCode);
    };
    const statusTagsRedeem = [
        "Transaction Initiated",
        "Verifying your Voucher Signature",
        "Requesting Distributed Book",
        "Transaction Successful"
    ];

    const setProgressStatusRentCB = statusCode => {
        setProgressStatusRent(statusCode);
    };
    const statusTagsRent = [
        "Transaction Initiated",
        "Requesting Book on Rent",
        "Transaction Successful"
    ];

    const setProgressStatusBuyCB = statusCode => {
        setProgressStatusBuy(statusCode);
    };
    const statusTagsBuy = ["Request Initiated", "Printing Your Copy", "Transaction Successful"];

    const setProgressStatusPlaceOfferCB = statusCode => {
        setProgressStatusPlaceOffer(statusCode);
    };
    const statusTagsPlaceOffer = [
        "Transaction Initiated",
        "Placing Offer",
        "Transaction Successful"
    ];

    const setProgressStatusDeleteOfferCB = statusCode => {
        setProgressStatusDeleteOffer(statusCode);
    };
    const statusTagsDeleteOffer = [
        "Transaction Initiated",
        "Deleting Offer",
        "Transaction Successful"
    ];

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
    }, [refresh, rentingEnabled]);

    return (
        !loading && (
            <ProgressStatus status={progressStatusBuy} statusTags={statusTagsBuy}>
                <ProgressStatus status={progressStatusRent} statusTags={statusTagsRent}>
                    <ProgressStatus
                        status={progressStatusPlaceOffer}
                        statusTags={statusTagsPlaceOffer}>
                        <ProgressStatus
                            status={progressStatusDeleteOffer}
                            statusTags={statusTagsDeleteOffer}>
                            <ProgressStatus
                                status={progressStatusRedeem}
                                statusTags={statusTagsRedeem}>
                                <Layout>
                                    <div className="mx-auto h-full w-full px-36 py-7">
                                        <div className="flex h-full w-full justify-around space-x-24">
                                            <div className="flex w-[367.2px] flex-col">
                                                <div className="h-[475.2px] w-[367.2px] rounded shadow-lg">
                                                    <PreviewBookCoverPage
                                                        src={edition.editionMetadata.coverPage}
                                                    />
                                                </div>
                                                <span className="group flex cursor-pointer items-center justify-end space-x-2 self-end py-2 text-sm font-medium tracking-wide text-os-500 transition duration-100 ease-in-out">
                                                    Preview Sample
                                                    <ChevronRightIcon className="h-5 w-5 scale-0 text-os-500 transition duration-100 ease-in-out group-hover:scale-100" />
                                                </span>
                                                <div className="mt-5 flex flex-col space-y-3">
                                                    <div>
                                                        <p className="mb-0.5 text-sm font-medium">
                                                            Language
                                                        </p>
                                                        <div className="h-min w-min rounded border border-os-500 py-0.5 px-2 text-xs font-medium text-os-500">
                                                            {edition.editionMetadata.language}
                                                        </div>
                                                    </div>
                                                    {edition.editionMetadata.genres.length > 0 && (
                                                        <div>
                                                            <p className="mb-0.5 text-sm font-medium">
                                                                Genres
                                                            </p>
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
                                                    {edition.editionMetadata.keywords.length >
                                                        0 && (
                                                        <div>
                                                            <p className="mb-0.5 text-sm font-medium">
                                                                Keywords
                                                            </p>
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
                                                                navigator.clipboard.writeText(
                                                                    router.asPath
                                                                );
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
                                                            {new Date(
                                                                edition.revisedOn * 1000
                                                            ).toLocaleString("en-US", {
                                                                weekday: "long",
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric"
                                                            })}
                                                        </span>
                                                    </span>
                                                </div>

                                                <h1 className="text-2xl font-semibold">
                                                    {edition.editionMetadata.title}
                                                </h1>
                                                <h2 className="text-lg">
                                                    {edition.editionMetadata.subtitle}
                                                </h2>
                                                <div className="flex w-full space-x-8 py-7">
                                                    {edition.contributions.map(
                                                        (contribution, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="group flex cursor-pointer snap-start flex-col items-center justify-center text-sm"
                                                                    onClick={() => {}}>
                                                                    <div className="relative mb-1">
                                                                        <Identicon
                                                                            seed={
                                                                                contribution
                                                                                    .contributor.id
                                                                            }
                                                                            scale={7}
                                                                            className="transition duration-200 ease-in-out group-hover:scale-95"
                                                                        />
                                                                    </div>
                                                                    <span className="text-center font-medium">
                                                                        {contribution.contributor
                                                                            .name
                                                                            ? contribution
                                                                                  .contributor.name
                                                                            : contribution.contributor.id.substring(
                                                                                  0,
                                                                                  5
                                                                              )}
                                                                        ....
                                                                        {contribution.contributor.id.substring(
                                                                            contribution.contributor
                                                                                .id.length - 5
                                                                        )}
                                                                    </span>
                                                                    <span className="text-center font-medium">
                                                                        {contribution.role}
                                                                    </span>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                                <p className="text-justify">
                                                    {edition.editionMetadata.description}
                                                </p>
                                                <div className="mt-16 grid w-full grid-cols-4 grid-rows-2 gap-3">
                                                    <div className="col-span-1 row-span-1 flex flex-col justify-between rounded border-2 border-gray-500 py-5 px-5">
                                                        {edition.supplyLimited &&
                                                        edition.pricedBookSupplyLimit -
                                                            edition.pricedBookPrinted ===
                                                            0 ? (
                                                            <div className="flex h-full items-center justify-center">
                                                                <span className="px-5 text-center text-lg font-medium">
                                                                    No copies available for Sale
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="self-end pt-2">
                                                                    <span className="text-2xl font-semibold">
                                                                        {new BigNumber(
                                                                            edition.price
                                                                        )
                                                                            .shiftedBy(-18)
                                                                            .toFixed(4)}
                                                                    </span>
                                                                    &nbsp;
                                                                    <span className="align-top text-sm font-medium">
                                                                        MATIC
                                                                    </span>
                                                                </div>
                                                                <div className="flex flex-col space-y-5">
                                                                    <div className="flex flex-col">
                                                                        <span>
                                                                            {edition.supplyLimited ? (
                                                                                <span className="text-sm leading-3">
                                                                                    Limited Sale!{" "}
                                                                                    <br />{" "}
                                                                                    Only&nbsp;
                                                                                    <span className="text-base font-semibold">
                                                                                        {edition.pricedBookSupplyLimit -
                                                                                            edition.pricedBookPrinted}
                                                                                    </span>
                                                                                    &nbsp;copies
                                                                                    left.
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-sm leading-3">
                                                                                    Available!{" "}
                                                                                    <br />
                                                                                    <span className="text-base font-semibold">
                                                                                        {
                                                                                            edition.pricedBookPrinted
                                                                                        }
                                                                                    </span>
                                                                                    &nbsp;copies
                                                                                    sold.
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <button
                                                                        className="button-os w-full"
                                                                        onClick={async () => {
                                                                            await buy(
                                                                                signer.signer,
                                                                                edition.id,
                                                                                edition.price,
                                                                                setProgressStatusBuyCB
                                                                            );
                                                                            setTimeout(() => {
                                                                                setProgressStatusBuyCB(
                                                                                    4
                                                                                );
                                                                            }, 700);
                                                                            setTimeout(() => {
                                                                                setLoading(true);
                                                                                router.push(
                                                                                    `/openshelf/shelf`
                                                                                );
                                                                            }, 1000);
                                                                        }}>
                                                                        Buy
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
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
                                                                            rentData[0].flowRate *
                                                                                60 *
                                                                                60 *
                                                                                24 *
                                                                                30
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
                                                                        {edition.supplyLimited && (
                                                                            <span className="text-sm leading-3">
                                                                                <span className="text-base font-semibold">
                                                                                    {
                                                                                        rentData.length
                                                                                    }
                                                                                </span>
                                                                                &nbsp;copies
                                                                                available for rent
                                                                            </span>
                                                                        )}
                                                                        {!rentingEnabled && (
                                                                            <span className="py-1 text-sm font-semibold leading-3 text-red-500">
                                                                                Not Subscribed for
                                                                                Renting!
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <button
                                                                        className={`mt-4 w-full ${
                                                                            !rentingEnabled
                                                                                ? "button-disabled text-sm"
                                                                                : "button-os bg-orange-400 hover:bg-orange-500"
                                                                        }`}
                                                                        disabled={!rentingEnabled}
                                                                        onClick={async () => {
                                                                            await takeOnRent(
                                                                                signer.signer,
                                                                                edition.id,
                                                                                rentData[0].copyUid,
                                                                                setProgressStatusRentCB
                                                                            );
                                                                            setTimeout(() => {
                                                                                setProgressStatusRentCB(
                                                                                    4
                                                                                );
                                                                            }, 700);
                                                                            setTimeout(() => {
                                                                                setLoading(true);
                                                                                router.push(
                                                                                    `/openshelf/shelf`
                                                                                );
                                                                            }, 1000);
                                                                        }}>
                                                                        Rent
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 row-span-2 flex flex-col rounded border-2 border-gray-500">
                                                        <EditionOffersTable
                                                            editionAddress={edition.id}
                                                            refresh={refresh}
                                                            setRefresh={setRefresh}
                                                            deleteOfferCB={
                                                                setProgressStatusDeleteOfferCB
                                                            }
                                                            placeOfferCB={
                                                                setProgressStatusPlaceOfferCB
                                                            }
                                                        />
                                                    </div>
                                                    <div className="col-span-2 row-span-1 flex flex-col space-y-1 rounded border-2 border-gray-500 py-5 px-5">
                                                        <span className="self-center text-lg font-semibold">
                                                            Enter Voucher Details
                                                        </span>
                                                        <div className="flex flex-col-reverse">
                                                            <textarea
                                                                name="voucherSignature"
                                                                type="text"
                                                                placeholder="Voucher Signature"
                                                                title="Enter Voucher Signature of the book."
                                                                className="input-text peer h-16"
                                                                autoComplete="off"
                                                                required={req}
                                                                value={voucherSignature}
                                                                onChange={e => {
                                                                    setVoucherSignature(
                                                                        e.target.value
                                                                    );
                                                                }}
                                                            />
                                                            <span className="peer-input-text">
                                                                {"|"}
                                                            </span>
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
                                                                    value={voucherPrice}
                                                                    onChange={e => {
                                                                        setVoucherPrice(
                                                                            e.target.value
                                                                        );
                                                                    }}
                                                                />
                                                                <span className="peer-input-text">
                                                                    {"|"}
                                                                </span>
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
                                                                <span className="peer-input-text">
                                                                    {"|"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="button-od"
                                                            onClick={async () => {
                                                                setReq(true);
                                                                if (
                                                                    (voucherSignature.length > 0) &
                                                                    (voucherPrice >= 0)
                                                                ) {
                                                                    const voucher = {
                                                                        bookID: edition.bookId,
                                                                        receiver: signer.address,
                                                                        price: ethers.utils.parseUnits(
                                                                            voucherPrice.toString(),
                                                                            "ether"
                                                                        ),
                                                                        signature: voucherSignature
                                                                    };
                                                                    console.log(voucher);
                                                                    await redeem(
                                                                        signer.signer,
                                                                        edition.id,
                                                                        voucher,
                                                                        voucherPrice,
                                                                        setProgressStatusRedeemCB
                                                                    );
                                                                    setTimeout(() => {
                                                                        setProgressStatusRedeemCB(
                                                                            5
                                                                        );
                                                                    }, 700);
                                                                    setTimeout(() => {
                                                                        setLoading(true);
                                                                        router.push(
                                                                            `/openshelf/shelf`
                                                                        );
                                                                    }, 1000);
                                                                }
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
                        </ProgressStatus>
                    </ProgressStatus>
                </ProgressStatus>
            </ProgressStatus>
        )
    );
};

export default DynamicAddressPage;
