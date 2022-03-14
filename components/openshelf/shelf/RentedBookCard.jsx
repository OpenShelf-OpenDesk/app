import {useState, useEffect} from "react";
import {executeQuery} from "../../../utils/apolloClient";
import PreviewBookCoverPage from "../../common/PreviewBookCoverPage";
import LoadingAnimation from "../../common/LoadingAnimation";
import BigNumber from "bignumber.js";
import {useSignerContext} from "../../../contexts/Signer";

const RentedBookCard = ({id}) => {
    const {signer} = useSignerContext();
    const [copy, setCopy] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            const book = await executeQuery(`
            query{
                rentRecords(id: "${id}"){
                  flowRate
                  copyId
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
                    }
                }
                  rentStartDate
                }
              }`);
            setCopy(book.rentRecords[0]);
            setLoading(false);
        };
        getData();
    }, [signer, id]);

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
                                {new Date(parseInt(copy.rentStartDate) * 1000).toLocaleString(
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
                            <span className="text-xs font-medium">Total Rent Paid</span>
                            <div className="flex items-center space-x-2 rounded font-mono text-base font-semibold">
                                <span>
                                    {new BigNumber(
                                        parseInt(
                                            copy.flowRate *
                                                (new Date().getTime() / 1000 - copy.rentStartDate)
                                        )
                                    )
                                        .shiftedBy(-18)
                                        .toFixed(5)}
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
                            <span className="relative text-xs font-medium">Flow Rate</span>
                            <div className="flex items-center rounded font-mono text-base font-semibold">
                                <span>
                                    {new BigNumber(copy.flowRate * 60 * 60 * 24 * 30)
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
                                        <span className="align-sub">x</span>/month
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* <div className="invisible flex justify-between space-x-2 opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100">
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
                    </div> */}
                </div>
            </div>
        </div>
    ) : (
        <div className="flex h-[300px] w-[480px] items-center justify-center rounded border-2 border-gray-500">
            <LoadingAnimation />
        </div>
    );
};

export default RentedBookCard;
