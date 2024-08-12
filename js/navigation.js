document.addEventListener('DOMContentLoaded', function () {
    const navbarLinks = document.querySelectorAll('.navbar a');
    const iframe = document.querySelector('.main-content iframe');

    navbarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const targetURL = link.getAttribute('href');
            const target = link.getAttribute('target');
            
            if (target === '_blank') {
                return;
            }
            
            // For non-blank targets, prevent default and load in iframe...
            event.preventDefault();
            if (targetURL) {
                iframe.setAttribute('src', targetURL);
            }
        });
    });
});