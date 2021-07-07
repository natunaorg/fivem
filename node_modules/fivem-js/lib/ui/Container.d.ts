import { Color, Point, Size } from '../utils';
import { IDrawable } from './';
export declare class Container implements IDrawable {
    pos: Point;
    size: Size;
    color: Color;
    items: IDrawable[];
    constructor(pos: Point, size: Size, color: Color);
    addItem(items: IDrawable | IDrawable[]): void;
    draw(offset?: Size, resolution?: Size): void;
}
