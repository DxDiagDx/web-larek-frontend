export interface ICardCatalog {
    cards: ICard[];
    preview: string | null;
}

export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: ICard[];
}

export interface IBasket {
    list: TCardCompact[];
    total: number;
}

export type TCardCompact = Pick<ICard, 'title' | 'price'>

export interface ICheckOut {
    checkValidation(data: Record<keyof TCheckOut, string>): boolean;
}

export interface IContacts {
    checkValidation(data: Record<keyof TContacts, string>): boolean;
}

export type TCheckOut = Pick<IOrder, 'payment' | 'address'>

export type TContacts = Pick<IOrder, 'email' | 'phone'>