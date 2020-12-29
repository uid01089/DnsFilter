"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const config = {
    DnsServer: {
        Address: "127.0.0.1",
        Port: 9530
    },
    UpstreamServer: {
        Address: "192.168.0.1",
        Port: 53
    },
    BlackLists: {
        Common: [/heise.de/],
    }
};
exports.config = config;
//# sourceMappingURL=Config.js.map