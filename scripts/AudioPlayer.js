class AudioPlayer {
	constructor(element) {
		this.element = element;
		this.audio = element.querySelector('audio');
		this.title = element.querySelector('.title');
		this.seekBar = element.querySelector('.progress-bar');
		this.playPauseButton = element.querySelector('.play-pause-button');
		this.currentTimeDisplay = element.querySelector('.current-time');
		this.durationDisplay = element.querySelector('.duration');
		if(element.classList.contains('skeleton')) {
			element.classList.remove('skeleton');
			this.audio.ontimeupdate = AudioPlayer.handleTimeUpdate;
			this.audio.onloadeddata = (e) => {
				const player = new AudioPlayer(e.currentTarget.parentElement);
				player.durationDisplay.innerText = AudioPlayer.secsToHMS(player.audio.duration);
			}
			this.audio.onseeking = (e) => {
				new AudioPlayer(e.currentTarget.parentElement).setStatusIcon('..assets/icons/loading16.gif');
			}
			this.audio.onseeked = this.audio.onplay = this.audio.onpause = (e) => {
				new AudioPlayer(e.currentTarget.parentElement).setStatusIcon();
			}

			this.seekBar.onclick = AudioPlayer.handleSeek;
			this.playPauseButton.onclick = AudioPlayer.togglePlayingState;

		}
	}

	setStatusIcon(image) {
		if(image == undefined)
			image = this.audio.paused ? '..assets/icons/play.png' : '..assets/icons/pause.png';
		this.playPauseButton.children[0].setAttribute('src', image);
	}

	static create(name, url) {
		const audio = document.createElement('audio');
		const source = document.createElement('source');
		source.setAttribute('src', url);	
		audio.appendChild(source);

		const title = document.createElement('div');
		title.classList.add('title');
		title.innerText = name;

		const seekBar = document.createElement('div');
		const bar = document.createElement('div');
		bar.classList.add('bar');
		seekBar.classList.add('progress-bar');
		seekBar.appendChild(bar);

		const currentTimeDisplay = document.createElement('span');
		currentTimeDisplay.classList.add('current-time');
		currentTimeDisplay.innerText = this.secsToHMS(0);
		const durationDisplay = document.createElement('span');
		durationDisplay.classList.add('duration');
		durationDisplay.innerText = this.secsToHMS(0);
		seekBar.appendChild(currentTimeDisplay);
		seekBar.appendChild(durationDisplay);

		const playIcon = document.createElement('img');
		playIcon.setAttribute('src', '..assets/icons/play.png');
		const playPauseButton = document.createElement('button');
		playPauseButton.classList.add('play-pause-button');
		playPauseButton.appendChild(playIcon);
		
		const downloadIcon = document.createElement('img');
		downloadIcon.setAttribute('src', '..assets/icons/download.png');
		const downloadButton = document.createElement('a');
		downloadButton.classList.add('button', 'download-button');
		downloadButton.setAttribute('href', url);
		downloadButton.appendChild(downloadIcon);

		const controls = document.createElement('div');
		controls.classList.add('controls');
		controls.appendChild(playPauseButton);
		controls.appendChild(downloadButton);

		const player = document.createElement('div');
		player.classList.add('player', 'skeleton');
		player.appendChild(audio);
		player.appendChild(title);
		player.appendChild(seekBar);
		player.appendChild(controls);
		return player;
	}

	// ---------- handlers ---------- //
	static togglePlayingState(e) {
		const player = new AudioPlayer(e.currentTarget.parentElement.parentElement);
		if(player.audio.paused) {
			player.audio.play();
		} else {
			player.audio.pause();
		}
		//player.setStatusIcon()
	}
	
	static handleSeek(e) {
		const player = e.currentTarget.parentElement;
		const audio = player.querySelector('audio');
		const seekBar = player.querySelector('.progress-bar');
		
		const rect = seekBar.getBoundingClientRect();
		let xRel = e.clientX - rect.left;
	
		const seek = audio.duration * xRel / rect.width;
		audio.currentTime = seek.toString();
	}
	
	static handleTimeUpdate(e) {
		const player = new AudioPlayer(e.currentTarget.parentElement);
		
		const progress = 100 * player.audio.currentTime / player.audio.duration;
		player.seekBar.children[0].setAttribute("style", "width: " + progress + "%");
		player.currentTimeDisplay.innerText = AudioPlayer.secsToHMS(player.audio.currentTime);
	
		/*if(player.tracklist != null) {
			for(let i = 0; i < player.tracklist.length; i++) {
				let track = player.tracklist[i];
				let nextTrack = player.tracklist[i + 1];
				if(nextTrack == null) {
					nextTrack = {};
					nextTrack.timestamp = player.audio.duration;
				}
				if(track.timestamp <= player.audio.currentTime && player.audio.currentTime < nextTrack.timestamp) {
					player.nowPlaying.innerText = track.artist + " - " + track.title;
				}
			}
		}*/
	}

	// ---------- helpers ---------- //
	static secsToHMS(t) {
        t = t.toFixed();
        let s = (t % 60).toString().padStart(2, "0");
        t = (t - s) / 60;
        let m = (t % 60).toString().padStart(2, "0");
        t = (t - m) / 60;
        let h = t.toString();
        return h + ":" + m + ":" + s;
    }
}

document.querySelectorAll('noscript').forEach(noscript => {
	console.log("creating player")
	const links = noscript.innerHTML.split('</a>');
	links.pop();
	const players = document.createElement('div');
	links.forEach(link => {
		const data = link.split('<a href="')[1].split('">');
		const name = data[1];
		const url = data[0].replace('http:', window.location.protocol);

		const player = new AudioPlayer(AudioPlayer.create(name, url));
		players.appendChild(player.element);
	});
	noscript.parentElement.appendChild(players);
});	
