import { Config } from "./Config";
import dgram from 'dgram';
import { PatternMatcher } from "./PatternMatcher";


const dnsPacket = require('dns-packet');


class DnsFilter {
    private config: Config;
    private patternMatcher: PatternMatcher;

    constructor(config: Config) {

        this.config = config;
        this.patternMatcher = new PatternMatcher(config.BlackLists);

        this.instantiateServer();


    }

    private instantiateServer(): void {
        const server = dgram.createSocket('udp4');

        server.on('listening', () => {
            console.log(`Listening on ${this.config.DnsServer.Address} at ${this.config.DnsServer.Port}`);
        });

        server.on('error', (err) => {
            console.error(err);
        })

        server.on('message', async (message, rinfo) => {

            console.log(dnsPacket.decode(message));

            const dnsPack = dnsPacket.decode(message);
            const askedHost = <string>dnsPack.questions[0].name;

            let response;
            if (this.patternMatcher.isBlocked(askedHost, rinfo.address)) {
                response = this.blockMessage(message);
            } else {
                response = await this.forwardToUpstream(message);
            }

            server.send(response, 0, response.length, rinfo.port, rinfo.address)

        })


        server.bind(this.config.DnsServer.Port, this.config.DnsServer.Address);
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
    }


}





export { DnsFilter };