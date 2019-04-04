import { PrivateKey } from "@ellcrys/spell";
import Account from "../../../dev/core/account";

const chai = require("chai");
chai.should();
const expect = chai.expect;

describe("Account", () => {
	describe(".fromPrivateKey", () => {
		it("should return an instance of Account", () => {
			const key = new PrivateKey();
			const acct = Account.fromPrivateKey(key, false);
			acct.should.not.be.empty;
		});
	});

	describe(".inflate", () => {
		it("should return an instance of Account", () => {
			// prettier-ignore
			const acct = Account.inflate({
				name: "account 1",
				privateKey: (new PrivateKey()).toBase58(),
				isCoinbase: false,
				hdPath: "m/1'",
			});
			acct.should.not.be.empty;
		});

		it("should return an error if private key is not valid", () => {
			// prettier-ignore
			expect(() => {
				const acct = Account.inflate({
					name: "account 1",
					privateKey: "invalid",
					isCoinbase: false,
					hdPath: "m/1'",
				});
			}).to.throw("Private key checksum is not valid");
		});
	});

	describe(".getName", () => {
		it("should return the name", () => {
			const acct = Account.inflate({
				name: "account 1",
				privateKey: new PrivateKey().toBase58(),
				isCoinbase: false,
				hdPath: "m/1'",
			});
			acct.getName().should.be.equal("account 1");
		});
	});

	describe(".setName", () => {
		it("should set the account name", () => {
			const account = Account.fromPrivateKey(new PrivateKey());
			account.setName("name1");
			account.getName().should.be.equal("name1");
		});
	});

	describe(".setPath & .getHDPath", () => {
		it("should set path to `m/1/'` and get `m/1/'`", () => {
			const account = Account.fromPrivateKey(new PrivateKey());
			account.setHDPath("m/1/'");
			account.getHDPath().should.be.equal("m/1/'");
		});
	});

	describe(".isEqual", () => {
		const key1 = PrivateKey.from(
			"wmVzqnDsTG43zgfdFxHkokz1mn61daobc13GwAmD1Gd7sWx1yVjqTucPjGgT7PwyoCYBxqztaeVTfXwe3DMxQX9TuciMEQ",
		);
		const key2 = PrivateKey.from(
			"wRFzS1E3MNaae4UqgGgSQ6HdVfU9bWyneJdLR8c8umJu5mQxJ4M1V34d3W7idaF82ytWNottjT6LdjoP5PruDgvyik39jU",
		);

		specify(
			`account from ${key1.toBase58()} must be equal to another account from ${key1.toBase58()}`,
			() => {
				const acct = Account.fromPrivateKey(key1);
				const acct2 = Account.fromPrivateKey(key1);
				acct.isEqual(acct2).should.be.true;
			},
		);

		specify(
			`account from ${key1.toBase58()} must be not equal to another account from ${key2.toBase58()}`,
			() => {
				const acct = Account.fromPrivateKey(key1);
				const acct2 = Account.fromPrivateKey(key2);
				acct.isEqual(acct2).should.not.be.true;
			},
		);
	});

	describe(".getPrivateKey", () => {
		it("should get the expected private key", () => {
			const pk = PrivateKey.from(
				"wmVzqnDsTG43zgfdFxHkokz1mn61daobc13GwAmD1Gd7sWx1y" +
					"VjqTucPjGgT7PwyoCYBxqztaeVTfXwe3DMxQX9TuciMEQ",
			);
			const acct = Account.fromPrivateKey(pk);
			acct.getPrivateKey().should.be.equal(pk);
		});
	});

	describe(".getAddress", () => {
		it("should get the expected address", () => {
			const pk = PrivateKey.from(
				"wmVzqnDsTG43zgfdFxHkokz1mn61daobc13GwAmD1Gd7sWx1y" +
					"VjqTucPjGgT7PwyoCYBxqztaeVTfXwe3DMxQX9TuciMEQ",
			);
			const acct = Account.fromPrivateKey(pk);
			acct.getPrivateKey()
				.toAddress()
				.toString()
				.should.be.equal(pk.toAddress().toString());
		});
	});

	describe(".toJSON", () => {
		const data = {
			name: "account 1",
			privateKey: new PrivateKey().toBase58(),
			isCoinbase: false,
			hdPath: "m/1'",
		};
		it("should get the same data used to inflate the account", () => {
			const acct = Account.inflate(data);
			const jsonData = acct.toJSON();
			jsonData.should.be.eql(data);
		});
	});

	describe(".isCoinbase", () => {
		it("should return true an account's coinbase field is set to `true`", () => {
			let acct = Account.fromPrivateKey(new PrivateKey(), true);
			acct.isCoinbase().should.be.true;
			acct = Account.fromPrivateKey(new PrivateKey(), false);
			acct.isCoinbase().should.be.false;
		});
	});
});
