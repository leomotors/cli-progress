import { Preset } from "../types";

// cli-progress legacy style as of 1.x
const legacyStyle = {
  format: "progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}",
  barCompleteChar: "=",
  barIncompleteChar: "-",
} satisfies Preset;

export default legacyStyle;
