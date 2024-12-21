/*const { fileURLToPath } = require('url');
const path = require('path');
const { writeFileSync } = require('fs');
const mega = require('megajs');

async function MakeSession(txt) {
  const __filename = fileURLToPath(require.main.filename);
  const __dirname = path.dirname(__filename);

  const megaCode = txt.replace("Rudhra=", '');
  const megaUrl = `https://mega.nz/file/${megaCode}`;
  console.log(megaUrl);

  const file = mega.File.fromURL(megaUrl);

  try {
    const stream = file.download();
    let data = '';

    for await (const chunk of stream) {
      data += chunk.toString();
    }

    const credsPath = path.join(__dirname, '..', 'session', 'creds.json');
    writeFileSync(credsPath, data);
    console.log('Saved credentials to', credsPath);
  } catch (error) {
    console.error('Error downloading or saving credentials:', error);
  }
}

module.exports = { MakeSession };
