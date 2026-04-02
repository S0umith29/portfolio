const input = document.getElementById('command-input');
const output = document.getElementById('output');
const cmdText = document.getElementById('cmd-text');

function updateThickCursorPosition() {
    // Create a temporary span to measure the text width accurately
    const tempSpan = document.createElement('span');
    tempSpan.style.font = getComputedStyle(input).font; // Use same font settings
    tempSpan.textContent = input.value;
    document.body.appendChild(tempSpan);
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    // Update the 'left' position of the pseudo-element in CSS
    input.style.setProperty('--cursor-left', textWidth + 'px');
}

// 1. Sync the visible text with the hidden input
input.addEventListener('input', () => {
    cmdText.textContent = input.value;
    updateThickCursorPosition();
});

// 2. Handle the "Enter" key
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const command = input.value.trim();
        
        // Add the finished line to the output history
        // Using viewer@sowmith to match your index.html prompt
        output.innerHTML += `<p><span class="prompt">viewer@sowmith ~ %</span> ${command}</p>`;
        
        // Reset everything for the next command
        input.value = ''; 
        cmdText.textContent = '';

        // Add command logic here later (e.g., if (command === 'help') ...)

        window.scrollTo(0, document.body.scrollHeight);
    }
});

// Keep focus on the input
document.addEventListener('click', () => input.focus());
document.addEventListener('keydown', () => input.focus());