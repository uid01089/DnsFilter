"use strict";
/*
Usage:

static mutex = new Mutex();

var release: Function;
try{
    release = await Alphaventage.mutex.lock();

....

} finally {
            release();
        }


*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
class Mutex {
    constructor() {
        this.locking = Promise.resolve();
        this.locks = 0;
    }
    isLocked() {
        return this.locks > 0;
    }
    lock() {
        this.locks += 1;
        let unlockNextFct;
        const willLock = new Promise((resolve) => {
            unlockNextFct = (() => {
                this.locks -= 1;
                resolve();
            });
        });
        const willUnlock = this.locking.then(() => unlockNextFct);
        this.locking = this.locking.then(() => willLock);
        return willUnlock;
    }
}
exports.Mutex = Mutex;
//# sourceMappingURL=Mutex.js.map