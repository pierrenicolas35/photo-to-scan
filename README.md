# photo-to-scan

Application web client-side pour transformer des photos de justificatifs en PDF.

## Nouvelles fonctionnalités IA

- **Cadrage automatique**: bouton `🪄 Cadrage Automatique` sur l'étape de recadrage.
  - Détection OpenCV des 4 coins du document.
  - Fallback heuristique/centré si l'IA n'est pas disponible ou échoue.
- **Auto-réglage couleur**: bouton `🪄 Auto-réglage IA` sur l'étape de contraste.
  - Nettoyage via seuillage adaptatif OpenCV.
  - Fallback automatique vers le réglage manuel existant.

## Notes

- Aucun secret/credential n'est requis.
- Tout le traitement reste exécuté localement dans le navigateur.
