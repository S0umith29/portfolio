const input = document.getElementById('command-input');
const output = document.getElementById('output');

// Listen for the "Enter" key
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const command = input.value.trim(); // Get what the user typed
        
        // Print what the user just typed to the screen with the zsh prompt
        output.innerHTML += `<p><span class="prompt">soumith@macbook ~ %</span> ${command}</p>`;
        
        // Clear the input box
        input.value = ''; 

        // We will add the logic to process commands here next!
        
        // Automatically scroll to the bottom
        window.scrollTo(0, document.body.scrollHeight);
    }
});

// Keep focus on the input so the user can always type
document.addEventListener('click', () => input.focus());