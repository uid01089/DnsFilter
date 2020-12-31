"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigImpl = exports.config = void 0;
const JsonDataStore_1 = require("./js_lib/JsonDataStore");
const defaultConfig = {
    DnsServer: {
        Address: "127.0.0.1",
        Port: 9530
    },
    UpstreamServer: {
        Address: "192.168.0.1",
        Port: 53
    },
    BlackLists: {
        Common: []
    }
};
class ConfigImpl {
    constructor(config, path) {
        this.dataStore = new JsonDataStore_1.JsonDataStore(path, config);
    }
    getConfig() {
        return this.dataStore.read();
    }
    registerChangeListener(callBack) {
        this.dataStore.registerChangeListener(callBack);
    }
}
exports.ConfigImpl = ConfigImpl;
const config = new ConfigImpl(defaultConfig, "./dnsFilter.conf");
exports.config = config;
//# sourceMappingURL=Config.js.map