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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const imageLib_1 = __importDefault(require("../libs/imageLib"));
const request = (0, supertest_1.default)(index_1.default);
describe('Images endpoint', () => {
    it('should return a resized image', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/images?width=200&height=200&name=fjord');
        expect(response.status).toEqual(200);
        expect(response.headers['content-type']).toBe('image/jpeg');
    }));
    it('should return generated resized image', () => __awaiter(void 0, void 0, void 0, function* () {
        const width = 200;
        const height = 200;
        const name = 'fjord';
        const filePath = imageLib_1.default.getOutputFilePath(imageLib_1.default.generateFileName(name, width, height));
        const deleteFileIfExist = yield imageLib_1.default.deleteFile(filePath);
        if (deleteFileIfExist) {
            const response = yield request.get(`/images?width=${width}&height=${height}&name=${name}`);
            expect(response.status).toEqual(200);
            expect(response.headers['content-type']).toBe('image/jpeg');
        }
        const fileExist = yield imageLib_1.default.fileExist(filePath);
        expect(fileExist).toBeTrue();
    }));
    it('should return a 400 error if the width or height or name parameter is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/images?width=200&height=200');
        expect(response.status).toEqual(400);
        expect(response.body.toString()).toEqual('Width, height and name parameters are required');
    }));
    it('should return a 400 error if the width or height parameter is text', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/images?width=200&height=text&name=fjord');
        expect(response.status).toEqual(400);
        expect(response.body.toString()).toEqual('Width and height parameters must be numbers');
    }));
    it('should return a 400 error if the width or height parameter is less than 1', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/images?width=200&height=-1&name=fjord');
        expect(response.status).toEqual(400);
        expect(response.body.toString()).toEqual('Width and height parameters must be greater than Zero');
    }));
    it('should return a 404 error if the file is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/images?width=200&height=200&name=ffjord');
        expect(response.status).toEqual(404);
        expect(response.body.toString()).toEqual('File not found');
    }));
});
