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

export async function putOnRent(signer, bookAddress, copyUid, flowRate) {
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.putOnRent(bookAddress, copyUid, flowRate);
            const transactionStatus = await transaction.wait();
            console.log(transactionStatus);
        },
        err => {
            console.log(err);
        }
    );
}

export async function removeFromRent(signer, bookAddress, copyUid) {
    await callContract(signer, async contract => {
        const transaction = await contract.removeFromRent(bookAddress, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function takeOnRent(signer, bookAddress, copyUid) {
    await callContract(
        signer,
        async contract => {
            const transaction = await contract.takeOnRent(bookAddress, copyUid);
            const transactionStatus = await transaction.wait();
            console.log(transactionStatus);
        },
        err => {
            console.log(err);
        }
    );
}

export async function returnBook(signer, bookAddress, copyUid) {
    await callContract(signer, async contract => {
        const transaction = await contract.returnBook(bookAddress, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function uri(signer, bookAddress, copyUid) {
    return await callContract(signer, async contract => {
        return await contract.uri(bookAddress, copyUid);
    });
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
