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
      bookImageLink: 'a.book__image',
      bookImage: '.book__image > figure > img',
      bookRating: '.book__rating__fill',
    },
  };

  const classNames = {
    book: {
      favorite: 'favorite',
      hidden: 'hidden',
    },
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };

  const favoriteBooks = [];

  //##### BOOK #####
  class Book{
    constructor(id, data) {
      const thisBook = this;

      thisBook.id = id;
      thisBook.data = data;
      //> console.log('new Book:', thisBook);

      thisBook.render();
      thisBook.addListeners();
    }

    render() {
      const thisBook = this;
      //* generate the HTML based on template
      const generatedHTML = templates.book(thisBook.data);
      //* create a DOMelement using utils.createElementFromHTML
      thisBook.element = utils.createDOMFromHTML(generatedHTML);
      //* find the menu container
      const bookList = document.querySelector(select.containerOf.booksList);
      //* insert the created DOMelement into menu container
      bookList.appendChild(thisBook.element);
    }

    addListeners() {
      const thisBook = this;

      const bookList = document.querySelector(select.containerOf.booksList);
      bookList.addEventListener('dblclick', function (e) {
        e.preventDefault();

        if (e.target && e.target.offsetParent.matches(select.bookInfo.bookImageLink)){ thisBook.addBookToFavs(e.target.offsetParent); }
      });
    }

    addBookToFavs(target) {
      const targetElement = target;
      const targetId = parseInt(targetElement.getAttribute('data-id'));

      //* add class favorite to clicked book
      if (!targetElement.classList.contains(classNames.book.favorite)) {
        targetElement.classList.add(classNames.book.favorite);
        //*add to data-id to favoriteBooks[]
        favoriteBooks.push(targetId);
      }
      else {
        targetElement.classList.remove(classNames.book.favorite);
        const index = favoriteBooks.indexOf(targetId);
        favoriteBooks.splice(index, 1);
      }
      //// console.log(favoriteBooks);
    }
  }

  const app = {
    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
    },
    initBooks: function () {
      const thisApp = this;

      (thisApp.data.books).forEach(book => new Book(book.id, book));
      //or for (let book in thisApp.data.books) { new Book(thisApp.data.books[book].id, thisApp.data.books[book]); }
    },
    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      //// console.log('thisApp:', thisApp);
      //// console.log('templates:', templates);

      thisApp.initData();
      thisApp.initBooks();
    },
  };

  app.init();

}