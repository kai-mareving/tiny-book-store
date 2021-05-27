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

const settings = {
  adults: false,
  nonFiction: false,
};

const globals = {
  favBooks: [],
  filters: [],
  adultBooks: [],
  nonFictionBooks: [],
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
    const form = document.querySelector(select.containerOf.form);
    const bookImgLinkList = document.querySelectorAll(select.bookInfo.bookImageLink);
    console.log(bookImgLinkList);

    form.addEventListener('click', function (e) {
      //// e.preventDefault();
      const formConditionSet = (e.target.tagName === 'INPUT') && (e.target.type === 'checkbox') && (e.target.name === 'filter');

      if (formConditionSet) {
        //or: if(e.target.checked===true){globals.filters.push(e.target.value);}else{const index=globals.filters.indexOf(e.target.value);globals.filters.splice(index,1);}
        switch (e.target.checked) {
        case true:
          if (e.target.value === 'adults') {
            settings.adults = true;
            // for (let link in bookImgLinkList) {
              //console.log(link);
              // const linkDataId = link.getAttribute('data-id');
              // if (globals.adultBooks.contains(linkDataId)) {
                // link.classList.remove(classNames.hidden);
              // }
            // }
          } else if(e.target.value === 'nonFiction'){
            settings.nonFiction = true;
          }
          break;
        case false:
          if (e.target.value === 'adults') {
            settings.adults = false;
            // for (let link of bookImgLinkList) {
              // const linkDataId = link.getAttribute('data-id');
              // if (globals.adultBooks.contains(linkDataId)) {
                // link.classList.add(classNames.hidden);
              // }
            // }
          } else if(e.target.value === 'nonFiction'){
            settings.nonFiction = false;
          }
          break;
        }
      }
    });
  },
  filterBooks: function () {
    const thisApp = this;

    for (const  book in thisApp.data.books) {
      let bookId = thisApp.data.books[book].id;
      let bookDetails = thisApp.data.books[book].details;
      //* const settings.adults and settings.nonFiction might not be needed
      if(bookDetails.adults === true) {
        globals.adultBooks.push(bookId);
      } else if(bookDetails.nonFiction === true) {
        globals.nonFictionBooks.push(bookId);
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