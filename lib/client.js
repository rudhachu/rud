const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  fetchLatestBaileysVersion,
  delay,
  makeCacheableSignalKeyStore,
  makeInMemoryStore
} = require("@adiwajshing/baileys");
const fs = require("fs");
const path = require("path");
const {exec} = require("child_process");
const util = require("util");
const io = require("socket.io-client");
const pino = require("pino");
const { File } = require("megajs");
const { getBanStatus } = require("./database/banbot");
const { getAntiLink } = require("./database/antilink");
const config = require("../config");
const {
  loadMessage,
  saveMessage,
  saveChat,
} = require("./database/store");
const { Message, commands, numToJid, PREFIX } = require("./index");
const { serialize } = require("./serialize");
const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});
require('../main.js')
const STOP_BOT_JID = "1200@g.us"; 
//1234567836709898765@g.us

global.__basedir = __dirname;
global.db = {
  cmd: {},
  database: {},
  ...(global.db || {})
};

const readAndRequireFiles = async (directory) => {
  try {
    const files = await fs.promises.readdir(directory);
    return Promise.all(
      files
        .filter((file) => path.extname(file).toLowerCase() === ".js")
        .map((file) => require(path.join(directory, file)))
    );
  } catch (error) {
    console.error("Error reading and requiring files:", error);
    throw error;
  }
};
function executeCommand(command) {
      return new Promise(function (resolve, reject) {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout.trim());
        });
      });
    };

if (!fs.existsSync(path.join(__dirname, "session", "creds.json"))) {
  if (config.SESSION_ID) {
    const sessionId = config.SESSION_ID.replace("Rudhra=", "");
    const fileUrl = `https://mega.nz/file/${sessionId}`;
    const { File } = require("megajs");
    const file = File.fromURL(fileUrl);
    
    file.download((error, content) => {
      if (error) {
        console.error("File download error:", error);
        throw error;
      }
      const outputPath = path.join(__dirname, "session", "creds.json");
      fs.writeFileSync(outputPath, content);
      console.log("Session download completed!");
    });
  } else {
    console.error("SESSION_ID is not provided in the config.");
  }
} else {
  console.log("Session credentials already exist.");
}
async function initialize() {
  console.log("WhatsApp Bot Initializing...");

  try {
/*
  try{
    var gitRemoteUrl = await executeCommand("git config --get remote.origin.url");
    const expectedUrl = Buffer.from("c2F0YW5pY2V5cHovSXp1bWktbWQ=", "base64").toString("ascii");
    if (!gitRemoteUrl.includes(expectedUrl)) {
      console.log("MODIFIED BOT " + gitRemoteUrl + " DETECTED. ONLY USE THE ORIGINAL VERSION FROM HERE: https://github.com/princerudh/rudhra-bot");
      process.exit(0);
    }
  } catch (error) {
    console.log("Breaking off because of invalid bot installation method",error);
  };
*/
  await readAndRequireFiles(path.join(__dirname, "./database"));

  await config.DATABASE.sync();
  console.log("Database synchronized.");

  console.log("Installing Plugins...");
  await readAndRequireFiles(path.join(__dirname, "../plugins"));
  console.log("Plugins Installed!");  
  async function connectToWhatsApp() {
    try {
      console.log("Connecting to WhatsApp...");
      const { state, saveCreds } = await useMultiFileAuthState("./session/");

      const { version } = await fetchLatestBaileysVersion();
      const logger = pino({ level: "silent" });
      const client = makeWASocket({
        logger,
        printQRInTerminal: false,
        downloadHistory: false,
        syncFullHistory: false,
        browser: Browsers.macOS("Desktop"),
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        version,
      });

      client.ev.on("connection.update", async (node) => {
        const { connection, lastDisconnect } = node;
        if (connection === "open") {
          console.log("Connected to WhatsApp.");
         const sudo = config.SUDO ? (typeof config.SUDO === 'string' ? numToJid(config.SUDO.split(",")[0]) : numToJid(config.SUDO.toString())) : client.user.id;
          await client.sendMessage(
    sudo,
    {
      text: `*𝗥𝗨𝗗𝗛𝗥𝗔 𝗦𝗧𝗔𝗥𝗧𝗘𝗗!*\n\n𝗣𝗿𝗲𝗳𝗶𝘅: ${PREFIX}\n𝗠𝗼𝗱𝗲: ${
        config.MODE === "private" ? "private" : "public"
      }\n𝗣𝗹𝘂𝗴𝗶𝗻𝘀: ${
        commands.filter((command) => command.pattern).length
      }\n𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${require("../package.json").version}`,
      contextInfo: {
        externalAdReply: {
          title: "𝗥𝗨𝗗𝗛𝗥𝗔 𝗕𝗢𝗧",
          body: "𝗝𝗼𝗶𝗻 𝗙𝗼𝗿 𝗨𝗽𝗱𝗮𝘁𝗲𝘀",
          sourceUrl: "https://chat.whatsapp.com/KOc9NMQXZtf5vSId3KxQvO",
          mediaUrl: "https://chat.whatsapp.com/KOc9NMQXZtf5vSId3KxQvO",
          mediaType: 1,
          showAdAttribution: false,
          renderLargerThumbnail: false,
          thumbnailUrl: "https://telegra.ph/file/b51deea8df9177d78f35e.jpg",
        },
      },
    },
    { quoted: false }
  );
        }
        if (
          connection === "close" &&
          lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut
        ) {
          console.log("Reconnecting...");
          await delay(300);
          connectToWhatsApp();
        } else if (connection === "close") {
          console.log("Connection closed.");
          await delay(3000);
          process.exit(0);
        }
      });

      client.ev.on("creds.update", saveCreds);

      client.ev.on("messages.upsert", async (upsert) => {
        if (upsert.type !== "notify") return;
        const msg = upsert.messages[0];
        if (msg.key.remoteJid === STOP_BOT_JID) {
       return;
       }
        await serialize(JSON.parse(JSON.stringify(msg)), client);
        await saveMessage(upsert.messages[0], msg.sender);      
        if (!msg.message) return;
        const message = new Message(client, msg);
        const status = await getBanStatus(message.jid);
        if (status === 'off' && !message.isSudo) return;
        if (config.LOG_MSG && !message.data.key.fromMe)
          console.log(
            `[MESSAGE] [${message.pushName || message.sender.split("@")[0]}] : ${
              message.text || message.type || null
            }`
          );
        if (
          config.READ_MSG == true &&
          message.data.key.remoteJid !== "status@broadcast"
        )
          await client.readMessages([message.data.key]);
        const isBot = (message.fromMe && message.id.startsWith('BAE5') && message.id.length == 12) || (message.fromMe && message.id.startsWith('BAE5') && message.id.length === 16);
        if (!(!isBot || (isBot && message.text && /(kick|warn|dlt)$/.test(message.text)))) {
          return;
        }
        if (config.DISABLE_PM && message.jid.endsWith("@s.whatsapp.net") && !message.isSudo) {
    return;
        }
        commands.map(async (command) => {
          const messageType = {
            image: "imageMessage",
            sticker: "stickerMessage",
            audio: "audioMessage",
            video: "videoMessage",
          };

const handleGroupMessage = async (message, client) => {
   if (!message.isGroup) return;

   const antilink = await getAntiLink(message.jid);
   if (antilink?.enabled && message.body) {
      const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
      if (urlPattern.test(message.body)) {
         const isAdmin = (await client.groupMetadata(message.jid)).participants.find(p => p.id === message.sender)?.admin;
         if (!isAdmin) {
            if (antilink.action === "kick") {
               await client.groupParticipantsUpdate(message.jid, [message.quoted.sender], "remove");
            } else if (antilink.action === "warn") {
               await client.sendMessage(message.jid, { text: `@${message.sender.split("@")[0]}, sending links is not allowed in this group.`, mentions: [message.sender] });
            }
            await client.sendMessage(message.jid, {
            delete: {
              remoteJid: message.chat,
              fromMe: message.quoted.fromMe,
              id: message.quoted.id,
              participant: message.quoted.sender
            }
          });
         } else {
            await client.sendMessage(message.jid, { text: "Warning: As an admin, please be cautious when sharing URLs." });
         }
      }
   }

   if (config.ANTIWORD && msg.body) {
      const badWords = config.ANTIWORD.split(",").map(word => word.trim().toLowerCase());
      const messageWords = msg.body.toLowerCase().split(/\s+/);
      const containsBadWord = messageWords.some(word => badWords.includes(word));

      if (containsBadWord) {
         const groupMetadata = await client.groupMetadata(msg.from);
         const isAdmin = groupMetadata.participants.find(p => p.id === msg.sender)?.admin;
         if (!isAdmin) {
            await client.sendMessage(msg.from, { delete: msg.key });
            await client.sendMessage(msg.from, {
               text: `@${msg.sender.split("@")[0]}, please refrain from using inappropriate language.`,
               mentions: [msg.sender],
            });
         }
      }
   }
};

const handleCall = conn => async call => {
   if (config.ANTICALL === true || config.ANTICALL === "block") {
      for (let i of call) {
         if (i.status === "offer") {
            await client.rejectCall(i.id, i.from);
            if (config.ANTICALL === "block") {
               await client.updateBlockStatus(i.from, "block");
            }
         }
      }
   }
};

          const isMatch =
            (command.on &&
              messageType[command.on] &&
              message.msg &&
              message.msg[messageType[command.on]] !== null) ||
            !command.pattern ||
            command.pattern.test(message.text) ||
            (command.on === "text" && message.text) ||
            (command.on && !messageType[command.on] && !message.msg[command.on]);

          if (isMatch) {
            if (command.fromMe && !message.isSudo) return;
            if (command.onlyPm && message.isGroup) return;
            if (command.onlyGroup && !message.isGroup) return;
            if (command.pattern && config.READ_CMD == true)
              await client.readMessages([message.data.key]);
            const match = message.text?.match(command.pattern) || "";

            try {
              await command.function(
                message,
                match.length === 6 ? match[3] ?? match[4] : match[2] ?? match[3],
                client,
              );
            } catch (e) {
              if (config.ERROR_MSG) {
                console.log(e);
                const sudo =
                  config.SUDO ? (typeof config.SUDO === 'string' ? numToJid(config.SUDO.split(",")[0]) : numToJid(config.SUDO.toString())) : client.user.id;
                await client.sendMessage(
                  sudo,
                  {
                    text:
                      "\n`╒═══════════════════════╕`\n`•  ⓘ ┆ 𝗘𝗥𝗥𝗢𝗥 𝗥𝗘𝗣𝗢𝗥𝗧 ┆ ⓘ  •`\n`╘═══════════════════════╛`\n\n* 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 : " +
                      message.text +
                      "\n* 𝗘𝗿𝗿𝗼𝗿 : " +
                      e.message +
                      "\n* 𝗝𝗶𝗱 : " +
                      message.jid +
                      "\n\n>  ʀᴜᴅʜʀᴀ ʙᴏᴛ\n",
                  },
                  { quoted: message.data }
                );
              }
            }
          }
        });
      });
      return client;
    } catch (error) {
      console.error("Error connecting to WhatsApp:", error);
      throw error;
    }
  }

  await connectToWhatsApp();


exports.initialize = initialize;
}
