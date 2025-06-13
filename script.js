// Capture elements
const input = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const main = document.querySelector('.main');
const movieListContainer = document.querySelector('.movie-list-container');
const watchlistContainer = document.querySelector('.watchlist-container');
// let watchlist = [];

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
                throw new Error('Unable to find what you\'re looking for');
            } else if (movies.Response === 'False') {
                throw new Error(movies.Error);
            }

            let movieTitles = [];

            for (let movie of movies.Search) {
                movieTitles.push(movie.Title);
            }

            // console.log(movieTitles);

            for (let title of movieTitles) {
                fetch(`http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`)
                    .then(res => {
                        if (!res.ok) {
                            throw Error('Something went wrong');
                        }

                        return res.json()
                    })
                    .then(movie => {

                        // console.log(movie);

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
                                   aria-label="Add  ${movie.Title} to watchlist">
                                   <img src="img/add-icon.png" alt="Add icon" />
                                   Watchlist
                               </button>
                           </div>
       
                           <p class="movie-summary">${movie.Plot}</p>
                       </div>
                   </article>
       
                   <hr>
                   `;
                    })
            }

            main.classList.add('main-filled');
            movieListContainer.classList.add('movie-list-filled');
            movieListContainer.innerHTML = '';
        })
        .catch(err => {
            console.error(err)

            main.classList.remove('main-filled');
            movieListContainer.classList.remove('movie-list-filled');

            movieListContainer.innerHTML = '';
            const errorMsgParagraph = document.createElement('p');
            const errorText = 'Unable to find what you\'re looking for. Please try another search.';
            errorMsgParagraph.textContent = errorText;
            errorMsgParagraph.classList.add('error-msg');

            movieListContainer.appendChild(errorMsgParagraph);
        })
})