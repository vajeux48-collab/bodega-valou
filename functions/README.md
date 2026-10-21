# Notifications push — La Bodega de Valou

La fonction `notifyNewChallenge` envoie un message FCM à un joueur lorsqu'un nouveau défi apparaît dans son document Firestore.

## Déploiement initial

1. Installer Node.js (version 20 ou supérieure), Firebase CLI : `npm install -g firebase-tools`.
2. Se connecter : `firebase login`.
3. Depuis la racine du dépôt : `firebase use --add` puis sélectionner `bodega-valou`.
4. Installer les dépendances : `cd functions && npm install && cd ..`.
5. Activer le forfait **Blaze** dans Firebase si demandé (Cloud Functions nécessite généralement la facturation).
6. Déployer : `firebase deploy --only functions --project bodega-valou`.

Le service worker du site doit être accessible à `/bodega-valou/firebase-messaging-sw.js`. Les utilisateurs doivent accepter les notifications. Sur iOS, le site doit être ajouté à l'écran d'accueil pour recevoir des notifications Web Push.

Ne jamais intégrer une clé privée Firebase dans le site public.

## Remarque

Le code envoie un message FCM **data-only**, affiché par le service worker en arrière-plan. Les notifications en premier plan sont déjà affichées dans l'application. Le déploiement Firebase Cloud Functions n'est pas effectué par un simple commit GitHub.
