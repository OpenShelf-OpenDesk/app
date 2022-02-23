import { ethers } from "ethers";
import addresses from "../contracts/addresses.json";
import Publisher from "../contracts/abis/Publisher.json";
import { NFTStorage, Blob } from "nft.storage";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const readFileData = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
            resolve(e.target.result);
        };
        reader.onerror = err => {
            reject(err);
        };
        reader.readAsDataURL(file);
    });
};

async function extractCoverImage(file) {
    const data = await readFileData(file);
    const pdf = await pdfjs.getDocument(data).promise;
    const canvas = document.createElement("canvas");
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    const image = canvas.toDataURL();
    canvas.remove();
    return image;
}

async function uploadBookCoverImage(coverImage) {
    const image = new Image();
    image.src = coverImage;
    const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
    });
    const cid = await client.storeBlob(new Blob([image]));
    return cid;
}

async function uploadBook(file) {
    const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
    });
    const cid = await client.storeBlob(new Blob([file]));
    return cid;
}

async function uploadBookMetadata(metadata) {
    const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
    });
    const cid = await client.storeBlob(new Blob([JSON.stringify(metadata)]));
    return cid;
}

function connect(signer) {
    return new ethers.Contract(addresses.publisher, Publisher.abi, signer);
}

export async function publish(signer, bookDetails, cb) {
    const contract = connect(signer);
    cb(1);
    const uri = await uploadBook(bookDetails.file);
    console.log("book uploaded");
    cb(2);
    const coverPage = await extractCoverImage(bookDetails.file);
    console.log("cover Page extracted");
    cb(3);
    const coverPageUri = await uploadBookCoverImage(coverPage);
    console.log("cover page uploaded");

    const bookMetaData = {
        title: bookDetails.title,
        subTitle: bookDetails.subTitle,
        description: bookDetails.description,
        language: bookDetails.language,
        currency: bookDetails.currency,
        genres: bookDetails.genres,
        keywords: bookDetails.keywords,
        copyrights: bookDetails.copyrights
    };
    cb(4);
    const metadataUri = await uploadBookMetadata(bookMetaData);
    console.log("metadata uploaded");

    const newBook = {
        uri: uri,
        metadataUri: metadataUri,
        coverPageUri: coverPageUri,
        price: ethers.utils.parseUnits(bookDetails.price.toString(), "ether"),
        royalty: ethers.utils.parseUnits(bookDetails.royalty.toString(), "ether"),
        edition: bookDetails.edition,
        prequel: bookDetails.prequel,
        supplyLimited: bookDetails.supplyLimited,
        pricedBookSupplyLimit: bookDetails.pricedBookSupplyLimit
    };

    try {
        cb(5);
        const transaction = await contract.publish(
            newBook.uri,
            newBook.metadataUri,
            newBook.coverPageUri,
            newBook.price,
            newBook.royalty,
            newBook.edition,
            newBook.prequel,
            newBook.supplyLimited,
            newBook.pricedBookSupplyLimit
        );
        cb(6);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus.events);
        cb(7);
    } catch (error) {
        console.error(error);
        if (error.code === 4001) {
            cb(-5);
        } else {
            cb(-6)
        }
    }
}

export async function getBookAddress(signer, bookId) {
    const contract = connect(signer);
    try {
        return await contract.getBookAddress(bookId);
    } catch (error) {
        console.error(error);
    }
}

export function contractAbi() {
    return Publisher.abi;
}

// TODO
// Function to update metadataURI in Book.sol
