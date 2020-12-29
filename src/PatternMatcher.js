"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternMatcher = void 0;
class PatternMatcher {
    constructor(blackLists) {
        this.blackLists = blackLists;
    }
    isBlocked(name, requester) {
        let isBlocked = this.isCommonBlocked(name);
        if (!isBlocked) {
            isBlocked = this.isSpecificBlocked(name, requester);
        }
        return isBlocked;
    }
    isSpecificBlocked(name, requester) {
        const isBlocked = false;
        return isBlocked;
    }
    isCommonBlocked(name) {
        let isBlocked = false;
        for (const regExp of this.blackLists.Common) {
            isBlocked = regExp.test(name);
            break;
        }
        return isBlocked;
    }
}
exports.PatternMatcher = PatternMatcher;
//# sourceMappingURL=PatternMatcher.js.map