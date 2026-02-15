// --- 1. THE GREETING LOGIC (New Part) ---
window.onload = async function() {
    try {
        const response = await fetch('/user_profile.json'); 
        const profile = await response.json();
        document.getElementById('greeting').innerText = `Welcome back, ${profile.fullName}! Ready to focus on ${profile.specificSounds}?`;
    } catch (e) {
        document.getElementById('greeting').innerText = "Welcome back! Ready to speak?";
    }
};

// --- 2. THE MICROPHONE LOGIC (What you already had) ---
let recognition;
let isRecording = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        document.getElementById('rawText').innerText = finalTranscript || interimTranscript;
    };

    recognition.onerror = (event) => {
        console.error("Speech error: ", event.error);
        stopRecording();
    };
}

function startRecording() {
    isRecording = true;
    document.getElementById('recordBtn').classList.add('recording');
    document.getElementById('btnText').innerText = "Stop & Clean";
    document.getElementById('status').innerText = "Vocalis is listening...";
    recognition.start();
}

function stopRecording() {
    isRecording = false;
    document.getElementById('recordBtn').classList.remove('recording');
    document.getElementById('btnText').innerText = "Start Listening";
    document.getElementById('status').innerText = "Cleaning your speech...";
    recognition.stop();
    cleanSpeechText();
}

document.getElementById('recordBtn').onclick = function() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
};

// --- 3. THE CLEANING LOGIC (Conversation & Question Optimized) ---
function cleanSpeechText() {
    const rawText = document.getElementById('rawText').innerText.trim();
    
    // Don't do anything if the box is empty
    if (!rawText || rawText === "...") return;

    // 1. Split into words
    let words = rawText.split(/\s+/); 

    // 2. Filter out immediate word repeats (stutters)
    let cleanedWords = words.filter((word, i, arr) => {
        return word.toLowerCase() !== (arr[i - 1] ? arr[i - 1].toLowerCase() : null);
    });

    // 3. Filter out partial stutters (e.g., "H-H-Hello")
    cleanedWords = cleanedWords.map(word => {
        if (word.includes('-')) return word.split('-').pop();
        return word;
    });

    let finalResult = cleanedWords.join(' ');

    // 4. SMART PUNCTUATION for Conversations
    // Check if the sentence starts like a question
    const questionWords = ['who', 'what', 'where', 'when', 'why', 'how', 'is', 'can', 'are', 'do'];
    const firstWord = cleanedWords[0].toLowerCase();
    
    let punctuation = ".";
    if (questionWords.includes(firstWord)) {
        punctuation = "?";
    }

    // 5. Final Formatting
    finalResult = finalResult.charAt(0).toUpperCase() + finalResult.slice(1) + punctuation;

    // Update the screen
    document.getElementById('cleanText').innerText = finalResult;
    document.getElementById('status').innerText = "Ready to help.";

    // Save this part of the conversation to your history file
    saveToHistory(rawText, finalResult);
}

// Add this brand new function below the cleanSpeechText function
async function saveToHistory(raw, cleaned) {
    await fetch('/api/save_transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: raw, cleaned: cleaned })
    });
}