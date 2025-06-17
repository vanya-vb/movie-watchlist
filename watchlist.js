// Capture elements
const main = document.querySelector('.main');
const watchlistContainer = document.querySelector('.watchlist-container');
const emptyWatchlist = document.querySelector('.empty-watchlist');

// Get the watchlist from local storage
let savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function renderWatchlist() {
    watchlistContainer.innerHTML = '';

    if (savedWatchlist.length === 0) {
        watchlistContainer.appendChild(emptyWatchlist);
        main.classList.remove('main-filled');
        watchlistContainer.classList.remove('movie-list-filled');

        return;
    }

    savedWatchlist.forEach(movie => {

        main.classList.add('main-filled');
        watchlistContainer.classList.add('movie-list-filled');

        watchlistContainer.innerHTML += `
                <article class="movie-card">
                    <div class="movie-img-container">
                        <img src="${movie.poster}" alt="Poster of ${movie.title}">
                    </div>
                    <div class="movie-info">
                        <h2 class="movie-title">
                            ${movie.title}
                            <span class="rating">
                                <img src="img/star-icon.png" alt="Star icon">
                                ${movie.rating}
                            </span>
                        </h2>
                        <div class="movie-description">
                            <span class="movie-duration">${movie.duration}</span>
                            <span class="movie-genre">${movie.genre}</span>
                            <button class="remove-from-watchlist-btn" data-movie-id="${movie.id}">
                                <img src="img/remove-icon.png" alt="Minus icon"> 
                                Remove
                            </button>
                        </div>
                        
                        <p class="movie-summary">${movie.summary}</p>
                </article>
        `;
    });
}

// Initial render
renderWatchlist();

// Remove from watchlist functionality
watchlistContainer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-from-watchlist-btn');

    if (removeBtn) {
        const movieId = removeBtn.dataset.movieId;
        const movieCard = removeBtn.closest('.movie-card');
        const index = savedWatchlist.findIndex(movie => movieId === movie.id);

        savedWatchlist.splice(index, 1);
        movieCard.remove();

        // update local storage
        localStorage.setItem('watchlist', JSON.stringify(savedWatchlist));

        renderWatchlist();
    }
});

// Read more functionality
watchlistContainer.addEventListener('click', (e) => {
    const plotBtn = e.target.closest('.plot-btn');

    if (plotBtn) {
        const plotText = plotBtn.parentElement.querySelector('.plot-text');
        const isShort = plotBtn.dataset.state === 'short';

        plotText.textContent = isShort ? plotBtn.dataset.fullPlot : plotBtn.dataset.shortPlot;
        plotBtnФ.textContent = isShort ? 'Read less' : 'Read more';
        plotBtn.dataset.state = isShort ? 'full' : 'short';
    }
})
