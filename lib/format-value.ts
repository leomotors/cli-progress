// default value format (apply autopadding)

import { Options, ValueType } from "./types";

// format valueset
export default function formatValue(
  v: number,
  options: Options,
  type: ValueType
) {
  // no autopadding ? passthrough
  if (options.autopadding !== true) {
    return v;
  }

  // padding
  function autopadding(value: number, length: number) {
    return (options.autopaddingChar! + value).slice(-length);
  }

  switch (type) {
    case "percentage":
      return autopadding(v, 3);

    default:
      return v;
  }
}
