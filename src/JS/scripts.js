import '../../src/CSS/styles.css';
import _ from 'lodash';

const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');
const bookDetailsContainer = document.getElementById('bookDetails');

searchButton.addEventListener('click', async () => {
  const category = document.getElementById('category').value.trim();

  if (!category) {
    alert('Please enter a category!');
    return;
  }

  resultsContainer.innerHTML = '<p>Loading...</p>';
  bookDetailsContainer.innerHTML = '';

  try {
    const response = await fetch(`https://openlibrary.org/subjects/${category}.json`);
    if (!response.ok) throw new Error('Category not found!');

    const data = await response.json();
    try {
      // Verifica se la risposta contiene la chiave "works" e se è un array
      const works = _.get(data, 'works', []);
      if (!Array.isArray(works) || works.length === 0) {
        resultsContainer.innerHTML = '<p>No books found for this category.</p>';
        return;
      }
      displayBooks(works);
    } catch (error) {
      resultsContainer.innerHTML = `<p>Error displaying books: ${error.message}</p>`;
    }
  } catch (error) {
    resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});

function displayBooks(books) {
  try {
    resultsContainer.innerHTML = '';
    books.forEach((book) => {
      try {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');

        // Verifica che il libro abbia un titolo e un autore valido
        const title = _.get(book, 'title', 'No Title');
        const authors = _.get(book, 'authors', []).map((author) => author.name).join(', ') || 'Unknown Author';

        bookItem.innerHTML = `
          <span><strong>${title}</strong> - ${authors}</span>
          <button class="details-button" data-key="${book.key}">View Details</button>
        `;

        resultsContainer.appendChild(bookItem);
      } catch (error) {
        console.error(`Error creating book item: ${error.message}`);
      }
    });

    document.querySelectorAll('.details-button').forEach((button) => {
      try {
        button.addEventListener('click', () => fetchBookDetails(button.dataset.key));
      } catch (error) {
        console.error(`Error adding event listener to button: ${error.message}`);
      }
    });
  } catch (error) {
    console.error(`Error in displayBooks function: ${error.message}`);
  }
}

async function fetchBookDetails(bookKey) {
  bookDetailsContainer.innerHTML = '<p>Loading details...</p>';

  try {
    const response = await fetch(`https://openlibrary.org${bookKey}.json`);
    if (!response.ok) throw new Error('Error fetching book details.');

    const bookData = await response.json();
    try {
      // Validazione dei dati ricevuti per i dettagli del libro
      if (!bookData || !bookData.title) throw new Error('Book data is incomplete.');

      displayBookDetails(bookData);
    } catch (error) {
      bookDetailsContainer.innerHTML = `<p>Error displaying book details: ${error.message}</p>`;
    }
  } catch (error) {
    bookDetailsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayBookDetails(book) {
  try {
    // Verifica che la descrizione sia valida
    const description = _.get(book, 'description', 'No description available.');
    const descriptionText = typeof description === 'string' ? description : _.get(description, 'value', 'No description available.');

    bookDetailsContainer.innerHTML = `
      <h2>Book Details</h2>
      <p><strong>Title:</strong> ${book.title}</p>
      <p><strong>Description:</strong> ${descriptionText}</p>
    `;
  } catch (error) {
    bookDetailsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}