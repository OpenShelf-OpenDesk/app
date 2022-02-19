import {ethers} from "ethers";
import addresses from "../contracts/addresses.json";
import Publisher from "../contracts/abis/Publisher.json";

function connect(signer) {
    return new ethers.Contract(addresses.publisher, Publisher.abi, signer);
}

export async function publish(signer, bookDetails) {
    const contract = connect(signer);
    // ethers.utils.formatBytes32String("bookUri"),
    const newBook = {
        uri: ethers.utils.formatBytes32String(bookDetails.uri),
        metadataUri: ethers.utils.formatBytes32String(bookDetails.metadataUri),
        coverPageUri: ethers.utils.formatBytes32String(bookDetails.coverPageUri),
        price: ethers.utils.parseUnits(bookDetails.price.toString(), "ether"),
        royalty: ethers.utils.parseUnits(bookDetails.royalty.toString(), "ether"),
        edition: bookDetails.edition,
        prequel: bookDetails.prequel,
        supplyLimited: bookDetails.supplyLimited,
        pricedBookSupplyLimit: bookDetails.pricedBookSupplyLimit
    };
    try {
        const transaction = contract.publish(...newBook);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus.events);
    } catch (error) {
        console.error(error);
    }
}

export async function getBookAddress(signer, bookId) {
    const contract = connect(signer);
    try {
        return contract.getBookAddress(bookId);
    } catch (error) {
        console.error(error);
    }
}

export function contractAbi() {
    return Publisher.abi;
}

// TODO
// Function to update metadataURI in Book.sol
