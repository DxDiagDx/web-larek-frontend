import { IOrder, IBasket, ICard, TCheckOut, FormErrors, TContacts } from "../types";
import { Model } from "./base/Model";

interface IAppState {
    cards: ICard[],
    preview: string | null;
    basket: IBasket;
    order: IOrder;
    formErrors: FormErrors;
}

export class AppState extends Model<IAppState>{
    cards: ICard[];
    preview: string | null;
    basket: IBasket = {
        items: [],
        total: 0,
    };
    order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: [],
    };
    formErrors: FormErrors = {};

    setCatalog(items: ICard[]) {
        this.cards = items;
		this.emitChanges('cards:change', this.cards);
    }

    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addCardToBasket(item: ICard) {
        this.basket.items.push(item.id);
		this.basket.total += item.price;
		this.emitChanges('basket:change', this.basket);
    }

    removeCardFromBasket(item: ICard) {
        this.basket.items = this.basket.items.filter((id) => id != item.id);
        this.basket.total -= item.price;
        this.emitChanges('basket:change', this.basket);
    }

    inBasket(item: ICard) {
        return this.basket.items.includes(item.id);
    }

    clearBasket() {
        this.basket.items = [];
        this.basket.total = 0;
        this.emitChanges('basket:change');
    }

    setOrderField(field: keyof (TCheckOut & TContacts), value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.order.total = this.basket.total;
            this.order.items = this.basket.items;
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.emitChanges('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}