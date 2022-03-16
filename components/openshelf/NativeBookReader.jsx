import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useSignerContext} from "../../contexts/Signer";
import {useLoadingContext} from "../../contexts/Loading";
import {
    ArrowNarrowLeftIcon,
    PlusIcon,
    MinusIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "@heroicons/react/solid";
import PreviewBook from "../openshelf/PreviewBook";
import LoadingAnimation from "../common/LoadingAnimation";
import {uri} from "../../controllers/Edition";

const NativeBookReader = ({editionAddress, copyUid}) => {
    const router = useRouter();
    const {signer} = useSignerContext();
    const [loadingState, setLoadingState] = useState(true);
    const {setLoading} = useLoadingContext();
    const [bookURI, setbookURI] = useState();
    const [zoomPercent, setZoomPercent] = useState(100);
    const [numOfPages, setNumOfPages] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (editionAddress && copyUid) {
            uri(signer.signer, editionAddress, copyUid)
                .then(bookURI => {
                    setbookURI(bookURI);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(true);
                    router.push(`/openshelf/shelf`);
                });
        } else {
            setLoading(true);
            router.push(`/openshelf/shelf`);
        }

        return () => {
            setLoading(true);
        };
    }, []);

    return (
        <>
            <div className={`h-full w-full`}>
                <div className="fixed right-20 top-10 z-50 flex cursor-pointer justify-center rounded-full border bg-gray-100 p-3 hover:shadow-md">
                    <ArrowNarrowLeftIcon
                        className="h-6 w-6"
                        onClick={() => {
                            setLoading(true);
                            router.push({
                                pathname: `/openshelf/shelf`
                            });
                        }}
                    />
                </div>
                <div className="fixed left-20 top-10 z-50 flex items-center justify-center space-x-2.5">
                    <div className="cursor-pointer rounded-full border bg-gray-100 p-3 hover:shadow-md">
                        <MinusIcon
                            className="h-6 w-6"
                            onClick={() => {
                                setZoomPercent(zoomPercent - 5);
                            }}
                        />
                    </div>
                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p>{zoomPercent + " %"}</p>
                    </div>
                    <div className="cursor-pointer rounded-full border bg-gray-100 p-3 hover:shadow-md">
                        <PlusIcon
                            className="h-6 w-6"
                            onClick={() => {
                                setZoomPercent(zoomPercent + 5);
                            }}
                        />
                    </div>
                </div>
                <div className="fixed right-20 bottom-10 z-50 flex items-center justify-center space-x-2.5">
                    <div className="cursor-pointer rounded-full border bg-gray-100 p-3 hover:shadow-md">
                        <ChevronLeftIcon
                            className="h-6 w-6"
                            onClick={() => {
                                if (page > 1) {
                                    setPage(page - 1);
                                }
                            }}
                        />
                    </div>
                    <div className="flex rounded-lg bg-gray-50 px-5 py-2">
                        <p>{page + " / " + numOfPages}</p>
                    </div>
                    <div className="cursor-pointer rounded-full border bg-gray-100 p-3 hover:shadow-md">
                        <ChevronRightIcon
                            className="h-6 w-6"
                            onClick={() => {
                                if (page < numOfPages) {
                                    setPage(page + 1);
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="flex min-h-screen w-full items-center justify-center overflow-scroll bg-gray-50">
                    {loadingState && (
                        <div className="absolute z-10 flex h-[500px] w-[600px] items-center justify-center bg-white">
                            <LoadingAnimation />
                        </div>
                    )}
                    <PreviewBook
                        url={`https://${bookURI}.ipfs.dweb.link`}
                        width={600}
                        height={500}
                        scale={zoomPercent / 100}
                        setNumOfPages={setNumOfPages}
                        page={page}
                        setLoading={setLoadingState}
                    />
                </div>
            </div>
        </>
    );
};

export default NativeBookReader;
