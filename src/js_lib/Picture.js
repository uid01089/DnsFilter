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
exports.Picture = void 0;
const PictureUtil_1 = require("./PictureUtil");
class Picture {
    constructor(url) {
        this.url = url;
    }
    getUrl() {
        return this.url;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield PictureUtil_1.PictureUtil.load(this.url);
            const canvas = PictureUtil_1.PictureUtil.imageToCanvas(image);
            this.data = PictureUtil_1.PictureUtil.getCanvasData(canvas);
            this.width = canvas.width;
            this.height = canvas.height;
        });
    }
    getPixel(x, y) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.data === undefined) {
                yield this.load();
            }
            else {
                //console.log("Picture already loaded");
            }
            const index = y * this.width + x;
            const pixel = this.data[index];
            //(A<<24) | (B<<16) | (G<<8) | R ;
            return {
                R: pixel & 0xff,
                G: (pixel >> 8) & 0xff,
                B: (pixel >> 16) & 0xff,
                A: (pixel >> 24) & 0xff
            };
        });
    }
}
exports.Picture = Picture;
//# sourceMappingURL=Picture.js.map