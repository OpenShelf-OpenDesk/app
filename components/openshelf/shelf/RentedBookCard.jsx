import {useState, useEffect} from "react";
import {executeQuery} from "../../../utils/apolloClient";
import PreviewBookCoverPage from "../../common/PreviewBookCoverPage";
import LoadingAnimation from "../../common/LoadingAnimation";
import BigNumber from "bignumber.js";
import {useSignerContext} from "../../../contexts/Signer";
import {useLoadingContext} from "../../../contexts/Loading";
import {returnBook} from "../../../controllers/Rentor";

const RentedBookCard = ({id}) => {
    const {signer} = useSignerContext();
    const {setLoading: setMainLoading} = useLoadingContext();
    const [copy, setCopy] = useState();
    const [intervalId, setIntervalId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalRentPaid, setTotalRentPaid] = useState();

    useEffect(() => {
        const getData = async () => {
            const rentRecordData = await executeQuery(`
            query{
                rentRecord(id: "${id}"){
                  flowRate
                  copyUid
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
            setCopy(rentRecordData.rentRecord);
            setLoading(false);
        };
        getData();
    }, [signer, id]);

    useEffect(() => {
        copy && calculateTotalRentPaid(true);
        return () => {
            calculateTotalRentPaid(false);
        };
    }, [copy]);

    const calculateTotalRentPaid = async on => {
        if (!on) {
            clearInterval(intervalId);
            return;
        }
        let flowRate = copy.flowRate / 1000;
        const currentOutFlowSoFar = flowRate * (new Date().getTime() - copy.rentStartDate * 1000);
        setTotalRentPaid(currentOutFlowSoFar);

        if (on) {
            const id = setInterval(() => {
                setTotalRentPaid(state => {
                    const x = state + flowRate * 100;
                    return x;
                });
            }, 100);
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
                            <span className="text-xs font-medium">Rent Started On</span>
                            <div className="rounded py-0.5 text-right font-mono text-base font-semibold">
                                {new Date(copy.rentStartDate * 1000).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                                &nbsp;
                                {Math.abs(
                                    new Date(copy.rentStartDate * 1000).getHours() == 12
                                        ? new Date(copy.rentStartDate * 1000).getHours()
                                        : new Date(copy.rentStartDate * 1000).getHours() % 12
                                )}
                                :{new Date(copy.rentStartDate * 1000).getMinutes()}&nbsp;
                                {new Date(copy.rentStartDate * 1000).getHours() >= 12 ? "PM" : "AM"}
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
                        <div className="flex w-full items-center justify-between">
                            <span className="text-xs font-medium">Total Rent Paid</span>
                            <div className="flex items-center space-x-2 rounded font-mono text-base font-semibold">
                                <span>
                                    {new BigNumber(parseInt(totalRentPaid))
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
                        <button
                            className="button-os bg-orange-400 px-4 text-xs hover:bg-orange-500"
                            onClick={async () => {
                                await returnBook(signer.signer, copy.edition.id, copy.copyUid);
                            }}>
                            Return Book
                        </button>
                        <button
                            className="button-od bg-gray-600 px-3 text-xs hover:bg-gray-700"
                            onClick={() => {
                                setMainLoading(true);
                                router.push(
                                    {
                                        pathname: `/openshelf/reader`,
                                        query: {
                                            editionAddress: copy.edition.id,
                                            copyUid: copy.copyUid
                                        }
                                    },
                                    `/openshelf/reader`
                                );
                            }}>
                            Read
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex h-[300px] items-center justify-center rounded border-2 border-gray-500">
            <LoadingAnimation />
        </div>
    );
};

export default RentedBookCard;
