import { IOrder } from "../types";
import { Form } from "./common/Form";
import { EventEmitter } from "./base/events";
import { ensureElement } from "../utils/utils";

export class Order extends Form<IOrder> {
    protected _paymentCard: HTMLButtonElement;
    protected _paymentCash: HTMLButtonElement;

    constructor(container: HTMLFormElement, protected events: EventEmitter) {
        super(container, events);

        this._paymentCard = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this._paymentCash = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);

        this._paymentCard.addEventListener('click', () => {
            this.payment = 'card';
            this.onInputChange('payment', 'card');
        })
        this._paymentCash.addEventListener('click', () => {
            this.payment = 'cash';
            this.onInputChange('payment', 'cash');
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set payment(value: string) {
        this.toggleClass(this._paymentCard, 'button_alt-active', value === 'card');
        this.toggleClass(this._paymentCash, 'button_alt-active', value === 'cash');
    }
}