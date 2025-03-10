const canvas = document.getElementById('matrix'); //GPTltä pyydetty matrix efekti tuomaan lisäää matrix henkisyyttä kauppalistaan lisätty napista aloitus 
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array.from({ length: columns }).fill(1);

let matrixRunning = false; 
let intervalId; 

function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    ctx.font = `${fontSize}px Courier Prime`;

    drops.forEach((y, index) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        const x = index * fontSize;
        ctx.fillText(text, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[index] = 0;
        }
        drops[index]++;
    });
}

// Funktio matrtixin käynnistämiseen
function startMatrix() {
    if (!matrixRunning) {
        matrixRunning = true;
        intervalId = setInterval(draw, 33);
    }
}

// Kuunnellaan tuotteiden lisäystä
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("kauppalista-form");
    form.addEventListener("submit", () => {
        startMatrix(); // Käynnistetään matrix, kun ensimmäinen tuote lisätään
    });
});
