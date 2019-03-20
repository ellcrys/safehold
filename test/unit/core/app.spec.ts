const chai = require("chai");
const sinonChai = require("sinon-chai");
import Spell, { Ell } from "@ellcrys/spell";
import crypto from "crypto";
import Decimal from "decimal.js";
import _ from "lodash";
import sinon, { SinonStubbedInstance } from "sinon";
import { ISpellStubs, SpellRPCError } from "../../..";
import App from "../../../dev/core/app";
import Elld from "../../../dev/core/elld";
import Wallet from "../../../dev/core/wallet";
chai.should();
chai.use(sinonChai);

describe("App", () => {
	/**
	 * Creates a stubs for testing algorithms
	 * that make use of Spell.js dependency
	 * modules
	 * @returns {ISpellStubs}
	 */
	function spellStubs(): ISpellStubs {
		const spell = sinon.createStubInstance(Spell);
		const ell = sinon.createStubInstance(Ell);
		spell.ell = ell as any;
		const elld = sinon.createStubInstance(Elld);
		elld.getSpell.returns(spell);
		return { spell, ell, elld };
	}

	function makeRPCErr(obj: SpellRPCError) {
		const e = new Error();
		(e as any).data = JSON.stringify(obj);
		return e;
	}

	describe.only(".restoreAccounts", () => {
		describe("with gap set to 20 and no active index", () => {
			// prettier-ignore
			specify("that the wallet has 0 accounts", async () => {
				const stubs = spellStubs();
				const rpcErr = makeRPCErr({error: {code: 30001}});
				stubs.ell.getBalance.returns(Promise.reject(rpcErr));

				const app = new App();
				app.setELLD(stubs.elld as any);

				const wallet = new Wallet(Buffer.from("05c2114f22217958d4fd4c3f4e156152", "hex"));
				app.wallet = wallet;

				await app.restoreAccounts();
				app.wallet.getAccounts().should.have.length(0);
			});
		});

		describe("with gap set to 20 and two active keys at index 7 and  8", () => {
			let stubs: ISpellStubs;
			let activeAddresses;
			let app: App;

			beforeEach(async () => {
				stubs = spellStubs();
				const rpcErr = makeRPCErr({ error: { code: 30001 } });
				activeAddresses = [
					"e7pyNZoyfmPnsN7u4wXosE2ud6rYRsfEWh",
					"eAz95c3S5Qc4DzSi4RwKCzZtGfZpm7kdGX",
				];
				stubs.ell.getBalance.callsFake((address: string) => {
					if (_.includes(activeAddresses, address)) {
						return Promise.resolve(new Decimal(123));
					}
					return Promise.reject(rpcErr);
				});

				app = new App();
				app.setELLD(stubs.elld as any);

				const wallet = new Wallet(
					Buffer.from("05c2114f22217958d4fd4c3f4e156152", "hex"),
				);
				app.wallet = wallet;
				await app.restoreAccounts();
			});

			// prettier-ignore
			specify("that the wallet has 2 accounts", async () => {
				const accounts = app.wallet.getAccounts();
				accounts.should.have.length(2);
				activeAddresses.should.contain(accounts[0].getAddress());
				activeAddresses.should.contain(accounts[1].getAddress());
			});

			// prettier-ignore
			specify("that there were 28 account checks", async () => {
				stubs.ell.getBalance.should.have.been.callCount(28);
			});
		});
	});
});
