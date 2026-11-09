// Node for the circular linked list
class Node {
    constructor(song) {
        this.song = song;
        this.next = null;
    }
}

// Circular linked list implementation
class CircularPlaylist {
    constructor() {
        this.tail = null;
        this.current = null;
        this.count = 0;
    }

    // Add a song to the playlist
    addSong(song) {
        const newNode = new Node(song);

        if (this.tail === null) {
            this.tail = newNode;
            newNode.next = newNode;
            this.current = newNode;
        } else {
            newNode.next = this.tail.next;
            this.tail.next = newNode;
            this.tail = newNode;
        }

        this.count++;
    }

    // Remove a song by its zero-based position
    removeSong(index) {
        if (
            this.tail === null ||
            index < 0 ||
            index >= this.count
        ) {
            return false;
        }

        let node = this.tail.next;
        let previous = this.tail;

        for (let i = 0; i < index; i++) {
            previous = node;
            node = node.next;
        }

        if (node === this.current) {
            this.current =
                this.count === 1 ? null : node.next;
        }

        if (this.count === 1) {
            this.tail = null;
            this.current = null;
        } else {
            previous.next = node.next;

            if (node === this.tail) {
                this.tail = previous;
            }
        }

        this.count--;
        return true;
    }

    // Move to the next song
    nextSong() {
        if (this.current !== null) {
            this.current = this.current.next;
        }

        return this.current;
    }

    // Move to the previous song
    previousSong() {
        if (this.current === null || this.count < 2) {
            return this.current;
        }

        let node = this.tail.next;

        while (node.next !== this.current) {
            node = node.next;
        }

        this.current = node;
        return this.current;
    }

    // Get songs in playlist order
    getSongs() {
        const songs = [];

        if (this.tail === null) {
            return songs;
        }

        let node = this.tail.next;

        do {
            songs.push(node.song);
            node = node.next;
        } while (node !== this.tail.next);

        return songs;
    }
}

// Create the playlist
const playlist = new CircularPlaylist();

// HTML elements
const songInput = document.getElementById("songInput");
const addButton = document.getElementById("addButton");
const playlistElement = document.getElementById("playlist");
const songCount = document.getElementById("songCount");
const currentSong = document.getElementById("currentSong");
const nextButton = document.getElementById("nextButton");
const previousButton = document.getElementById("previousButton");

// Add a song
function addSong() {
    const song = songInput.value.trim();

    if (song === "") {
        alert("Please enter a song name!");
        return;
    }

    playlist.addSong(song);

    songInput.value = "";
    displayPlaylist();
}

// Remove a song
function removeSong(index) {
    playlist.removeSong(index);
    displayPlaylist();
}

// Display the playlist
function displayPlaylist() {
    playlistElement.replaceChildren();

    const songs = playlist.getSongs();

    songs.forEach((song, index) => {
        const li = document.createElement("li");
        const row = document.createElement("div");
        const name = document.createElement("span");
        const removeButton = document.createElement("button");

        row.className = "song-row";
        name.className = "song-name";
        name.textContent = song;

        removeButton.textContent = "Remove";
        removeButton.className = "remove-button";

        removeButton.addEventListener("click", () => {
            removeSong(index);
        });

        if (playlist.current &&
            playlist.current.song === song &&
            getCurrentIndex() === index) {
            name.textContent = "▶ " + song;
        }

        row.append(name, removeButton);
        li.appendChild(row);
        playlistElement.appendChild(li);
    });

    songCount.textContent = `Total Songs: ${playlist.count}`;

    currentSong.textContent = playlist.current
        ? `Selected Song: ${playlist.current.song}`
        : "No song selected";
}

// Find the current song's position
function getCurrentIndex() {
    const songs = playlist.getSongs();

    if (!playlist.current) {
        return -1;
    }

    return songs.findIndex((song, index) => {
        let node = playlist.tail.next;

        for (let i = 0; i < index; i++) {
            node = node.next;
        }

        return node === playlist.current;
    });
}

// Next song button
nextButton.addEventListener("click", () => {
    playlist.nextSong();
    displayPlaylist();
});

// Previous song button
previousButton.addEventListener("click", () => {
    playlist.previousSong();
    displayPlaylist();
});

// Add song button
addButton.addEventListener("click", addSong);

// Allow Enter to add a song
songInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addSong();
    }
});

// Initial display
displayPlaylist();