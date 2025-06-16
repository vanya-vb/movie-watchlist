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
            // console.log(movies)

            if (input.value === '') {
                throw new Error(movies.Error);
            } else if (movies.Response === 'False') {
                throw new Error(movies.Error);
            }

            let movieTitles = [];

            for (let movie of movies.Search) {
                movieTitles.push(movie.Title);
            }

            for (let title of movieTitles) {
                fetch(`http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`)
                    .then(res => {
                        if (!res.ok) {
                            throw Error('Something went wrong');
                        }

                        return res.json()
                    })
                    .then(movie => {
                        let plotText = movie.Plot;
                        isReadBtnNeeded = plotText.length > 130;

                        if (plotText.length > 130) {
                            plotText = plotText.split('').slice(0, 130).join('') + '...';
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
                               <button class="add-to-watchlist-btn" data-movie-id=${movie.imdbID}
                                   aria-label="Add ${movie.Title} to watchlist">
                                   <img src="img/add-icon.png" alt="Add icon" />
                                   Watchlist
                               </button>
                           </div>
       
                           ${isReadBtnNeeded ?
                                `<p class="movie-summary">
                                    <span>${plotText}</span>
                                    <button class="read-more-btn">Read more</button></div>
                                </p>`
                                :
                                `<p class="movie-summary">${plotText}</p>`
                            }
                       </div>
                   </article>
                   `;
                    })
            }

            main.classList.add('main-filled');
            movieListContainer.classList.add('movie-list-filled');
            movieListContainer.innerHTML = '';
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

// Add to watchlist functionality
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

movieListContainer.addEventListener('click', (e) => {
    // find which button was clicked by id
    const button = e.target.closest('.add-to-watchlist-btn');

    if (button) {
        // make a film object
        const movieId = button.dataset.movieId;
        const movieCard = button.closest('.movie-card');
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

        // add it to watchlist arr if it's not added
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
})

