import Image from "next/image";
import {
    ArrowNarrowLeftIcon,
    DocumentRemoveIcon,
    ExclamationCircleIcon
} from "@heroicons/react/solid";
import {useState, useEffect} from "react";
import ChipInputField from "../../components/ChipInputField";
import PreviewBook from "../../components/PreviewBook";
import {publish} from "../../controllers/Publisher";
import {useSignerContext} from "../../contexts/Signer";
import {useRouter} from "next/router";
import ProgressStatus from "../../components/ProgressStatus";
import List from "../../components/List";
import {useThemeContext} from "../../contexts/Theme";
import {useLoadingContext} from "../../contexts/Loading";

const Publish = () => {
    const {setTheme} = useThemeContext();
    const {setLoading} = useLoadingContext();

    useEffect(() => {
        setTheme("od");
        setLoading(false);

        return () => {
            setLoading(true);
        };
    }, []);

    const statusTags = [
        "Uploading e-book file",
        "Extracting Cover Page",
        "Uploading Book MetaData",
        "Transaction Request Initiated",
        "Transaction Successful"
    ];

    const languageOptions = [
        "English",
        "Hindi",
        "French",
        "Spanish",
        "German",
        "Russian",
        "Chinese",
        "Japanese",
        "Korean",
        "Dutch",
        "Portuguese",
        "Italian",
        "Other"
    ];

    const {signer} = useSignerContext();
    const router = useRouter();
    const [req, setReq] = useState(false);
    const [supplyLimited, setSupplyLimited] = useState(false);
    const [genres, setGenres] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [selectedLanguageOption, setSelectedLanguageOption] = useState(languageOptions[0]);
    const [selectedBookFile, setSelectedBookFile] = useState();
    const [selectedBookLocalURL, setSelectedBookLocalURL] = useState("");
    const [progressStatus, setProgressStatus] = useState(0);
    const [validSubmitAttempt, setValidSubmitAttempt] = useState(false);
    const [invalidSubmitAttempt, setInvalidSubmitAttempt] = useState(false);

    const setProgressStatusCB = statusCode => {
        setProgressStatus(statusCode);
    };

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
                keywords: keywords,
                copyrights: e.target.copyrights.value,
                language: selectedLanguageOption,
                edition: e.target.edition.value ? e.target.edition.value : 0,
                prequel: e.target.prequel.value ? e.target.prequel.value : 0,
                supplyLimited: supplyLimited,
                pricedBookSupplyLimit: supplyLimited ? e.target.pricedBookSupplyLimit.value : 0,
                file: selectedBookFile
            };
            await publish(signer.signer, newBook, setProgressStatusCB);
            setTimeout(() => {
                router.push(`/opendesk`);
            }, 1000);
            console.log(newBook);
        } else {
            setInvalidSubmitAttempt(true);
        }
    };

    return (
        <>
            {validSubmitAttempt && (
                <ProgressStatus status={progressStatus} statusTags={statusTags} />
            )}
            <section className="flex h-screen w-screen items-center justify-center">
                <div className="absolute right-10 top-8 flex cursor-pointer justify-center">
                    <ArrowNarrowLeftIcon
                        className="h-6 w-6"
                        onClick={() => {
                            router.back();
                        }}
                    />
                </div>
                <form
                    className="no-scrollbar grid h-full w-full grid-cols-2 gap-20 overflow-scroll px-32 py-12 accent-od-400"
                    onSubmit={handleSubmit}>
                    <div className="m-auto h-full max-w-full overflow-scroll rounded border-2 border-od-400 shadow-lg shadow-od-300/50">
                        {selectedBookFile ? (
                            <>
                                <div
                                    className="sticky cursor-pointer"
                                    onClick={() => {
                                        setSelectedBookFile(null);
                                        setSelectedBookLocalURL("");
                                        setInvalidSubmitAttempt(false);
                                    }}>
                                    <div className="flex cursor-pointer items-center space-x-2 rounded bg-red-200 px-3 py-2 text-sm hover:bg-red-300">
                                        <DocumentRemoveIcon className="h-4 w-4" />
                                        <p>Remove this e-book file</p>
                                    </div>
                                </div>
                                <div className="flex h-full w-full justify-center overflow-y-scroll">
                                    <PreviewBook url={selectedBookLocalURL} />
                                </div>
                            </>
                        ) : (
                            <>
                                {invalidSubmitAttempt && (
                                    <div
                                        className="sticky cursor-pointer"
                                        onClick={() => {
                                            setSelectedBookFile(null);
                                            setSelectedBookLocalURL("");
                                        }}>
                                        <div className="flex cursor-pointer items-center space-x-2 rounded bg-red-200 px-3 py-2 text-sm hover:bg-red-300">
                                            <ExclamationCircleIcon className="h-4 w-4" />
                                            <p>No file selected</p>
                                        </div>
                                    </div>
                                )}
                                <label className="flex h-full w-full justify-center">
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
                                    <div className="group flex h-full w-full cursor-pointer items-center justify-center bg-gray-50">
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
                            </>
                        )}
                    </div>
                    <div className="flex w-full flex-col justify-center space-y-2.5 px-10">
                        <div className="mx-auto text-2xl font-semibold tracking-wide text-od-500">
                            Enter Book Details
                        </div>
                        <div className="flex flex-col-reverse">
                            <input
                                name="title"
                                type="text"
                                placeholder="Title"
                                title="Enter title of the book."
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
                                title="Enter subtitle of the book."
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
                                title="Enter description of the book."
                                className="input-text peer h-24"
                                autoComplete="off"
                                required={req}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div
                            className="flex flex-col-reverse"
                            title="Enter genres (separated by comma) of the book">
                            <ChipInputField
                                chips={genres}
                                setChips={setGenres}
                                placeholder={"Genre"}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div
                            className="flex flex-col-reverse"
                            title="Enter keywords (separated by comma) for the book.">
                            <ChipInputField
                                chips={keywords}
                                setChips={setKeywords}
                                placeholder={"Keywords"}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div className="flex flex-col-reverse">
                            <textarea
                                name="copyrights"
                                placeholder="Copyrights"
                                title="Enter copyrights for the book."
                                className="input-text peer"
                                autoComplete="off"
                                value={`Copyright © ${new Date().getFullYear()}`}
                                required={req}
                            />
                            <span className="peer-input-text">{"|"}</span>
                        </div>
                        <div className="flex w-full flex-row space-x-2">
                            <div className="flex w-full flex-col-reverse">
                                <input
                                    name="edition"
                                    type="number"
                                    placeholder="Edition"
                                    title="Enter the Book ID of previous Edition."
                                    className="input-text peer"
                                    autoComplete="off"
                                    step="1"
                                    min="0"
                                />
                                <span className="peer-input-text">{"|"}</span>
                            </div>
                            <div className="flex w-full flex-col-reverse">
                                <input
                                    name="prequel"
                                    type="number"
                                    placeholder="Prequel"
                                    title="Enter the Book ID of the prequel."
                                    className="input-text peer"
                                    autoComplete="off"
                                    step="1"
                                    min="0"
                                />
                                <span className="peer-input-text">{"|"}</span>
                            </div>
                            <div
                                className="flex w-full flex-col-reverse"
                                title="Select language of the book.">
                                <List
                                    selected={selectedLanguageOption}
                                    setSelected={setSelectedLanguageOption}
                                    options={languageOptions}
                                />
                                <span className="peer-input-text">{"|"}</span>
                            </div>
                        </div>
                        <div className="flex w-full flex-row space-x-2">
                            <div className="flex w-full flex-col-reverse">
                                <input
                                    name="price"
                                    type="number"
                                    placeholder="Price"
                                    className="input-text peer font-semibold"
                                    title="Enter launch Price of the book."
                                    autoComplete="off"
                                    step="any"
                                    min="0"
                                    required={req}
                                />
                                <span className="peer-input-text">{"|"}</span>
                            </div>
                            <div className="flex w-full flex-col-reverse">
                                <input
                                    name="royalty"
                                    type="number"
                                    placeholder="Royalty"
                                    className="input-text peer font-semibold"
                                    title="Enter royalty for the book."
                                    autoComplete="off"
                                    step="any"
                                    min="0"
                                    required={req}
                                />
                                <span className="peer-input-text">{"|"}</span>
                            </div>
                            <div className="flex w-1/5 flex-col-reverse">
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
                                    title="Check to limit supply."
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
                                    title="Enter supply limit of the book."
                                    autoComplete="off"
                                    step="1"
                                    min="0"
                                    disabled={!supplyLimited}
                                    required={supplyLimited && req}
                                />
                                <span className="peer-input-text">{"|"}</span>
                            </div>
                        </div>
                        <div className="w-full pt-3">
                            <button
                                className="button-od w-full"
                                type="Submit"
                                onClick={() => {
                                    setReq(true);
                                }}>
                                Publish
                            </button>
                        </div>
                    </div>
                </form>
            </section>
        </>
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
