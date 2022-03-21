import BigNumber from "bignumber.js";
import {useEffect, useState} from "react";
import {useSignerContext} from "../../../contexts/Signer";
import {transfer} from "../../../controllers/Edition";
import {offerAccepted} from "../../../controllers/Exchange";
import {executeQuery} from "../../../utils/apolloClient";
import LoadingAnimation from "../../common/LoadingAnimation";
import {useRouter} from "next/router";

const CopyOffersTable = ({editionId, copyUid, setShowOffers, royalty, setProgressStatusCB}) => {
    const {signer} = useSignerContext();
    const router = useRouter();
    const [copyOffers, setCopyOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOfferer, setSelectedOfferer] = useState();

    useEffect(() => {
        const getData = async () => {
            setLoading(true);

            const offers = await executeQuery(`
            query{
                offers(where: { copy: "${
                    copyUid + editionId
                }"}, orderBy:offerPrice, orderDirection:desc){
                        offerer
                        offerPrice
                }
            }`);
            setCopyOffers(offers.offers);
            setLoading(false);
            setSelectedOfferer();
        };
        getData();
    }, [signer, editionId, copyUid]);

    return (
        <div className="group relative h-full w-full">
            <div
                className={`absolute inset-0 flex h-full w-full items-center justify-center rounded  transition-all duration-300 ease-in-out ${
                    loading ? "z-10 opacity-100" : "-z-10 opacity-0"
                }`}>
                <LoadingAnimation />
            </div>
            <div
                className={`flex h-full w-full rounded bg-transparent transition duration-500 ease-in-out ${
                    !loading ? "z-10 opacity-100" : "-z-10 opacity-0"
                }`}>
                {!loading && (
                    <>
                        {!copyOffers.length > 0 ? (
                            <div className="m-auto text-lg font-medium">No Offers available.</div>
                        ) : (
                            <div className="h-full min-w-full">
                                <div className="my-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium">
                                            Royalty to Author :
                                        </span>
                                        <div className="flex items-center space-x-1">
                                            <span className="font-mono font-semibold">
                                                {new BigNumber(royalty).shiftedBy(-18).toFixed(3)}
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
                                    <button
                                        className="button-os w-1/3 px-3"
                                        onClick={async () => {
                                            if (selectedOfferer) {
                                                await transfer(
                                                    signer.signer,
                                                    editionId,
                                                    selectedOfferer.toLowerCase(),
                                                    copyUid,
                                                    royalty,
                                                    setProgressStatusCB
                                                );
                                                await offerAccepted(
                                                    signer.signer,
                                                    editionId,
                                                    copyUid,
                                                    selectedOfferer.toLowerCase(),
                                                    setProgressStatusCB
                                                );
                                                setTimeout(() => {
                                                    setProgressStatusCB(6);
                                                }, 700);
                                                setTimeout(() => {
                                                    setLoading(true);
                                                    router.reload();
                                                }, 1000);
                                                setTimeout(() => {
                                                    setShowOffers(false);
                                                }, 1500);
                                            } else {
                                                alert("Select an Offer to Accept !");
                                            }
                                        }}>
                                        Accept Offer
                                    </button>
                                </div>
                                <div className="max-h-[180px] overflow-x-hidden rounded">
                                    <table className="min-w-full table-fixed divide-y divide-gray-200 rounded">
                                        <thead className="overscroll-none rounded bg-gray-300">
                                            <tr>
                                                <th scope="col"></th>
                                                <th
                                                    scope="col"
                                                    className="py-2 px-2 text-left text-xs font-semibold tracking-wider text-gray-700">
                                                    Offerer
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="py-2 px-2 text-left text-xs font-semibold tracking-wider text-gray-700">
                                                    Price
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 overflow-y-scroll bg-white">
                                            {copyOffers.map((offer, index) => {
                                                return (
                                                    <tr className="hover:bg-gray-100" key={index}>
                                                        <td className="w-4 pl-2.5">
                                                            <div className="flex items-center">
                                                                <input
                                                                    id={`copy${index + 1}`}
                                                                    type="radio"
                                                                    name="offers"
                                                                    value={offer.offerer.toLowerCase()}
                                                                    className="h-3 w-3"
                                                                    onClick={e => {
                                                                        setSelectedOfferer(
                                                                            e.target.value
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="break-all p-2 font-mono text-sm font-medium text-gray-900">
                                                            {offer.offerer.toLowerCase()}
                                                        </td>
                                                        <td className="break-all p-2 text-center text-sm font-medium text-gray-900">
                                                            <div className="flex items-center space-x-1">
                                                                <span className="font-mono font-semibold">
                                                                    {new BigNumber(offer.offerPrice)
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
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CopyOffersTable;
``;
