/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      form: '.filters > form',
      booksPanel: 'section.books-panel',
      booksList: 'ul.books-list',
    },
    formInput: {
      adultsOnly: 'input[value="adults"]',
      nonFiction: 'input[value="nonFiction"]',
    },
    bookInfo: {
      bookLi: 'li.book',
      bookName: 'h2.book__name',
      bookPrice: '.product__base-price',
      bookImageLink: '.book__image',
      bookImage: '.book__image > figure > img',
      bookRating: '.book__rating__fill',
    },
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  //##### BOOK #####
  class Book{
    constructor(id, data) {
      const thisBook = this;

      thisBook.id = id;
      thisBook.data = data;

      console.log('new Book:', thisBook);
    }
  }

  const app = {
    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
    },
    initBooks: function () {
      const thisApp = this;

      //? starts with index 1. is that correct?
      (thisApp.data.books).forEach(book => new Book(book.id, book));

      //? this loop works well - or does it? starts with index 0
      /* for (let book in thisApp.data.books) {
        new Book(book, thisApp.data.books[book]);
      } */
    },
    init: function () {
      const thisApp = this;

      console.log('*** App starting ***');
      console.log('thisApp in app.init():', thisApp);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initBooks();
    },
  };

  app.init();

}