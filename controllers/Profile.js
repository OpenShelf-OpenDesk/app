import {ethers} from "ethers";
import addresses from "../contracts/addresses.json";
import Profile from "../contracts/abis/Profile.json";
import {NFTStorage, Blob} from "nft.storage";

function callContract(signer, functionToCall) {
    const contract = new ethers.Contract(addresses.profile, Profile.abi, signer);
    try {
        return functionToCall(contract);
    } catch (error) {
        console.error(error);
    }
}

async function uploadMetadata(metadata) {
    const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY
    });
    const cid = await client.storeBlob(new Blob([JSON.stringify(metadata)]));
    return cid;
}

export async function updateReaderProfile(signer, readerDetails) {
    const readerProfileDetails = {
        username: readerDetails.username,
        name: readerDetails.name,
        aboutMe: readerDetails.aboutMe,
        handles: readerDetails.handles
    };
    const profileMetadataUri = await uploadMetadata(readerProfileDetails);
    console.log("Reader Profile Metadata uploaded");

    callContract(signer, async contract => {
        const transaction = await contract.updateReaderProfile(profileMetadataUri);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export async function updateContributorProfile(signer, contributorDetails) {
    const contributorProfileDetails = {
        username: readerDetails.username,
        name: readerDetails.name,
        aboutMe: readerDetails.aboutMe,
        handles: readerDetails.handles
    };
    const profileMetadataUri = await uploadMetadata(contributorProfileDetails);
    console.log("Contributor Profile Metadata uploaded");

    callContract(signer, async contract => {
        const transaction = await contract.updateContributorProfile(profileMetadataUri);
        const transactionStatus = await transaction.wait();
        console.log(transactionStatus);
    });
}

export function contractAbi() {
    return Profile.abi;
}
