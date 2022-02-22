import {ethers} from "ethers";
import addresses from "../contracts/addresses.json";
import Rentor from "../contracts/abis/Rentor.json";

function callContract(signer, functionToCall) {
    const contract = new ethers.Contract(addresses.rentor, Rentor.abi, signer);
    try {
        return functionToCall(contract);
    } catch (error) {
        console.error(error);
    }
}

export async function putOnRent(signer, bookAddress, copyUid, flowRate) {
    callContract(signer, async contract => {
        const transaction = await contract.putOnRent(bookAddress, copyUid, flowRate);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function removeFromRent(signer, bookAddress, copyUid) {
    callContract(signer, async contract => {
        const transaction = await contract.removeFromRent(bookAddress, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function takeOnRent(signer, bookAddress, copyUid) {
    callContract(signer, async contract => {
        const transaction = await contract.takeOnRent(bookAddress, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function returnBook(signer, bookAddress, copyUid) {
    callContract(signer, async contract => {
        const transaction = await contract.returnBook(bookAddress, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function uri(signer, bookAddress, copyUid) {
    return callContract(signer, async contract => {
        return await contract.uri(bookAddress, copyUid);
    });
}

export async function addToWaitingList(signer, bookAddress, copyUid) {
    callContract(signer, async contract => {
        const transaction = await contract.addToWaitingList(bookAddress, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function removeFromWaitingList(signer, bookAddress, copyUid) {
    callContract(signer, async contract => {
        const transaction = await contract.removeFromWaitingList(bookAddress, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export function contractAbi() {
    return Rentor.abi;
}
