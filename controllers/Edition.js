import {ethers} from "ethers";
import Edition from "../contracts/abis/Edition.json";

async function callContract(signer, editionAddress, functionToCall, handleError) {
    const contract = new ethers.Contract(editionAddress, Edition.abi, signer);
    try {
        return await functionToCall(contract);
    } catch (error) {
        await handleError(error);
    }
}

export async function buy(signer, editionAddress) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.buy();
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function transfer(signer, editionAddress, to, copyUid) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.transfer(to, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function uri(signer, editionAddress, copyUid) {
    return await callContract(signer, editionAddress, async contract => {
        return await contract.uri(copyUid);
    });
}

export async function redeem(signer, editionAddress, voucher) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.redeem(voucher);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function verifyOwnership(signer, editionAddress, owner, copyUid, distributed) {
    return await callContract(signer, editionAddress, async contract => {
        return await contract.verifyOwnership(owner, copyUid, distributed);
    });
}

export async function lockWith(signer, editionAddress, to, copyUid) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.lockWith(to, copyUid);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function updateSellingPrice(signer, editionAddress, copyUid, newSellingPrice) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.updateSellingPrice(
            copyUid,
            ethers.utils.parseUnits(newSellingPrice.toString(), "ether")
        );
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

// called only by Rentor Contract Address
// export async function unlock(signer, editionAddress, copyUid) {
//     return callContract(signer, editionAddress, async contract => {
//         const transaction = await contract.unlock(copyUid);
//         const transactionStatus = await transaction.wait();
//         console.log(transactionStatus);
//     });
// }

export async function verifyLockedWith(signer, editionAddress, to, copyUid) {
    return await callContract(signer, editionAddress, async contract => {
        return await contract.verifyLockedWith(to, copyUid);
    });
}
export async function getPreviousOwner(signer, editionAddress, copyUid) {
    return await callContract(signer, editionAddress, async contract => {
        return await contract.getPreviousOwner(copyUid);
    });
}
export async function getChainID(signer, editionAddress) {
    return await callContract(signer, editionAddress, async contract => {
        return await contract.getChainID();
    });
}

//  Only Publisher --------------------------------------------------
export async function updatePrice(signer, editionAddress, newPrice) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.updatePrice(
            ethers.utils.parseUnits(newPrice.toString(), "ether")
        );
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function increaseMarketSupply(signer, editionAddress, incrementSupplyBy) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.increaseMarketSupply(incrementSupplyBy);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function delimitSupply(signer, editionAddress) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.delimitSupply();
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function limitSupply(signer, editionAddress) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.limitSupply();
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function updateRoyalty(signer, editionAddress, newRoyalty) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.updateRoyalty(
            ethers.utils.parseUnits(newRoyalty.toString(), "ether")
        );
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function getWithdrawableRevenue(signer, editionAddress) {
    return await callContract(signer, editionAddress, async contract => {
        return await contract.getWithdrawableRevenue();
    });
}

// newContributors[] = Contributor{address,share,role}[]
export async function addContributors(signer, editionAddress, newContributors, cb) {
    await callContract(
        signer,
        editionAddress,
        async contract => {
            const transaction = await contract.addContributors(newContributors);
            cb(7);
            const transactionStatus = await transaction.wait();
            cb(8);
            console.log(transactionStatus);
        },
        async error => {
            if (error.code === 4001) {
                cb(-6);
            } else {
                cb(-7);
            }
        }
    );
}

export async function withdrawRevenue(signer, editionAddress) {
    await callContract(signer, editionAddress, async contract => {
        const transaction = await contract.withdrawRevenue();
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export function contractAbi() {
    return Edition.abi;
}
