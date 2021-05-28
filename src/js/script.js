/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

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

const globals = {
  favBooks: [],
  filters: [],
};


class Book{
  constructor(id, data) {
    const thisBook = this;

    thisBook.id = id;
    thisBook.data = data;
    //> console.log('new Book:', thisBook);

    thisBook.render();
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
  initFavListener: function () {
    const bookList = document.querySelector(select.containerOf.booksList);

    bookList.addEventListener('dblclick', function (e) {
      e.preventDefault();
      if (e.target && e.target.offsetParent.matches(select.bookInfo.bookImageLink)) {
        const targetElement = e.target.offsetParent;
        const targetId = parseInt(targetElement.getAttribute('data-id'));
        //* add class favorite to clicked book
        if (!targetElement.classList.contains(classNames.book.favorite)) {
          targetElement.classList.add(classNames.book.favorite);
          //*add to data-id to favBooks[]
          globals.favBooks.push(targetId);
        } else {
          targetElement.classList.remove(classNames.book.favorite);
          const index = globals.favBooks.indexOf(targetId);
          globals.favBooks.splice(index, 1);
        }
      }
    });
  },
  initFormListener: function () {
    const thisApp = this;

    const form = document.querySelector(select.containerOf.form);

    form.addEventListener('click', function (event) {

      if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
        //or: if(e.target.checked===true){globals.filters.push(e.target.value);}else{const index=globals.filters.indexOf(e.target.value);globals.filters.splice(index,1);}
        switch (event.target.checked) {
        case true:
          globals.filters.push(event.target.value);
          break;
        case false:
          const index = globals.filters.indexOf(event.target.value); // eslint-disable-line no-case-declarations
          globals.filters.splice(index, 1);
          break;
        }
      }
      thisApp.filterBooks();
    });
  },
  filterBooks: function () {
    const thisApp = this;

    for (let book of thisApp.data.books) {
      let shouldBeHidden = false;
      for (let filter of globals.filters) {
        switch (globals.filters.length) {
          case 1:
            if (book.details[filter] === false) {
              shouldBeHidden = true;
              break;
            }
            break;
          case 2:
            if (book.details['adults'] === true && book.details['nonFiction'] === true) {
              shouldBeHidden = false;
            } else {shouldBeHidden = true}
        }
      }

      if (shouldBeHidden) {
        document.querySelector('.book__image[data-id="' + book.id + '"]').classList.add(classNames.book.hidden);
      } else {
        document.querySelector('.book__image[data-id="' + book.id + '"]').classList.remove(classNames.book.hidden);
      }
    }
  },
  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    //// console.log('thisApp:', thisApp);
    //// console.log('templates:', templates);

    thisApp.initData();
    thisApp.initBooks();
    thisApp.filterBooks();
    thisApp.initFavListener();
    thisApp.initFormListener();
  },
};

app.init();