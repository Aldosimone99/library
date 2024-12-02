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
    displayBooks(data.works);
  } catch (error) {
    resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});

function displayBooks(books) {
    if (books.length === 0) {
      resultsContainer.innerHTML = '<p>No books found for this category.</p>';
      return;
    }
  
    resultsContainer.innerHTML = '';
    books.forEach((book) => {
      const bookItem = document.createElement('div');
      bookItem.classList.add('book-item');
  
      const title = book.title ? `<strong>${book.title}</strong>` : '<strong>No Title</strong>';
      const authors = book.authors ? book.authors.map((author) => author.name).join(', ') : 'Unknown Author';
  
      bookItem.innerHTML = `
        <span>${title} - ${authors}</span>
        <button class="details-button" data-key="${book.key}">View Details</button>
      `;
  
      resultsContainer.appendChild(bookItem);
    });
  
    document.querySelectorAll('.details-button').forEach((button) => {
      button.addEventListener('click', () => fetchBookDetails(button.dataset.key));
    });
  }

async function fetchBookDetails(bookKey) {
  bookDetailsContainer.innerHTML = '<p>Loading details...</p>';

  try {
    const response = await fetch(`https://openlibrary.org${bookKey}.json`);
    if (!response.ok) throw new Error('Error fetching book details.');

    const bookData = await response.json();
    displayBookDetails(bookData);
  } catch (error) {
    bookDetailsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}


function displayBookDetails(book) {
  const description = book.description ? (typeof book.description === 'string' ? book.description : book.description.value) : 'No description available.';

  bookDetailsContainer.innerHTML = `
    <h2>Book Details</h2>
    <p><strong>Title:</strong> ${book.title}</p>
    <p><strong>Description:</strong> ${description}</p>
  `;
}