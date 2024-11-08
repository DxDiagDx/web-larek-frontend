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

Карточка товара

```
interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
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
    items: string[];
}
```

Ответ с сервера об успешном оформлении заказа

```
interface IOrderSuccess {
    id: string;
    total: number;
}
```

Корзина

```
interface IBasket {
    items: string[];
    total: number;
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

Тип данных для валидации формы

```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Интерфейс объекта с обработчиком события клика

```
interface IActions {
    onClick: (event: MouseEvent) => void;
}
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

#### Класс Component
Базовый абстрактный класс для работы с DOM-элементами. Содержит общие для дочерних классов методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключает класс элемента
- `setDisabled(element: HTMLElement, state: boolean)` - включает или отключает у элемента атрибут disabled
- `setText(element: HTMLElement, value: unknown)` - устанавливает текст
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение с alt-текстом
- `render(data?: Partial<T>): HTMLElement` - возвращает DOM-элемент для дальнейшего отображения 

Конструктор принимает в качестве параметра:
- `container: HTMLElement` - корневой элемент, содержащий разметку для рендеринга

#### Класс Model
Базовый абстрактный класс для создания модели данных. Предоставляет метод для вызова обрабочика событий:
- `emitChanges(event: string, payload?: object)` - сообщает обработчику о событии event и передаёт объект payload, если требуется. 


### Слой данных

#### Класс ShopAPI
Класс наследуется от базового класса Api и предназначен для работы с сервером.

Конструктор класса принимает:
- `cdn: string` - url-адрес для получения изображений
- `baseUrl: string` - url-адрес для получения информации о товарах

Методы класса:
- `getCardList(): Promise<ICard[]>` - выполняет GET-запрос на сервер и возвращает список товаров
- `postOrder(order: IOrder): Promise<IOrderSuccess>` - выполняет POST-запрос с информацией о заказе и возвращяет результат выполнения 

#### Класс AppState
Класс наследуется от базового класса Model и отвечает за логику работы с данными, а также управлением состояния приложения.

Поля класса:
- `cards: ICard[]` - список товаров
- `preview: string | null` - карточка товара, выбранная для просмотра
- `basket: IBasket` - список товаров в корзине и общая сумма заказа
- `order: IOrder` - информация о заказе
- `formErrors` - ошибки в полях форм заказа

Методы класса:
- `setCatalog(items: ICard[])` - устанавливает список товаров и генерирует событие 'cards:change'
- `setPreview(item: ICard)` - устанаваливает ID карточки товара для предварительного просмотра и генерирует событие 'preview:changed'
- `addCardToBasket(item: ICard)` - добавляет товар в корзину, увеличивает сумму заказа на стоимость товара и генерирует событие 'basket:change'
- `removeCardFromBasket(item: ICard)` - удалет товар из корзины, уменьшает сумму заказа на стоимость товара и генерирует событие 'basket:change'
- `inBasket(item: ICard)` - вовзращает ID карточки товара, добавленной в корзину
- `clearBasket()` - очищает список товаров в корзине, обнуляет сумму заказа и генерирует событие 'basket:change'
- `setOrderField(field: keyof (TCheckOut & TContacts), value: string)` - устанавливает значения полей в объект заказа и если форма заполнена без ошибок, передаёт из корзины в заказ его итоговую сумму и список товаров.
- `validateOrder()` - проверяет на заполнение поля заказа и генерирует событие 'formErrors:change'. Возвращает true, если форма прошла валидацию.

### Слой отображения

#### Класс Modal
Класс отвечает за отображения контента в модальном окне.
У каждого контента есть свой шаблон. 
Контент передаётся методу `render`, как параметр.

Поля класса
- `buttonClose: HTMLElement` - кнопка закрытия модального окна
- `content: HTMLElement` - блок для контента модального окна

Конструктор класса принимает два параметра:
- `container: HTMLElement` - контейнер модального окна
- `events: IEvents` - брокер событий

Методы:
- `open(): void` - открыть модальное окно
- `close(): void` - закрыть модальное окно
- `render(data: HTMLElement): HTMLElement` - рендер контента для отображения в модальном окне


#### Класс Card
Класс Card отвечает за отображение:
- в галерее товаров на главной странице
- в модальном окне с подробной информацией
- в списке товаров в корзине

Поля класса:
- `category`
- `title`
- `description`
- `image`
- `price`

Конструктор класса принимает два параметра:
- `container: HTMLElement` - шаблон карточки 
- `events: EventEmitter` - обработчик клика, соответствующий различным шаблонам

Методы - сеттеры и геттеры для заполнения полей карточки


#### Класс Basket
Класс Basket отвечает за отображение корзины.

Поля:
- `items: HTMLElement` - список товаров в корзине
- `total: number` - общая стоимость товаров в корзине
- `button: HTMLElement` - кнопка действия "В корзину" или "Удалить"

Конструктор класса принимает два параметра:
- `container: HTMLElement` - шаблон корзины 
- `events: IEvents` - брокер событий

Методы - сеттеры и геттеры для заполнения полей класса.



#### Класс Order
Первый шаг оформления товара. Отображает форму в модальном окне.
Отображает элементы для указания способы оплаты и адреса доставки.

Поля класса:
- `payment` - способ оплаты
- `address` - адрес доставки

Конструктор класса принимает два параметра:
- `container: HTMLElement` - шаблон формы #order
- `events: IEvents` - брокер событий

Методы - сеттеры для заполнения полей класса.


#### Класс Contacts
Второй шаг оформления товара. Отображает форму в модальном окне.
Отображает инпуты для указания email и телефона.

Поля класса:
- `email: string`
- `phone: string`

Конструктор класса принимает два параметра:
- `container: HTMLElement` - контейнер, в котором будет отображаться контент
- `events: IEvents` - брокер событий

Методы - сеттеры для заполнения полей класса.



#### Класс Form
Класс расширяет классы Order и Contacts, добавляя в них проверку правильности заполнения форм.

Поля класса:
- `errors: HTMLElement` - информация об ошибках

Конструктор класса принимает два параметра:
- `container: HTMLElement` - контейнер, в котором будет отображаться контент
- `events: IEvents` - брокер событий

Методы - сеттер для заполнения поля errors.


#### Класс Success
Отвечает за отображение информации об успешном оформлении заказа.

Поля:
- `total: HTMLElement` - информация о сумме заказа
- 

Конструктор принимает два параметра:
- `container: HTMLElement` - контейнер, в котором будет отображаться контент
- `events: IEvents` - брокер событий

Методы - сеттер для заполнения поля total.


#### Класс Page
Класс отвечает за отображение на главной странице списка товаров, счётчика количества товаров в корзине и иконки корзины, слушающей клик.

Поля класса:
- `gallery: HTMLElement` - список товаров
- `counter: HTMLElement` - количество товаров в корзине.
- `basket: HTMLElement` - иконка корзины, при нажатии на которую открывается модальное окно с содержимым корзины

Конструктор класса принимает два параметра:
- `container: HTMLElement` - контейнер, в котором будет отображаться контент
- `events: IEvents` - брокер событий

Методы:
- `set counter(value: number)` - количество товаров в корзине
- `set gallery(items: HTMLElement[])` - список товаров


### Слой презентера
Код презентера не будет выделен в отдельный класс, а будет размещен в основном скрипте приложения.

События:
`'cards:change'` - выводит товары на главную страницу.  

`'card:select'`   - Выбор карточки и инициализация её просмотра.  
`'preview:changed'` - Рендер карточки и открытие её в модальном окне.  

`'basket:open'`   - При клике на иконку корзины в шапке сайта, открывается модально окно с корзиной.  
`'basket:change'` - Изменение состава корзины. В корзине рассчитывается сумма стоимости всех товаров в корзине. При нажатии на кнопку удаления товара из корзины, итог пересчитывается.

`'order:open'` - При нажатии на кнопку "Оформить заказ" открывается форма выбора способа оплаты и адреса доставки.
`'contacts:open'` - При нажатии на кнопку "Далее" открывается Contacts форма указания контактов.
`/^order\..*:change/` - Валидация полей формы заказа.
`/^contacts\..*:change/` - Валидация полей формы контактов.
`'formErrors:change'` - Проверка валидности формы.

`'order:submit'` - При нажатии на кнопку "Далее" закрывает форму заказа и открывает форму контактов.
`'contacts:submit'` - При нажатии на кнопку "Олатить" отправляет данные о заказе на сервер.
`'success:open'` - При успешном ответе с сервера о принятом заказе открывается модальное окно об успешном оформлении заказа.

`'modal:open'` - открытие модального окна.
`'modal:close'` - закрытие модального окна.


