document.addEventListener('DOMContentLoaded', () => {
    const albumCover = document.querySelector('.album-cover');
    const body = document.body;

    albumCover.addEventListener('click', (e) => {
        e.stopPropagation();
        const expandedImage = document.createElement('div');
        expandedImage.classList.add('expanded-image');
        expandedImage.innerHTML = `<img src="${albumCover.src}" alt="Expanded album cover">`;
        body.appendChild(expandedImage);
        body.classList.add('darkened');
    });

    body.addEventListener('click', () => {
        const expandedImage = document.querySelector('.expanded-image');
        if (expandedImage) {
            expandedImage.remove();
            body.classList.remove('darkened');
        }
    });
});