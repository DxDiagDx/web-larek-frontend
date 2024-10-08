# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Каталог товаров

```
interface ICardCatalog {
    cards: ICard[];
    preview: string | null;
}
```

Товар

```
interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}
```

Заказ

```
interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: ICard[];
}
```

Корзина

```
interface IBasket {
    basketList: TCardCompact[];
    getTotal(): number;
}
```

Тип товара для отображения в корзине

```
type TCardCompact = Pick<ICard, 'title' | 'price'>
```

Данные формы способа оплаты и адреса доставки

```
interface ICheckOut {
    checkValidation(data: Record<keyof TCheckOut, string>): boolean;
}
```

Данные формы контактов

```
interface IContacts {
    checkValidation(data: Record<keyof TContacts, string>): boolean;
}
```

Тип данных для формы способа оплаты и адреса доставки

```
type TCheckOut = Pick<IOrder, 'payment' | 'address'>
```

Тип данных для формы контактов

```
type TContacts = Pick<IOrder, 'email' | 'phone'>
```


## Архитектура приложения

Код разделён на слои, согласно MVP:
- слой отображения отвечает за отображение данных на странице
- слой данных отвечает за их хранение и изменение
- презентер отвечает за связь между слоем отображения и слоем данных

### Базовый код

#### Класс Api
Содержит базовую логику отправки запросов. В конструктор передаётся базовый адрес сервера и опциональный объект с заголовками запроса.

Методы:
- `get` - выполяет GET запрос на переданный эндпоинт и возвращает промис с объектом
- `post` - принимает объект с данными, которые будут отправлены в JSON в теле запроса, и отправялет эти данные на эндпоинт, переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод может быть переопределён заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом, описаны интерфейсом `IEvents`:
- `on` - подписка на события
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой иницициализируется требуемое в параметрах событие

### Слой данных

#### Класс Catalog

Класс отвечает за хранение и логику работы с товарами.
Конструктор класса принимает инстант брокера событий.
В полях класса хранятся следующие данные:
- _cards: ICard[] - массив объектов товаров
- _preview: string | null - id товара, выбранного для просмотра в модальной окне
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных

Так же класс предоставляет набор методов для взаимодействия с этими данными:
- getCatalog() - получаем список товаров по API


### Слой отображения

#### Класс Page
Класс отвечает за отображение на главной странице:
- списка товаров
- количество товара в корзине, которое выводится в шапке сайта. 
Для этого считаем количество товаров со свойством inBasket = True.


#### Класс Modal
Класс отвечает за отображения любого модального окна.

Поля класса
- modalTemplate: HTMLTemplateElement - темплейт модального окна
- submitButton: HTMLButtonElement - Кнопка подтверждения
- events: IEvents - брокер событий

Методы:
- close(): void - закрыть модальное окно
- render(): HTMLElement - возвращает HTML модального окна с указынным контентом

#### Класс ModalWithForm

Расширяет класс Modal. Предназначен для реализации модального окна с формой содержащей поля ввода.
Предоставляет методы для отображения ошибок и управления активностью кнопки действия.

Поля класса:
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения


#### Класс CardFull
Отображение карточки товара в модальном окне.
Содержит кнопку действия, которая может быть:
- "Купить", если свойсво inBasket у товара False
- "Убрать", если inBasket = True


#### Класс Basket
Отображает корзину со списком товаров в модальном окне.
Поля:
- список товаров

методы:
- basketPrice() - сумма всех товаров в корзине
- removeCard(cardId) - удаляет товар из корзины, и устанавливает товару свойство inBasket = False


#### Класс CheckOut
Первый шаг оформления товара. Отображает форму в модальном окне.
Отображает инпуты для указания способы оплаты и адреса доставки.

#### Класс Contacts
Второй шаг оформления товара. Отображает форму в модальном окне.
Отображает инпуты для указания email и телефона.

#### Класс Success
Отображает сообщение об успешном оформлении заказа в модальном окне.
Кнопка действия закрывает модальное окно и отображает главную страницу,
возвращаясь к первоначаному состоянию.


### Слой презентера
Код презентера не будет выделен в отдельный класс, а будет размещен в основном скрипте приложения.

События:
'catalog:open'  - При открытии страницы происходит get-запрос по API на получение списка товаров. А также после закрытия модального окна, при нажатии на кнопку "За новыми покупками!" после оформления заказа.

'card:select'   - При клике на карточку товара, она открывается в модальном окне.
'card:basket-out' - Если товар уже есть в корзине - при нажатии на кнопку "Удалить" меняется свойство товара inBasket и название кнопки на "Купить"
'card:basket-in'  - При нажатии на кнопку "Купить" меняется свойство товара inBasket и название кнопки на "Удалить"
'catalog:change' - При закрытии модального окна с товаром, карточка товара возвращается со свойством inBasket или без него, пересчитывается количество товара со свойством inBasket = True и выводится в шапке сайте.

'basket:open'   - При клике на иконку корзины в шапке сайта, открывается модально окно с корзиной. В корзине отображаются товары, у которых свойство inBasket = True.
'basket:change' - В корзине рассчитывается сумма стоимости всех товаров в корзине. При нажатии на кнопку удаления товара из корзины, корзина пересчитывается.

'checkout:open' - При нажатии на кнопку "Оформить заказ" открывается CheckOut форма выбора способа оплаты и адреса доставки.
'contacts:open' - При нажатии на кнопку "Далее" открывается Contacts форма указания контактов.

'success:open' - При нажатии на кнопку "Далее" открывается Success модальное окно.


