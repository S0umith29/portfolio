const input = document.getElementById('command-input');
const output = document.getElementById('output');
const cmdText = document.getElementById('cmd-text');

const fileSystem = {
    '/': {
        type: "directory",
        children: ["projects", "about_me.txt", "resume.pdf", "contact.txt"]
    },
    '/about_me.txt': {
        type: "file",
        content: "Hello, I'm Sowmith! I'm a software engineer focused on distributed systems and web tech."
    }
}

async function fetchGithubProjects() {
    const username = 's0umith29';
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();

        fileSystem['/projects'] = {
            type: "directory",
            children: []
        };

        repos.forEach(repo => {
            fileSystem["/projects"].children.push(repo.name);
            fileSystem[`/projects/${repo.name}`] = {
                type: "file",
                content: `Name: ${repo.name}\nDesc: ${repo.description}\nLink: ${repo.html_url}`
            };
        });
    } catch (e) {
        console.log("Offline mode: Github projects not loaded.");
    }
}
fetchGithubProjects();

function processCommand(rawInput) {
    const parts = rawInput.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
        case 'help':
            return "Available: ls, cd, cat, clear, whoami, github";
        case 'whoami':
            return "viewer@sowmith - exploring the portfolio OS."
        case 'clear':
            output.innerHTML = '';
            return ''
        case 'github':
            window.open("https://github.com/s0umith29", "_blank");
            return "Opening Github profile..."
        case "ls":
            return listDirectory();
        case "cd":
            return changeDirectory(args[0]);
        case "cat":
            return readFile(args[0]);
        default:
            return `Command not found: $(command)`;
    }
}

function listDirectory() {
    const dir = fileSystem[currentPath];
    return dir.children.join("  ");
}

function changeDirectory(path) {
    if (!target || target == "~" || target == "/") {
        currentPath = "/";
    } else {
        const newPath = currentPath = "/" ? `/${target}` : `${currentPath}/${target}`;
        if (fileSystem[newPath] && fileSystem[newPath].type == "directory") {
            currentPath = newPath;
        } else {
            return `cd: no such directory: ${target}`
        }
    }
    updatePrompt();
    return "";
}

function readFile(fileName) {
    if (!fileName) return "usage: cat [file]";
    const filePath = currentPath === "/" ? `/${fileName}` : `${currentPath}/${fileName}`;
    if (fileSystem[filePath] && fileSystem[filePath].type === "file") {
        return fileSystem[filePath].content;
    }
    return `cat: ${fileName}: No such file`;
}

function updatePrompt() {
    const displayPath = currentPath === "/" ? "~" : `~${currentPath}`;
    document.querySelector(".prompt").textContent = `viewer@sowmith ${displayPath} %`;
}

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