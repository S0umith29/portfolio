let currentPath = "/";

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
        content: "Hello, I'm Sowmith! I'm a software engineer focused on distributed systems and web tech. I've tried to build a mini linux portfolio, enjoy exploring!!!"
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
            
            // Clean the description in case it has weird characters that break HTML
            const safeDesc = repo.description ? repo.description.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "No description provided.";
            
            fileSystem[`/projects/${repo.name}`] = {
                type: "file",
                repo_url: repo.html_url,
                // Using an inline style to ensure it looks and acts like a clickable link
                content: `Name: ${repo.name}\nDesc: ${safeDesc}\nLink: <a href="${repo.html_url}" target="_blank" style="color: #58a6ff; text-decoration: underline; pointer-events: auto;">View Repository on GitHub</a>`
            };
        });
    } catch (e) {
        console.log("Offline mode: Github projects not loaded.");
    }
}
fetchGithubProjects();

function processCommand(rawInput) {
    // FIX 1: Split by ANY whitespace (handles Mac Option+Space bug)
    const parts = rawInput.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
        case 'help':
            return "Available: ls, cd, cat, clear, whoami, github";
        case 'whoami':
            return "Hey, this is Sowmith, nice to meet you!";
        case 'clear':
            output.innerHTML = '';
            return '';
        case 'github':
            window.open("https://github.com/s0umith29", "_blank");
            return "Opening Github profile...";
        case "ls":
            return listDirectory();
        case "cd":
            return changeDirectory(args[0]);
        case "cat":
            return readFile(args[0]);
        case "file":
            // FIX 3: Catch the 'file' command and point them to 'cat'
            return `Command 'file' is not supported in this environment. Try using 'cat ${args[0] || "filename"}' instead.`;
        default:
            return `Command not found: ${command}`; 
    }
}

function listDirectory() {
    const dir = fileSystem[currentPath];
    return dir.children.join("   ");
}

function changeDirectory(target) {
    if (!target || target === "~" || target === "/") {
        currentPath = "/";
    } else if (target === ".."){
        if (currentPath !== "/") {
            const parts = currentPath.split("/");
            parts.pop();
            currentPath = parts.length === 1 ? "/" : parts.join("/");
        }
    } else {
        const newPath = currentPath === "/" ? `/${target}` : `${currentPath}/${target}`;
        if (fileSystem[newPath]) {
            if (fileSystem[newPath].type === "directory") {
                currentPath = newPath;
            } else if (fileSystem[newPath].type === "file") {
                if (fileSystem[newPath].repo_url) {
                    return `cd: not a directory: ${target}<br>💡 Hint: Use 'cat ${target}' to read it, or <a href="${fileSystem[newPath].repo_url}" target="_blank" style="color: #58a6ff; text-decoration: underline;">click here to view it on GitHub</a>.`;
                }
                return `cd: not a directory: ${target}`;
            }
        } else {
            return `cd: no such file or directory: ${target}`;
        }
    }
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
    // FIX 4: Globally forces the HTML to match our currentPath variable
    const displayPath = currentPath === "/" ? "~" : `~${currentPath}`;
    document.querySelector("#input-line .prompt").textContent = `viewer@sowmith ${displayPath} %`;
}

input.addEventListener('input', () => {
    cmdText.textContent = input.value;
});

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const fullCommand = input.value.trim();
        const currentPrompt = document.querySelector("#input-line .prompt").textContent;
        
        output.innerHTML += `<p><span class="prompt">${currentPrompt}</span> ${fullCommand}</p>`;
        
        if (fullCommand.length > 0) {
            const response = processCommand(fullCommand);
            if (response) {
                const formattedResponse = response.replace(/\n/g, "<br>");
                output.innerHTML += `<p>${formattedResponse}</p>`;
            }
        }

        // Run this at the end of EVERY command to ensure the visual prompt never breaks
        updatePrompt();

        input.value = ''; 
        cmdText.textContent = '';
        window.scrollTo(0, document.body.scrollHeight);
    }
});

// FIX 2: Only force focus back to the input if they didn't click a link!
document.addEventListener('click', (event) => {
    if (event.target.tagName !== 'A') {
        input.focus();
    }
});
document.addEventListener('keydown', () => input.focus());