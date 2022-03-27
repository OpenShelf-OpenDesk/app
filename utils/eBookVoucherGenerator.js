import {ethers} from "ethers";
import Edition from "../contracts/abis/Edition.json";

const SIGNING_DOMAIN_NAME = "BOOK-VOUCHER";
const SIGNING_DOMAIN_VERSION = "1";

export class eBookVoucherGenerator {
    _contract;
    _signer;
    _domain;
    _bookID;

    constructor(editionAddress, bookID, signer) {
        this._contract = new ethers.Contract(editionAddress, Edition.abi, signer);
        this._bookID = bookID;
        this._signer = signer;
    }

    async createVoucher(address, price = 0) {
        const voucher = {
            bookID: this._bookID,
            receiver: address,
            price: ethers.utils.parseUnits(price.toString(), "ether")
        };
        console.log(voucher);
        const domain = await this._signingDomain();
        const types = {
            BookVoucher: [
                {name: "bookID", type: "uint256"},
                {name: "receiver", type: "address"},
                {name: "price", type: "uint256"}
            ]
        };
        const signature = await this._signer._signTypedData(domain, types, voucher);
        return {
            ...voucher,
            signature: signature
        };
    }

    async _signingDomain() {
        if (this._domain != null) {
            return this._domain;
        }
        const chainId = await this._contract.getChainID();
        this._domain = {
            name: SIGNING_DOMAIN_NAME,
            version: SIGNING_DOMAIN_VERSION,
            verifyingContract: this._contract.address,
            chainId
        };
        return this._domain;
    }
}
