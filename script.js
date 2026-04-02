let currentPath = "/";
let isPasswordMode = false;   
let passwordAttempts = 0;     

const input = document.getElementById('command-input');
const output = document.getElementById('output');
const cmdText = document.getElementById('cmd-text');

// 1 & 2: Added contact.txt and resume.pdf to the file system
const fileSystem = {
    '/': {
        type: "directory",
        children: ["projects", "about_me.txt", "resume.pdf", "contact.txt"]
    },
    '/about_me.txt': {
        type: "file",
        content: "Hello, I'm Sowmith! I'm a software engineer focused on distributed systems and web tech. I've tried to build a mini linux portfolio, enjoy exploring!!!"
    },
    '/contact.txt': {
        type: "file",
        content: "Let's connect!<br>Email: <a href='mailto:your.email@example.com' style='color: #58a6ff;'>your.email@example.com</a><br>LinkedIn: <a href='https://linkedin.com/in/soumith29' target='_blank' style='color: #58a6ff;'>linkedin.com/in/soumith29</a>"
    },
    '/resume.pdf': {
        type: "file",
        content: "Opening resume in a new tab... <br>If it didn't open automatically, <a href='https://drive.google.com/file/d/1U6Hsf-wjn4_ZB-bezH0W78lrGrrMrKhg/view?usp=sharing' target='_blank' style='color: #58a6ff; text-decoration: underline;'>click here to view my resume</a>."
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
            const safeDesc = repo.description ? repo.description.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "No description provided.";
            
            fileSystem[`/projects/${repo.name}`] = {
                type: "file",
                repo_url: repo.html_url,
                content: `Name: ${repo.name}\nDesc: ${safeDesc}\nLink: <a href="${repo.html_url}" target="_blank" style="color: #58a6ff; text-decoration: underline; pointer-events: auto;">View Repository on GitHub</a>`
            };
        });
    } catch (e) {
        console.log("Offline mode: Github projects not loaded.");
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
        // 5: Changed the help command to be beginner-friendly
        case 'help':
            return `Welcome! Here are the available commands to navigate my portfolio:<br><br>
<span style="color: #58a6ff;">ls</span>     - List all files and folders in your current location<br>
<span style="color: #58a6ff;">cd</span>     - Change directory (e.g., 'cd projects' to enter the projects folder)<br>
<span style="color: #58a6ff;">cat</span>    - Read a file (e.g., 'cat about_me.txt' or 'cat resume.pdf')<br>
<span style="color: #58a6ff;">clear</span>  - Clear the terminal screen<br>
<span style="color: #58a6ff;">whoami</span> - Find out who built this terminal<br>
<span style="color: #58a6ff;">github</span> - Opens my GitHub profile in a new tab<br>
<span style="color: #58a6ff;">sudo</span>   - ??? (Super secret admin command)`;
        case 'whoami':
            return "Hey, this is Sowmith, nice to meet you!";
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
            return readFile(args[0]);
        case "file":
            return `Command 'file' is not supported. Try using 'cat ${args[0] || "filename"}' instead.`;
        default:
            return `Command not found: ${command}. Type 'help' for a list of commands.`; 
    }
}

function listDirectory(target) {
    const targetPath = target ? resolvePath(target) : currentPath;
    const node = fileSystem[targetPath];

    if (node) {
        if (node.type === "directory") {
            return node.children.join("   ");
        } else if (node.type === "file") {
            return `${target} <br>💡 Hint: Use 'cat ${target}' to view its contents.`;
        }
    }
    return `ls: ${target}: No such file or directory`;
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

// 2: Auto-open the resume file if it is "cat'd"
function readFile(fileName) {
    if (!fileName) return "usage: cat [file]";
    const filePath = resolvePath(fileName);
    if (fileSystem[filePath] && fileSystem[filePath].type === "file") {
        if (filePath === "/resume.pdf") {
            window.open('https://drive.google.com/file/d/1U6Hsf-wjn4_ZB-bezH0W78lrGrrMrKhg/view?usp=sharing', '_blank'); // Opens Google Drive link
        }
        return fileSystem[filePath].content;
    }
    return `cat: ${fileName}: No such file or directory`;
}

// 4: Updated prompt
function updatePrompt() {
    const displayPath = currentPath === "/" ? "~" : `~${currentPath}`;
    document.querySelector("#input-line .prompt").textContent = `sowmith@portfolio ${displayPath} %`;
}

input.addEventListener('input', () => {
    if (isPasswordMode) {
        cmdText.textContent = ''; 
    } else {
        cmdText.textContent = input.value;
    }
});

input.addEventListener('keydown', function(event) {
    const currentPrompt = document.querySelector("#input-line .prompt").textContent;

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
        if (isPasswordMode) {
            output.innerHTML += `<p><span class="prompt">${currentPrompt}</span>^C</p>`;
            isPasswordMode = false;
            passwordAttempts = 0;
        } else {
            output.innerHTML += `<p><span class="prompt">${currentPrompt}</span> ${input.value}^C</p>`;
        }
        
        updatePrompt();
        input.value = '';
        cmdText.textContent = '';
        window.scrollTo(0, document.body.scrollHeight);
        return; 
    }

    if (event.key === 'Enter') {
        const fullCommand = input.value.trim();
        
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
        } 
        else {
            output.innerHTML += `<p><span class="prompt">${currentPrompt}</span> ${fullCommand}</p>`;
            
            if (fullCommand.length > 0) {
                const parts = fullCommand.trim().split(/\s+/);
                
                if (parts[0].toLowerCase() === 'sudo') {
                    isPasswordMode = true;
                    passwordAttempts = 0;
                    document.querySelector("#input-line .prompt").textContent = "Password:";
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

// 3: Dynamic MOTD Initialization
window.addEventListener('DOMContentLoaded', () => {
    // Generates standard date like: "Wed Apr 01 2026 09:24:36 GMT-0400"
    const fullDate = new Date().toString(); 
    
    const motd = `
        <p>Last login: ${fullDate}</p>
        <p>======================================================================</p>
        <p>👋 Welcome to Sowmith's Interactive Terminal Portfolio!</p>
        <p>I'm a software engineer passionate about distributed systems & web tech.</p>
        <p>======================================================================</p>
        <p><br>💡 <b>Tip:</b> If you aren't familiar with terminal commands, simply type <span style="color: #58a6ff; font-weight: bold;">help</span> and hit Enter to see what you can do.</p>
        <p><br></p>
    `;
    
    output.innerHTML = motd;
});