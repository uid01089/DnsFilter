"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsFilter = void 0;
const dgram_1 = __importDefault(require("dgram"));
const PatternMatcher_1 = require("./PatternMatcher");
const dnsPacket = require('dns-packet');
class DnsFilter {
    constructor(configImpl) {
        this.configImpl = configImpl;
        this.config = configImpl.getConfig();
        this.patternMatcher = new PatternMatcher_1.PatternMatcher(this.config.BlackLists);
        this.server = this.instantiateServer();
        this.configImpl.registerChangeListener((newConfig) => {
            this.config = newConfig;
            this.server.close();
            this.instantiateServer();
        });
    }
    instantiateServer() {
        const server = dgram_1.default.createSocket('udp4');
        server.on('listening', () => {
            console.log(`Listening on ${this.config.DnsServer.Address} at ${this.config.DnsServer.Port}`);
        });
        server.on('error', (err) => {
            console.error(err);
        });
        server.on('message', (message, rinfo) => __awaiter(this, void 0, void 0, function* () {
            //console.log(dnsPacket.decode(message));
            const dnsPack = dnsPacket.decode(message);
            const askedHost = dnsPack.questions[0].name;
            console.log(`${rinfo.address} requests ${askedHost}`);
            let response;
            if (this.patternMatcher.isBlocked(askedHost, rinfo.address)) {
                response = this.blockMessage(message);
            }
            else {
                response = yield this.forwardToUpstream(message);
            }
            server.send(response, 0, response.length, rinfo.port, rinfo.address);
        }));
        server.bind(this.config.DnsServer.Port, this.config.DnsServer.Address);
        return server;
    }
    blockMessage(message) {
        const dnsPack = dnsPacket.decode(message);
        // Set qr, ra and rd flags
        dnsPack.flags = (1 << 15) | (1 << 8) | (1 << 7);
        dnsPack.type = 'response';
        dnsPack.answers.push({
            class: 'IN',
            data: '192.168.0.3',
            flush: false,
            name: dnsPack.questions[0].name,
            ttl: 19527,
            type: 'A'
        });
        return dnsPacket.encode(dnsPack);
    }
    forwardToUpstream(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sock = dgram_1.default.createSocket('udp4');
                sock.send(message, 0, message.length, this.config.UpstreamServer.Port, this.config.UpstreamServer.Address, () => {
                    console.log();
                });
                sock.on('error', (err) => {
                    console.error(err);
                    reject(err);
                });
                sock.on('message', (response) => {
                    console.log(dnsPacket.decode(response));
                    sock.close();
                    resolve(response);
                });
            });
        });
    }
}
exports.DnsFilter = DnsFilter;
//# sourceMappingURL=DnsFilter.js.map