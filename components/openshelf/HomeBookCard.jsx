import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import BookCoverPagePreview from "../common/BookCoverPagePreview";
import LoadingAnimation from "../common/LoadingAnimation";

const HomeBookCard = ({book}) => {
    const router = useRouter();

    return book ? (
        <div className="group h-80 w-60 snap-start rounded bg-white">
            <div
                className={`absolute h-72 w-60 origin-bottom-right overflow-visible rounded shadow-md transition duration-500 ease-in-out group-hover:z-10 group-hover:-translate-y-56 group-hover:shadow-xl`}>
                <div className="h-full w-full bg-white">
                    <BookCoverPagePreview src={book.editionMetadata.coverPage} />
                </div>
            </div>
            <div className="h-72 w-60 rounded border-2 border-transparent pt-20 group-hover:border-gray-500">
                <div className="flex h-full flex-col p-3 text-gray-700">
                    <p className="break-all font-semibold leading-tight">
                        {book.editionMetadata.title.length > 70
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
                        {book.editionMetadata.description.length > 115
                            ? `${book.editionMetadata.description.substring(0, 105)}...`
                            : book.editionMetadata.description}
                    </p>
                    <div className="flex h-full w-full justify-end">
                        <button
                            className={`button-os h-7 self-end rounded p-1 px-3 text-center text-xs font-semibold text-white`}
                            onClick={() => {
                                // router.push(
                                //     {
                                //         pathname: `/OpenShelf/bookpreview`,
                                //         query: {bookdata: JSON.stringify(bookMetadata)}
                                //     },
                                //     `/OpenShelf/bookpreview`
                                // );
                            }}>
                            More &#10142;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="mr-8 flex h-72 w-60 items-center justify-center rounded border border-gray-400 bg-white">
            <LoadingAnimation />
        </div>
    );
};

export default HomeBookCard;
