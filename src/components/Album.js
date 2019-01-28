import React, { Component } from 'react';
import albumData from './../data/albums';

class Album extends Component {
  constructor(props) {
    super(props);
    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      currentIndex: 0
    };
    
    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false});
  }

  setSong(song,songIndex) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song,currentIndex: songIndex});
  }

  handleSongClick(song,songIndex) {
    const isSameSong = this.state.currentSong === song;
    const allsongs = this.state.album.songs.slice();
    allsongs[this.state.currentIndex].clicked = false;
    
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song,songIndex);
      }
      allsongs[songIndex].clicked = true;
      this.play();
    }
    this.setState({ album: { ...this.state.album, songs: allsongs } });

  }

  handleSongHover(songIndex) {
    const allsongs = this.state.album.songs.slice();
    allsongs[songIndex].hover = true;
    this.setState({ album: { ...this.state.album, songs: allsongs } });
  }

  handleSongLeave(songIndex) { 
    const allsongs = this.state.album.songs.slice();
    allsongs[songIndex].hover = false;
    this.setState({ album: { ...this.state.album, songs: allsongs } });
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title} />
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            <tr>
              <th id="song-number-header">Song Number</th>
              <th id="song-title-header">Song Title</th>
              <th id="song-duration-header">Song Duration</th>
            </tr>
            {
              this.state.album.songs.map((song, songIndex) =>
                <tr className="song" key={songIndex} onClick={() => this.handleSongClick(song,songIndex)} onMouseEnter={() => this.handleSongHover(songIndex)} onMouseLeave={() => this.handleSongLeave(songIndex)}>
                  <td id="song-number">
                    {!song.hover && !song.clicked && <span className="not-playing">{songIndex + 1}</span>}
                    {song.hover && !song.clicked && <span className="ion-md-play"></span>}
                    {song.clicked && <span className="ion-md-pause"></span>}
                  </td>
                  <td id="song-title">{song.title}</td>
                  <td id="song-duration">{song.duration}s</td>
                  
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
    );
  }
}

export default Album;