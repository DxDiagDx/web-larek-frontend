import { ensureElement } from "./../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IPage {
    gallery: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected _gallery: HTMLElement;
    protected _basket: HTMLElement;
    protected _counter: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._gallery = ensureElement<HTMLElement>('.gallery');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        })
    }

    set gallery(items: HTMLElement[]) {
        this._gallery.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }

    set counter(value: number) {
        this.setText(this._counter, value);
    }
}