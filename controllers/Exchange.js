import {ethers} from "ethers";
import addresses from "../contracts/addresses.json";
import Exchange from "../contracts/abis/Exchange.json";

function callContract(signer, functionToCall) {
    const contract = new ethers.Contract(addresses.exchange, Exchange.abi, signer);
    try {
        return functionToCall(contract);
    } catch (error) {
        console.error(error);
    }
}

export async function makeOffer(signer, bookAddress, copyUid, offerPrice) {
    callContract(signer, async contract => {
        const transaction = contract.makeOffer(bookAddress, copyUid, offerPrice);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function cancelOffer(signer, bookAddress, copyUid) {
    callContract(signer, async contract => {
        const transaction = contract.cancelOffer(bookAddress, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function offerAccepted(signer, bookAddress, copyUid, buyer) {
    callContract(signer, async contract => {
        const transaction = contract.offerAccepted(bookAddress, copyUid, buyer);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export function contractAbi() {
    return Exchange.abi;
}
