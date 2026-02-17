// --- 1. THE GREETING LOGIC (New Part) ---
window.onload = async function() {
    try {
        const response = await fetch('/user_profile.json'); 
        const profile = await response.json();
        document.getElementById('greeting').innerText = `Welcome back, ${profile.fullName}! Ready to focus on ${profile.specificSounds}?`;
    } catch (e) {
        document.getElementById('greeting').innerText = "Welcome back! Ready to speak?";
    }

    // Start fetching transcripts automatically
    fetchTranscripts();
};

// --- 2. AUTOMATIC REDIS FETCH LOGIC (Replacing Microphone) ---
let lastIndex = 0; // Track already displayed transcripts

async function fetchTranscripts() {
    try {
        const response = await fetch('/api/get_transcripts');
        const transcripts = await response.json();

        console.log("Testing");
        console.log(transcripts.raw)
        
        document.getElementById('rawText').innerText = transcripts.raw;

    } catch (e) {
        console.error("Error fetching transcripts:", e);
    }

    // Fetch again after 1 second
    setTimeout(fetchTranscripts, 1000); // 1000 ms = 1 second
}

// --- 3. THE CLEANING LOGIC (Conversation & Question Optimized) ---
function cleanSpeechText(rawText) {
    if (!rawText || rawText === "...") return "";

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
    const questionWords = ['who', 'what', 'where', 'when', 'why', 'how', 'is', 'can', 'are', 'do'];
    const firstWord = cleanedWords[0]?.toLowerCase();
    
    let punctuation = ".";
    if (firstWord && questionWords.includes(firstWord)) {
        punctuation = "?";
    }

    // 5. Final Formatting
    finalResult = finalResult.charAt(0).toUpperCase() + finalResult.slice(1) + punctuation;

    return finalResult;
}