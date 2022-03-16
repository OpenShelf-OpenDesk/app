import {executeQuery} from "../../../utils/apolloClient";
import {useEffect, useState} from "react";
import {useSignerContext} from "../../../contexts/Signer";
import Image from "next/image";
import LoadingAnimation from "../../common/LoadingAnimation";
import DistributedBookCard from "./DistributedBookCard";

const DistributedBooks = () => {
    const {signer} = useSignerContext();
    const [distributedBooks, setDistributedBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const bookData = await executeQuery(`
            query{
                distributedCopies(where:{receiver: "${signer.address.toLowerCase()}"}, orderBy:receivedOn, orderDirection:desc){
                  id
                }
              }`);
            console.log(bookData);
            setDistributedBooks(bookData.distributedCopies);
            setLoading(false);
        };
        getData();
        return () => {
            setLoading(true);
        };
    }, [signer]);

    return (
        <div className="relative h-screen w-full rounded bg-os-500/[0.05] p-10">
            <div
                className={`h-full w-full transition duration-500 ease-in-out ${
                    !loading ? "opacity-100" : "opacity-0"
                }`}>
                {!loading && (
                    <div className="relative h-full">
                        <div
                            className={`grid grid-cols-3 gap-10 transition duration-500 ease-in-out ${
                                distributedBooks.length > 0 ? "opacity-100" : "opacity-0"
                            }`}>
                            {distributedBooks.length > 0 &&
                                distributedBooks.map((copy, index) => {
                                    return (
                                        <DistributedBookCard
                                            key={index}
                                            id={copy.id}
                                            owner={signer.address.toLowerCase()}
                                        />
                                    );
                                })}
                        </div>
                        <div
                            className={`flex h-full w-full flex-col items-center justify-center transition duration-500 ease-in-out ${
                                distributedBooks.length > 0 ? "opacity-0" : "opacity-100"
                            }`}>
                            <Image
                                src="/os/blank.svg"
                                width={300 * 2}
                                height={200 * 2}
                                layout="fixed"
                                className="h-full"
                                alt="No books in shelf"
                            />
                            <div className="mt-10">
                                <p className="text-xl font-semibold text-gray-700">
                                    Shelf is Empty
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div
                className={`absolute inset-0 flex h-full w-full items-center justify-center rounded transition-all duration-300 ease-in-out ${
                    loading ? "opacity-100" : "opacity-0"
                }`}>
                <LoadingAnimation />
            </div>
        </div>
    );
};

export default DistributedBooks;
