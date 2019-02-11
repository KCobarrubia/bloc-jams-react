import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);
    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    album.songs.forEach((songRecord) => songRecord.hover = false);

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 1,
      isPlaying: false,
    };
    
    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumechange: e => {
        this.setState({ volume: this.audioElement.volume });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange);
  }
  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false});
  }

  setSong(song) {
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song);
      }
      this.play();
    }
  }

  handleSongHover(songIndex) {
    const songs = this.state.album.songs.slice();
    const song = songs[songIndex];
    song.hover = true;
    this.setState({ album: { ...this.state.album, songs: songs } });
  }

  handleSongLeave(songIndex) { 
    const songs = this.state.album.songs.slice();
    const song = songs[songIndex];
    song.hover = false;
    this.setState({ album: { ...this.state.album, songs: songs } });
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(currentIndex + 1, this.state.album.songs.length-1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    const newVolume = e.target.value;
    this.audioElement.volume = newVolume;
    this.setState({ volume: newVolume});
  }

  formatTime(timesecond) {
    if ( isNaN(timesecond)) {
      return '-:--';
    }
    var d = new Date(1980, 1, 1, 0, 0, timesecond);
    return d.getMinutes() + ':' + ((d.getSeconds() < 10) ? '0' + d.getSeconds() : d.getSeconds()) ;
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
                <tr className="song" key={songIndex} onClick={() => this.handleSongClick(song)} onMouseEnter={() => this.handleSongHover(songIndex)} onMouseLeave={() => this.handleSongLeave(songIndex)}>
                  <td id="song-number">
                    {!song.hover && !(this.state.currentSong === song && this.state.isPlaying) && <span className="not-playing">{songIndex + 1}</span>}
                    {song.hover && !(this.state.currentSong === song && this.state.isPlaying) && <span className="ion-md-play"></span>}
                    {this.state.currentSong === song && this.state.isPlaying && <span className="ion-md-pause"></span>}
                  </td>
                  <td id="song-title">{song.title}</td>
                  <td id="song-duration">{this.formatTime(song.duration)}</td>
                  
                </tr>
              )
            }
          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime}
          duration={this.audioElement.duration}
          volume={this.audioElement.volume}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNextClick={() => this.handleNextClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={(timesecond) => this.formatTime(timesecond)}
        />
      </section>
    );
  }
}

export default Album;