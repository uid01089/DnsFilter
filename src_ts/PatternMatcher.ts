import { BlackLists } from "./Config";

class PatternMatcher {
    private blackLists: BlackLists;

    constructor(blackLists: BlackLists) {
        this.blackLists = blackLists;
    }

    public isBlocked(name: string, requester: string): boolean {
        let isBlocked = this.isCommonBlocked(name);

        if (!isBlocked) {
            isBlocked = this.isSpecificBlocked(name, requester);
        }

        return isBlocked;
    }
    private isSpecificBlocked(name: string, requester: string): boolean {
        let isBlocked = false;

        const index = Object.keys(this.blackLists).indexOf(requester);
        if (index != -1) {
            const specificBlackList = Object.values(this.blackLists)[index];
            for (const regExp of specificBlackList) {
                isBlocked = regExp.test(name);
                break;
            }
            return isBlocked;
        }

        return isBlocked;
    }

    private isCommonBlocked(name: string): boolean {
        let isBlocked = false;
        for (const regExp of this.blackLists.Common) {
            isBlocked = regExp.test(name);
            break;
        }
        return isBlocked;
    }
}

export { PatternMatcher };