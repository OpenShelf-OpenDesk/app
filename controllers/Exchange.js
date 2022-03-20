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

export async function makeOffer(signer, bookAddress, copyUid, offerPrice, cb) {
    offerPrice = ethers.utils.parseUnits(offerPrice.toString(), "ether");
    cb(1);
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.makeOffer(bookAddress, copyUid, offerPrice, {
                value: offerPrice
            });
            cb(2);
            const transactionStatus = await transaction.wait();
            cb(3);
            console.log(transactionStatus);
        },
        async error => {
            if (error.code === 4001) {
                cb(-2);
            } else {
                cb(-3);
            }
        }
    );
}

export async function cancelOffer(signer, bookAddress, copyUid, cb) {
    cb(1);
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.cancelOffer(bookAddress, copyUid);
            cb(2);
            const transactionStatus = await transaction.wait();
            cb(3);
            console.log(transactionStatus);
        },
        async error => {
            if (error.code === 4001) {
                cb(-2);
            } else {
                cb(-3);
            }
        }
    );
}

export async function offerAccepted(signer, bookAddress, copyUid, buyer, cb) {
    await callContract(
        signer,
        async contract => {
            cb(4);
            const transaction = await contract.offerAccepted(bookAddress, copyUid, buyer);
            const transactionStatus = await transaction.wait();
            cb(5);
            console.log(transactionStatus);
        },
        async error => {
            if (error.code === 4001) {
                cb(-4);
            } else {
                cb(-5);
            }
        }
    );
}

export function contractAbi() {
    return Exchange.abi;
}
