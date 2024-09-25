const apiKey = 'AIzaSyDn1bri9xu3LPmWucde9USErpz9z6hZC2o'; // Replace with your Tenor API key
let nextPos = 0;
let currentQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
});

function fetchCategories() {
    fetch(`https://tenor.googleapis.com/v2/categories?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const categoriesDiv = document.getElementById('categories');
            data.tags.forEach(tag => {
                const button = document.createElement('button');
                button.textContent = tag.name;
                button.onclick = () => searchGIFs(tag.name);
                categoriesDiv.appendChild(button);
            });
        });
}

function searchGIFs(query) {
    currentQuery = query || document.getElementById('searchInput').value;
    nextPos = 0;
    fetchGIFs();
}

function fetchGIFs() {
    fetch(`https://tenor.googleapis.com/v2/search?q=${currentQuery}&key=${apiKey}&limit=10&pos=${nextPos}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            if (nextPos === 0) resultsDiv.innerHTML = '';
            data.results.forEach(gif => {
                const img = document.createElement('img');
                img.src = gif.media_formats.tinygif.url;
                img.onclick = () => downloadGIF(gif.media_formats.gif.url);
                img.oncontextmenu = (e) => {
                    e.preventDefault();
                    shareGIF(gif.media_formats.gif.url);
                };
                resultsDiv.appendChild(img);
            });
            nextPos = data.next;
            document.getElementById('loadMore').style.display = data.next ? 'block' : 'none';
        });
}

function loadMoreGIFs() {
    fetchGIFs();
}

function downloadGIF(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'download.gif';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function shareGIF(url) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this GIF!',
            url: url
        }).catch(console.error);
    } else {
        alert('Sharing is not supported in this browser.');
    }
}
