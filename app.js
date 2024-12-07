document.getElementById('searchInput').addEventListener('input', function() {
    const query = document.getElementById('searchInput').value;

    if (query.length > 2) { // Realizar la búsqueda solo si hay más de 2 caracteres
        fetch(`https://api.lyrics.ovh/suggest/${query}`)
            .then(response => response.json())
            .then(suggestions => {
                let suggestionsHTML = '';
                suggestions.data.forEach(item => {
                    suggestionsHTML += `
                        <div class="list-group-item">
                            <a href="#" class="list-group-item-action" onclick="selectSuggestion('${item.artist.name}', '${item.title}')">${item.title} - ${item.artist.name}</a>
                        </div>`;
                });
                document.getElementById('autocompleteSuggestions').innerHTML = suggestionsHTML;
            })
            .catch(error => {
                console.error('Error fetching autocomplete suggestions:', error);
                document.getElementById('autocompleteSuggestions').innerHTML = ''; // Limpiar sugerencias
            });
    }
});

function selectSuggestion(artist, title) {
    document.getElementById('searchInput').value = `${title} - ${artist}`;
    document.getElementById('autocompleteSuggestions').innerHTML = ''; // Limpiar sugerencias
    fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
        .then(response => response.json())
        .then(data => {
            const lyrics = data.lyrics;
            document.getElementById('lyricsDisplay').innerText = lyrics;
            document.getElementById('lyricsOptions').innerHTML = `
                <button onclick="copyLyrics('${artist}', '${title}')">Copiar Letra</button>
            `;
        })
        .catch(error => {
            console.error('Error fetching lyrics:', error);
        });
}

function copyLyrics(artist, title) {
    const lyrics = document.getElementById('lyricsDisplay').innerText;
    navigator.clipboard.writeText(lyrics).then(() => {
        alert('Letra copiada al portapapeles');
    }).catch(err => {
        console.error('Error al copiar la letra:', err);
    });
}