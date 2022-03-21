import {useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PreviewBook = ({url, height, width, setNumOfPages, page, scale, setLoading}) => {
    function onDocumentFullLoadSuccess({numPages}) {
        setNumOfPages(numPages);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    if (height && width && setNumOfPages && scale && page) {
        return (
            <Document
                file={url}
                options={{workerSrc: "/pdf.worker.min.js"}}
                onLoadSuccess={onDocumentFullLoadSuccess}
                loading={""}>
                <Page
                    pageNumber={page}
                    width={width}
                    height={height}
                    scale={scale}
                    loading={""}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                />
            </Document>
        );
    }
};

export default PreviewBook;
