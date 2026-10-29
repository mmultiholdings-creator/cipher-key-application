import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The prop must stay browser-local: no real device detection and no network calls.
const engine = readFileSync(resolve(__dirname, "../cipher/engine.ts"), "utf8");
const markup = readFileSync(resolve(__dirname, "../cipher/cipher-markup.html"), "utf8");

describe("C.I.P.H.E.R. prop stays browser-local", () => {
  it("never touches real USB / Bluetooth / HID / serial devices", () => {
    expect(engine).not.toMatch(/navigator\.(usb|bluetooth|hid|serial)/);
  });

  it("makes no network requests", () => {
    expect(engine).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/);
  });

  it("uses in-page dialogs instead of native prompt/confirm boxes", () => {
    expect(engine).not.toMatch(/window\.(prompt|confirm|alert)\s*\(/);
  });

  it("loads no external scripts or images in the page markup", () => {
    expect(markup).not.toMatch(/(src|href)="https?:\/\//);
  });
});
