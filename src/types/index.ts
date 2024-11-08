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
    items: string[];
}

export interface IOrderSuccess {
    id: string;
    total: number;
}

export interface IBasket {
    items: string[];
    total: number;
}

export type TCheckOut = Pick<IOrder, 'payment' | 'address'>

export type TContacts = Pick<IOrder, 'email' | 'phone'>

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IActions {
    onClick: (event: MouseEvent) => void;
}