const listeners = [];
export const logServer = {
  push(log) {
    for(const fn of listeners) fn(log);
  },
  subscribe(fn) {
    listeners.push(fn);
  }
};
