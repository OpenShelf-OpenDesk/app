import {DuplicateIcon, ExternalLinkIcon} from "@heroicons/react/solid";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useSignerContext} from "../../../contexts/Signer";
import {executeQuery} from "../../../utils/apolloClient";
import LoadingAnimation from "../../common/LoadingAnimation";
import PreviewBookCoverPage from "../../common/PreviewBookCoverPage";
import {useLoadingContext} from "../../../contexts/Loading";
import {eBookVoucherGenerator} from "../../../utils/eBookVoucherGenerator";
import BigNumber from "bignumber.js";

const PublishedBookCard = ({contributionId}) => {
    const router = useRouter();
    const {signer} = useSignerContext();
    const [loading, setLoading] = useState(true);
    const {setLoading: setMainLoading} = useLoadingContext();
    const [book, setBook] = useState();
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [voucherReq, setVoucherReq] = useState(false);
    const [voucherGenerated, setVoucherGenerated] = useState();

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
    }, [signer, contributionId]);

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
        <div className="group relative h-[400px] w-full">
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
                            {voucherLoading ? (
                                <div className="flex h-full min-w-[300px] items-center justify-center pl-5">
                                    <LoadingAnimation />
                                </div>
                            ) : voucherGenerated ? (
                                <div className="flex h-full min-w-[300px] -translate-x-1 flex-col justify-evenly pl-5">
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
                                <div className="flex h-full min-w-[300px] -translate-x-1 flex-col justify-evenly pl-5">
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
                                            <span className="peer-input-text">{"|"}</span>
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
                                                <span className="peer-input-text">{"|"}</span>
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
                                                <span className="peer-input-text">{"|"}</span>
                                            </div>
                                        </div>
                                        <div className="flex w-full justify-center py-7">
                                            <button type="submit" className="button-od w-full">
                                                Create Voucher
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            <div className="flex h-full w-full flex-col justify-between space-y-5 px-7 pb-7">
                                <ExternalLinkIcon
                                    className="invisible absolute top-2 right-2 h-5 w-5 cursor-pointer text-gray-700 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100"
                                    onClick={() => {
                                        setMainLoading(true);
                                        router.push(`/openshelf/book/${book.edition.id}`);
                                    }}
                                />
                                <div className="text-left text-xl font-semibold">
                                    {book.edition.editionMetadata.title}
                                </div>
                                <div className="grid w-full grid-cols-3 gap-3">
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">Price</p>
                                    </div>
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">Royalty</p>
                                    </div>
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">Supply Limit</p>
                                    </div>
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">Sales Revenue</p>
                                    </div>
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">Royalty Revenue</p>
                                    </div>
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Distribution Revenue
                                        </p>
                                    </div>
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">Transfer Volume</p>
                                    </div>
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Withdrawable Revenue
                                        </p>
                                    </div>
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Priced Books Printed
                                        </p>
                                    </div>
                                    <div className="my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Distribution Books Printed
                                        </p>
                                    </div>
                                    <div className="col-span-2 my-2 flex flex-col items-center">
                                        <p className="text-base font-semibold">
                                            {new BigNumber(book.edition.price)
                                                .shiftedBy(-18)
                                                .toFixed(4)}
                                        </p>
                                        <p className="text-xs text-gray-400">Total Sales Revenue</p>
                                    </div>
                                </div>
                                <div className="self-end">
                                    <button className="button-od">Withdraw Revenue</button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PublishedBookCard;
