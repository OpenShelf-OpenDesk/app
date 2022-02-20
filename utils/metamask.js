import Web3Modal from "web3modal";
import {ethers} from "ethers";

export async function connectToWallet(networkUpdated, signerUpdated) {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection, "any");

    connection.on("accountsChanged", async accounts => {
        console.log("accountsChanged");
        if ((await provider.listAccounts()).length > 0) {
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            signerUpdated(signer, address);
        } else {
            signerUpdated(null, null);
        }
    });

    // Subscribe to chainId change
    connection.on("chainChanged", async chainId => {
        console.log("chainChanged");
        console.log(chainId);
        const network = await provider.getNetwork();
        networkUpdated(network);
    });

    // Subscribe to provider connection
    connection.on("connect", async info => {
        console.log("connect");
        console.log(info);
        const network = await provider.getNetwork();
        networkUpdated(network);
    });

    // Subscribe to provider disconnection
    connection.on("disconnect", error => {
        console.log("disconnect");
        console.log(error);
    });

    if ((await provider.listAccounts()).length > 0) {
        console.log("defaultConnection");
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        signerUpdated(signer, address);
        const network = await provider.getNetwork();
        networkUpdated(network);
    }
}
