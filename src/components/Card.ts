import { ensureElement } from "./../utils/utils";
import { Component } from "./base/Component";
import { IActions, ICard } from "./../types";

export class Card extends Component<ICard> {
    protected _description: HTMLElement;
    protected _image: HTMLImageElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected categoryColors = <Record<string, string>>{
        "софт-скил": 'soft',
        "другое": 'other',
        "кнопка": 'button',
        "хард-скил": 'hard',
        "дополнительное": 'additional'
    }
    protected _category: HTMLElement;
    
    constructor(container: HTMLElement, actions?: IActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        
        this._description = container.querySelector('.card__text');
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }

        if (!value) {
            this.setDisabled(this._button, true);
        }
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
        if (this._category) {
            this._category.className = `card__category card__category_${this.categoryColors[value]}`;
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set button(value: string) {
        this.setText(this._button, value);
    }
}