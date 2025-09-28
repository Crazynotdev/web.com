import fs from 'fs';
import path from 'path';

const SESSIONS_DIR = path.resolve('./backend/sessions/');
let currentSession = null;
let prefix = '.';

function save(phone, pref) {
  currentSession = phone;
  prefix = pref;
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  fs.writeFileSync(`${SESSIONS_DIR}/${phone}.json`, JSON.stringify({ phone, prefix }));
}

function status() {
  if (!currentSession) return { status: 'Non connecté' };
  return { status: 'Connecté', phone: currentSession, prefix };
}

function getPrefix() {
  return prefix;
}

function getActive() {
  return currentSession;
}

function clear(phone) {
  try {
    fs.unlinkSync(`${SESSIONS_DIR}/${phone}.json`);
  } catch {}
  currentSession = null;
  prefix = '.';
}

export default { save, status, getPrefix, getActive, clear };
