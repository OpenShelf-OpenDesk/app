import {PlusCircleIcon} from "@heroicons/react/outline";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useSignerContext} from "../../../contexts/Signer";
import {executeQuery} from "../../../utils/apolloClient";
import LoadingAnimation from "../../common/LoadingAnimation";
import PreviewBookCoverPage from "../../common/PreviewBookCoverPage";
import {useLoadingContext} from "../../../contexts/Loading";
import {eBookVoucherGenerator} from "../../../utils/eBookVoucherGenerator";
import BigNumber from "bignumber.js";
import {
    PencilAltIcon,
    CheckIcon,
    TrashIcon,
    DuplicateIcon,
    ExternalLinkIcon
} from "@heroicons/react/solid";
import {
    delimitSupply,
    increaseMarketSupply,
    limitSupply,
    updatePrice,
    updateRoyalty,
    withdrawRevenue
} from "../../../controllers/Edition";
import {ethers} from "ethers";
import ProgressStatus from "../../common/ProgressStatus";

const PublishedBookCard = ({contributionId}) => {
    const router = useRouter();
    const {signer} = useSignerContext();
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(1);
    const {setLoading: setMainLoading} = useLoadingContext();
    const [book, setBook] = useState();
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [voucherReq, setVoucherReq] = useState(false);
    const [voucherGenerated, setVoucherGenerated] = useState();
    const [editReq, setEditReq] = useState(false);
    const [editPrice, setEditPrice] = useState(false);
    const [newPrice, setNewPrice] = useState("");
    const [editRoyalty, setEditRoyalty] = useState(false);
    const [newRoyalty, setNewRoyalty] = useState("");
    const [editSupply, setEditSupply] = useState(false);
    const [increaseSupplyBy, setIncreaseSupplyBy] = useState("");
    const [progressStatusWithdraw, setProgressStatusWithdraw] = useState(0);

    const setProgressStatusWithdrawCB = statusCode => {
        setProgressStatusWithdraw(statusCode);
    };

    const statusTagsWithdraw = [
        "Transaction Initiated",
        "Withdrawing Revenue",
        "Distributing among the Contributors",
        "Transaction Successful"
    ];

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            setVoucherReq(false);
            const book = await executeQuery(`
            query{
                contribution(id:"${contributionId}"){
                    role
                    share
                    edition{
                        id
                        bookId
                        publisherAddress
                        price
                        royalty
                        supplyLimited
                        pricedBookSupplyLimit
                        revisedOn
                        salesRevenue
                        royaltyRevenue
                        distributionRevenue
                        transferVolume
                        withdrawableRevenue
                        pricedBookPrinted
                        distributedBooksPrinted
                        editionMetadata{
                            title
                            subtitle
                            description
                            coverPage
                        }
                    }
                }
            }`);
            console.log(book);
            setBook(book.contribution);
            setLoading(false);
        };
        getData();
    }, [signer, contributionId, refresh]);

    const handleCreateVoucher = async e => {
        e.preventDefault();
        setVoucherReq(true);
        if (e.target.address.value.length > 0 && e.target.price.value >= 0) {
            console.log(e.target.address.value, e.target.price.value);
            setVoucherLoading(true);
            const voucherGenerator = new eBookVoucherGenerator(
                book.edition.id,
                book.edition.bookId,
                signer.signer
            );
            voucherGenerator
                .createVoucher(e.target.address.value, e.target.price.value)
                .then(voucher => {
                    setVoucherGenerated(voucher);
                    setTimeout(() => {
                        setVoucherLoading(false);
                        setVoucherReq(false);
                    }, 1000);
                });
        }
    };

    return (
        <ProgressStatus status={progressStatusWithdraw} statusTags={statusTagsWithdraw}>
            <div className="group relative h-[400px] w-[43%]">
                <div
                    className={`absolute inset-0 flex h-full w-full items-center justify-center rounded border-2 border-gray-500 transition-all duration-300 ease-in-out ${
                        loading ? "z-10 opacity-100" : "-z-10 opacity-0"
                    }`}>
                    <LoadingAnimation />
                </div>
                <div
                    className={`h-full w-full rounded bg-transparent transition duration-500 ease-in-out ${
                        !loading ? "z-10 opacity-100" : "-z-10 opacity-0"
                    }`}>
                    {!loading && (
                        <>
                            <div className="group relative flex h-full w-full items-center rounded border-2 border-gray-500 bg-white">
                                <div
                                    className={`absolute z-10 origin-top-left -translate-x-1 overflow-visible rounded bg-white opacity-100 shadow-md transition duration-300 ease-in-out group-hover:opacity-0`}>
                                    <div className="h-full w-full rounded">
                                        <PreviewBookCoverPage
                                            src={book.edition.editionMetadata.coverPage}
                                            height={400}
                                            width={300}
                                        />
                                    </div>
                                </div>
                                {signer.address.toLowerCase() != book.edition.publisherAddress ? (
                                    <div className="flex h-full min-w-[300px] max-w-[300px] -translate-x-1 items-center justify-center pl-5">
                                        <span className="text-center text-lg font-medium text-gray-700">
                                            Contact <br />
                                            <span className="break-all text-xl font-semibold">
                                                {book.edition.publisherAddress}
                                            </span>
                                            <br />
                                            to create voucher.
                                        </span>
                                    </div>
                                ) : (
                                    <>
                                        {voucherLoading ? (
                                            <div className="flex h-full min-w-[300px] max-w-[300px] -translate-x-1 items-center justify-center pl-5">
                                                <LoadingAnimation />
                                            </div>
                                        ) : voucherGenerated ? (
                                            <div className="flex h-full min-w-[300px] max-w-[300px] -translate-x-1 flex-col justify-evenly pl-5">
                                                <p className="text-center text-lg font-semibold text-od-500">
                                                    Book Voucher Details
                                                </p>
                                                <div className="flex flex-col space-y-5">
                                                    <div className="flex flex-col space-y-2">
                                                        <textarea
                                                            name="bookVoucher"
                                                            type="text"
                                                            placeholder="Book Voucher Signature"
                                                            title="Enter description of the book."
                                                            className="input-text peer rounded"
                                                            autoComplete="off"
                                                            readOnly
                                                            rows={5}
                                                            value={voucherGenerated.signature}
                                                        />
                                                        <div className="flex justify-end">
                                                            <button
                                                                className="flex justify-center space-x-1.5 rounded border border-od-500 px-2 py-0.5"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(
                                                                        voucherGenerated.signature
                                                                    );
                                                                }}>
                                                                <p className="text-xs font-medium text-od-500">
                                                                    Copy
                                                                </p>
                                                                <DuplicateIcon className="h-4 w-4 text-od-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="w-full pt-5">
                                                        <button
                                                            className="button-od w-full"
                                                            onClick={() => {
                                                                setVoucherGenerated(null);
                                                            }}>
                                                            Create New Voucher
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex h-full min-w-[300px] max-w-[300px] -translate-x-1 flex-col justify-evenly pl-5">
                                                <div className="w-full text-center text-lg font-semibold text-od-500">
                                                    Create Book Voucher
                                                </div>
                                                <form
                                                    className="w-full"
                                                    onSubmit={e => {
                                                        handleCreateVoucher(e);
                                                    }}>
                                                    <div className="flex w-full flex-col-reverse pt-2">
                                                        <input
                                                            name="address"
                                                            type="text"
                                                            placeholder="Receiver's Address"
                                                            title="Enter Receiver's Address of the voucher."
                                                            className="input-text peer w-full"
                                                            autoComplete="off"
                                                            required={voucherReq}
                                                        />
                                                        <span className="peer-input-text">
                                                            {"|"}
                                                        </span>
                                                    </div>
                                                    <div className="flex w-full flex-row space-x-1 pt-2">
                                                        <div className="flex w-full flex-col-reverse">
                                                            <input
                                                                name="price"
                                                                type="number"
                                                                placeholder="Price"
                                                                className="input-text peer w-full font-semibold"
                                                                title="Enter voucher price."
                                                                autoComplete="off"
                                                                step="any"
                                                                min="0"
                                                                required={voucherReq}
                                                            />
                                                            <span className="peer-input-text">
                                                                {"|"}
                                                            </span>
                                                        </div>
                                                        <div className="flex w-1/3 flex-col-reverse">
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
                                                    <div className="flex w-full justify-center py-7">
                                                        <button
                                                            type="submit"
                                                            className="button-od w-full">
                                                            Create Voucher
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="flex h-full w-full flex-col justify-evenly px-7">
                                    <ExternalLinkIcon
                                        className="invisible absolute top-2 right-2 h-5 w-5 cursor-pointer text-gray-700 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100"
                                        onClick={() => {
                                            setMainLoading(true);
                                            router.push(`/openshelf/book/${book.edition.id}`);
                                        }}
                                    />
                                    <div className="text-center text-xl font-semibold">
                                        {book.edition.editionMetadata.title}
                                    </div>
                                    <div className="grid w-full grid-cols-3 gap-3">
                                        <div className="my-2 flex flex-col items-center">
                                            {editPrice ? (
                                                <div className="flex w-3/5 items-center">
                                                    <div className="relative flex items-center space-x-1">
                                                        <input
                                                            name="newPrice"
                                                            type="number"
                                                            placeholder="Price"
                                                            className="input-text w-full py-0.5 px-1.5 text-xs font-semibold"
                                                            title="Enter new Price of the book."
                                                            autoComplete="off"
                                                            step="any"
                                                            min="0"
                                                            value={newPrice}
                                                            onChange={e => {
                                                                setNewPrice(e.target.value);
                                                            }}
                                                            required={editReq}
                                                        />
                                                        <CheckIcon
                                                            className="h-6 w-6 cursor-pointer text-od-500"
                                                            onClick={async () => {
                                                                setEditReq(true);
                                                                if (newPrice > 0) {
                                                                    setLoading(true);
                                                                    await updatePrice(
                                                                        signer.signer,
                                                                        book.edition.id,
                                                                        newPrice
                                                                    );
                                                                    setTimeout(() => {
                                                                        setRefresh(stat => {
                                                                            return stat + 1;
                                                                        });
                                                                        setEditPrice(false);
                                                                    }, 1000);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-1">
                                                    <p className="font-mono text-base font-semibold">
                                                        {new BigNumber(book.edition.price)
                                                            .shiftedBy(-18)
                                                            .toFixed(3)}
                                                    </p>
                                                    <span>
                                                        <img
                                                            src="/matic.svg"
                                                            height={14}
                                                            width={14}
                                                            alt="Matic Token Symbol"
                                                        />
                                                    </span>
                                                </div>
                                            )}
                                            <span className="flex items-center space-x-0.5">
                                                <p className="text-center text-xs text-gray-400">
                                                    Price
                                                </p>
                                                {signer.address.toLowerCase() ===
                                                    book.edition.publisherAddress &&
                                                    !editPrice &&
                                                    !editRoyalty &&
                                                    !editSupply && (
                                                        <PencilAltIcon
                                                            className="invisible h-3.5 w-3.5 -translate-y-0.5 cursor-pointer text-gray-500 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100"
                                                            onClick={() => {
                                                                setNewPrice("");
                                                                setEditReq(false);
                                                                setEditPrice(true);
                                                            }}
                                                        />
                                                    )}
                                            </span>
                                        </div>
                                        <div className="my-2 flex flex-col items-center">
                                            {editRoyalty ? (
                                                <div className="flex w-3/5 items-center">
                                                    <div className="relative flex items-center space-x-1">
                                                        <input
                                                            name="newRoyalty"
                                                            type="number"
                                                            placeholder="Royalty"
                                                            className="input-text w-full py-0.5 px-1.5 text-xs font-semibold"
                                                            title="Enter new Royalty of the book."
                                                            autoComplete="off"
                                                            step="any"
                                                            min="0"
                                                            value={newRoyalty}
                                                            onChange={e => {
                                                                setNewRoyalty(e.target.value);
                                                            }}
                                                            required={editReq}
                                                        />
                                                        <CheckIcon
                                                            className="h-6 w-6 cursor-pointer text-od-500"
                                                            onClick={async () => {
                                                                setEditReq(true);
                                                                if (newRoyalty >= 0) {
                                                                    setLoading(true);
                                                                    await updateRoyalty(
                                                                        signer.signer,
                                                                        book.edition.id,
                                                                        newRoyalty
                                                                    );
                                                                    setTimeout(() => {
                                                                        setRefresh(stat => {
                                                                            return stat + 1;
                                                                        });
                                                                        setEditRoyalty(false);
                                                                    }, 1000);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-1">
                                                    <p className="font-mono text-base font-semibold">
                                                        {new BigNumber(book.edition.royalty)
                                                            .shiftedBy(-18)
                                                            .toFixed(3)}
                                                    </p>
                                                    <span>
                                                        <img
                                                            src="/matic.svg"
                                                            height={14}
                                                            width={14}
                                                            alt="Matic Token Symbol"
                                                        />
                                                    </span>
                                                </div>
                                            )}
                                            <span className="flex items-center space-x-0.5">
                                                <p className="text-center text-xs text-gray-400">
                                                    Royalty
                                                </p>
                                                {signer.address.toLowerCase() ===
                                                    book.edition.publisherAddress &&
                                                    !editRoyalty &&
                                                    !editPrice &&
                                                    !editSupply && (
                                                        <PencilAltIcon
                                                            className="invisible h-3.5 w-3.5 -translate-y-0.5 cursor-pointer text-gray-500 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100"
                                                            onClick={() => {
                                                                setNewRoyalty("");
                                                                setEditReq(false);
                                                                setEditRoyalty(true);
                                                            }}
                                                        />
                                                    )}
                                            </span>
                                        </div>
                                        <div className="my-2 flex flex-col items-center">
                                            {editSupply ? (
                                                <div className="flex w-[75%] items-center">
                                                    <div className="relative flex items-center space-x-1">
                                                        <input
                                                            name="increaseSupply"
                                                            type="number"
                                                            placeholder="Add Supply"
                                                            className="input-text w-full py-0.5 px-1.5 text-xs font-semibold"
                                                            title="Enter value to increase Supply Limit of the book."
                                                            autoComplete="off"
                                                            step="any"
                                                            min="0"
                                                            value={increaseSupplyBy}
                                                            onChange={e => {
                                                                setIncreaseSupplyBy(e.target.value);
                                                            }}
                                                            required={editReq}
                                                        />
                                                        <CheckIcon
                                                            className="h-6 w-6 cursor-pointer text-od-500"
                                                            onClick={async () => {
                                                                setEditReq(true);
                                                                if (
                                                                    book.edition.supplyLimited &&
                                                                    increaseSupplyBy > 0
                                                                ) {
                                                                    setLoading(true);
                                                                    await increaseMarketSupply(
                                                                        signer.signer,
                                                                        book.edition.id,
                                                                        increaseSupplyBy
                                                                    );
                                                                    setTimeout(() => {
                                                                        setRefresh(stat => {
                                                                            return stat + 1;
                                                                        });
                                                                        setEditSupply(false);
                                                                    }, 1000);
                                                                } else if (
                                                                    !book.edition.supplyLimited &&
                                                                    increaseSupplyBy > 0
                                                                ) {
                                                                    setLoading(true);
                                                                    await limitSupply(
                                                                        signer.signer,
                                                                        book.edition.id
                                                                    );
                                                                    await increaseMarketSupply(
                                                                        signer.signer,
                                                                        book.edition.id,
                                                                        increaseSupplyBy
                                                                    );
                                                                    setTimeout(() => {
                                                                        setRefresh(stat => {
                                                                            return stat + 1;
                                                                        });
                                                                        setEditSupply(false);
                                                                    }, 1000);
                                                                }
                                                            }}
                                                        />
                                                        {book.edition.supplyLimited && (
                                                            <TrashIcon
                                                                className="h-6 w-6 cursor-pointer text-red-500"
                                                                onClick={async () => {
                                                                    setLoading(true);
                                                                    await delimitSupply(
                                                                        signer.signer,
                                                                        book.edition.id
                                                                    );
                                                                    setTimeout(() => {
                                                                        setRefresh(stat => {
                                                                            return stat + 1;
                                                                        });
                                                                        setEditSupply(false);
                                                                    }, 1000);
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="font-mono text-base font-semibold">
                                                    {book.edition.supplyLimited
                                                        ? book.edition.pricedBookSupplyLimit
                                                        : "Not Set"}
                                                </p>
                                            )}
                                            <span className="flex items-center space-x-0.5">
                                                <p className="text-center text-xs text-gray-400">
                                                    Supply Limit
                                                </p>
                                                {signer.address.toLowerCase() ===
                                                    book.edition.publisherAddress &&
                                                    !editRoyalty &&
                                                    !editPrice &&
                                                    !editSupply && (
                                                        <>
                                                            {book.edition.supplyLimited ? (
                                                                <PlusCircleIcon
                                                                    className="invisible h-4 w-4 -translate-y-0.5 cursor-pointer text-gray-600 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100"
                                                                    onClick={() => {
                                                                        setEditSupply("");
                                                                        setEditReq(false);
                                                                        setEditSupply(true);
                                                                    }}
                                                                />
                                                            ) : (
                                                                <PencilAltIcon
                                                                    className="invisible h-3.5 w-3.5 -translate-y-0.5 cursor-pointer text-gray-500 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100"
                                                                    onClick={() => {
                                                                        setEditSupply("");
                                                                        setEditReq(false);
                                                                        setEditSupply(true);
                                                                    }}
                                                                />
                                                            )}
                                                        </>
                                                    )}
                                            </span>
                                        </div>
                                        <div className="my-2 flex flex-col items-center">
                                            <div className="flex items-center space-x-1">
                                                <p className="font-mono text-base font-semibold">
                                                    {new BigNumber(book.edition.salesRevenue)
                                                        .shiftedBy(-18)
                                                        .toFixed(3)}
                                                </p>
                                                <span>
                                                    <img
                                                        src="/matic.svg"
                                                        height={14}
                                                        width={14}
                                                        alt="Matic Token Symbol"
                                                    />
                                                </span>
                                            </div>
                                            <p className="text-center text-xs text-gray-400">
                                                Sales Revenue
                                            </p>
                                        </div>
                                        <div className="my-2 flex flex-col items-center">
                                            <div className="flex items-center space-x-1">
                                                <p className="font-mono text-base font-semibold">
                                                    {new BigNumber(book.edition.royaltyRevenue)
                                                        .shiftedBy(-18)
                                                        .toFixed(3)}
                                                </p>
                                                <span>
                                                    <img
                                                        src="/matic.svg"
                                                        height={14}
                                                        width={14}
                                                        alt="Matic Token Symbol"
                                                    />
                                                </span>
                                            </div>
                                            <p className="text-center text-xs text-gray-400">
                                                Royalty Revenue
                                            </p>
                                        </div>
                                        <div className="my-2 flex flex-col items-center">
                                            <div className="flex items-center space-x-1">
                                                <p className="font-mono text-base font-semibold">
                                                    {new BigNumber(book.edition.distributionRevenue)
                                                        .shiftedBy(-18)
                                                        .toFixed(3)}
                                                </p>
                                                <span>
                                                    <img
                                                        src="/matic.svg"
                                                        height={14}
                                                        width={14}
                                                        alt="Matic Token Symbol"
                                                    />
                                                </span>
                                            </div>
                                            <p className="text-center text-xs text-gray-400">
                                                Distribution Revenue
                                            </p>
                                        </div>
                                        <div className="my-2 flex flex-col items-center">
                                            <p className="font-mono text-base font-semibold">
                                                {book.edition.transferVolume}
                                            </p>
                                            <p className="text-center text-xs text-gray-400">
                                                Transfer Volume
                                            </p>
                                        </div>
                                        <div className="my-2 flex flex-col items-center">
                                            <p className="font-mono text-base font-semibold">
                                                {book.edition.distributedBooksPrinted}
                                            </p>
                                            <p className="text-center text-xs text-gray-400">
                                                Distribution Books Printed
                                            </p>
                                        </div>
                                        <div className="my-2 flex flex-col items-center">
                                            <p className="font-mono text-base font-semibold">
                                                {book.edition.pricedBookPrinted}
                                            </p>
                                            <p className="text-center text-xs text-gray-400">
                                                Priced Books Printed
                                            </p>
                                        </div>
                                        <div className="my-2 flex flex-col items-center">
                                            <div className="flex items-center space-x-1">
                                                <p className="font-mono text-base font-semibold">
                                                    {new BigNumber(book.edition.withdrawableRevenue)
                                                        .shiftedBy(-18)
                                                        .toFixed(3)}
                                                </p>
                                                <span>
                                                    <img
                                                        src="/matic.svg"
                                                        height={14}
                                                        width={14}
                                                        alt="Matic Token Symbol"
                                                    />
                                                </span>
                                            </div>
                                            <p className="text-center text-xs text-gray-400">
                                                Withdrawable Revenue
                                            </p>
                                        </div>
                                        <div className="col-span-2 my-2 flex flex-col items-center">
                                            <div className="flex items-center space-x-1">
                                                <p className="font-mono text-2xl font-black">
                                                    {new BigNumber(
                                                        Number(book.edition.salesRevenue) +
                                                            Number(book.edition.royaltyRevenue) +
                                                            Number(book.edition.distributionRevenue)
                                                    )
                                                        .shiftedBy(-18)
                                                        .toFixed(4)}
                                                </p>
                                                <span>
                                                    <img
                                                        src="/matic.svg"
                                                        height={22}
                                                        width={22}
                                                        alt="Matic Token Symbol"
                                                    />
                                                </span>
                                            </div>
                                            <p className="text-center text-sm text-gray-500">
                                                Total Revenue
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`self-end opacity-0 transition duration-100 ease-in-out group-hover:opacity-100 ${
                                            signer.address.toLowerCase() !=
                                                book.edition.publisherAddress && "hidden"
                                        }`}>
                                        <button
                                            className="button-od"
                                            onClick={async () => {
                                                await withdrawRevenue(
                                                    signer.signer,
                                                    book.edition.id,
                                                    setProgressStatusWithdrawCB
                                                );
                                                setTimeout(() => {
                                                    setProgressStatusWithdrawCB(5);
                                                }, 700);
                                                setTimeout(() => {
                                                    setLoading(true);
                                                    router.reload();
                                                }, 1000);
                                            }}>
                                            Withdraw Revenue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ProgressStatus>
    );
};

export default PublishedBookCard;
