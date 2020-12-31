"use strict";
// see https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/match
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCache = void 0;
class FetchCache {
    static fetch(cacheName, url, init) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = new Request(url);
                //type RequestMode = "navigate" | "same-origin" | "no-cors" | "cors";
                const requestInit = (init === undefined ? { mode: 'cors' } : init);
                // Is request in the cache?
                let response;
                if (null != window.caches) {
                    const cacheStorage = yield caches.open(cacheName);
                    response = yield cacheStorage.match(request);
                    if (response == undefined) {
                        response = yield fetch(request, requestInit);
                        cacheStorage.put(request, response.clone());
                    }
                }
                else {
                    response = yield fetch(request);
                    console.warn("window.caches not supported");
                }
                return response.clone();
            }
            catch (e) {
                console.log(e);
                throw e;
            }
        });
    }
    // Does not work - for further investigation
    static fetchCrossOrigin(parentUrl, cacheName, url, init) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.setAttribute('src', parentUrl);
        iframe.onload = () => {
            const response = fetch(url, { mode: 'cors' });
            response.then((resp) => {
                console.log(resp);
            }).catch((e) => {
                console.log(e);
            });
        };
        document.head.appendChild(iframe);
    }
}
exports.FetchCache = FetchCache;
//# sourceMappingURL=FetchCache.js.map