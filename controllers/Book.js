import {ethers} from "ethers";
import Book from "../contracts/abis/Book.json";

// const provider = ethers.providers.JsonRpcBatchProvider(window.ethereum);
// const provider = ethers.providers.Web3Provider(window.ethereum);

function callContract(signer, bookAddress, functionToCall) {
    const contract = new ethers.Contract(bookAddress, Book.abi, signer);
    try {
        return functionToCall(contract);
    } catch (error) {
        console.error(error);
    }
}

export async function buy(signer, bookAddress) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.buy();
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function transfer(signer, bookAddress, to, copyUid) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.transfer(to, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function uri(signer, bookAddress, copyUid) {
    return callContract(signer, bookAddress, async contract => {
        return await contract.uri(copyUid);
    });
}

export async function redeem(signer, bookAddress, voucher) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.redeem(voucher);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function verifyOwnership(signer, bookAddress, owner, copyUid, distributed) {
    return callContract(signer, bookAddress, async contract => {
        return await contract.verifyOwnership(owner, copyUid, distributed);
    });
}

export async function lockWith(signer, bookAddress, to, copyUid) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.lockWith(to, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function updateSellingPrice(signer, bookAddress, copyUid, newSellingPrice) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.updateSellingPrice(
            copyUid,
            ethers.utils.parseUnits(newSellingPrice.toString(), "ether")
        );
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

// export async function unlock(signer, bookAddress, copyUid) {
//     return callContract(signer, bookAddress, async contract => {
//         const transaction = await contract.unlock(copyUid);
//         const transactionStatus = await transaction.wait();
//         console.log(transactionStatus);
//     });
// }

export async function verifyLockedWith(signer, bookAddress, to, copyUid) {
    return callContract(signer, bookAddress, async contract => {
        return await contract.verifyLockedWith(to, copyUid);
    });
}
export async function getPreviousOwner(signer, bookAddress, copyUid) {
    return callContract(signer, bookAddress, async contract => {
        return await contract.getPreviousOwner(copyUid);
    });
}
export async function getChainID(signer, bookAddress) {
    return callContract(signer, bookAddress, async contract => {
        return await contract.getChainID();
    });
}

//  Only Publisher --------------------------------------------------
export async function updatePrice(signer, bookAddress, newPrice) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.updatePrice(
            ethers.utils.parseUnits(newPrice.toString(), "ether")
        );
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function increaseMarketSupply(signer, bookAddress, incrementSupplyBy) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.increaseMarketSupply(incrementSupplyBy);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function delimitSupply(signer, bookAddress) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.delimitSupply();
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function limitSupply(signer, bookAddress) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.limitSupply(to, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function updateRoyalty(signer, bookAddress, newRoyalty) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.updateRoyalty(
            ethers.utils.parseUnits(newRoyalty.toString(), "ether")
        );
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function updateCoverPageUri(signer, bookAddress, newCoverPageUri) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.updateCoverPageUri(newCoverPageUri);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function getWithdrawableRevenue(signer, bookAddress) {
    return callContract(signer, bookAddress, async contract => {
        return await contract.getWithdrawableRevenue();
    });
}

export async function addContributor(signer, bookAddress, newContributor) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.addContributor(newContributor);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function removeContributor(signer, bookAddress, contributorAddress) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.removeContributor(contributorAddress);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function updateContributorShares(signer, bookAddress, contributor, share) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.updateContributorShares(contributor, share);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function withdrawRevenue(signer, bookAddress) {
    callContract(signer, bookAddress, async contract => {
        const transaction = await contract.withdrawRevenue();
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export function contractAbi() {
    return Book.abi;
}

// export async function upgrade(signer, bookAddress, newImplementation) {}

// TODO
// On remove contributors, add to previously contributed in subgraph
