import {executeQuery} from "../../../utils/apolloClient";
import {useEffect, useState} from "react";
import {useSignerContext} from "../../../contexts/Signer";
import OwnedBookCard from "./OwnedBookCard";

const OwnedBooks = ({data}) => {
    const {signer} = useSignerContext();
    const [ownedBooks, setOwnedBooks] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const bookData = await executeQuery(`
            query{
                copies(where:{owner: "${signer.address.toLowerCase()}"}, orderBy: purchasedOn, orderDirection: desc){
                    copyUid
                    edition{
                        id
                    }
                }
            }`);
            setOwnedBooks(bookData.copies);
        };
        getData();
    }, [signer]);

    return (
        <div className="h-screen w-full rounded bg-os-500/[0.05] p-10">
            <div className="grid grid-cols-3 gap-5">
                {ownedBooks.map((copy, index) => {
                    return (
                        <OwnedBookCard
                            key={index}
                            editionId={copy.edition.id}
                            copyUid={copy.copyUid}
                            owner={signer.address.toLowerCase()}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default OwnedBooks;
