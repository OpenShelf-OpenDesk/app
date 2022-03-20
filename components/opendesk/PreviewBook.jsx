import {useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PreviewBook = ({url, setLoading}) => {
    const [numPages, setNumPages] = useState(0);

    function onDocumentLoadSuccess({numPages}) {
        setNumPages(numPages);
    }

    return (
        <Document
            file={url}
            options={{workerSrc: "/pdf.worker.min.js"}}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={""}>
            {Array.from(new Array(numPages), (el, index) => (
                <div key={index}>
                    <Page
                        pageNumber={index + 1}
                        key={index}
                        width={566}
                        loading={""}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                    />
                    {index + 1 === numPages &&
                        setTimeout(() => {
                            setLoading(false);
                        }, 1000)}
                </div>
            ))}
        </Document>
    );
};

export default PreviewBook;
