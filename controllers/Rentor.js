import {ethers} from "ethers";
import addresses from "../contracts/addresses.json";
import Rentor from "../contracts/abis/Rentor.json";

async function callContract(signer, functionToCall, handleError) {
    const contract = new ethers.Contract(addresses.rentor, Rentor.abi, signer);
    try {
        return await functionToCall(contract);
    } catch (error) {
        await handleError(error);
    }
}

export async function putOnRent(signer, bookAddress, copyUid, flowRate, cb) {
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.putOnRent(bookAddress, copyUid, flowRate);
            const transactionStatus = await transaction.wait();
            cb(4);
            console.log(transactionStatus);
        },
        async err => {
            console.log(err);
        }
    );
}

export async function removeFromRent(signer, bookAddress, copyUid, cb) {
    cb(1);
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.removeFromRent(bookAddress, copyUid);
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

export async function takeOnRent(signer, bookAddress, copyUid) {
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.takeOnRent(bookAddress, copyUid);
            const transactionStatus = await transaction.wait();
            console.log(transactionStatus);
        },
        async err => {
            console.log(err);
        }
    );
}

export async function returnBook(signer, bookAddress, copyUid) {
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.returnBook(bookAddress, copyUid);
            const transactionStatus = await transaction.wait();
            console.log(transactionStatus);
        },
        async err => {
            console.log(err);
        }
    );
}

export async function uri(signer, bookAddress, copyUid) {
    return await callContract(
        signer,
        async contract => {
            return await contract.uri(bookAddress, copyUid);
        },
        async err => {
            console.log(err);
        }
    );
}

// export async function addToWaitingList(signer, bookAddress, copyUid) {
//     callContract(signer, async contract => {
//         const transaction = await contract.addToWaitingList(bookAddress, copyUid);
//         const transactionStatus = await transaction.wait();
//         console.log(transactionStatus);
//     });
// }

// export async function removeFromWaitingList(signer, bookAddress, copyUid) {
//     callContract(signer, async contract => {
//         const transaction = await contract.removeFromWaitingList(bookAddress, copyUid);
//         const transactionStatus = await transaction.wait();
//         console.log(transactionStatus);
//     });
// }

export function contractAbi() {
    return Rentor.abi;
}
