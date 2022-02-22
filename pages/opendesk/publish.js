import Image from "next/image";
import {
    ArrowNarrowLeftIcon,
    DocumentRemoveIcon,
    DocumentAddIcon,
    ExclamationCircleIcon
} from "@heroicons/react/solid";
import {useState} from "react";
import ChipInputField from "../../components/ChipInputField";
import PreviewBook from "../../components/PreviewBook";
import {publish} from "../../controllers/Publisher";
import {useSignerContext} from "../../contexts/Signer";
import {useRouter} from "next/router";

const Publish = () => {
    const {signer} = useSignerContext();
    const router = useRouter();
    const [req, setReq] = useState(false);
    const [supplyLimited, setSupplyLimited] = useState(false);
    const [genres, setGenres] = useState([]);
    const [selectedBookFile, setSelectedBookFile] = useState();
    const [selectedBookLocalURL, setSelectedBookLocalURL] = useState("");
    const [validSubmitAttempt, setValidSubmitAttempt] = useState(false);
    const [invalidSubmitAttempt, setInvalidSubmitAttempt] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        if (selectedBookFile) {
            setValidSubmitAttempt(true);
            const newBook = {
                title: e.target.title.value,
                subTitle: e.target.subtitle.value,
                description: e.target.description.value,
                price: e.target.price.value,
                royalty: e.target.royalty.value,
                currency: "MATIC",
                genres: genres,
                edition: e.target.edition.value,
                prequel: e.target.prequel.value,
                supplyLimited: supplyLimited,
                pricedBookSupplyLimit: supplyLimited ? e.target.pricedBookSupplyLimit.value : -1,
                file: selectedBookFile
            };
            await publish(signer.signer, newBook);
            setTimeout(() => {
                router.push(`/openshelf`);
            }, 500);
            console.log(newBook);
        } else {
            setInvalidSubmitAttempt(true);
        }
    };

    return (
        <section className="flex h-screen w-screen items-center justify-center">
            <p className="absolute right-10 top-8 flex cursor-pointer justify-center">
                <ArrowNarrowLeftIcon
                    className="h-6 w-6"
                    onClick={() => {
                        router.back();
                    }}
                />
            </p>
            <form
                className="flex h-full w-full items-center justify-evenly space-x-20 px-20 py-32 accent-od-400"
                onSubmit={handleSubmit}>
                <div className="h-full self-center overflow-scroll rounded border-2 border-od-400">
                    <label className="flex h-full w-full flex-col justify-center">
                        <input
                            name="ebook_file"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={e => {
                                setSelectedBookFile(e.target.files[0]);
                                const url = URL.createObjectURL(e.target.files[0]);
                                setSelectedBookLocalURL(url);
                            }}
                        />
                        <div className="group flex h-full w-full cursor-pointer items-center bg-gray-50">
                            <Image
                                src={`/undraw_add_document_re_mbjx.svg`}
                                layout="intrinsic"
                                height={618}
                                width={809 * 0.7}
                                className="scale-95 transform transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:scale-100"
                                priority={true}
                                alt="Upload book"
                            />
                        </div>
                    </label>
                </div>
                <div className="flex w-1/2 flex-col space-y-5">
                    <div className="flex flex-col-reverse">
                        <input
                            name="title"
                            type="text"
                            placeholder="Title"
                            className="input-text peer"
                            autoComplete="off"
                            required={req}
                        />
                        <span className="peer-input-text">{"|"}</span>
                    </div>
                    <div className="flex flex-col-reverse">
                        <input
                            name="subtitle"
                            type="text"
                            placeholder="Sub-title"
                            className="input-text peer"
                            autoComplete="off"
                            required={req}
                        />
                        <span className="peer-input-text">{"|"}</span>
                    </div>
                    <div className="flex flex-col-reverse">
                        <textarea
                            name="description"
                            type="text"
                            placeholder="Description"
                            className="input-text peer h-36"
                            autoComplete="off"
                            required={req}
                        />
                        <span className="peer-input-text">{"|"}</span>
                    </div>

                    <ChipInputField chips={genres} setChips={setGenres} placeholder={"Genre"} />
                    <div className="flex w-full flex-row space-x-5">
                        <div className="flex flex-1 flex-col-reverse">
                            <input
                                name="edition"
                                type="number"
                                placeholder="Edition"
                                className="input-text peer"
                                autoComplete="off"
                                step="1"
                                required={req}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div className="flex flex-1 flex-col-reverse">
                            <input
                                name="prequel"
                                type="number"
                                placeholder="Prequel"
                                className="input-text peer"
                                autoComplete="off"
                                step="1"
                                required={req}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                    </div>
                    <div className="flex w-full flex-row space-x-1">
                        <div className="flex flex-1 flex-col-reverse">
                            <input
                                name="price"
                                type="number"
                                placeholder="Price"
                                className="input-text peer"
                                autoComplete="off"
                                step="any"
                                required={req}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div className="flex flex-col-reverse">
                            <input
                                name="currency"
                                type="text"
                                placeholder="Currency"
                                className="input-text peer text-center font-semibold uppercase"
                                value="Matic"
                                autoComplete="off"
                                disabled
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                    </div>
                    <div className="flex w-full flex-row space-x-1">
                        <div className="flex flex-1 flex-col-reverse">
                            <input
                                name="royalty"
                                type="number"
                                placeholder="Royalty"
                                className="input-text peer"
                                autoComplete="off"
                                step="any"
                                required={req}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div className="flex flex-col-reverse">
                            <input
                                name="currency"
                                type="text"
                                placeholder="Currency"
                                className="input-text peer text-center font-semibold uppercase"
                                value="Matic"
                                autoComplete="off"
                                disabled
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                    </div>
                    <div className="flex w-full flex-row justify-between space-x-5">
                        <div className="mt-4 flex items-center space-x-2">
                            <input
                                id="supplyLimited"
                                name="supplyLimited"
                                type="checkbox"
                                className="text-lg"
                                onChange={() => {
                                    setSupplyLimited(state => !state);
                                }}
                            />
                            <label htmlFor="supplyLimited">Supply Limited ?</label>
                        </div>
                        <div className="flex flex-1 flex-col-reverse">
                            <input
                                name="pricedBookSupplyLimit"
                                type="number"
                                placeholder="Book Supply Limit"
                                className="input-text peer w-full"
                                autoComplete="off"
                                step="1"
                                disabled={!supplyLimited}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                    </div>
                    <button
                        className="button-od"
                        type="Submit"
                        onClick={() => {
                            setReq(true);
                        }}>
                        Publish
                    </button>
                </div>
            </form>
        </section>
    );
};

export default Publish;

// type BookMetaData @entity {
//     id: ID!
//     title: String!
//     subTitle: String!
//     language: String!
//     BigIntPublished: BigInt!
//     description: String!
//     copyrights: String!
//     keywords: [String!]!
//     fiction: Boolean!
//     genre: [String!]!
//     currency: String!
// }
