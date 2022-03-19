import {ethers} from "ethers";
import addresses from "../contracts/addresses.json";
import Exchange from "../contracts/abis/Exchange.json";

async function callContract(signer, functionToCall, handleError) {
    const contract = new ethers.Contract(addresses.exchange, Exchange.abi, signer);
    try {
        return await functionToCall(contract);
    } catch (error) {
        await handleError(error);
    }
}

export async function makeOffer(signer, bookAddress, copyUid, offerPrice) {
    offerPrice = ethers.utils.parseUnits(offerPrice.toString(), "ether");
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.makeOffer(bookAddress, copyUid, offerPrice, {
                value: offerPrice
            });
            const transactionStatus = await transaction.wait();
            console.log(transactionStatus);
        },
        err => {
            console.log(err);
        }
    );
}

export async function cancelOffer(signer, bookAddress, copyUid) {
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.cancelOffer(bookAddress, copyUid);
            const transactionStatus = await transaction.wait();
            console.log(transactionStatus);
        },
        err => {
            console.log(err);
        }
    );
}

export async function offerAccepted(signer, bookAddress, copyUid, buyer) {
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.offerAccepted(bookAddress, copyUid, buyer);
            const transactionStatus = await transaction.wait();
            console.log(transactionStatus);
        },
        err => {
            console.log(err);
        }
    );
}

export function contractAbi() {
    return Exchange.abi;
}
