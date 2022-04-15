import React, { useState, useEffect } from 'react';
import axios from './axios';
import requests from './requests';
import './Banner.css';

function Banner() {
  const [movie, setMovie] = useState([]);
  const [youtubeTrailer, setYoutubeTrailer] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      let randomMovie = Math.floor(
        Math.random() * request.data.results.length - 1
      );
      setMovie(request.data.results[randomMovie]);

      async function fetchYoutubeTrailer() {
        //trailer id:  request.data.results[randomMovie].id
        const trailerReq = await axios.get(
          `https://api.themoviedb.org/3/tv/${request.data?.results[randomMovie]?.id}/videos?api_key=14045fe4e260107e4b484bdb96ba3183&language=en-US`
        );
        if (trailerReq?.data?.results[0]?.key) {
          let youtubeVideoLink = `https://www.youtube.com/watch?v=${trailerReq.data.results[0].key}`;
          setYoutubeTrailer(youtubeVideoLink);
        }
      }
      fetchYoutubeTrailer();
      return request;
    }

    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  }
  return (
    <header
      className='banner'
      style={{
        backgroundSize: 'cover',
        backgroundImage: `url(
        "https://image.tmdb.org/t/p/original/${movie?.backdrop_path}"
        )`,
        backgroundPosition: 'center center',
      }}
    >
      <div className='banner_contents'>
        <h1 className='banner_title'>
          {movie?.title || movie?.name || movie?.original_name}
        </h1>

        <div className='banner_buttons'>
          {youtubeTrailer ? (
            <a href={youtubeTrailer} target='_blank' rel='noopener noreferrer'>
              <button className='banner_button'>Play</button>
            </a>
          ) : (
            <button
              className='banner_button disabled'
              title='No trailer available for this show or movie'
              disabled
            >
              Play
            </button>
          )}

          <button className='banner_button'>My List</button>
        </div>
        <h1 className='banner_description'>{truncate(movie?.overview, 150)}</h1>
      </div>

      <div className='banner--fadeBottom' />
    </header>
  );
}

export default Banner;
