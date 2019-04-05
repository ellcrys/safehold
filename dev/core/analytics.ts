import { app } from "electron";
const ua = require("universal-analytics");
const uuid = require("uuid/v4");
const { JSONStorage } = require("node-localstorage");
const nodeStorage = new JSONStorage(app.getPath("userData"));

// Retrieve the userId value, and if it's not there, assign it a new uuid.
const userId = nodeStorage.getItem("userId") || uuid();
nodeStorage.setItem("userId", userId);

const usr = ua("UA-101346362-5", userId);

export default function trackEvent(
	category: string,
	action: string,
	label?: string,
	value?: any,
) {
	usr.event({
		ec: category,
		ea: action,
		el: label,
		ev: value,
	}).send();
}

export function exceptionEvent(desc: string, fatal?: boolean) {
	usr.exception(desc, fatal);
}

export function timingEvent(category: string, variable: string, time: number) {
	usr.timing(category, variable, time);
}
