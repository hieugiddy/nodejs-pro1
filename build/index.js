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
const express_1 = __importDefault(require("express"));
const imageResizeParamsValidator_1 = __importDefault(require("./utilities/imageResizeParamsValidator"));
const imageCacheMiddleware_1 = __importDefault(require("./utilities/imageCacheMiddleware"));
const imageLib_1 = __importDefault(require("./libs/imageLib"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/health_check', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Application running ok');
}));
app.get('/images', [imageResizeParamsValidator_1.default, imageCacheMiddleware_1.default], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { width, height, name } = req.query;
    const inputFilePath = imageLib_1.default.getInputFilePath(name);
    console.log(`Generated input file name ${inputFilePath}`);
    const fileExist = yield imageLib_1.default.fileExist(inputFilePath);
    console.log(`Input file exist: ${fileExist}`);
    res.set('Content-Type', 'image/jpeg');
    if (!fileExist) {
        return res.status(404).send('File not found');
    }
    const convertResponse = yield imageLib_1.default.convertImage(name, width, height);
    console.log(`Convert Images response ${convertResponse}`);
    if (!convertResponse) {
        return res.status(500).send('Failed to convert image');
    }
    const file = imageLib_1.default.readFile(imageLib_1.default.getOutputFilePath(imageLib_1.default.generateFileName(name, width, height)));
    file.pipe(res);
}));
app.listen(port, () => {
    console.log(`server started at localhost:${port}`);
});
exports.default = app;
