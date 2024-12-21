const path = require('path');
const { writeFileSync } = require('fs');
const mega = require('megajs'); 

async function MakeSession(txt) {
  if (!txt || txt.trim() === "") {
    console.error("Session ID Variable cannot be empty,edit in config.js")
    return
  }
  const megaCode = txt.replace('Rudhra=', '');
  const megaUrl = `https://mega.nz/file/${megaCode}`;

  const file = mega.File.fromURL(megaUrl);

  try {
    const stream = file.download();
    let data = '';
    
    for await (const chunk of stream) {
      data += chunk.toString();
    }

    const credsPath = __dirname + '/session/creds.json';
    writeFileSync(credsPath, data); 
    console.log('Login credentials Saved to', credsPath);
  } catch (error) {
    console.error('Error downloading or saving credentials:', error);
  }
}

module.exports = { MakeSession };
