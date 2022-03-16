import {useState, useEffect} from "react";
import {executeQuery} from "../../../utils/apolloClient";
import PreviewBookCoverPage from "../../common/PreviewBookCoverPage";
import LoadingAnimation from "../../common/LoadingAnimation";
import {useSignerContext} from "../../../contexts/Signer";
import {useLoadingContext} from "../../../contexts/Loading";
import {useRouter} from "next/router";

const DistributedBookCard = ({id}) => {
    const router = useRouter();
    const {signer} = useSignerContext();
    const {setLoading: setMainLoading} = useLoadingContext();
    const [copy, setCopy] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(id);
        const getData = async () => {
            const distributedCopyData = await executeQuery(`
            query{
                distributedCopy(id: "${id}"){
                    copyUid
                    receivedOn
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
                }
              }`);
            console.log(distributedCopyData);
            setCopy(distributedCopyData.distributedCopy);
            setLoading(false);
        };
        getData();
    }, [signer, id]);

    return !loading ? (
        <div className="group flex h-[300px] items-center rounded border-2 border-gray-500 bg-transparent">
            <div
                className={`h-[300px] w-64 -translate-x-1 overflow-visible rounded shadow-md transition duration-300 ease-in-out group-hover:scale-[1.03]`}>
                <div className="h-full w-full">
                    <PreviewBookCoverPage src={copy.edition.editionMetadata.coverPage} />
                </div>
            </div>
            <div className="mx-auto h-full w-64">
                <div className="flex flex-col justify-between space-y-2 py-5 px-3">
                    <div className="flex h-full flex-col justify-center text-gray-700">
                        <p className="break-all font-semibold leading-tight">
                            {copy.edition.editionMetadata.title.length > 70
                                ? `${copy.edition.editionMetadata.title.substring(0, 45)}...`
                                : copy.edition.editionMetadata.title}
                        </p>
                        {/* {copy.edition.contributions[0].contributor.name && (
                            <p className="mt-1 flex-wrap self-end text-sm font-semibold">
                                ~&nbsp;
                                {copy.edition.contributions[0].contributor.name}
                            </p>
                        )} */}
                        <p className="mt-1 flex-wrap self-end text-sm font-semibold">
                            ~ Chetan Bhagat
                        </p>
                        <p className="mt-3 break-all text-justify text-sm font-medium leading-tight">
                            {copy.edition.editionMetadata.description.length > 115
                                ? `${copy.edition.editionMetadata.description.substring(0, 300)}...`
                                : copy.edition.editionMetadata.description}
                        </p>
                    </div>
                    <div className="invisible flex justify-end opacity-0 transition duration-100 ease-in-out group-hover:visible group-hover:opacity-100">
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

export default DistributedBookCard;
