document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value;

    if (query) {
        // Dividir la consulta en artista y título si es posible
        const [artist, title] = query.split(' - ');

        if (artist && title) {
            fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
                .then(response => response.json())
                .then(data => {
                    if (data.lyrics) {
                        document.getElementById('lyrics').innerText = data.lyrics;
                        document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
                    } else {
                        document.getElementById('lyrics').innerText = 'Letra no encontrada.';
                        document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
                    }
                })
                .catch(error => {
                    console.error('Error fetching lyrics:', error);
                    document.getElementById('lyrics').innerText = 'Error al buscar la letra.';
                    document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
                });
        } else {
            document.getElementById('lyrics').innerText = 'Por favor, ingrese el artista y la canción en el formato "Artista - Canción".';
            document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
        }
    } else {
        document.getElementById('lyrics').innerText = 'Por favor, ingrese el artista o la canción.';
        document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
    }
});

document.getElementById('searchInput').addEventListener('input', function() {
    const query = document.getElementById('searchInput').value;

    if (query.length > 2) { // Realizar la búsqueda solo si hay más de 2 caracteres
        fetch(`https://api.lyrics.ovh/suggest/${query}`)
            .then(response => response.json())
            .then(suggestions => {
                let suggestionsHTML = '';
                suggestions.data.forEach(item => {
                    suggestionsHTML += `<a href="#" class="list-group-item list-group-item-action" onclick="selectSuggestion('${item.artist.name}', '${item.title}')">${item.title} - ${item.artist.name}</a>`;
                });
                document.getElementById('autocompleteSuggestions').innerHTML = suggestionsHTML;
            })
            .catch(error => {
                console.error('Error fetching autocomplete suggestions:', error);
                document.getElementById('autocompleteSuggestions').innerHTML = ''; // Limpiar sugerencias
            });
    } else {
        document.getElementById('autocompleteSuggestions').innerHTML = ''; // Limpiar sugerencias
    }
});

function selectSuggestion(artist, title) {
    document.getElementById('searchInput').value = `${artist} - ${title}`;
    document.getElementById('autocompleteSuggestions').innerHTML = ''; // Limpiar sugerencias
}