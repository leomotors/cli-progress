import { Preset } from "../types";

// cli-progress legacy style as of 1.x
const shadesGrey = {
  format:
    " \u001b[90m{bar}\u001b[0m {percentage}% | ETA: {eta}s | {value}/{total}",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
} satisfies Preset;

export default shadesGrey;
