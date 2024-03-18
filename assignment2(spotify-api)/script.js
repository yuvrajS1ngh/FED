const CLIENT_ID = '77d18083d50b49109bc1938bfcbc62a6';
const CLIENT_SECRET = '4f775739ae5d466794a1c512ffae610e';
const REDIRECT_URI = 'http://127.0.0.1:5500';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const API_ENDPOINT = 'https://api.spotify.com/v1';

const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await result.json()
    return data.access_token
}

async function searchArtist(artistName) {
    try {
        const token = await _getToken();
        // const artistName = document.getElementById('searchInput').value;
        if (!token) {
            console.log('Access token not found. Please authenticate first.');
            return;
        }

        fetch(`${API_ENDPOINT}/search?q=${artistName}&type=artist`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(data => {
                const artistId = data.artists.items[0].id;
                // const artisturl = data.artists.items[0].images[0].url
                displayAlbums(token, artistId);
            })
            .catch(error => console.error('Error searching artist:', error));
    } catch (error) {
        console.error('Error getting access token:', error);
    }
}

function displayAlbums(token, artistId) {
    fetch(`${API_ENDPOINT}/artists/${artistId}/albums`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(response => response.json())
        .then(data => {
            const albumsContainer = document.getElementById('albums');
            albumsContainer.innerHTML = '';

            data.items.forEach(album => {
                const albumElement = document.createElement('div');
                albumElement.style.cssText = "box-shadow: 0 0 2px black"
                albumElement.classList.add('album');
                let artisturl = album.images[0].url
                albumElement.innerHTML = `${artisturl} ${album.name}`;
                albumElement.innerHTML = `<img class="songimage" src=${album.images[0].url}> <p>${album.name} - ${album.artists[0].name}</p>`;
                albumElement.addEventListener('click', () => displayTracks(token, album.id, artisturl));
                albumsContainer.appendChild(albumElement);
            });
        })
        .catch(error => console.error('Error displaying albums:', error));
}

function displayTracks(token, albumId, artisturl) {
    fetch(`${API_ENDPOINT}/albums/${albumId}/tracks`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(response => response.json())
        .then(data => {
            const tracksContainer = document.getElementById('tracks');
            tracksContainer.innerHTML = '';

            data.items.forEach(track => {
                const trackElement = document.createElement('div');
                trackElement.style.cssText = "border: 1px solid black";
                trackElement.classList.add('track');
                let imageurl =  artisturl
                let trackname = track.name
                let artistname = track.artists[0].name
                trackElement.innerHTML = `<img class="songimage" src=${imageurl}> <p>${trackname} - ${artistname}</p>`;
                trackElement.addEventListener('click', () => playTrack(track.preview_url, trackname, artistname, imageurl));
                tracksContainer.appendChild(trackElement);
            });
        })
        .catch(error => console.error('Error displaying tracks:', error));
}

function playTrack(previewUrl, trackname, artistname, imageurl) {
    if (!previewUrl) {
        console.error('No preview available for this track');
        return;
    }
    document.querySelector('.songname').innerHTML = trackname
    document.querySelector('.songartist').innerHTML = artistname
    const songimage = document.querySelectorAll('.songimage')
    songimage[songimage.length - 1].src = imageurl
    const audio = document.getElementById('audioPlayer');
    audio.src = previewUrl;
    audio.play();
}

document.getElementById('searchButton').addEventListener('click', async function () {
    const searchInput = document.getElementById('searchInput').value.trim();
    if (searchInput !== '') {
        await searchArtist(searchInput);
    }
});

document.getElementById('searchInput').addEventListener('keypress', function (e) {
    document.getElementById('searchButton').click();
});

async function showDefault(){
    await searchArtist("songs");
}

window.addEventListener("load" , () => {
    showDefault();
})
