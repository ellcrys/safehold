import { PrivateKey } from "@ellcrys/spell";
import Mixin, {
	ErrBadAddressLen,
	ErrBadBlockHashLen,
	ErrBadPeerIDLen,
} from "../../../../dev/renderer/components/dashboard/Mixin";
const chai = require("chai");
const should = chai.should();
const expect = chai.expect;

describe("Mixin", () => {
	describe(".shortenAddress", () => {
		it("should shorten 'eR3Wa4zCCKFQhMZFiDLHu61x3cJoZYSaEK' to ''", () => {
			const addr = "eR3Wa4zCCKFQhMZFiDLHu61x3cJoZYSaEK";
			const actual = Mixin.methods.shortenAddress(addr);
			actual.should.be.eq("eR3Wa...YSaEK");
		});

		it("should throw ErrBadAddressLen when address length is less than 34", () => {
			const addr = "eR3Wa4zCCKFQhMZFiDLHu61";
			expect(() => {
				Mixin.methods.shortenAddress(addr);
			}).to.throw(ErrBadAddressLen);
		});
	});

	describe(".shortenPeerID", () => {
		// prettier-ignore
		it("should shorten '12D3KooW9wwo3NtwUGL25QBhgYMUQSkhNvPYxucRHrHXBFsWqoeV'" +
				" to '12D3KooW9w...HXBFsWqoeV'", () => {
				const addr = "12D3KooW9wwo3NtwUGL25QBhgYMUQSkhNvPYxucRHrHXBFsWqoeV";
				const actual = Mixin.methods.shortenPeerID(addr);
				actual.should.be.eq("12D3KooW9w...HXBFsWqoeV");
			},
		);

		it("should throw ErrBadPeerIDLen when address length is not equal to 52", () => {
			const addr = "12D3KooW9wwo3Nt";
			expect(() => {
				Mixin.methods.shortenPeerID(addr);
			}).to.throw(ErrBadPeerIDLen);
		});
	});

	describe(".shortenBlockHash", () => {
		// prettier-ignore
		it("should shorten '0xff0eb6273e1a8c7ac690f41986eed616404214c65afcfc9ba8cf7e185dcbbea9'" +
				" to '0xff0eb6273e1a8...8cf7e185dcbbea9'", () => {
				const hash = "0xff0eb6273e1a8c7ac690f41986eed616404214c65afcfc9ba8cf7e185dcbbea9";
				const actual = Mixin.methods.shortenBlockHash(hash);
				actual.should.be.eq("0xff0eb6273e1a8...8cf7e185dcbbea9");
			},
		);

		it("should throw ErrBadBlockHashLen when address length is not equal to 66", () => {
			const hash = "0xff0eb6273e1a8c7a3Nt";
			expect(() => {
				Mixin.methods.shortenBlockHash(hash);
			}).to.throw(ErrBadBlockHashLen);
		});
	});

	describe(".percentageDiff", () => {
		specify("that the percentage increase of 50 to 100 is 100", () => {
			const res = Mixin.methods.percentageDiff("100", "50");
			res.should.have.property("increase");
			res.increase.should.be.true;
			res.should.have.property("diff");
			res.diff.should.be.eq("100");
		});

		specify("that the percentage increase of 50 to 75 is 50", () => {
			const res = Mixin.methods.percentageDiff("75", "50");
			res.should.have.property("increase");
			res.increase.should.be.true;
			res.should.have.property("diff");
			res.diff.should.be.eq("50");
		});

		specify("that the percentage decrease of 100 to 50 is 50", () => {
			const res = Mixin.methods.percentageDiff("50", "100");
			res.should.have.property("increase");
			res.increase.should.be.false;
			res.should.have.property("diff");
			res.diff.should.be.eq("50");
		});

		specify("that the percentage difference from 100 to 100 is 0", () => {
			const res = Mixin.methods.percentageDiff("100", "100");
			res.should.have.property("increase");
			res.increase.should.be.false;
			res.should.have.property("diff");
			res.diff.should.be.eq("0");
		});
	});
});
