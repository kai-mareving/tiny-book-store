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
      bookImageLink: '.books-list .book__image',
      bookImage: '.book__image > figure > img',
      bookRating: '.book__rating__fill',
    },
  };

  const classNames = {
    book: {
      bookFavorite: 'favorite',
      bookHidden: 'hidden',
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
      //> console.log('new Book:', thisBook);

      thisBook.render();
      thisBook.initActions();
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

    initActions() {
      const thisBook = this;

      const favoriteBooks = []; //* create favoriteBooks = [];
      //* find elements on which we will be operating:
      const bookImgLink = thisBook.element.querySelector(select.bookInfo.bookImageLink);
      //* with for [loop] add listeners to each a.book__image:
      bookImgLink.addEventListener('dblclick', addBookToFavorites);

      function addBookToFavorites(event) {
        event.preventDefault();

        const clickedElement = this;
        //* on 'dbclick' add class favorite to .book__image & add data-id of that image link to favoriteBooks[]
        clickedElement.classList.add('favorite');
        const imgDataId = parseInt(clickedElement.getAttribute('data-id'));
        favoriteBooks.push(imgDataId);
        console.log(favoriteBooks);
      }

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