document.getElementById('searchButton').addEventListener('click', function() {
    const artist = document.getElementById('artist').value;
    const song = document.getElementById('song').value;

    if (artist && song) {
        fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
            .then(response => response.json())
            .then(data => {
                if (data.lyrics) {
                    document.getElementById('lyrics').innerText = data.lyrics;
                    document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
                } else {
                    // Si no se encuentra la letra exacta, realizar una búsqueda difusa
                    fetch(`https://api.lyrics.ovh/suggest/${song}`)
                        .then(response => response.json())
                        .then(suggestions => {
                            const options = {
                                keys: ['title'],
                                threshold: 0.3 // Ajusta este valor para cambiar la sensibilidad de la búsqueda difusa
                            };
                            const fuse = new Fuse(suggestions.data, options);
                            const result = fuse.search(song);

                            // Mostrar sugerencias solo si no se encuentra una coincidencia exacta
                            if (result.length > 0) {
                                const bestMatch = result[0].item;
                                if (bestMatch.artist.name.toLowerCase() !== artist.toLowerCase() || bestMatch.title.toLowerCase() !== song.toLowerCase()) {
                                    let suggestionsHTML = '<h5>Sugerencias:</h5><ul class="list-group">';
                                    result.forEach(item => {
                                        suggestionsHTML += `<li class="list-group-item">${item.item.artist.name} - ${item.item.title}</li>`;
                                    });
                                    suggestionsHTML += '</ul>';
                                    document.getElementById('suggestions').innerHTML = suggestionsHTML;
                                } else {
                                    document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
                                }
                            } else {
                                document.getElementById('lyrics').innerText = 'Letra no encontrada.';
                                document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching suggestions:', error);
                            document.getElementById('lyrics').innerText = 'Error al buscar sugerencias.';
                            document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching lyrics:', error);
                document.getElementById('lyrics').innerText = 'Error al buscar la letra.';
                document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
            });
    } else {
        document.getElementById('lyrics').innerText = 'Por favor, ingrese el artista y la canción.';
        document.getElementById('suggestions').innerHTML = ''; // Limpiar sugerencias
    }
});