export default class Logger {
  logs;

  constructor() {
    this.logs = [];
  }

  log(message) {
    this.logs.push([new Date().toLocaleTimeString("nl-NL"), message]);
  }

  clear() {
    this.logs = [];
  }
}
