window.addEventListener('resize', function() {
    resizeBodyHeight();
});

// Set initial body height
window.onload = function() {
    resizeBodyHeight();
};

function resizeBodyHeight() {
    var contentHeight = document.getElementById('content').offsetHeight;
    var windowHeight = window.innerHeight;

    if (contentHeight > windowHeight) {
        document.body.style.height = contentHeight + 'px';
    } else {
        document.body.style.height = windowHeight + 'px';
    }
}