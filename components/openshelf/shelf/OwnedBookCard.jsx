import {useState, useEffect} from "react";
import {executeQuery} from "../../../utils/apolloClient";
import PreviewBookCoverPage from "../../common/PreviewBookCoverPage";
import LoadingAnimation from "../../common/LoadingAnimation";

const OwnedBookCard = ({editionId, copyUid, owner}) => {
    const [copy, setCopy] = useState();
    const [rentRecords, setRentRecords] = useState();
    const [loading, setLoading] = useState(true);

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
                        }
                    }
                    rentRecord{
                    	rentStartDate
                    	flowRate
                    }
                    onRent
                }
                rentRecords(where: {rentedFrom: "${owner}", copyId: "${copyUid}", edition: "${editionId}", rentEndDate_not: null}){
                    id
                    flowRate
    				rentStartDate
    				rentEndDate
                }
            }`);
            console.log(book);
            setCopy(book.copy);
            setRentRecords(book.rentRecords);
            setLoading(false);
        };
        getData();
    }, []);

    return !loading ? (
        <div className="group h-80 w-60 snap-start rounded bg-transparent">
            <div
                className={`absolute h-72 w-60 origin-bottom-right overflow-visible rounded shadow-md transition duration-300 ease-in-out group-hover:-translate-x-60 group-hover:shadow-xl`}>
                <div className="h-full w-full">
                    <PreviewBookCoverPage src={copy.edition.editionMetadata.coverPage} />
                </div>
            </div>
            <div className="flex h-72 w-[480px] items-center justify-start rounded border-2 border-gray-500">
                <div className="h-full w-1/2">
                    <div className="flex h-full flex-col p-3 text-gray-700">
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
            </div>
        </div>
    ) : (
        <LoadingAnimation />
    );
};

export default OwnedBookCard;
