document.addEventListener('DOMContentLoaded', function () {
    const navbarLinks = document.querySelectorAll('.navbar a');
    const iframe = document.querySelector('.main-content iframe');

    navbarLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            const targetURL = link.getAttribute('href');
            const target = link.getAttribute('target');
            
            if (target === '_blank') {
                // Open in a new tab/window
                window.open(targetURL, '_blank');
            } else {
                // Load in iframe
                event.preventDefault();
                if (targetURL) {
                    iframe.setAttribute('src', targetURL);
                }
            }
        });
    });
});