import { ConfigImpl, Config } from "./Config";
import dgram from 'dgram';
import { PatternMatcher } from "./PatternMatcher";
import { Server } from "http";


const dnsPacket = require('dns-packet');


class DnsFilter {
    private configImpl: ConfigImpl;
    private patternMatcher: PatternMatcher;
    private config: Config;
    private server: dgram.Socket;

    constructor(configImpl: ConfigImpl) {

        this.configImpl = configImpl;
        this.config = configImpl.getConfig();
        this.patternMatcher = new PatternMatcher(this.config.BlackLists);

        this.server = this.instantiateServer();

        this.configImpl.registerChangeListener((newConfig) => {
            this.config = newConfig;
            this.server.close();
            this.instantiateServer();

        });




    }

    private instantiateServer(): dgram.Socket {
        const server = dgram.createSocket('udp4');


        server.on('listening', () => {
            console.log(`Listening on ${this.config.DnsServer.Address} at ${this.config.DnsServer.Port}`);
        });

        server.on('error', (err) => {
            console.error(err);
        })

        server.on('message', async (message, rinfo) => {

            //console.log(dnsPacket.decode(message));


            const dnsPack = dnsPacket.decode(message);
            const askedHost = <string>dnsPack.questions[0].name;


            let response;
            if (this.patternMatcher.isBlocked(askedHost, rinfo.address)) {
                console.log(`${rinfo.address} requests ${askedHost} but blocked`);
                response = this.blockMessage(message);
            } else {
                console.log(`${rinfo.address} requests ${askedHost}`);
                response = await this.forwardToUpstream(message);
            }

            server.send(response, 0, response.length, rinfo.port, rinfo.address)

        })


        server.bind(this.config.DnsServer.Port, this.config.DnsServer.Address);

        return server;
    }
    blockMessage(message: Buffer): Buffer {
        const dnsPack = dnsPacket.decode(message);
        // Set qr, ra and rd flags
        dnsPack.flags = (1 << 15) | (1 << 8) | (1 << 7);
        dnsPack.type = 'response';
        (dnsPack.answers as []).push({
            class: 'IN',
            data: '192.168.0.3',
            flush: false,
            name: <string>dnsPack.questions[0].name,
            ttl: 19527,
            type: 'A'
        });

        return dnsPacket.encode(dnsPack);

    }

    private async forwardToUpstream(message: Buffer): Promise<Buffer> {

        return new Promise<Buffer>((resolve, reject) => {
            const sock = dgram.createSocket('udp4');

            sock.send(message, 0, message.length, this.config.UpstreamServer.Port, this.config.UpstreamServer.Address, () => {
                //console.log();
            });

            sock.on('error', (err) => {
                console.error(err);
                reject(err);
            });

            sock.on('message', (response) => {
                //console.log(dnsPacket.decode(response));
                sock.close();
                resolve(response);
            });
        });
    }


}





export { DnsFilter };