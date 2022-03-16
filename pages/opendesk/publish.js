import Image from "next/image";
import {
    ArrowNarrowLeftIcon,
    DocumentRemoveIcon,
    ExclamationCircleIcon,
    PlusIcon,
    XCircleIcon
} from "@heroicons/react/solid";
import {useState, useEffect} from "react";
import {useRouter} from "next/router";
import ChipInputField from "../../components/common/ChipInputField";
import PreviewBook from "../../components/opendesk/PreviewBook";
import ProgressStatus from "../../components/common/ProgressStatus";
import List from "../../components/common/List";
import {launchNewBook} from "../../controllers/Publisher";
import {useSignerContext} from "../../contexts/Signer";
import {useThemeContext} from "../../contexts/Theme";
import {useLoadingContext} from "../../contexts/Loading";
import Identicon from "../../components/common/Identicon";
import {addContributors} from "../../controllers/Edition";
import LoadingAnimation from "../../components/common/LoadingAnimation";

const Publish = () => {
    const {setTheme} = useThemeContext();
    const {setLoading} = useLoadingContext();
    const {signer} = useSignerContext();
    const router = useRouter();

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
        "Book Launched Successfully",
        "Adding Contributors",
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

    const [req, setReq] = useState(false);
    const [contributorReq, setContributorReq] = useState(false);
    const [contributorAddForm, setContributorAddForm] = useState(false);
    const [supplyLimited, setSupplyLimited] = useState(false);
    const [genres, setGenres] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [contributors, setContributors] = useState([]);
    const [copyrights, setCopyrights] = useState(`Copyright © ${new Date().getFullYear()}`);
    const [selectedLanguageOption, setSelectedLanguageOption] = useState(languageOptions[0]);
    const [selectedBookFile, setSelectedBookFile] = useState();
    const [selectedBookLocalURL, setSelectedBookLocalURL] = useState("");
    const [progressStatus, setProgressStatus] = useState(0);
    const [validSubmitAttempt, setValidSubmitAttempt] = useState(0);
    // [0 - false , 1 - true(book Selected), (-1) - No file Selected]
    const [newContributorRole, setNewContributorRole] = useState("");
    const [newContributorAddress, setNewContributorAddress] = useState("");
    const [newContributorShare, setNewContributorShare] = useState("");
    const [bookLoading, setBookLoading] = useState(true);

    useEffect(() => {
        setContributors(() => {
            return [{contributorAddress: signer.address, share: 100, role: "Author & Publisher"}];
        });
    }, [signer]);

    const setProgressStatusCB = statusCode => {
        setProgressStatus(statusCode);
    };

    const handleContributorSubmit = async e => {
        const newContributor = {
            contributorAddress: newContributorAddress,
            share: newContributorShare,
            role: newContributorRole
        };
        setContributors(state => {
            return [...state, newContributor];
        });
        setContributorAddForm(false);
        setContributorReq(false);
        setNewContributorAddress("");
        setNewContributorRole("");
        setNewContributorShare("");
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (selectedBookFile) {
            setValidSubmitAttempt(1);
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
                supplyLimited: supplyLimited,
                pricedBookSupplyLimit: supplyLimited ? e.target.pricedBookSupplyLimit.value : 0,
                file: selectedBookFile
            };
            const editionAddress = await launchNewBook(signer.signer, newBook, setProgressStatusCB);
            await addContributors(signer.signer, editionAddress, contributors, setProgressStatusCB);
            setTimeout(() => {
                setLoading(true);
                router.push(`/opendesk`);
            }, 1000);
            console.log(newBook);
        } else {
            setValidSubmitAttempt(-1);
        }
    };

    return (
        <>
            <ProgressStatus status={progressStatus} statusTags={statusTags}>
                <section className={`flex h-screen w-screen items-center justify-center`}>
                    <div className="absolute right-10 top-8 flex cursor-pointer justify-center">
                        <ArrowNarrowLeftIcon
                            className="h-6 w-6"
                            onClick={() => {
                                router.back();
                            }}
                        />
                    </div>
                    <form
                        className="no-scrollbar grid h-full w-full grid-cols-2 gap-14 overflow-scroll px-28 py-12 accent-od-400"
                        onSubmit={handleSubmit}>
                        <div className="m-auto h-[85%] max-w-full overflow-scroll rounded border-2 border-od-400 shadow-lg shadow-od-300/50">
                            {selectedBookFile ? (
                                <>
                                    <div
                                        className="sticky cursor-pointer"
                                        onClick={() => {
                                            setSelectedBookFile(null);
                                            setSelectedBookLocalURL("");
                                            setValidSubmitAttempt(0);
                                            setBookLoading(true);
                                        }}>
                                        <div className="flex cursor-pointer items-center space-x-2 rounded bg-red-200 px-3 py-2 text-sm hover:bg-red-300">
                                            <DocumentRemoveIcon className="h-4 w-4" />
                                            <p>Remove this e-book file</p>
                                        </div>
                                    </div>
                                    <div className="relative flex h-full w-[556px] justify-center overflow-y-scroll">
                                        {bookLoading && (
                                            <div className="absolute z-10 flex h-full w-full items-center justify-center bg-white">
                                                <LoadingAnimation />
                                            </div>
                                        )}
                                        <PreviewBook
                                            url={selectedBookLocalURL}
                                            setLoading={setBookLoading}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {validSubmitAttempt === -1 && (
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
                                                setBookLoading(true);
                                            }}
                                        />
                                        <div className="group flex h-full w-full cursor-pointer items-center justify-center bg-gray-50">
                                            <Image
                                                src={`/od/save_to_bookmarks.svg`}
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
                            <div className="flex w-full flex-row justify-between space-x-5">
                                <div className="flex w-full space-x-1">
                                    <div className="mt-4 flex w-full items-center space-x-2">
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
                                    <div className="flex w-full flex-col-reverse">
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
                            <div
                                className="flex flex-col-reverse"
                                title="Enter genres (separated by comma) of the book">
                                <ChipInputField
                                    chips={genres}
                                    setChips={setGenres}
                                    placeholder={"Genre (romance, comedy,...)"}
                                />
                                <span className="peer-input-text">{"|"}</span>
                            </div>
                            <div
                                className="flex flex-col-reverse"
                                title="Enter keywords (separated by comma) for the book.">
                                <ChipInputField
                                    chips={keywords}
                                    setChips={setKeywords}
                                    placeholder={"Keywords (music, cooking, ...)"}
                                />
                                <span className="peer-input-text">{"|"}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="peer-input-text">{"|"}</span>
                                <div className="input-text flex flex-col justify-center">
                                    <span className="flex-0 text-sm font-medium text-gray-400">
                                        Contributors
                                    </span>
                                    <div className="flex w-full items-center justify-center space-x-7 px-5">
                                        <div className="flex snap-x items-center justify-between space-x-5 overflow-x-scroll px-5 pt-3">
                                            {contributors.map((contributor, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="group flex snap-start flex-col items-center justify-center text-xs">
                                                        <div className="relative mb-1">
                                                            <Identicon
                                                                seed={
                                                                    contributor.contributorAddress
                                                                }
                                                                scale={7}
                                                                className="transition duration-200 ease-in-out group-hover:scale-95"
                                                            />
                                                            {contributors.length > 1 && (
                                                                <XCircleIcon
                                                                    className="absolute -right-5 -top-3 z-10 h-5 w-5 scale-0 cursor-pointer text-od-500 transition duration-100 ease-in-out group-hover:scale-100"
                                                                    onClick={() => {
                                                                        setContributors(state => {
                                                                            return state.filter(
                                                                                _ => {
                                                                                    return (
                                                                                        _.contributorAddress !==
                                                                                        contributor.contributorAddress
                                                                                    );
                                                                                }
                                                                            );
                                                                        });
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <span className="text-center">
                                                            {contributor.contributorAddress.substring(
                                                                0,
                                                                5
                                                            )}
                                                            .....
                                                            {contributor.contributorAddress.substring(
                                                                contributor.contributorAddress
                                                                    .length - 3
                                                            )}
                                                        </span>
                                                        <span className="text-center">
                                                            {contributor.role}
                                                        </span>
                                                        <span className="text-center">
                                                            {contributor.share}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {contributorAddForm ? (
                                            <div className="flex w-[53%] flex-col justify-center space-y-1 pb-2">
                                                <div className="flex w-full flex-col-reverse">
                                                    <input
                                                        name="address"
                                                        value={newContributorAddress}
                                                        onChange={e => {
                                                            setNewContributorAddress(
                                                                e.target.value
                                                            );
                                                        }}
                                                        type="text"
                                                        placeholder="Contributor Address"
                                                        title="Enter address of the contributor."
                                                        className="input-text peer w-full"
                                                        autoComplete="off"
                                                        required={contributorReq}
                                                    />
                                                    <span className="peer-input-text">{"|"}</span>
                                                </div>
                                                <div className="flex w-full space-x-2">
                                                    <div className="flex w-1/3 flex-col-reverse">
                                                        <input
                                                            name="share"
                                                            value={newContributorShare}
                                                            onChange={e => {
                                                                setNewContributorShare(
                                                                    e.target.value
                                                                );
                                                            }}
                                                            type="number"
                                                            placeholder="Share"
                                                            title="Enter share of the contributor in the book."
                                                            className="input-text peer w-full"
                                                            autoComplete="off"
                                                            step="any"
                                                            min="0"
                                                            required={contributorReq}
                                                        />
                                                        <span className="peer-input-text">
                                                            {"|"}
                                                        </span>
                                                    </div>
                                                    <div className="flex w-full flex-col-reverse">
                                                        <input
                                                            name="role"
                                                            value={newContributorRole}
                                                            onChange={e => {
                                                                setNewContributorRole(
                                                                    e.target.value
                                                                );
                                                            }}
                                                            type="text"
                                                            placeholder="Role"
                                                            title="Enter role of the contributor in the book."
                                                            className="input-text peer w-full"
                                                            autoComplete="off"
                                                            required={contributorReq}
                                                        />
                                                        <span className="peer-input-text">
                                                            {"|"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 pt-3">
                                                    <button
                                                        className="button-od w-full bg-black/50 hover:bg-black/60"
                                                        onClick={() => {
                                                            setContributorAddForm(false);
                                                            setContributorReq(false);
                                                        }}>
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="button-od w-full"
                                                        onClick={() => {
                                                            if (
                                                                newContributorAddress === "" ||
                                                                newContributorRole === "" ||
                                                                newContributorShare === ""
                                                            ) {
                                                                setContributorReq(true);
                                                            } else {
                                                                handleContributorSubmit();
                                                            }
                                                        }}>
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="flex cursor-pointer items-center justify-center rounded bg-od-500/[0.1] p-5 transition duration-200 ease-in-out hover:scale-95"
                                                onClick={() => {
                                                    setContributorAddForm(true);
                                                }}>
                                                <PlusIcon className="h-8 w-8 text-od-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse">
                                <textarea
                                    name="copyrights"
                                    placeholder="Copyrights"
                                    title="Enter copyrights for the book."
                                    className="input-text peer"
                                    autoComplete="off"
                                    value={copyrights}
                                    required={req}
                                    onChange={e => {
                                        setCopyrights(e.target.value);
                                    }}
                                />
                                <span className="peer-input-text">{"|"}</span>
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
            </ProgressStatus>
        </>
    );
};

export default Publish;
