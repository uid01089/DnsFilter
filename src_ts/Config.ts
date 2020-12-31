import { JsonDataStore } from "./js_lib/JsonDataStore";

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

const defaultConfig: Config = {
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

}

class ConfigImpl {
    dataStore: JsonDataStore<Config>;


    constructor(config: Config, path: string) {
        this.dataStore = new JsonDataStore(path, config);
    }

    public getConfig(): Config {
        return this.dataStore.read();
    }

    public registerChangeListener(callBack: (newConfig: Config) => void): void {
        this.dataStore.registerChangeListener(callBack);
    }



}

const config = new ConfigImpl(defaultConfig, "./dnsFilter.conf");

export { config, ConfigImpl, Config, BlackLists };