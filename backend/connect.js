import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import path from 'path';
import SessionManager from './sessionManager.js';
import { loadCommands, runCommand } from './commands/loader.js';
import { logServer } from '../utils/logger.js';

const SESSIONS_DIR = path.resolve('./backend/sessions/');
const sessions = {};

const ConnectManager = {
  async initSession(phone, prefix) {
    const { state, saveCreds } = await useMultiFileAuthState(`${SESSIONS_DIR}/${phone}`);
    const sock = makeWASocket({ auth: state });

    sessions[phone] = sock;
    SessionManager.save(phone, prefix);

    // Génère le code de pairing réel avec Baileys
    const pairingCode = await sock.requestPairingCode(phone);
    console.log(`voila ton code ${pairingCode}`);

    // Charge les commandes une seule fois au démarrage
    const commands = await loadCommands();

    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (!msg.message?.conversation) continue;
        const response = await runCommand(msg.message.conversation, prefix, commands);
        if (response) {
          await sock.sendMessage(msg.key.remoteJid, { text: response });
        }
        logServer.push({ time: new Date().toLocaleTimeString(), text: `[${phone}] ${msg.message.conversation}` });
      }
    });

    sock.ev.on('connection.update', (update) => {
      logServer.push({ time: new Date().toLocaleTimeString(), text: `[${phone}] Connexion: ${update.connection}` });
    });

    return { pairingCode };
  },

  async runCommand(command) {
    const phone = SessionManager.getActive();
    const prefix = SessionManager.getPrefix();
    const commands = await loadCommands();
    const result = await runCommand(command, prefix, commands);
    logServer.push({ time: new Date().toLocaleTimeString(), text: `[CMD] ${command}: ${result}` });
    return result;
  },

  async logout() {
    const phone = SessionManager.getActive();
    if (sessions[phone]) {
      await sessions[phone].logout();
      delete sessions[phone];
      SessionManager.clear(phone);
      logServer.push({ time: new Date().toLocaleTimeString(), text: `[${phone}] session logout` });
    }
  }
};

export default ConnectManager;
