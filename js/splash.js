// Mojang was here...

const lines = [
    "beemerj is gay",
    "i need to go on a webp diet",
    "its over 9000",
    "responsive?",
    "phantom was here",
    "rather piss in the sink",
    "...I Am wow_mao Fan!!!",
];

const speakerImage = document.getElementById("body-img");
let speechBubble = null;

speakerImage.addEventListener("mouseover", showSpeechBubble);
speakerImage.addEventListener("mouseout", hideSpeechBubble);

function showSpeechBubble() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)); // funny math lol...
    const randomIndex = (dayOfYear + lines.length) % lines.length;
    const line = lines[randomIndex];

    // Remove any existing speech bubble
    hideSpeechBubble();

    speechBubble = document.createElement("div");
    speechBubble.innerHTML = `"${line}"<br>\\`;
    speechBubble.style.position = "absolute";
    speechBubble.style.width = "200px";
    speechBubble.style.fontSize = 'small';
    speechBubble.style.textAlign = "right";
    speechBubble.style.color = "var(--primary-color-dark)";

    // Position the speech bubble relative to the image
    const imageRect = speakerImage.getBoundingClientRect();
    speechBubble.style.left = `${imageRect.left + imageRect.width + -192}px`;
    speechBubble.style.top = `${imageRect.top - 8}px`;

    document.body.appendChild(speechBubble);
}

function hideSpeechBubble() {
    if (speechBubble) {
        document.body.removeChild(speechBubble);
        speechBubble = null;
    }
}