export declare class Color {
    static empty: Color;
    static transparent: Color;
    static black: Color;
    static white: Color;
    static whiteSmoke: Color;
    static fromArgb(a: number, r: number, g: number, b: number): Color;
    static fromRgb(r: number, g: number, b: number): Color;
    a: number;
    r: number;
    g: number;
    b: number;
    constructor(a: number, r: number, g: number, b: number);
}
