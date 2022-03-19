import BigNumber from "bignumber.js";
import {useEffect, useState} from "react";
import {useSignerContext} from "../../contexts/Signer";
import {cancelOffer, makeOffer} from "../../controllers/Exchange";
import {executeQuery} from "../../utils/apolloClient";
import LoadingAnimation from "../common/LoadingAnimation";

const EditionOffersTable = ({editionAddress, refresh, setRefresh}) => {
    const {signer} = useSignerContext();
    const [editionOffers, setEditionOffers] = useState([]);
    const [placedOffers, setPlacedOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offerReq, setOfferReq] = useState(false);
    const [showPlacedOffers, setShowPlacedOffers] = useState(false);
    const [newOfferPrice, setNewOfferPrice] = useState("");
    const [selectedCopyUid, setSelectedCopyUid] = useState();

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const offers = await executeQuery(`
            query{
                copies(where:{edition: "${editionAddress}"}){
                    id
                    copyUid
                    offers(orderBy:offerPrice, orderDirection:desc){
                      offerPrice
                      offerer
                    }
                }
            }`);
            setEditionOffers(offers.copies);
            const placedOffers = await executeQuery(`
            query{
                copies(where:{edition: "${editionAddress}"}){
                    id
                    copyUid
                    offers(where:{offerer: "${signer.address.toLowerCase()}"},orderBy:offerPrice, orderDirection:desc){
                      offerPrice
                      offerer
                    }
                }
            }`);
            setPlacedOffers(placedOffers.copies);
            setSelectedCopyUid();
            setLoading(false);
        };
        getData();
    }, [signer, editionAddress, refresh]);

    return (
        <div className="group relative h-full w-full">
            <div
                className={`absolute inset-0 flex h-full w-full items-center justify-center rounded  transition-all duration-300 ease-in-out ${
                    loading ? "z-10 opacity-100" : "-z-10 opacity-0"
                }`}>
                <LoadingAnimation />
            </div>
            <div
                className={`flex h-full rounded bg-transparent transition duration-500 ease-in-out ${
                    !loading ? "z-10 opacity-100" : "-z-10 opacity-0"
                }`}>
                {!loading && (
                    <>
                        {!editionOffers.length > 0 ? (
                            <div className="m-auto text-lg font-medium">
                                No Copies available to make offers.
                            </div>
                        ) : (
                            <div className="flex w-full flex-col">
                                <div className="flex w-full justify-between">
                                    <button
                                        className={`w-full cursor-pointer rounded-tl py-3 px-8 text-center text-sm focus:outline-none ${
                                            showPlacedOffers
                                                ? "bg-gray-100 font-medium text-gray-400 hover:bg-gray-200 active:scale-95"
                                                : "bg-gray-500 font-semibold tracking-wider text-white duration-200 hover:bg-gray-600"
                                        }`}
                                        onClick={() => {
                                            setShowPlacedOffers(false);
                                            setSelectedCopyUid();
                                        }}>
                                        Make Offer
                                    </button>
                                    <button
                                        className={`w-full cursor-pointer rounded-tl py-3 px-8 text-center text-sm focus:outline-none ${
                                            showPlacedOffers
                                                ? "bg-gray-500 font-semibold tracking-wider text-white duration-200 hover:bg-gray-600"
                                                : "bg-gray-100 font-medium text-gray-400 hover:bg-gray-200 active:scale-95"
                                        }`}
                                        onClick={() => {
                                            setShowPlacedOffers(true);
                                            setSelectedCopyUid();
                                        }}>
                                        Placed Offers
                                    </button>
                                </div>
                                {showPlacedOffers ? (
                                    <div className="h-full min-w-full px-5 py-2.5">
                                        <div className="my-4">
                                            <button
                                                className="button-os w-1/3 bg-gray-500 px-3 text-white hover:bg-gray-600 focus:bg-gray-600"
                                                onClick={async () => {
                                                    if (selectedCopyUid) {
                                                        await cancelOffer(
                                                            signer.signer,
                                                            editionAddress,
                                                            selectedCopyUid
                                                        );
                                                        setTimeout(() => {
                                                            setRefresh(state => {
                                                                return state + 1;
                                                            });
                                                        }, 1500);
                                                    } else {
                                                        alert("Select a Copy to Delete Offer !");
                                                    }
                                                }}>
                                                Delete Offer
                                            </button>
                                        </div>
                                        <div className="max-h-[400px] overflow-x-hidden rounded">
                                            <table className="min-w-full table-fixed divide-y divide-gray-200 rounded">
                                                <thead className="overscroll-none rounded bg-gray-300">
                                                    <tr>
                                                        <th scope="col"></th>
                                                        <th
                                                            scope="col"
                                                            className="py-2 pl-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                                            Copy ID
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="py-2 pl-4 text-left text-xs font-semibold tracking-wider text-gray-700">
                                                            Offer Price
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 overflow-y-scroll bg-white">
                                                    {placedOffers.map((copy, index) => {
                                                        if (copy.offers.length > 0) {
                                                            return (
                                                                <tr
                                                                    className="hover:bg-gray-100"
                                                                    key={index}>
                                                                    <td className="w-4 pl-4">
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                id={`copy${
                                                                                    index + 1
                                                                                }`}
                                                                                type="radio"
                                                                                name="placedOffers"
                                                                                value={copy.copyUid}
                                                                                className="h-3 w-3"
                                                                                onClick={e => {
                                                                                    setSelectedCopyUid(
                                                                                        e.target
                                                                                            .value
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="break-all py-2 px-4 font-mono text-sm font-medium text-gray-900">
                                                                        {copy.id}
                                                                    </td>
                                                                    <td className="break-all py-2 px-4 text-center font-mono text-sm font-semibold text-gray-900">
                                                                        <div className="flex items-center space-x-1">
                                                                            <span>
                                                                                {new BigNumber(
                                                                                    copy.offers[0].offerPrice
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
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full min-w-full px-5 py-2.5">
                                        <div className="my-4">
                                            <div className="flex items-center justify-between space-x-3">
                                                <div className="flex w-full justify-between space-x-3">
                                                    <input
                                                        name="offerPrice"
                                                        type="number"
                                                        placeholder="Offer Price"
                                                        title="Enter Offer Price of the book."
                                                        className="input-text w-full"
                                                        autoComplete="off"
                                                        value={newOfferPrice}
                                                        onChange={e => {
                                                            setNewOfferPrice(e.target.value);
                                                        }}
                                                        required={offerReq}
                                                        step="any"
                                                        min="0"
                                                    />
                                                    <button
                                                        className="button-os w-[45%] bg-gray-500 px-3 text-white hover:bg-gray-600 focus:bg-gray-600"
                                                        onClick={async () => {
                                                            setOfferReq(true);
                                                            if (
                                                                parseFloat(newOfferPrice) > 0 &&
                                                                selectedCopyUid
                                                            ) {
                                                                await makeOffer(
                                                                    signer.signer,
                                                                    editionAddress,
                                                                    selectedCopyUid,
                                                                    newOfferPrice
                                                                );
                                                                setNewOfferPrice("");
                                                                setOfferReq(false);
                                                                setTimeout(() => {
                                                                    setRefresh(state => {
                                                                        return state + 1;
                                                                    });
                                                                }, 1500);
                                                            } else {
                                                                alert(
                                                                    "Select a Copy to Place Offer !"
                                                                );
                                                            }
                                                        }}>
                                                        Place Offer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="max-h-[400px] overflow-x-hidden rounded">
                                            <table className="min-w-full table-fixed divide-y divide-gray-200 rounded">
                                                <thead className="overscroll-none rounded bg-gray-300">
                                                    <tr>
                                                        <th scope="col"></th>
                                                        <th
                                                            scope="col"
                                                            className="py-2 pl-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                                                            Copy ID
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="py-2 pl-4 text-left text-xs font-semibold tracking-wider text-gray-700">
                                                            Offers Made
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="py-2 pl-4 text-left text-xs font-semibold tracking-wider text-gray-700">
                                                            Highest Offer
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 overflow-y-scroll bg-white">
                                                    {editionOffers.map((copy, index) => {
                                                        return (
                                                            <tr
                                                                className="hover:bg-gray-100"
                                                                key={index}>
                                                                <td className="w-4 pl-4">
                                                                    <div className="flex items-center">
                                                                        <input
                                                                            id={`copy${index + 1}`}
                                                                            type="radio"
                                                                            name="copies"
                                                                            value={copy.copyUid}
                                                                            className="h-3 w-3"
                                                                            onClick={e => {
                                                                                setSelectedCopyUid(
                                                                                    e.target.value
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="break-all py-2 px-4 font-mono text-sm font-medium text-gray-900">
                                                                    {copy.id}
                                                                </td>
                                                                <td className="break-all py-2 px-4 text-center font-mono text-sm font-semibold text-gray-900">
                                                                    {copy.offers.length}
                                                                </td>
                                                                <td className="break-all py-2 px-4 text-center font-mono text-sm font-semibold text-gray-900">
                                                                    {copy.offers.length > 0 ? (
                                                                        <div className="flex items-center space-x-1">
                                                                            <span>
                                                                                {new BigNumber(
                                                                                    copy.offers[0].offerPrice
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
                                                                    ) : (
                                                                        0
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EditionOffersTable;
``;
