const input = document.getElementById('command-input');
const output = document.getElementById('output');
const cmdText = document.getElementById('cmd-text');

// 1. Sync the visible text with the hidden input
input.addEventListener('input', () => {
    cmdText.textContent = input.value;
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