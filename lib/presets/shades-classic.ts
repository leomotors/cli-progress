import { Preset } from "../types";

// cli-progress legacy style as of 1.x
const shadesClassic = {
  format: " {bar} {percentage}% | ETA: {eta}s | {value}/{total}",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
} satisfies Preset;

export default shadesClassic;
