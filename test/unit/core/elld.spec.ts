import { PrivateKey } from "@ellcrys/spell";
import Account from "../../../dev/core/account";
import Elld from "../../../dev/core/elld";

const chai = require("chai");
chai.should();
const expect = chai.expect;

describe("Elld", () => {
	describe(".getSpell", () => {
		const elld = new Elld("");
		it("should throw error when internal spell instance is undefined", () => {
			expect(() => {
				elld.getSpell();
			}).to.throw("spell not initialized");
		});
	});
});
