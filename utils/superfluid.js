import {Framework} from "@superfluid-finance/sdk-core";
import addresses from "../contracts/addresses.json";
import {network} from "../superfluid_config.json";

let MATICx;
const sfLogo =
    "      |||||||||||||||||||||\n      |||||||||||||||||||||\n      ||||||||         ||||\n      ||||||||         ||||\n      |||||||||||||    ||||\n      |||||||||||||    ||||\n      ||||    |||||||||||||\n      ||||    |||||||||||||\n      |||||||||||||||||||||\n      |||||||||||||||||||||\n      ";

export async function initializeSF(web3ModalProvider) {
    const web3ModalSf = await Framework.create({
        chainId: 80001,
        provider: web3ModalProvider
    });
    console.log(`%c\n\n${sfLogo}\nSuperfluid Framework Initialized`, "font-weight: 900;");
    console.log(web3ModalSf);
    MATICx = web3ModalSf.loadSuperToken(network.polytest.acceptedToken);
    return web3ModalSf;
}

function calculateFlowRate(amountInEther) {
    if (typeof Number(amountInEther) !== "number" || isNaN(Number(amountInEther)) === true) {
        console.log(typeof Number(amountInEther));
        alert("You can only calculate a flowRate based on a number");
        return;
    } else if (typeof Number(amountInEther) === "number") {
        const monthlyAmount = ethers.utils.parseEther(amountInEther.toString());
        const calculatedFlowRate = Math.floor(monthlyAmount / 3600 / 24 / 30);
        return calculatedFlowRate;
    }
}

export async function subscribe(sf, signer, flowRate) {
    flowRate = calculateFlowRate(flowRate);
    try {
        const createFlowOperation = sf.cfaV1.createFlow({
            flowRate: flowRate,
            receiver: addresses.rentor,
            superToken: MATICx
        });

        console.log("Creating your subscription.");

        const result = await createFlowOperation.exec(signer.signer);
        console.log(result);

        console.log(
            `%cCongrats - you've just subscribed for renting books!\n
        View your stream At: https://app.superfluid.finance/dashboard/${addresses.rentor}\n
        Network: Matic Mumbai Testnet\n
        Super Token: MATICx\n
        Sender: ${signer.address}\n
        Receiver: ${addresses.rentor}\n
        FlowRate: ${flowRate}
        `,
            "font-weight: 900;"
        );
    } catch (error) {
        console.log(
            "Your transaction threw an error!\nMake sure that you're not already subscribed."
        );
        console.error(error);
    }
}

export async function updateSubscription(sf, signer, newFlowRate) {
    newFlowRate = calculateFlowRate(newFlowRate);
    try {
        const updateFlowOperation = sf.cfaV1.updateFlow({
            flowRate: newFlowRate,
            receiver: addresses.rentor,
            superToken: MATICx
        });

        console.log("Updating your subscription.");

        const result = await updateFlowOperation.exec(signer.signer);
        console.log(result);

        console.log(
            `%cCongrats - you've just updated your subscription for renting books!\n
        View your stream At: https://app.superfluid.finance/dashboard/${addresses.rentor}\n
        Network: Matic Mumbai Testnet\n
        Super Token: MATICx\n
        Sender: ${signer.address}\n
        Receiver: ${addresses.rentor}\n
        FlowRate: ${newFlowRate}
        `,
            "font-weight: 900;"
        );
    } catch (error) {
        console.log("Your transaction threw an error!\nMake sure that you're already subscribed.");
        console.error(error);
    }
}

export async function unsubscribe(sf, signer) {
    try {
        const deleteFlowOperation = sf.cfaV1.deleteFlow({
            sender: signer.address,
            receiver: addresses.rentor,
            superToken: MATICx
        });

        console.log("Ending you subscription.");

        const result = await deleteFlowOperation.exec(signer.signer);
        console.log(result);

        console.log(
            `%You've just unsubscribed for renting books!\n
        View your stream At: https://app.superfluid.finance/dashboard/${addresses.rentor}\n
        Network: Matic Mumbai Testnet\n
        Super Token: MATICx\n
        Sender: ${signer.address}\n
        Receiver: ${addresses.rentor}
        `,
            "font-weight: 900;"
        );
    } catch (error) {
        console.log("Your transaction threw an error!\nMake sure that you're already subscribed.");
        console.error(error);
    }
}

export async function getSuperTokenBalance(signer) {
    return await MATICx.balanceOf({
        account: string,
        providerOrSigner: signer
    }).then(balance => {
        return balance;
    });
} //calculate date of empty

export async function wrap(sf, signer, amount) {
    const MATIC = new ethers.Contract(
        "0xb9ca5e36d03cdb0dfa4561e7fec77ccd86a8b201",
        MaticABI,
        signer
    );
    const MATICx = await sf.loadSuperToken(network.polytest.acceptedToken);
    try {
        // approving
        // console.log("Approving test MATIC spend.");
        // await MATIC.approve(
        //     network.polytest.acceptedToken,
        //     ethers.utils.parseEther(amount.toString())
        // ).then(tx => {
        //     console.log(
        //         `Approved your MATIC spend. You can see this transaction at https://mumbai.polygonscan.com/tx/${tx.hash}.`
        //     );
        // });

        // upgrading
        console.log(`Upgrading ${amount} MATIC to MATICx.`);
        const amountToUpgrade = ethers.utils.parseEther(amount.toString());
        const upgradeOperation = MATICx.upgrade({
            amount: amountToUpgrade.toString()
        });
        const upgradeTxn = await upgradeOperation.exec(signer);
        await upgradeTxn.wait().then(tx => {
            console.log(
                `Upgraded ${amount} MATIC to MATICx! You can see this transaction at https://mumbai.polygonscan.com/tx/${tx.hash}.`
            );
        });
    } catch (error) {
        console.error(error);
    }
}

// export async function unWrap(sf, signer, amount) {}

// flow balance (from contract/ to contract)
export async function getFlowBalance(sf) {
    return await sf.query
        .listStreams({
            sender: string.address,
            receiver: addresses.rentor,
            token: network.polytest.acceptedToken
        })
        .then(result => {
            return result;
        });
}
