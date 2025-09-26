import { Options } from "./types";

// format bar
export default function formatBar(progress: number, options: Options) {
  // calculate barsize
  const completeSize = Math.round(progress * options.barsize!);
  const incompleteSize = options.barsize! - completeSize;

  // generate bar string by stripping the pre-rendered strings
  return (
    options.barCompleteString!.substr(0, completeSize) +
    options.barGlue +
    options.barIncompleteString!.substr(0, incompleteSize)
  );
}
