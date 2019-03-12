import { decrypt, encrypt, kdf } from "../../../../src/utilities/crypto";
const crypto = require("crypto");
describe("Encrypt", () => {
    describe(".encrypt & decrypt", () => {
        let key;
        let data;
        let encData;
        beforeEach(() => {
            key = crypto.randomBytes(16);
            data = Buffer.from("ben", "utf-8");
            encData = encrypt(key, data);
            encData.should.not.be.empty;
        });
        it("should decrypt encrypted data", () => {
            const decData = decrypt(key, encData);
            decData.should.be.eql(data);
        });
    });
    describe(".kdf", () => {
        const vectors = [
            {
                data: "abc",
                outLen: 64,
                salt: "",
                out: "6b74330202f5af2987ec7ee364c570a6c784be6e433160d10efa91724f0f138" +
                    "3c127178d0f917afbcda64cb8f9cd74fd08c040dd0295c6b5e52546889da3af27",
            },
            {
                data: "xyz",
                outLen: 32,
                salt: "",
                out: "afc93463006ead8cd9a5cde6f7f2c74d10d72b2f3f05d9019e12efe6629f2cdb",
            },
        ];
        vectors.forEach((vector) => {
            it(`should be valid for data = ${vector.data}`, () => {
                kdf(vector.data, vector.outLen)
                    .toString("hex")
                    .should.be.eql(vector.out);
            });
        });
    });
});
//# sourceMappingURL=crypto.spec.js.map