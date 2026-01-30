import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "util";

// react-router (v7+) relies on TextEncoder/TextDecoder, which are not guaranteed
// to exist on Jest's jsdom global.
if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder =
    TextDecoder as unknown as typeof globalThis.TextDecoder;
}
