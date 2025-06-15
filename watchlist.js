// Capture elements
const main = document.querySelector('.main');
const watchlistContainer = document.querySelector('.watchlist-container');
const emptyWatchlist = document.querySelector('.empty-watchlist');

// Get the watchlist from local storage
let savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

if (savedWatchlist.length > 0) {

    watchlistContainer.innerHTML = '';

    savedWatchlist.forEach(movie => {
        watchlistContainer.innerHTML += `
        <article class="movie-card">
           <div class="movie-img-container">
               <img src="${movie.poster}" alt="Poster of ${movie.title}">
           </div>
           <div class="movie-info">
               <h2 class="movie-title">
                   ${movie.title}
                   <span class="rating">
                       <img src="img/star-icon.png" alt="star icon">
                       ${movie.rating}
                   </span>
               </h2>
               <div class="movie-description">
                   <span class="movie-duration">${movie.duration}</span>
                   <span class="movie-genre">${movie.genre}</span>
                   <button class="remove-from-watchlist-btn" data-movie-id="${movie.id}">
                       <img src="img/remove-icon.png" alt="Remove icon"> Remove
                   </button>
               </div>
               <p class="movie-summary">${movie.summary}</p>
           </div>
       </article>
      `;

        main.classList.add('main-filled');
        watchlistContainer.classList.add('movie-list-filled');

    });
}

// Remove btn functionality

watchlistContainer.addEventListener('click', (e) => {
    // find which button was clicked by id
    const button = e.target.closest('.remove-from-watchlist-btn');
    const movieId = button.dataset.movieId;

    // get the movie card
    const movieCard = button.closest('.movie-card');

    // get the index of the clicked movie card in the arr
    const index = savedWatchlist.findIndex(movie => movieId === movie.id);

    // remove the movie from the arr and the movie card from the DOM
    savedWatchlist.splice(index, 1);
    movieCard.remove();

    // update local storage
    localStorage.setItem('watchlist', JSON.stringify(savedWatchlist));
    savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    if (savedWatchlist.length === 0) {
        watchlistContainer.innerHTML = '';
        watchlistContainer.appendChild(emptyWatchlist);

        main.classList.remove('main-filled');
        watchlistContainer.classList.remove('movie-list-filled');
    }
})

// localStorage.clear();


