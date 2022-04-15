import React, { useState, useEffect } from 'react';
import axios from './axios';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import './Row.css';

const base_url = 'https://image.tmdb.org/t/p/original';

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [urlError, setUrlError] = useState(false);

  useEffect(() => {
    console.log('useeffect');
    
    document.querySelectorAll('.row_posters').forEach((item) => {
      // console.log('item', item);
      item.addEventListener('wheel', (e) => {
        // console.log('listener added');
        handleScroll(e);
      });
    });
    // return () => {
    //   document.removeEventListener('wheel', handleScroll);
    //   console.log("remove event listener")
    // };
  }, []);

  function handleScroll(e) {
    e.preventDefault();
    let target = e.target;
    var parent = target.parentElement;
    let id = parent.id;
    if (id) {
      document.getElementById(id).scrollBy({
        left: e.deltaY < 0 ? -300 : 300,
      });
    }
    parent.removeEventListener('wheel', handleScroll);
    // console.log('listener removed');
  }

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: '390',
    width: '99%',
    playerVars: {
      autoplay: 0,
    },
  };

  async function fetchMovie(movie_id) {
    const movie_request = await axios.get(
      '/movie/' + movie_id + '?api_key=14045fe4e260107e4b484bdb96ba3183'
    );
    return movie_request.data.results;
  }

  const handleClick = (movie) => {
    if (trailerUrl && urlError === false) {
      setTrailerUrl('');
    } else {
      movieTrailer(movie?.title || '') // the (|| "") part is for if the title is undefined
        .then((url) => {
          if (!url) {
            //if url is null
            setUrlError(true);
            return;
          }
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get('v'));
          setUrlError(false);
        })
        .catch((error) => {
          console.log('error! ', error);
          setUrlError(true);
        });
    }
    if (movie?.id) {
      fetchMovie(movie.id);
    }
  };

  return (
    <div className='row'>
      <h2>{title}</h2>
      <div className='row_posters' id={title}>
        {movies.map((movie) => {
          return (
            <img
              key={movie.id}
              id={movie.id}
              onClick={() => handleClick(movie)}
              className={`row_poster ${isLargeRow && 'row_posterLarge'}`}
              src={`${base_url}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.title}
            />
          );
        })}
      </div>
      <div style={{ padding: '40px' }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        {urlError && <div className='url_error'>No trailer available</div>}
      </div>
    </div>
  );
}

export default Row;
