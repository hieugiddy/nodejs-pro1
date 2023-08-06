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
const imageLib_1 = __importDefault(require("../libs/imageLib"));
const fetchCacheIfExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { width, height, name } = req.query;
    const outputFilePath = imageLib_1.default.getOutputFilePath(imageLib_1.default.generateFileName(name, width, height));
    const fileExist = yield imageLib_1.default.fileExist(outputFilePath);
    console.log(`file ${outputFilePath} exist: ${fileExist}`);
    if (fileExist) {
        res.set('Content-Type', 'image/jpeg');
        imageLib_1.default.readFile(outputFilePath).pipe(res);
        return res.status(200);
    }
    next();
});
exports.default = fetchCacheIfExist;
