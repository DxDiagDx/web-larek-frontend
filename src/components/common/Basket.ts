import { IBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export class Basket extends Component<IBasket> {
    protected _items: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._items = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this._button.addEventListener('click', () => {
            this.events.emit('order:open');
        })

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._items.replaceChildren(...items);
            this.setDisabled(this._button, false);
        } else {
            this._items.replaceChildren();
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}
}