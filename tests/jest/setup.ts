import "regenerator-runtime/runtime";
import { TextEncoder, TextDecoder } from "util";

// ✅ Polyfill for environments missing these (keeps it safe)
if (typeof global.TextEncoder === "undefined") {
  (global as any).TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  (global as any).TextDecoder = TextDecoder;
}

// ✅ Use Jest's built-in JSDOM globals, not your own instance
// The testEnvironment: "jsdom" already provides `window`, `document`, `Element`, `SVGElement`, etc.
// You don’t need to create a new JSDOM manually.

// ✅ Optional custom matchers (uncomment if you use them)
// import * as matchers from "jest-extended";
// expect.extend(matchers);
