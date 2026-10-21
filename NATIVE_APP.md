# La Bodega de Valou — iPhone & Android (Capacitor)

Le site GitHub Pages existant reste en place. La version native est dans `www/`, et utilise la même base Firestore et les mêmes joueurs.

## Prérequis

- Node.js 20 ou supérieur
- Android Studio pour Android ; macOS + Xcode pour iPhone
- Firebase Console : créer les applications Android (`fr.valou.bodega`) et iOS (`fr.valou.bodega`)
- Configurer Firebase Cloud Messaging pour Android et iOS ; sur iOS, activer les capacités Push Notifications et Background Modes > Remote notifications, et ajouter une clé APNs dans Firebase.
- Sur Android, déposer `google-services.json` dans `android/app/`.
- Sur iOS, déposer `GoogleService-Info.plist` dans le projet Xcode (cible App).

## Installation

```bash
npm install
npm run build
npx cap add android
npx cap add ios    # sur macOS uniquement
npx cap sync
npx cap open android
npx cap open ios
```

Après chaque modification de `www/`, exécuter `npm run sync`.

## Notifications

Le bouton natif demande l'autorisation et enregistre le **jeton FCM** dans `pushTokens/{uid}` dans Firestore. La fonction `functions/index.js` du dépôt envoie des messages lors de la réception de défis. **Elle doit être déployée sur un backend sécurisé** : sans ce déclencheur, les notifications ne seront pas envoyées lorsque l'application est fermée.

Le déploiement Firebase Cloud Functions exige généralement Blaze. Une alternative est un backend externe avec les identifiants Firebase Admin sécurisés ; ne jamais placer une clé serveur dans l'application.

Les applications natives doivent être compilées, signées et distribuées. Sur iOS, App Store ou TestFlight requiert normalement un compte Apple Developer. Ce dépôt ne contient pas encore de binaires IPA/APK signés.

## Attention

Le fichier `index.html` à la racine est la version Web ; `www/index.html` est la version Capacitor. Synchroniser les modifications du jeu dans les deux versions.
