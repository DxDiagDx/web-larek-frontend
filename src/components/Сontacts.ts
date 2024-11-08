import { IOrder } from "../types";
import { EventEmitter } from "./base/events";
import { Form } from "./common/Form";

export class Сontacts extends Form<IOrder> {
    constructor(container: HTMLFormElement, protected events: EventEmitter) {
        super(container, events);
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }
}