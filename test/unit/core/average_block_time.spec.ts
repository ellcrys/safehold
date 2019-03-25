const chai = require("chai");
const sinonChai = require("sinon-chai");
import Spell, { Ell, State } from "@ellcrys/spell";
import _ from "lodash";
import sinon, { SinonStubbedInstance } from "sinon";
import { ISpellStubs, SpellRPCError } from "../../..";
import AverageBlockTime from "../../../dev/core/average_block_time";
import Elld from "../../../dev/core/elld";
chai.should();
chai.use(sinonChai);

describe("AverageBlockTime", () => {
	/**
	 * Creates a stubs for testing algorithms
	 * that make use of Spell.js dependency
	 * modules
	 * @returns {ISpellStubs}
	 */
	function spellStubs(): ISpellStubs {
		const spell = sinon.createStubInstance(Spell);
		const ell = sinon.createStubInstance(Ell);
		const state = sinon.createStubInstance(State);
		spell.ell = ell as any;
		spell.state = state as any;
		const elld = sinon.createStubInstance(Elld);
		elld.getSpell.returns(spell);
		return { spell, ell, state, elld };
	}

	function makeRPCErr(obj: SpellRPCError) {
		const e = new Error();
		(e as any).data = JSON.stringify(obj);
		return e;
	}

	describe(".calculate", () => {
		const testBlocks = [
			{ header: { number: 1, timestamp: (100).toString(16) } },
			{ header: { number: 2, timestamp: (150).toString(16) } },
			{ header: { number: 3, timestamp: (200).toString(16) } },
			{ header: { number: 4, timestamp: (230).toString(16) } },
		];

		it("should calculate average to be 33", async () => {
			const stubs = spellStubs();
			// prettier-ignore
			stubs.state.getBlock.callsFake((num: number) => {
				if (num === 0) { return Promise.resolve(testBlocks[3]); }
				return Promise.resolve(testBlocks[num - 1]);
			});

			const avg = await AverageBlockTime.calculate(stubs.spell);
			avg.valueOf().should.be.equal(33);
		});
	});
});
