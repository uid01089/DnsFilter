interface UpstreamServer {
    Address: string;
    Port: number;
}

interface DnsServer {
    Address: string;
    Port: number;
}

interface BlackLists {
    Common: RegExp[];
    [key: string]: RegExp[];
}

interface Config {
    UpstreamServer: UpstreamServer;
    DnsServer: DnsServer;
    BlackLists: BlackLists;
}

const config: Config = {
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

}

export { config, Config, BlackLists };