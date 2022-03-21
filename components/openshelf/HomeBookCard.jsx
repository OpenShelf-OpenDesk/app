import {useRouter} from "next/router";
import PreviewBookCoverPage from "../common/PreviewBookCoverPage";
import LoadingAnimation from "../common/LoadingAnimation";
import {useLoadingContext} from "../../contexts/Loading";
import {useEffect, useState} from "react";
import {executeQuery} from "../../utils/apolloClient";

const HomeBookCard = ({id}) => {
    const router = useRouter();
    const [book, setBook] = useState();
    const {setLoading} = useLoadingContext();

    useEffect(() => {
        const getData = async () => {
            const bookData = await executeQuery(`
            query{
                edition(id: "${id}"){
                    contributions(orderBy:share, orderDirection: desc ,first:1){
                        contributor{
                            id
                            name
                        }
                    }
                    editionMetadata{
                        coverPage
                        title
                        subtitle
                        description
                        genres
                    }
                }
            }`);
            if (bookData) {
                setBook(bookData.edition);
                setLoading(false);
            }
        };
        if (id) {
            getData();
        }
    }, [id]);

    return book && book.contributions.length > 0 ? (
        <div className="group h-80 w-60 snap-start rounded bg-white">
            <div
                className={`absolute h-72 w-60 origin-bottom-right overflow-visible rounded shadow-md transition duration-500 ease-in-out group-hover:z-10 group-hover:-translate-y-56 group-hover:shadow-xl`}>
                <div className="h-full w-full bg-white">
                    <PreviewBookCoverPage src={book.editionMetadata.coverPage} />
                </div>
            </div>
            <div className="h-72 w-60 rounded border-2 border-transparent pt-20 group-hover:border-gray-500">
                <div className="flex h-full flex-col p-3 text-gray-700">
                    <p className="break-all font-semibold leading-tight">
                        {book.editionMetadata.title.length > 45
                            ? `${book.editionMetadata.title.substring(0, 45)}...`
                            : book.editionMetadata.title}
                    </p>
                    {book.contributions[0].contributor.name && (
                        <p className="mt-1 flex-wrap self-end text-sm font-semibold">
                            ~&nbsp;
                            {book.contributions[0].contributor.name}
                        </p>
                    )}
                    <p className="mt-3 break-all text-sm font-medium leading-tight">
                        {book.editionMetadata.description.length > 110
                            ? `${book.editionMetadata.description.substring(0, 105)}...`
                            : book.editionMetadata.description}
                    </p>
                    <div className="flex h-full w-full justify-end">
                        <button
                            className={`button-os h-7 self-end rounded p-1 px-3 text-center text-xs font-semibold text-white`}
                            onClick={() => {
                                setLoading(true);
                                router.push({
                                    pathname: `/openshelf/book/[address]`,
                                    query: {address: id}
                                });
                            }}>
                            More &#10142;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex h-72 w-60 items-center justify-center rounded border border-gray-400 bg-white">
            <LoadingAnimation />
        </div>
    );
};

export default HomeBookCard;
