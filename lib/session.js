const axios = require('axios');
const { File } = require('megajs');
const fs = require('fs');
const path = require('path');

function saveJsonToFile(mergedJSON, outputFolderPath) {
    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath, { recursive: true });
    }
    for (const [fileName, fileContent] of Object.entries(mergedJSON)) {
        const outputPath = path.join(outputFolderPath, fileName);
        fs.writeFileSync(outputPath, JSON.stringify(fileContent, null, 2));
        console.log(`Saved ${fileName} to ${outputPath}`);
    }
}

async function downloadFromMega(url, outputPath) {
    const file = File.fromURL(url);
    try {
        await file.loadAttributes();
        const data = await file.downloadBuffer();
        fs.writeFileSync(outputPath, data);
        console.log(`Downloaded session file to ${outputPath}`);
    } catch (error) {
        console.error("Error downloading session file from MEGA:", error);
        throw error;
    }
}

async function MakeSession(sessionId, folderPath) {
    try {
        const decryptedSessionId = sessionId.split("Rudhra~")[1].split('').reverse().join('');
        const response = await axios.get(`https://pastebin.com/raw/${decryptedSessionId}`);
        saveJsonToFile(response.data, folderPath);
        console.log("Session loaded successfully");
        return true;
    } catch (error) {
        console.error("Error loading session from Pastebin:", error.message);

        try {
            const url = "https://mega.nz/file/" + sessionId.replace("Rudhra~", "");
            const outputPath = path.join(folderPath, "creds.json");
            await downloadFromMega(url, outputPath);
            console.log("Session loaded successfully from MEGA");
            return true;
        } catch (megaError) {
            console.error("Failed to load session from MEGA:", megaError.message);
            throw megaError;
        }
    }
}

module.exports = { MakeSession };
