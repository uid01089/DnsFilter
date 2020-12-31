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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PictureUtil = void 0;
const FetchCache_1 = require("./FetchCache");
class PictureUtil {
    constructor() {
        // TODO: just for testing - for later usager
        this.blobToFile = (theBlob, fileName) => {
            var b = theBlob;
            //A Blob() is almost a File() - it's just missing the two properties below which we will add
            b.lastModifiedDate = new Date();
            b.name = fileName;
            //Cast to a File() type
            return theBlob;
        };
    }
    static load(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let img = PictureUtil.url2Image.get(url);
            if (img === undefined) {
                img = yield PictureUtil.performLoad(url);
                PictureUtil.url2Image.set(url, img);
            }
            return img;
        });
    }
    static performLoad(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // https://stackoverflow.com/questions/47001306/display-png-from-http-get-request
            const response = yield FetchCache_1.FetchCache.fetch("BuildUtil", url);
            const blob = yield response.blob();
            const img = URL.createObjectURL(blob);
            // https://stackoverflow.com/questions/7650587/using-javascript-to-display-a-blob
            return new Promise(resolve => {
                const myImg = new Image();
                myImg.onload = () => {
                    URL.revokeObjectURL(img);
                    resolve(myImg);
                };
                myImg.onerror = () => {
                    URL.revokeObjectURL(img);
                    resolve(null);
                };
                myImg.src = img;
            });
        });
    }
    static imageToCanvas(img) {
        // https://stackoverflow.com/questions/8751020/how-to-get-a-pixels-x-y-coordinate-color-from-an-image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        return canvas;
    }
    static getPixelFromCanvas(canvas, x, y) {
        //https://stackoverflow.com/questions/8751020/how-to-get-a-pixels-x-y-coordinate-color-from-an-image
        const pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
        return pixelData;
    }
    static getCanvasData(canvas) {
        //https://stackoverflow.com/questions/19499500/canvas-getimagedata-for-optimal-performance-to-pull-out-all-data-or-one-at-a
        const myGetImageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        const sourceBuffer32 = new Uint32Array(myGetImageData.data.buffer);
        return sourceBuffer32;
    }
}
exports.PictureUtil = PictureUtil;
PictureUtil.url2Image = new Map();
//# sourceMappingURL=PictureUtil.js.map