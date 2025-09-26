import _GenericBar from "./generic-bar";
import * as _options from "./options";

import { Options, Preset } from "./types";

// Progress-Bar constructor
export default class SingleBar extends _GenericBar {
  private timer: NodeJS.Timeout | null;
  private schedulingRate: number;
  private sigintCallback: (() => void) | null;

  constructor(options: Options, preset?: Preset) {
    super(_options.parse(options, preset));

    // the update timer
    this.timer = null;

    // disable synchronous updates in notty mode
    if (this.options.noTTYOutput && this.terminal.isTTY() === false) {
      this.options.synchronousUpdate = false;
    }

    // update interval
    this.schedulingRate = this.terminal.isTTY()
      ? // @ts-ignore
        this.options.throttleTime
      : this.options.notTTYSchedule;

    // callback used for gracefulExit
    this.sigintCallback = null;
  }

  // internal render function
  override render() {
    // stop timer
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    // run internal rendering
    super.render();

    // add new line in notty mode!
    if (this.options.noTTYOutput && this.terminal.isTTY() === false) {
      this.terminal.newline();
    }

    // next update
    this.timer = setTimeout(this.render.bind(this), this.schedulingRate);
  }

  override update(payload: object): void;
  override update(current: number, payload?: object): void;
  override update(current: number | object, payload?: object) {
    if (typeof current !== "number") {
      throw new Error("Not implemented");
    }

    // timer inactive ?
    if (!this.timer) {
      return;
    }

    super.update(current, payload);

    // trigger synchronous update ?
    // check for throttle time
    if (
      this.options.synchronousUpdate &&
      // @ts-ignore
      this.lastRedraw + this.options.throttleTime * 2 < Date.now()
    ) {
      // force update
      this.render();
    }
  }

  // start the progress bar
  override start(total: number, startValue: number, payload?: object) {
    // progress updates are only visible in TTY mode!
    if (this.options.noTTYOutput === false && this.terminal.isTTY() === false) {
      return;
    }

    // add handler to restore cursor settings (stop the bar) on SIGINT/SIGTERM ?
    if (this.sigintCallback === null && this.options.gracefulExit) {
      this.sigintCallback = this.stop.bind(this);
      process.once("SIGINT", this.sigintCallback);
      process.once("SIGTERM", this.sigintCallback);
    }

    // save current cursor settings
    this.terminal.cursorSave();

    // hide the cursor ?
    if (this.options.hideCursor === true) {
      this.terminal.cursor(false);
    }

    // disable line wrapping ?
    if (this.options.linewrap === false) {
      this.terminal.lineWrapping(false);
    }

    // initialize bar
    super.start(total, startValue, payload);

    // redraw on start!
    this.render();
  }

  // stop the bar
  override stop() {
    // timer inactive ?
    if (!this.timer) {
      return;
    }

    // remove sigint listener
    if (this.sigintCallback) {
      process.removeListener("SIGINT", this.sigintCallback);
      process.removeListener("SIGTERM", this.sigintCallback);
      this.sigintCallback = null;
    }

    // trigger final rendering
    this.render();

    // restore state
    super.stop();

    // stop timer
    clearTimeout(this.timer);
    this.timer = null;

    // cursor hidden ?
    if (this.options.hideCursor === true) {
      this.terminal.cursor(true);
    }

    // re-enable line wrapping ?
    if (this.options.linewrap === false) {
      this.terminal.lineWrapping(true);
    }

    // restore cursor on complete (position + settings)
    this.terminal.cursorRestore();

    // clear line on complete ?
    if (this.options.clearOnComplete) {
      this.terminal.cursorTo(0, null);
      this.terminal.clearLine();
    } else {
      // new line on complete
      this.terminal.newline();
    }
  }
}
