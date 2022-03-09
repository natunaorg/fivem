export type TickHandler = () => void;

export default class TickManager {
    constructor() {
        setTick(() => {
            for (const tick of this.#list) {
                tick.handler();
            }
        });
    }

    #count = 0;
    #list: { id: number; handler: TickHandler }[] = [];

    set = (handler: TickHandler) => {
        const id = this.#count;

        this.#list.push({ id, handler });
        this.#count++;

        return id;
    };

    remove = (id: number) => {
        this.#list = this.#list.filter((t) => t.id !== id);
        return true;
    };

    update = (id: number, handler: TickHandler) => {
        const index = this.#list.findIndex((t) => t.id === id);

        if (index === -1) {
            return false;
        }

        this.#list[index].handler = handler;
        return true;
    };
}
