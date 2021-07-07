import { UIMenuItem } from '../';
import { Rectangle, Sprite } from '../../../';
import { Menu } from '../../';
export declare abstract class AbstractUIMenuPanel {
    readonly id: string;
    protected parentItem: UIMenuItem;
    protected enabled: boolean;
    protected readonly background: Sprite | Rectangle;
    get ParentMenu(): Menu;
    get ParentItem(): UIMenuItem;
    set ParentItem(value: UIMenuItem);
    get Enabled(): boolean;
    set Enabled(value: boolean);
    get Height(): number;
    setVerticalPosition(y: number): void;
    draw(): void;
}
