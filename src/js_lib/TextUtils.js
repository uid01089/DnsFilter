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
exports.TextUtils = void 0;
class TextUtils {
    static loadText(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const text = reader.result;
                    resolve(text);
                };
                reader.onerror = (error) => {
                    reject(error);
                };
                reader.readAsText(file);
            });
        });
    }
    //https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
    static saveText(fileName, text) {
        const fileContent = new Blob([text], { type: "text/plain" });
        const a = document.createElement("a");
        const url = URL.createObjectURL(fileContent);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
    static asCsv(text, separator) {
        const table = [];
        const lines = text.match(/^.*((\r\n|\n|\r)|$)/gm);
        lines.forEach((line) => {
            const values = line.split(separator);
            const trimmedValues = values.map((e) => { return e.trim(); });
            table.push(trimmedValues);
        });
        return table;
    }
}
exports.TextUtils = TextUtils;
//# sourceMappingURL=TextUtils.js.map