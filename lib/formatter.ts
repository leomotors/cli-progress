import _stringWidth from "string-width";
import _defaultFormatValue from "./format-value";
import _defaultFormatBar from "./format-bar";
import _defaultFormatTime from "./format-time";
import { Options, Params } from "./types";

// generic formatter
export default function defaultFormatter(
  options: Options,
  params: Params,
  payload: any
) {
  // copy format string
  let s = options.format;

  // custom time format set ?
  const formatTime = options.formatTime || _defaultFormatTime;

  // custom value format set ?
  const formatValue = options.formatValue || _defaultFormatValue;

  // custom bar format set ?
  const formatBar = options.formatBar || _defaultFormatBar;

  // calculate progress in percent
  const percentage = Math.floor(params.progress * 100) + "";

  // bar stopped and stopTime set ?
  const stopTime = params.stopTime || Date.now();

  // calculate elapsed time
  const elapsedTime = Math.round((stopTime - params.startTime) / 1000);

  // merges data from payload and calculated
  const context = Object.assign({}, payload, {
    bar: formatBar(params.progress, options),

    percentage: formatValue(+percentage, options, "percentage"),
    total: formatValue(params.total, options, "total"),
    value: formatValue(params.value, options, "value"),

    eta: formatValue(params.eta, options, "eta"),
    eta_formatted: formatTime(params.eta, options, 5),

    duration: formatValue(elapsedTime, options, "duration"),
    duration_formatted: formatTime(elapsedTime, options, 1),
  });

  // assign placeholder tokens
  s = (s as string).replace(/\{(\w+)\}/g, function (match, key) {
    // key exists within payload/context
    if (typeof context[key] !== "undefined") {
      return context[key];
    }

    // no changes to unknown values
    return match;
  });

  // calculate available whitespace (2 characters margin of error)
  const fullMargin = Math.max(0, params.maxWidth - _stringWidth(s) - 2);
  const halfMargin = Math.floor(fullMargin / 2);

  // distribute available whitespace according to position
  switch (options.align) {
    // fill start-of-line with whitespaces
    case "right":
      s = fullMargin > 0 ? " ".repeat(fullMargin) + s : s;
      break;

    // distribute whitespaces to left+right
    case "center":
      s = halfMargin > 0 ? " ".repeat(halfMargin) + s : s;
      break;

    // default: left align, no additional whitespaces
    case "left":
    default:
      break;
  }

  return s;
}
