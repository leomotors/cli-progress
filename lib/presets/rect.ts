import { Preset } from "../types";

const rectStyle = {
  format: " {bar}\u25A0 {percentage}% | ETA: {eta}s | {value}/{total}",
  barCompleteChar: "\u25A0",
  barIncompleteChar: " ",
} satisfies Preset;

export default rectStyle;
