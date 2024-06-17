document.addEventListener('DOMContentLoaded', function () {
    const navbarLinks = document.querySelectorAll('.navbar a');
    const iframe = document.querySelector('.main-content iframe');

    navbarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default link behavior
            const targetURL = link.getAttribute('href');
            if (targetURL) {
                iframe.setAttribute('src', targetURL);
            }
        });
    });
});