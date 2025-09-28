// api/connect.js
import express from 'express';
import sessionManager from '../backend/sessionManager.js';

const router = express.Router();

router.post('/connect', async (req, res) => {
  const { phone, prefix } = req.body;

  // Validation basique
  if (!phone || !prefix) {
    return res.json({ success: false, error: 'Numéro ou préfixe manquant.' });
  }

  try {
    const { pairingCode } = await ConnectManager.initSession(phone, prefix);

    if (!pairingCode) {
      return res.json({ success: false, error: 'Impossible de générer le code de pairage.' });
    }

    return res.json({ success: true, pairingCode });
  } catch (err) {
    console.error('Erreur lors de la connexion WhatsApp :', err);
    return res.json({ success: false, error: 'Erreur serveur ou numéro invalide.' });
  }
});

export default router;
