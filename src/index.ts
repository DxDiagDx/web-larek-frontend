import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { CDN_URL, API_URL } from './utils/constants'
import { AppState } from "./components/AppData";
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Card } from './components/Card';
import { ShopAPI } from './components/ApiModel';
import { cloneTemplate, ensureElement } from "./utils/utils";
import { ICard, IOrder, TCheckOut, TContacts } from './types';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Сontacts } from './components/Сontacts';
import { Success } from './components/Success';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL)

// Все шаблоны и элемент страницы
const pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const cardGalleryTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(pageWrapper, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Сontacts(cloneTemplate(contactsTemplate), events);

// Открыть карточку товара
events.on('card:select', (item: ICard) => {
    appData.setPreview(item);
})

events.on('preview:changed', (item: ICard) => {
    ('preview:changed');
    const inBasket = appData.inBasket(item);
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (inBasket) {
                appData.removeCardFromBasket(item);
                events.emit('preview:changed', item);
            } else {
                appData.addCardToBasket(item);
                events.emit('preview:changed', item);
            }
        }
    })
    card.button = inBasket ? 'Удалить' : 'В корзину'
    modal.render({content: card.render(item)})
})

// Открыть корзину
events.on('basket:open', () => {
    modal.render({content: basket.render()})
})

// Изменился состав корзины
events.on('basket:change', () => {
    page.counter = appData.basket.items.length;

    basket.items = appData.basket.items.map((id, index) => {
        const item = appData.cards.find((item) => item.id === id);
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.removeCardFromBasket(item);
            }
        })
        const cardElement = card.render(item);
        const itemIndex = cardElement.querySelector('.basket__item-index');
        itemIndex.textContent = (++index).toString();
        return cardElement;
    })
    
    basket.total = appData.basket.total;
})

// Открыть форму оформления заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        }),
    })
})

// Изменились поля формы заказа
events.on(/^order\..*:change/, (data: {field: keyof (TCheckOut & TContacts), value: string}) => {
    appData.setOrderField(data.field, data.value);
})

// Изменились поля формы контактов
events.on(/^contacts\..*:change/, (data: {field: keyof (TCheckOut & TContacts), value: string}) => {
    appData.setOrderField(data.field, data.value);
})

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { payment, address, email, phone } = errors;  
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Открыть форму контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

// Отправить заказ на сервер
events.on('contacts:submit', () => {
    api.postOrder(appData.order)
        .then(() => {
            events.emit('success:open');
        })
        .catch((err) => {
            console.error(err);
        })
})

// Окно успешного оформления заказа
events.on('success:open', () => {
    const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => {
            modal.close();
        },
    });
    appData.clearBasket();
    events.emit('basket:change');
    modal.render({
        content: success.render({ total: appData.order.total }),
    });
})

// Выводим каталог
events.on('cards:change', (items: ICard[]) => {
    page.gallery = items.map((item) => {
        const card = new Card(cloneTemplate(cardGalleryTemplate), {
            onClick: () => events.emit('card:select', item),
        })
        return card.render(item);
    })
})

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем карточки товаров с сервера
api.getCardList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

