const { ipcRenderer } = require('electron');

function changeBgColor(color) {
    document.body.style.backgroundColor = color;
    const textColor = color === 'black' ? 'white' : 'black';
    document.body.style.color = textColor;

    const frames = document.querySelectorAll('#frame1, #frame2, #frame3, #frame4, #frame5, .change_color');
    frames.forEach(frame => {
        frame.style.backgroundColor = color;
        frame.style.color = textColor;
    });

    ipcRenderer.send('change-bg-color', color);
}

function buttonAction(buttonNumber) {
    ipcRenderer.send('button-action', buttonNumber);
}

ipcRenderer.on('button-action', (event, message) => {
    alert(message);
});

function loadCommands() {
    const fs = require('fs');
    const path = require('path');
    const commandsPath = path.join(__dirname, 'commands.json');

    try {
        const data = fs.readFileSync(commandsPath, 'utf8');
        return JSON.parse(data); // Зчитуємо всі команди з файлу
    } catch (err) {
        console.error('Помилка завантаження команд:', err);
        return {};
    }
}

function handleMessage(message) {
    const allCommands = loadCommands();
    const commands = allCommands.commands || [];
    const speakWithBotCommands = allCommands.speak_with_bot || [];
    let response = '';

    // Переведення введеного тексту до нижнього регістру для порівняння
    const lowerCaseMessage = message.toLowerCase();

    // Пошук в звичайних командах
    for (const cmd of commands) {
        if (cmd.keywords) {
            for (const keyword of cmd.keywords) {
                if (lowerCaseMessage.includes(keyword.toLowerCase())) {
                    // Виконуємо дію, пов'язану з командою
                    executeCommand(cmd.action);
                    response = `Бот: Команда "${keyword}" виконана успішно`;
                    break;
                }
            }
        }
        if (response) {
            break;
        }
    }

    // Якщо в звичайних командах не знайдено відповіді, шукаємо в спілкуванні з ботом
    if (!response) {
        for (const cmd of speakWithBotCommands) {
            for (const keyword of cmd.keywords) {
                if (lowerCaseMessage.includes(keyword.toLowerCase())) {
                    response = cmd.answer;
                    break;
                }
            }
            if (response) {
                break;
            }
        }
    }

    if (!response) {
        response = 'Бот: Команда не знайдена';
    }

    const chatLog = document.getElementById('chat_log');
    chatLog.innerHTML += `You: ${message}<br>`;
    chatLog.innerHTML += `Bot: ${response}<br>`;
    chatLog.scrollTop = chatLog.scrollHeight;

    ipcRenderer.send('send-message', message);
}

function executeCommand(action) {
    // Виконання дії, пов'язаної з командою
    switch (action) {
        case 'openGoogle':
            window.open('https://www.google.com', '_blank');
            break;
        case 'openYouTube':
            window.open('https://www.youtube.com', '_blank');
            break;
        case 'openFacebook':
            window.open('https://www.facebook.com', '_blank');
            break;
        // Додайте інші варіанти за необхідності
        default:
            console.log(`Невідома команда: ${action}`);
            break;
    }
}

function sendMessage() {
    const entryMessage = document.getElementById('entry_message');
    const message = entryMessage.value.trim();

    if (message) {
        handleMessage(message);
        entryMessage.value = '';
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

ipcRenderer.on('send-message', (event, message) => {
    console.log(message);
});











// const { ipcRenderer } = require('electron');

// function changeBgColor(color) {
//     document.body.style.backgroundColor = color;
//     const textColor = color === 'black' ? 'white' : 'black';
//     document.body.style.color = textColor;

//     const frames = document.querySelectorAll('#frame1, #frame2, #frame3, #frame4, #frame5, .change_color');
//     frames.forEach(frame => {
//         frame.style.backgroundColor = color;
//         frame.style.color = textColor;
//     });

//     ipcRenderer.send('change-bg-color', color);
// }

// function buttonAction(buttonNumber) {
//     ipcRenderer.send('button-action', buttonNumber);
// }

// ipcRenderer.on('button-action', (event, message) => {
//     alert(message);
// });

// function loadCommands() {
//     const fs = require('fs');
//     const path = require('path');
//     const commandsPath = path.join(__dirname, 'commands.json');

//     try {
//         const data = fs.readFileSync(commandsPath, 'utf8');
//         return JSON.parse(data).commands;
//     } catch (err) {
//         console.error('Помилка завантаження команд:', err);
//         return [];
//     }
// }

// function handleMessage(message) {
//     const commands = loadCommands();
//     let response = '';

//     const lowerCaseMessage = message.toLowerCase();

//     for (const cmd of commands) {
//         for (const keyword of cmd.keywords) {
//             if (lowerCaseMessage.includes(keyword.toLowerCase())) {
//                 executeCommand(cmd.action);
//                 response = `Бот: Команда "${keyword}" виконана успішно`;
//                 break;
//             }
//         }
//         if (response) {
//             break;
//         }
//     }

//     if (!response) {
//         response = 'Бот: Команда не знайдена';
//     }

//     const chatLog = document.getElementById('chat_log');
//     chatLog.innerHTML += `You: ${message}<br>`;
//     chatLog.innerHTML += `${response}<br>`;
//     chatLog.scrollTop = chatLog.scrollHeight;

//     ipcRenderer.send('send-message', message);
// }

// function executeCommand(action) {
//     switch (action) {
//         case 'openGoogle':
//             window.open('https://www.google.com', '_blank');
//             break;
//         case 'openYouTube':
//             window.open('https://www.youtube.com', '_blank');
//             break;
//         case 'openFacebook':
//             window.open('https://www.facebook.com', '_blank');
//             break;
//         default:
//             console.log(`Невідома команда: ${action}`);
//             break;
//     }
// }

// function sendMessage() {
//     const entryMessage = document.getElementById('entry_message');
//     const message = entryMessage.value.trim();

//     if (message) {
//         handleMessage(message);
//         entryMessage.value = '';
//     }
// }

// function handleKeyDown(event) {
//     if (event.key === 'Enter') {
//         sendMessage();
//     }
// }

// ipcRenderer.on('send-message', (event, message) => {
//     console.log(message);
// });