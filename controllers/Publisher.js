import {ethers} from "ethers";
import addresses from "../contracts/addresses.json";
import Publisher from "../contracts/abis/Publisher.json";
import {NFTStorage, Blob} from "nft.storage";
import {pdfjs} from "react-pdf";

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
    const viewport = page.getViewport({scale: 1});
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    await page.render({canvasContext: context, viewport: viewport}).promise;
    const image = canvas.toDataURL();
    canvas.remove();
    return image;
}

async function uploadBook(file) {
    const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
    });
    const cid = await client.storeBlob(new Blob([file]));
    return cid;
}

async function uploadMetadata(metadata) {
    const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
    });
    const cid = await client.storeBlob(new Blob([JSON.stringify(metadata)]));
    return cid;
}

function connect(signer) {
    return new ethers.Contract(addresses.publisher, Publisher.abi, signer);
}

export async function launchNewBook(signer, bookDetails, cb) {
    const contract = connect(signer);
    cb(1);
    const uri = await uploadBook(bookDetails.file);
    console.log("book uploaded");
    cb(2);
    const coverPage = await extractCoverImage(bookDetails.file);
    console.log("cover Page extracted");
    cb(3);
    const bookMetaData = {
        title: bookDetails.title,
        subtitle: bookDetails.subTitle,
        description: bookDetails.description,
        language: bookDetails.language,
        currency: bookDetails.currency,
        genres: bookDetails.genres,
        keywords: bookDetails.keywords,
        copyrights: bookDetails.copyrights,
        coverPage: coverPage
    };
    const metadataUri = await uploadMetadata(bookMetaData);
    console.log("Book Metadata uploaded");

    const newBook = {
        uri: uri,
        metadataUri: metadataUri,
        price: ethers.utils.parseUnits(bookDetails.price.toString(), "ether"),
        royalty: ethers.utils.parseUnits(bookDetails.royalty.toString(), "ether"),
        supplyLimited: bookDetails.supplyLimited,
        pricedBookSupplyLimit: bookDetails.pricedBookSupplyLimit
    };

    try {
        cb(4);
        const transaction = await contract.launchNewBook(
            newBook.uri,
            newBook.metadataUri,
            newBook.price,
            newBook.royalty,
            newBook.pricedBookSupplyLimit,
            newBook.supplyLimited
        );
        cb(5);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus.events);
        cb(6);
    } catch (error) {
        console.error(error);
        if (error.code === 4001) {
            cb(-4);
        } else {
            cb(-5);
        }
    }
}

export async function launchNewEdition(signer, bookId, bookDetails, cb) {
    const contract = connect(signer);
    cb(1);
    const uri = await uploadBook(bookDetails.file);
    console.log("book uploaded");
    cb(2);
    const coverPage = await extractCoverImage(bookDetails.file);
    console.log("cover Page extracted");
    cb(3);
    const bookMetaData = {
        title: bookDetails.title,
        subtitle: bookDetails.subTitle,
        description: bookDetails.description,
        language: bookDetails.language,
        currency: bookDetails.currency,
        genres: bookDetails.genres,
        keywords: bookDetails.keywords,
        copyrights: bookDetails.copyrights,
        coverPage: coverPage
    };
    const metadataUri = await uploadMetadata(bookMetaData);
    console.log("Edition Metadata uploaded");

    const newEdition = {
        uri: uri,
        metadataUri: metadataUri,
        price: ethers.utils.parseUnits(bookDetails.price.toString(), "ether"),
        royalty: ethers.utils.parseUnits(bookDetails.royalty.toString(), "ether"),
        supplyLimited: bookDetails.supplyLimited,
        pricedBookSupplyLimit: bookDetails.pricedBookSupplyLimit
    };

    try {
        cb(4);
        const transaction = await contract.launchNewEdition(
            bookId,
            newEdition.uri,
            newEdition.metadataUri,
            newEdition.price,
            newEdition.royalty,
            newEdition.supplyLimited,
            newEdition.pricedBookSupplyLimit
        );
        cb(5);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus.events);
        cb(6);
    } catch (error) {
        console.error(error);
        if (error.code === 4001) {
            cb(-4);
        } else {
            cb(-5);
        }
    }
}

export async function createSeries(signer, newSeriesDetails) {
    const contract = connect(signer);
    const seriesMetaData = {
        title: newSeriesDetails.title,
        description: newSeriesDetails.description,
        keywords: newSeriesDetails.keywords
    };
    const seriesMetadataUri = await uploadMetadata(seriesMetaData);
    console.log("Series Metadata uploaded");

    try {
        const transaction = await contract.createSeries(seriesMetadataUri);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus.events);
    } catch (error) {
        console.error(error);
    }
}

export async function addBookToSeries(signer, seriesId, bookId) {
    const contract = connect(signer);
    try {
        const transaction = contract.addBookToSeries(seriesId, bookId);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus.events);
    } catch (error) {
        console.error(error);
    }
}

export function contractAbi() {
    return Publisher.abi;
}
