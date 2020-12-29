// https://github.com/ekristen/dns-proxy

import { config } from './Config';
import { DnsFilter } from './DnsFilter';

const dnsFilter = new DnsFilter(config);




/*


import dgram from 'dgram';
import { exit } from 'process';
import { DnsFilter } from './DnsFilter';
const dnsPacket = require('dns-packet');

const host = "127.0.0.1";
const port = 9530;
const upstreamDnsServer = "192.168.0.1";
const upstreamDnsServerPort = 53;

const server = dgram.createSocket('udp4');

server.on('listening', () => {
    console.log(`Listening on ${host} at ${port}`);
});

server.on('error', (err) => {
    console.error(err);
})

server.on('message', async (message, rinfo) => {

    console.log(dnsPacket.decode(message));

    const dnsPack = dnsPacket.decode(message);
    console.log(dnsPacket.decode(message));

    console.log(dnsPack.questions[0].name);

    const sock = dgram.createSocket('udp4');

    sock.send(message, 0, message.length, upstreamDnsServerPort, upstreamDnsServer, () => {
        console.log();
    });

    sock.on('error', (err) => {
        console.error(err);
    })

    sock.on('message', (response) => {
        console.log(dnsPacket.decode(response));
        server.send(response, 0, response.length, rinfo.port, rinfo.address)
        sock.close()
    })


})


server.bind(port, host);

*/