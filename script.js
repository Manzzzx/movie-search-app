const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const moviesContainer = document.getElementById('movies');


const API_KEY = '512be3fd';

// Event listener untuk tombol search
searchBtn.addEventListener('click', () => {
  const query = searchInput.value; // Ambil teks pencarian dari input
  if (query) {
    searchMovies(query); // Panggil fungsi untuk cari film
  }
});

// Fungsi untuk mencari film berdasarkan query
async function searchMovies(query) {
  const url = `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`; // URL API
  try {
    const response = await fetch(url); // Panggil API
    const data = await response.json();
    if (data.Search) {
      displayMovies(data.Search); // Kalau ada hasil, tampilkan film
    } else {
      moviesContainer.innerHTML = '<p>No movies found.</p>'; // Kalau gak ada, kasih pesan
    }
  } catch (error) {
    console.error('Error fetching movies:', error); // Tampilkan error di console
  }
}

// Fungsi untuk menampilkan daftar film
function displayMovies(movies) {
  moviesContainer.innerHTML = movies.map(movie => `
    <div class="movie" data-id="${movie.imdbID}">
      <img src="${movie.Poster}" alt="${movie.Title}">
      <div class="movie-details">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <p>${movie.Type}</p>
      </div>
    </div>
  `).join(''); // Buat daftar film

  // Tambahkan event listener ke setiap film
  const movieElements = document.querySelectorAll('.movie');
  movieElements.forEach(movie => {
    movie.addEventListener('click', () => {
      const movieID = movie.getAttribute('data-id'); // Ambil ID film
      fetchMovieDetails(movieID); // Panggil fungsi detail film
    });
  });
}

// Fungsi untuk ambil detail film dari API
async function fetchMovieDetails(movieID) {
  const url = `https://www.omdbapi.com/?i=${movieID}&apikey=${API_KEY}`; // URL untuk detail film
  try {
    const response = await fetch(url); // Panggil API
    const data = await response.json();
    if (data) {
      displayMovieDetails(data); // Tampilkan detail film
    }
  } catch (error) {
    console.error('Error fetching movie details:', error); // Tampilkan error di konsol
  }
}

// Fungsi untuk menampilkan detail film
function displayMovieDetails(movie) {
  moviesContainer.innerHTML = `
    <div class="movie-details">
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h2>${movie.Title}</h2>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Released:</strong> ${movie.Released}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <button id="back-btn">Back to Search</button>
    </div>
  `;

  // Tambahkan tombol untuk kembali ke hasil pencarian
  const backBtn = document.getElementById('back-btn');
  backBtn.addEventListener('click', () => {
    moviesContainer.innerHTML = ''; 
    searchMovies(searchInput.value); 
  });
}
