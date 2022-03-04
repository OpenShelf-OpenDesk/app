import {useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
// import LoadingAnimation from "../common/LoadingAnimation";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PreviewBook = ({url, height, width, setNumOfPages, page, scale, setLoadingState}) => {
    const [numPages, setNumPages] = useState(0);
    // const [loading, setLoading] = useState(true);

    function onDocumentFullLoadSuccess({numPages}) {
        setNumOfPages(numPages);
        setTimeout(() => {
            setLoadingState(false);
        }, 1000);
    }

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }

    if (height && width && setNumOfPages && scale && page) {
        return (
            <Document
                file={url}
                options={{workerSrc: "/pdf.worker.min.js"}}
                onLoadSuccess={onDocumentFullLoadSuccess}
                loading={""}
                renderMode="svg">
                <Page
                    pageNumber={page}
                    width={width}
                    height={height}
                    scale={scale}
                    loading={""}
                    renderMode="svg"
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                />
            </Document>
        );
    } else {
        return (
            <Document
                file={url}
                options={{workerSrc: "/pdf.worker.min.js"}}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={""}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        pageNumber={index + 1}
                        key={index}
                        width={566}
                        loading={""}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                ))}
            </Document>
        );
    }
};

export default PreviewBook;
{
    /* <div className="flex h-full w-full items-center justify-center">
    <LoadingAnimation />
</div> */
}
