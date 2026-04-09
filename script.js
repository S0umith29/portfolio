let currentPath = "/";
let isPasswordMode = false;
let passwordAttempts = 0;

let commandHistory = [];
let historyIndex = -1;

let tabMatches = [];
let tabIndex = -1;
let lastTabInput = '';

const availableCommands = ['help', 'ls', 'cd', 'cat', 'open', 'pwd', 'clear', 'whoami', 'github', 'sudo', 'file'];

const input = document.getElementById('command-input');
const output = document.getElementById('output');
const cmdText = document.getElementById('cmd-text');

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const fileSystem = {
    '/': {
        type: "directory",
        children: ["projects", "about_me.txt", "resume.pdf", "contact.txt"]
    },
    '/projects': {
        type: "directory",
        children: [],
        loading: true
    },
    '/about_me.txt': {
        type: "file",
        content: "Name:     Sowmith Kuppa\nRole:     Software Engineer\nFocus:    Distributed systems &amp; backend infrastructure\n\nI enjoy building systems that scale — from distributed databases\nto side projects like this terminal portfolio.\n\nWhen I'm not coding, I'm usually deep in a systems design paper\nor tinkering with something new.\n\nFeel free to explore — check out /projects, grab /resume.pdf,\nor find me in /contact.txt."
    },
    '/contact.txt': {
        type: "file",
        content: "Let's connect!<br>Email: <a href='mailto:soumith.odu@gmail.com' style='color: #58a6ff;'>soumith.odu@gmail.com</a><br>LinkedIn: <a href='https://linkedin.com/in/soumith29' target='_blank' style='color: #58a6ff;'>linkedin.com/in/soumith29</a>"
    },
    '/resume.pdf': {
        type: "file",
        content: "Opening resume in a new tab... <br>If it didn't open automatically, <a href='https://drive.google.com/file/d/1U6Hsf-wjn4_ZBbezH0W78lrGrrMrKhg/view?usp=sharing' target='_blank' style='color: #58a6ff; text-decoration: underline;'>click here to view my resume</a>."
    }
};

async function fetchGithubProjects() {
    const username = 's0umith29';
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const repos = await response.json();

        fileSystem['/projects'] = {
            type: "directory",
            children: [],
            loading: false
        };

        repos.forEach(repo => {
            fileSystem["/projects"].children.push(repo.name);
            const safeDesc = repo.description ? repo.description.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "No description provided.";

            fileSystem[`/projects/${repo.name}`] = {
                type: "file",
                repo_url: repo.html_url,
                content: `Name: ${repo.name}\nDesc: ${safeDesc}\nLink: <a href="${repo.html_url}" target="_blank" style="color: #58a6ff; text-decoration: underline; pointer-events: auto;">View Repository on GitHub</a>`
            };
        });
    } catch (e) {
        fileSystem['/projects'].loading = false;
        fileSystem['/projects'].error = true;
        console.log("Offline mode: Github projects not loaded.", e.message);
    }
}
fetchGithubProjects();

function resolvePath(target) {
    if (!target || target === "~" || target === "/") return "/";
    if (target === "..") {
        if (currentPath === "/") return "/";
        const parts = currentPath.split("/");
        parts.pop();
        return parts.length === 1 ? "/" : parts.join("/");
    }
    return currentPath === "/" ? `/${target}` : `${currentPath}/${target}`;
}

function processCommand(rawInput) {
    const parts = rawInput.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    const restrictedCommands = ['su', 'rm', 'mkdir', 'touch', 'mv', 'cp', 'chmod', 'chown', 'nano', 'vim', 'vi'];
    if (restrictedCommands.includes(command)) {
        return `-zsh: permission denied: ${command}`;
    }

    switch (command) {
        case 'help':
            return `Welcome! Here are the available commands to navigate my portfolio:<br><br>
<span style="color: #58a6ff;">ls</span>     - List all files and folders in your current location<br>
<span style="color: #58a6ff;">cd</span>     - Change directory (e.g., 'cd projects' to enter the projects folder)<br>
<span style="color: #58a6ff;">cat</span>    - Read a file (e.g., 'cat about_me.txt' or 'cat resume.pdf')<br>
<span style="color: #58a6ff;">open</span>   - Open a file (e.g., 'open resume.pdf')<br>
<span style="color: #58a6ff;">pwd</span>    - Print current working directory<br>
<span style="color: #58a6ff;">clear</span>  - Clear the terminal screen<br>
<span style="color: #58a6ff;">whoami</span> - Find out who built this terminal<br>
<span style="color: #58a6ff;">github</span> - Opens my GitHub profile in a new tab`;
        case 'whoami':
            return "Hey, this is Sowmith, nice to meet you!";
        case 'pwd':
            return currentPath;
        case 'clear':
            output.innerHTML = '';
            return '';
        case 'github':
            window.open("https://github.com/s0umith29", "_blank");
            return "Opening Github profile...";
        case "ls":
            return listDirectory(args[0]);
        case "cd":
            return changeDirectory(args[0]);
        case "cat":
        case "open":
            return readFile(args[0]);
        case "file":
            return `Command 'file' is not supported. Try using 'cat ${args[0] || "filename"}' instead.`;
        case "sudo":
            return handleSudo();
        default:
            return `Command not found: ${command}. Type 'help' for a list of commands.`;
    }
}

function handleSudo() {
    isPasswordMode = true;
    passwordAttempts = 0;
    document.querySelector("#input-line .prompt").textContent = "Password:";
    return '';
}

function listDirectory(target) {
    const targetPath = target ? resolvePath(target) : currentPath;
    const node = fileSystem[targetPath];

    if (node) {
        if (node.type === "directory") {
            if (node.loading) return "Fetching GitHub repositories...";
            if (node.error) return "(error loading repositories — check your connection)";
            if (node.children.length === 0) return "(empty directory)";
            return node.children.join("   ");
        } else if (node.type === "file") {
            return `${target}  (use 'cat ${target}' to view its contents)`;
        }
    }
    return `ls: ${target || currentPath}: No such file or directory`;
}

function changeDirectory(target) {
    if (!target || target === "~" || target === "/") {
        currentPath = "/";
    } else {
        const newPath = resolvePath(target);
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
    const filePath = resolvePath(fileName);
    if (fileSystem[filePath]) {
        if (fileSystem[filePath].type === "directory") {
            return `cat: ${fileName}: Is a directory`;
        }
        if (fileSystem[filePath].type === "file") {
            if (filePath === "/resume.pdf") {
                window.open('https://drive.google.com/file/d/1U6Hsf-wjn4_ZBbezH0W78lrGrrMrKhg/view?usp=sharing', '_blank');
            }
            return fileSystem[filePath].content;
        }
    }
    return `cat: ${fileName}: No such file or directory`;
}

function updatePrompt() {
    const displayPath = currentPath === "/" ? "~" : `~${currentPath}`;
    document.querySelector("#input-line .prompt").textContent = `sowmith@portfolio ${displayPath} %`;
}

function resetTabState() {
    tabMatches = [];
    tabIndex = -1;
    lastTabInput = '';
}

input.addEventListener('input', () => {
    resetTabState();
    if (isPasswordMode) {
        cmdText.textContent = '';
    } else {
        cmdText.textContent = input.value;
    }
});

input.addEventListener('keydown', function(event) {
    const currentPrompt = document.querySelector("#input-line .prompt").textContent;

    if (event.key === 'Tab') {
        event.preventDefault();
        const currentInput = input.value;
        const parts = currentInput.split(' ');

        // Re-compute matches only if input changed since last Tab
        if (currentInput !== lastTabInput || tabMatches.length === 0) {
            tabMatches = [];
            tabIndex = -1;

            if (parts.length === 1) {
                tabMatches = availableCommands.filter(cmd => cmd.startsWith(parts[0].toLowerCase()));
            } else if (parts.length === 2 && ['cd', 'cat', 'ls', 'open', 'file'].includes(parts[0].toLowerCase())) {
                const typedOut = parts[1];
                const node = fileSystem[currentPath];
                if (node && node.children) {
                    tabMatches = node.children.filter(child => child.startsWith(typedOut));
                }
            }
        }

        if (tabMatches.length > 0) {
            tabIndex = (tabIndex + 1) % tabMatches.length;
            const match = tabMatches[tabIndex];
            input.value = parts.length === 1 ? match + ' ' : parts[0] + ' ' + match;
            lastTabInput = input.value;
            cmdText.textContent = input.value;
        }
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        resetTabState();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
            cmdText.textContent = input.value;
        }
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        resetTabState();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
            cmdText.textContent = input.value;
        } else if (historyIndex === commandHistory.length - 1) {
            historyIndex++;
            input.value = '';
            cmdText.textContent = '';
        }
        return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
        if (isPasswordMode) {
            output.innerHTML += `<p><span class="prompt">${currentPrompt}</span>^C</p>`;
            isPasswordMode = false;
            passwordAttempts = 0;
        } else {
            output.innerHTML += `<p><span class="prompt">${currentPrompt}</span> ${escapeHtml(input.value)}^C</p>`;
        }
        resetTabState();
        updatePrompt();
        input.value = '';
        cmdText.textContent = '';
        window.scrollTo(0, document.body.scrollHeight);
        return;
    }

    if (event.key === 'Enter') {
        const fullCommand = input.value.trim();
        resetTabState();

        if (fullCommand.length > 0 && !isPasswordMode) {
            commandHistory.push(fullCommand);
            historyIndex = commandHistory.length;
        }

        if (isPasswordMode) {
            output.innerHTML += `<p><span class="prompt">${currentPrompt}</span></p>`;
            passwordAttempts++;

            if (passwordAttempts >= 3) {
                output.innerHTML += `<p>sudo: 3 incorrect password attempts. This incident will be reported.</p>`;
                isPasswordMode = false;
                passwordAttempts = 0;
                updatePrompt();
            } else {
                output.innerHTML += `<p>Sorry, try again.</p>`;
            }
        } else {
            output.innerHTML += `<p><span class="prompt">${currentPrompt}</span> ${escapeHtml(fullCommand)}</p>`;

            if (fullCommand.length > 0) {
                const parts = fullCommand.trim().split(/\s+/);

                if (parts[0].toLowerCase() === 'sudo') {
                    handleSudo();
                } else {
                    const response = processCommand(fullCommand);
                    if (response) {
                        const formattedResponse = response.replace(/\n/g, "<br>");
                        output.innerHTML += `<p>${formattedResponse}</p>`;
                    }
                    updatePrompt();
                }
            } else {
                updatePrompt();
            }
        }

        input.value = '';
        cmdText.textContent = '';
        window.scrollTo(0, document.body.scrollHeight);
    }
});

document.addEventListener('click', (event) => {
    if (event.target.tagName !== 'A') {
        input.focus();
    }
});
document.addEventListener('keydown', () => input.focus());

window.addEventListener('DOMContentLoaded', () => {
    const fullDate = new Date().toString();

    const asciiArt = String.raw`
<pre style="color: #58a6ff; font-weight: bold; line-height: 1.1; font-size: clamp(8px, 1.2vw, 14px);">
  ██████  ██████  ██     ██ ███    ███ ██ ████████ ██   ██    ██   ██ ██    ██ ██████  ██████   █████
 ██      ██    ██ ██     ██ ████  ████ ██    ██    ██   ██    ██  ██  ██    ██ ██   ██ ██   ██ ██   ██
 ███████ ██    ██ ██  █  ██ ██ ████ ██ ██    ██    ███████    █████   ██    ██ ██████  ██████  ███████
      ██ ██    ██ ██ ███ ██ ██  ██  ██ ██    ██    ██   ██    ██  ██  ██    ██ ██      ██      ██   ██
 ██████   ██████   ███ ███  ██      ██ ██    ██    ██   ██    ██   ██  ██████  ██      ██      ██   ██
</pre>`;

    const motd = `
        <p>Last login: ${fullDate}</p>
        ${asciiArt}
        <p>=================================================================================================</p>
        <p>👋 Welcome to my Terminal Portfolio!</p>
        <p>I'm a software engineer focused on distributed systems and web tech. Type <span style="color: #58a6ff; font-weight: bold;">help</span> to get started.</p>
        <p>=================================================================================================</p>
        <p><br></p>
    `;

    output.innerHTML = motd;
});
