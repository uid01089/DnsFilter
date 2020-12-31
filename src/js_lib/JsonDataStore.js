"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDataGitStore = exports.JsonDataStore = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const promise_1 = __importDefault(require("simple-git/promise"));
class JsonDataStore {
    constructor(path, alternative) {
        this.path = path;
        this.alternative = alternative;
    }
    // This will just return the property on the `data` object
    read() {
        return this.parseDataFile(this.path);
    }
    setPath(path) {
        this.path = path;
    }
    write(object) {
        const json = JSON.stringify(object, null, 4);
        fs_1.default.writeFileSync(this.path, json);
    }
    registerChangeListener(callBack) {
        fs_1.default.watchFile(this.path, () => {
            const newConfig = this.read();
            callBack(newConfig);
        });
    }
    parseDataFile(filePath) {
        try {
            return JSON.parse(fs_1.default.readFileSync(filePath).toString());
        }
        catch (error) {
            // if there was some kind of error, return the passed in defaults instead.
            this.write(this.alternative);
            return this.alternative;
        }
    }
}
exports.JsonDataStore = JsonDataStore;
class JsonDataGitStore extends JsonDataStore {
    constructor(fileName, alternative) {
        super(fileName, alternative);
    }
    write(object) {
        super.write(object);
        const git = promise_1.default(path_1.default.dirname(this.path));
        git.add('./*');
        git.commit((new Date()).toLocaleString());
    }
}
exports.JsonDataGitStore = JsonDataGitStore;
//# sourceMappingURL=JsonDataStore.js.map