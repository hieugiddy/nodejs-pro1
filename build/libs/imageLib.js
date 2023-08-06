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
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
const generateFileName = (fileName, width, height) => `${fileName}x${width}x${height}`;
const getOutputFilePath = (fileName) => `${config_1.default.pathRoot}/processedImages/${fileName}.jpg`;
const getInputFilePath = (fileName) => `${config_1.default.pathRoot}/images/${fileName}.jpg`;
const fileExist = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_1.default.promises.stat(filePath);
        return true;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
});
const deleteFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs_1.default.promises.unlink(filePath);
        return true;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return true;
        }
        return false;
    }
});
const readFile = (filePath) => {
    return fs_1.default.createReadStream(filePath);
};
const convertImage = (fileName, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = (0, sharp_1.default)(getInputFilePath(fileName));
        image.resize(Number(width), Number(height));
        image.toFormat('jpeg');
        yield image.toFile(getOutputFilePath(generateFileName(fileName, width, height)));
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.default = {
    generateFileName,
    getOutputFilePath,
    getInputFilePath,
    fileExist,
    readFile,
    convertImage,
    deleteFile
};
