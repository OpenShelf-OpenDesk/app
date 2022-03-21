import {Framework} from "@superfluid-finance/sdk-core";
import addresses from "../contracts/addresses.json";
import sfConfig from "../superfluid_config.json";
import {ethers} from "ethers";

const network = sfConfig.network;
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
    MATICx = await web3ModalSf.loadSuperToken(network.polytest.acceptedToken);
    return web3ModalSf;
}

export function calculateFlowRate(amountInEther) {
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
            superToken: network.polytest.acceptedToken
        });

        console.log("Creating your subscription.");

        const tx = await createFlowOperation.exec(signer.signer);
        const result = await tx.wait();

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
            superToken: network.polytest.acceptedToken
        });

        console.log("Updating your subscription.");

        const tx = await updateFlowOperation.exec(signer.signer);
        const result = await tx.wait();
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
            superToken: network.polytest.acceptedToken
        });

        console.log("Ending you subscription.");

        const tx = await deleteFlowOperation.exec(signer.signer);
        const result = await tx.wait();

        console.log(
            `%cYou've just unsubscribed for renting books!\n
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

export async function getSuperTokenBalance(sf, signer) {
    const netFlow = await sf.cfaV1.getNetFlow({
        superToken: network.polytest.acceptedToken,
        account: signer.address,
        providerOrSigner: signer.signer
    });
    return await MATICx.balanceOf({
        account: signer.address,
        providerOrSigner: signer.signer
    }).then(balance => {
        return [balance, netFlow];
    });
}

export async function wrap(sf, signer, amount) {
    // const MATIC = new ethers.Contract(
    //     "0x0000000000000000000000000000000000000000",
    //     MaticABI,
    //     signer
    // );
    MATICx = await sf.loadSuperToken(network.polytest.acceptedToken);
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

export async function getFlowBalance(sf, sender, cb) {
    await sf.query.on(
        (events, unsubscribe) => {
            if (events.length >= 2) {
                cb(
                    Number(weiToEther(events[0].flowRate) * 2592000).toPrecision(3),
                    Number(weiToEther(events[1].flowRate) * 2592000).toPrecision(3)
                );
                unsubscribe();
            }
        },
        3000,
        sender
    );
}

export async function getStream(sf, sender) {
    const outFlow = await sf.query
        .listStreams(
            {
                sender: sender,
                receiver: addresses.rentor,
                token: network.polytest.acceptedToken
            },
            {take: 1}
        )
        .then(result => {
            if (result.data[0]) {
                return result.data[0].currentFlowRate;
            }
            return 0;
        });
    const inFlow = await sf.query
        .listStreams(
            {
                sender: addresses.rentor,
                receiver: sender,
                token: network.polytest.acceptedToken
            },
            {take: 1}
        )
        .then(result => {
            if (result.data[0]) {
                return result.data[0].currentFlowRate;
            }
            return 0;
        });
    return [
        Number(weiToEther(inFlow) * 2592000).toPrecision(3),
        Number(weiToEther(outFlow) * 2592000).toPrecision(3)
    ];
}

export function weiToEther(x) {
    return ethers.utils.formatUnits(x, "ether");
}
