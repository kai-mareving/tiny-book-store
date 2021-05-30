/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

'use strict';

const select = {
  templateOf: {
    book: '#template-book',
  },
  containerOf: {
    form: '.filters > form',
    booksPanel: 'section.books-panel',
    bookList: 'ul.books-list',
  },
  book: {
    imgLink: 'a.book__image',
    rating: '.book__rating__fill',
  },
  classNames: {
    favorite: 'favorite',
    hidden: 'hidden',
  },
};

const templates = {
  book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
};


class BookApp {
  constructor() {
    const bookApp = this;

    bookApp.data = dataSource;
    bookApp.favs = [];
    bookApp.filters = [];

    bookApp.getElements();
    bookApp.initBooks();
    bookApp.filterBooks();
    bookApp.initFavListener();
    bookApp.initFormListener();
  }

  getElements() {
    const bookApp = this;

    bookApp.dom = {};
    bookApp.dom.form = document.querySelector(select.containerOf.form);
    bookApp.dom.bookList = document.querySelector(select.containerOf.bookList);
  }

  initBooks() {
    const bookApp = this;
    console.log(bookApp);

    for (const book of bookApp.data.books) {
      book.ratingBgc = bookApp.determineRatingBgc(book.rating);
      book.ratingWidth = book.rating * 10;
      const generatedHTML = templates.book(book);
      //* create a DOMelement using utils.createElementFromHTML
      const DOMelement = utils.createDOMFromHTML(generatedHTML);
        //* insert the created DOMelement into menu container
      bookApp.dom.bookList.appendChild(DOMelement);
    }
  }

  determineRatingBgc(rating) {
    let background = '';

    if (rating < 6) {
      background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
    } else if (rating > 6 && rating <= 8) {
      background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
    } else if (rating > 8 && rating <= 9) {
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
    } else {
      background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
    }

    return background;
  }

  initFavListener() {
    const bookApp = this;

    bookApp.dom.bookList.addEventListener('dblclick', function (event) {
      event.preventDefault();
      if (event.target && event.target.offsetParent.matches(select.book.imgLink)) {
        const targetElement = event.target.offsetParent;
        const targetId = parseInt(targetElement.getAttribute('data-id'));
        //* add class favorite to clicked book
        if (!targetElement.classList.contains(select.classNames.favorite)) {
          targetElement.classList.add(select.classNames.favorite);
          //*add to data-id to favourites[]
          bookApp.favs.push(targetId);
        } else {
          targetElement.classList.remove(select.classNames.favorite);
          const index = bookApp.favs.indexOf(targetId);
          bookApp.favs.splice(index, 1);
        }
      }
    });
  }

  initFormListener() {
    const bookApp = this;

    bookApp.dom.form.addEventListener('click', function (event) {
      if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter') {
        //or: if(e.target.checked===true){globals.filters.push(e.target.value);}else{const index=globals.filters.indexOf(e.target.value);globals.filters.splice(index,1);}
        switch (event.target.checked) {
        case true:
          bookApp.filters.push(event.target.value);
          break;
        case false:
          const index = bookApp.filters.indexOf(event.target.value); // eslint-disable-line no-case-declarations
          bookApp.filters.splice(index, 1);
          break;
        }
      }
      bookApp.filterBooks();
    });
}

  filterBooks() {
    const bookApp = this;

    for (let book of bookApp.data.books) {
      let shouldBeHidden = false;

      for (let filter of bookApp.filters) {
        if (!book.details[filter]){
          shouldBeHidden = true;
          break;
        }
      }
      if (shouldBeHidden) {
        document.querySelector('.book__image[data-id="' + book.id + '"]').classList.add(select.classNames.hidden);
      } else {
        document.querySelector('.book__image[data-id="' + book.id + '"]').classList.remove(select.classNames.hidden);
      }
    }
  }
}

const app = new BookApp();