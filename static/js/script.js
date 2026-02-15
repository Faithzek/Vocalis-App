async function saveAndContinue() {
    const name = document.getElementById('fullName').value;
    const support = document.getElementById('supportType').value;
    const sounds = document.getElementById('specificSounds').value; // Add this line!

    const profileData = {
        fullName: name || "Friend",
        speechSupportType: support,
        specificSounds: sounds || "" // Add this line!
    };

    const response = await fetch('/api/save_profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
    });

    if (response.ok) {
        window.location.href = '/dashboard';
    }
}