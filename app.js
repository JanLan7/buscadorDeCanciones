document.getElementById('searchButton').addEventListener('click', function() {
    const artist = document.getElementById('artist').value;
    const song = document.getElementById('song').value;
    
    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('lyrics').innerText = data.lyrics;
        })
        .catch(error => {
            document.getElementById('lyrics').innerText = 'Letra no encontrada';
        });
});
