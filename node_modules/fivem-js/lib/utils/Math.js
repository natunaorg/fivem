"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = exports.clamp = void 0;
function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
exports.clamp = clamp;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.getRandomInt = getRandomInt;
