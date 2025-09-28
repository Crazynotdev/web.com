# Crazy Web Bot 🤖

Plateforme web + bot WhatsApp Baileys, design « wow », dashboard interactif, logs en temps réel.

## Installation

```bash
npm install
npm start
```

## Structure

- **frontend/** : Pages HTML stylées (index, dashboard)
- **backend/** : Serveur Express, Baileys, gestion commandes et sessions
- **utils/** : Logger serveur

## Fonctionnalités

- Connexion WhatsApp réelle (pairing code Baileys)
- Dashboard interactif et coloré
- Commandes personnalisables (.menu, .help, .status, .logout)
- Logs live via WebSocket

## Déploiement

- **Frontend** : compatible Vercel (pages statiques)
- **Backend** : Node.js, à héberger sur VPS ou service compatible (Railway, Render…)
