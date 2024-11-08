import {Api, ApiListResponse} from './base/api'
import { ICard, IOrder, IOrderSuccess } from '../types';

export interface IShopAPI {
    getCardList: () => Promise<ICard[]>;
    postOrder(order: IOrder): Promise<IOrderSuccess>;
}

export class ShopAPI extends Api implements IShopAPI {
    constructor(readonly cdn: string, baseUrl: string) {
        super(baseUrl);
        this.cdn = cdn;
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product/')
            .then((data: ApiListResponse<ICard>) =>
                data.items.map((item) => ({
                    ...item,
                    image: this.cdn + item.image
                }))
        );
    }

    postOrder(order: IOrder): Promise<IOrderSuccess> {
        return this.post('/order/', order)
            .then((data: IOrderSuccess) => data)
    }
}