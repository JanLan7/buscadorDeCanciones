document.getElementById('searchButton').addEventListener('click', function() {
    const artist = document.getElementById('artist').value;
    const song = document.getElementById('song').value;

    if (artist && song) {
        fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
            .then(response => response.json())
            .then(data => {
                if (data.lyrics) {
                    document.getElementById('lyrics').innerText = data.lyrics;
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

                            if (result.length > 0) {
                                const bestMatch = result[0].item;
                                fetch(`https://api.lyrics.ovh/v1/${bestMatch.artist.name}/${bestMatch.title}`)
                                    .then(response => response.json())
                                    .then(data => {
                                        document.getElementById('lyrics').innerText = data.lyrics;
                                    });
                            } else {
                                document.getElementById('lyrics').innerText = 'Letra no encontrada.';
                            }
                        });
                }
            })
            .catch(error => {
                console.error('Error fetching lyrics:', error);
                document.getElementById('lyrics').innerText = 'Error al buscar la letra.';
            });
    } else {
        document.getElementById('lyrics').innerText = 'Por favor, ingrese el artista y la canción.';
    }
});