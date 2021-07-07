"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    constructor(x = 0, y = 0) {
        this.X = x;
        this.Y = y;
    }
    static parse(arg) {
        let point = new Point();
        if (arg) {
            if (typeof arg === 'object') {
                if (Array.isArray(arg)) {
                    if (arg.length === 2) {
                        point = new Point(arg[0], arg[1]);
                    }
                }
                else if (arg.X && arg.Y) {
                    point = new Point(arg.X, arg.Y);
                }
            }
            else {
                if (arg.indexOf(',') !== -1) {
                    const arr = arg.split(',');
                    point = new Point(parseFloat(arr[0]), parseFloat(arr[1]));
                }
            }
        }
        return point;
    }
}
exports.Point = Point;
