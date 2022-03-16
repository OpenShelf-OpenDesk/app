import {executeQuery} from "../../../utils/apolloClient";
import {useEffect, useState} from "react";
import {useSignerContext} from "../../../contexts/Signer";
import Image from "next/image";
import LoadingAnimation from "../../common/LoadingAnimation";
import DistributedBookCard from "./DistributedBookCard";

const DistributedBooks = () => {
    const {signer} = useSignerContext();
    const [distributedBooks, setDistributedbooks] = useState([]);
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
            setDistributedbooks(bookData.distributedCopies);
            setLoading(false);
        };
        getData();
        return () => {
            setLoading(true);
        };
    }, [signer]);

    return (
        <div className="h-screen w-full rounded bg-os-500/[0.05] p-10">
            {!loading ? (
                distributedBooks.length > 0 ? (
                    <div className="grid grid-cols-3 gap-10">
                        {distributedBooks.map((copy, index) => {
                            return (
                                <DistributedBookCard
                                    key={index}
                                    id={copy.id}
                                    owner={signer.address.toLowerCase()}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center">
                        <Image
                            src="/undraw_blank_canvas_re_2hwy.svg"
                            width={300 * 2}
                            height={200 * 2}
                            layout="fixed"
                            className="h-full"
                            alt="No books in shelf"
                        />
                        <div className="p-10">
                            <p className="text-xl font-semibold text-gray-700">Shelf is Empty</p>
                        </div>
                    </div>
                )
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <LoadingAnimation />
                </div>
            )}
        </div>
    );
};

export default DistributedBooks;
