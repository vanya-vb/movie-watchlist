// Capture elements
const input = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const main = document.querySelector('.main');
const movieListContainer = document.querySelector('.movie-list-container');

const apiKey = '1658edc3';

// Search button functionality

searchBtn.addEventListener('click', () => {
    fetch(`http://www.omdbapi.com/?s=${input.value}&apikey=${apiKey}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Something went wrong');
            }

            return res.json()
        })
        .then(movies => {

            if (input.value === '') {
                throw new Error(movies.Error);
            } else if (movies.Response === 'False') {
                throw new Error(movies.Error);
            }

            let movieIds = movies.Search.map(movie => movie.imdbID);

            movieListContainer.innerHTML = '';
            main.classList.add('main-filled');
            movieListContainer.classList.add('movie-list-filled');

            for (let id of movieIds) {
                fetch(`http://www.omdbapi.com/?i=${id}&apikey=${apiKey}`)
                    .then(res => {
                        if (!res.ok) {
                            throw Error('Something went wrong');
                        }

                        return res.json()
                    })
                    .then(movie => {

                        isReadBtnNeeded = movie.Plot.length > 130;
                        let shortPlotText = '';

                        if (isReadBtnNeeded) {
                            shortPlotText = movie.Plot.split('').slice(0, 130).join('') + '...';
                        }

                        movieListContainer.innerHTML += `
                    <article class="movie-card">
                       <div class="movie-img-container">
                           <img src=${movie.Poster} class="poster-img" alt="Poster of ${movie.Title}">
                       </div>
       
                       <div class="movie-info">
                           <h2 class="movie-title">
                               ${movie.Title}
                               <span class="rating" aria-label="Rating: ${movie.imdbRating}">
                                   <img src="img/star-icon.png" alt="Star icon" />${movie.imdbRating}</span>
                           </h2>
       
                           <div class="movie-description">
                               <span class="movie-duration">${movie.Runtime}</span>
                               <span class="movie-genre">${movie.Genre}</span>
                               <button 
                                   class="add-to-watchlist-btn" 
                                   data-movie-id=${movie.imdbID}
                                   aria-label="Add ${movie.Title} to watchlist">
                                   <img src="img/add-icon.png" alt="Plus icon" />
                                   Watchlist
                               </button>
                           </div>
       
                           ${isReadBtnNeeded ?
                                `<p class="movie-summary">
                                    <span class="plot-text">${shortPlotText}</span>
                                    <button 
                                        class="plot-btn" 
                                        data-state="short"
                                        data-short-plot="${shortPlotText}"
                                        data-full-plot="${movie.Plot}">
                                        Read more
                                    </button>
                                </p>`
                                :
                                `<p class="movie-summary">${movie.Plot}</p>`
                            }
                    </article>
                   `;
                    })
            }
        })
        .catch(err => {
            console.error(err);

            movieListContainer.innerHTML = '';

            const errorMsgParagraph = document.createElement('p');
            const errorText = 'Unable to find what you\'re looking for. Please try another search.';
            errorMsgParagraph.textContent = errorText;
            errorMsgParagraph.classList.add('error-msg');

            movieListContainer.appendChild(errorMsgParagraph);

            main.classList.remove('main-filled');
            movieListContainer.classList.remove('movie-list-filled');
        })
})

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Add to watchlist functionality
movieListContainer.addEventListener('click', (e) => {
    // find which button was clicked by id
    const addBtn = e.target.closest('.add-to-watchlist-btn');

    // make a film object
    if (addBtn) {
        const movieId = addBtn.dataset.movieId;
        const movieCard = addBtn.closest('.movie-card');
        const title = movieCard.querySelector('.movie-title').childNodes[0].textContent.trim();
        const poster = movieCard.querySelector('img').src;
        const rating = movieCard.querySelector('.rating').textContent.trim();
        const genre = movieCard.querySelector('.movie-genre').textContent;
        const duration = movieCard.querySelector('.movie-duration').textContent;
        const summary = movieCard.querySelector('.movie-summary').textContent;

        const movie = {
            id: movieId,
            title,
            poster,
            rating,
            genre,
            duration,
            summary
        };

        // add it to watchlist arr if it's not present
        if (watchlist.some(movie => movie.id === movieId)) {
            console.log(`"${title}" is already in your watchlist.`);
        } else {
            watchlist.push(movie);
            console.log(`"${title}" is added in your watchlist.`);
        }

        // add the arr of movies to localStorage
        localStorage.setItem('watchlist', JSON.stringify(watchlist));

        // display the saved movies in watchlistContainer => watchlist.js
        // add remove functionality => watchlist.js
    }
});

// Read more functionality
movieListContainer.addEventListener('click', (e) => {
    // find which button was clicked
    const readMoreBtn = e.target.closest('.plot-btn');

    // toggle the plot length
    if (readMoreBtn) {
        const movieSummary = readMoreBtn.previousElementSibling;

        if (readMoreBtn.dataset.state === 'short') {
            movieSummary.textContent = readMoreBtn.dataset.fullPlot;
            readMoreBtn.dataset.state = 'full';
            readMoreBtn.textContent = 'Read less';
        } else {
            movieSummary.textContent = readMoreBtn.dataset.shortPlot;
            readMoreBtn.dataset.state = 'short';
            readMoreBtn.textContent = 'Read more';
        }
    }
});


