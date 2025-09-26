import _readline from "readline";

// low-level terminal interactions
export default class Terminal {
  private stream: NodeJS.WritableStream & { isTTY?: boolean; columns?: number };
  private linewrap: boolean;
  private dy: number;

  constructor(outputStream: NodeJS.WritableStream) {
    this.stream = outputStream;

    // default: line wrapping enabled
    this.linewrap = true;

    // current, relative y position
    this.dy = 0;
  }

  // save cursor position + settings
  cursorSave() {
    if (!this.stream.isTTY) {
      return;
    }

    // save position
    this.stream.write("\x1B7");
  }

  // restore last cursor position + settings
  cursorRestore() {
    if (!this.stream.isTTY) {
      return;
    }

    // restore cursor
    this.stream.write("\x1B8");
  }

  // show/hide cursor
  cursor(enabled: boolean) {
    if (!this.stream.isTTY) {
      return;
    }

    if (enabled) {
      this.stream.write("\x1B[?25h");
    } else {
      this.stream.write("\x1B[?25l");
    }
  }

  // change cursor position
  cursorTo(x: number | null = null, y: number | null = null) {
    if (!this.stream.isTTY) {
      return;
    }

    // move cursor absolute
    _readline.cursorTo(this.stream, x, y);
  }

  // change relative cursor position
  cursorRelative(dx: number | null = null, dy: number | null = null) {
    if (!this.stream.isTTY) {
      return;
    }

    // store current position
    this.dy = this.dy + dy;

    // move cursor relative
    _readline.moveCursor(this.stream, dx, dy);
  }

  // relative reset
  cursorRelativeReset() {
    if (!this.stream.isTTY) {
      return;
    }

    // move cursor to initial line
    _readline.moveCursor(this.stream, 0, -this.dy);

    // first char
    _readline.cursorTo(this.stream, 0, null);

    // reset counter
    this.dy = 0;
  }

  // clear to the right from cursor
  clearRight() {
    if (!this.stream.isTTY) {
      return;
    }

    _readline.clearLine(this.stream, 1);
  }

  // clear the full line
  clearLine() {
    if (!this.stream.isTTY) {
      return;
    }

    _readline.clearLine(this.stream, 0);
  }

  // clear everyting beyond the current line
  clearBottom() {
    if (!this.stream.isTTY) {
      return;
    }

    _readline.clearScreenDown(this.stream);
  }

  // add new line; increment counter
  newline() {
    this.stream.write("\n");
    this.dy++;
  }

  // write content to output stream
  // @TODO use string-width to strip length
  write(s, rawWrite = false) {
    // line wrapping enabled ? trim output
    // this is just a fallback mechanism in case user enabled line-wrapping via options or set it to auto
    if (this.linewrap === true && rawWrite === false) {
      this.stream.write(s.substr(0, this.getWidth()));

      // standard behaviour with disabled linewrapping
    } else {
      this.stream.write(s);
    }
  }

  // control line wrapping
  lineWrapping(enabled: boolean) {
    if (!this.stream.isTTY) {
      return;
    }

    // store state
    this.linewrap = enabled;
    if (enabled) {
      this.stream.write("\x1B[?7h");
    } else {
      this.stream.write("\x1B[?7l");
    }
  }

  // tty environment ?
  isTTY() {
    return this.stream.isTTY === true;
  }

  // get terminal width
  getWidth() {
    // set max width to 80 in tty-mode and 200 in notty-mode
    return this.stream.columns || (this.stream.isTTY ? 80 : 200);
  }
}
