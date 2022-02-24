import {Framework} from "@superfluid-finance/sdk-core";

const sfLogo =
    "      |||||||||||||||||||||\n      |||||||||||||||||||||\n      ||||||||         ||||\n      ||||||||         ||||\n      |||||||||||||    ||||\n      |||||||||||||    ||||\n      ||||    |||||||||||||\n      ||||    |||||||||||||\n      |||||||||||||||||||||\n      |||||||||||||||||||||\n      ";

export async function initializeSF(web3ModalProvider) {
    const web3ModalSf = await Framework.create({
        chainId: 80001,
        provider: web3ModalProvider
    });
    console.log(`%c\n\n${sfLogo}\nSuperfluid Framework Initialized`, "font-weight: 900;");
    console.log(web3ModalSf);
    return web3ModalSf;
}
