import { PrivateKey } from "@ellcrys/spell";
import { reject } from "bluebird";
import Datastore from "nedb";
import Account from "../../../dev/core/account";
import DBOps from "../../../dev/core/db_ops";

const chai = require("chai");
chai.should();
const expect = chai.expect;

describe.only("DBOp", () => {
	let dbOp: DBOps;
	let store: Datastore;

	beforeEach(() => {
		store = new Datastore();
		dbOp = DBOps.fromDB(store);
	});

	describe(".findOne", () => {
		const testObj = { type: "doc", a: 2, _id: "xyz" };
		beforeEach(() => {
			store.insert(testObj);
		});

		it("should find the document with _id = xyz", async () => {
			const res = await dbOp.findOne({ _id: "xyz" });
			res.should.be.eql(testObj);
		});

		it("should return null when document was not found", async () => {
			const res = await dbOp.findOne({ _id: "xyz_abc" });
			expect(res).to.be.null;
		});
	});

	describe(".count", () => {
		const testObj = { type: "doc", a: 2, _id: "xyz" };
		beforeEach(() => {
			store.insert(testObj);
		});

		it("should find the document with _id = xyz", async () => {
			const res = await dbOp.count({ _id: "xyz" });
			res.should.be.equal(1);
		});

		it("should return null when document was not found", async () => {
			const res = await dbOp.count({ _id: "xyz_abc" });
			expect(res).to.be.equal(0);
		});
	});

	describe(".find", () => {
		const testObjs = [
			{ type: "doc", age: 2, _id: "xyz" },
			{ type: "doc", age: 3, _id: "xyz3" },
			{ type: "doc", age: 4, _id: "xyz4" },
			{ type: "doc", age: 5, _id: "xyz5" },
			{ type: "doc", age: 6, _id: "xyz6" },
		];
		beforeEach(() => {
			for (const obj of testObjs) {
				store.insert(obj);
			}
		});

		it("should return 5 documents with type=doc", async () => {
			const res = await dbOp.find({ type: "doc" });
			res.length.should.be.equal(5);
		});

		it("should return 2 documents with type=doc, limit=2", async () => {
			const res = await dbOp.find({ type: "doc" }, 2);
			res.length.should.be.equal(2);
			res[0].should.be.eql(testObjs[0]);
			res[1].should.be.eql(testObjs[1]);
		});

		it(
			"should return 2 documents and skip the doc at index 1 when " +
				"args are type=doc, limit=2, skip=1",
			async () => {
				const res = await dbOp.find({ type: "doc" }, 2, 1);
				res.length.should.be.equal(2);
				res[0].should.be.eql(testObjs[1]);
				res[1].should.be.eql(testObjs[2]);
			},
		);

		it(
			"should return 2 documents, skip the doc and sort by age=-1 at index 1 and  when " +
				"args are type=doc, limit=2, skip=1",
			async () => {
				const res = await dbOp.find({ type: "doc" }, 2, 1, { age: -1 });
				res.length.should.be.equal(2);
				res[0].should.be.eql(testObjs[3]);
				res[1].should.be.eql(testObjs[2]);
			},
		);
	});

	describe(".insert", () => {
		const testObjs = [
			{ type: "doc", age: 2, _id: "xyz" },
			{ type: "doc", age: 3, _id: "xyz3" },
		];
		beforeEach(async () => {
			await dbOp.insert(...testObjs);
		});

		it("should insert 2 documents", (done) => {
			const res = store.count({}, (err, count) => {
				// prettier-ignore
				if (err) { return done(err); }
				count.should.be.equal(2);
				done();
			});
		});
	});

	describe(".remove", () => {
		const testObjs = [
			{ type: "doc", age: 2, _id: "xyz" },
			{ type: "doc", age: 3, _id: "xyz3" },
		];
		beforeEach(async () => {
			await dbOp.insert(...testObjs);
			const count = await dbOp.count({});
			count.should.be.equal(2);
		});

		it("should insert 2 documents", async () => {
			const res = await dbOp.remove({ _id: "xyz" });
			const count = await dbOp.count({});
			count.should.be.equal(1);
		});
	});
});
