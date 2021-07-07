"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsCollection = void 0;
const modules_1 = require("../modules");
class ItemsCollection {
    constructor(items) {
        if (items.length === 0) {
            throw new Error('ItemsCollection cannot be empty');
        }
        this.items = items;
    }
    length() {
        return this.items.length;
    }
    getListItems() {
        const items = [];
        for (const item of this.items) {
            if (item instanceof modules_1.ListItem) {
                items.push(item);
            }
            else if (typeof item === 'string') {
                items.push(new modules_1.ListItem(item.toString()));
            }
        }
        return items;
    }
}
exports.ItemsCollection = ItemsCollection;
