# La Bodega de Valou 🎲
Site indépendant pour les 30 ans de Valentin. Jeu individuel avec 25 défis, plus le Dé de la Bodega, classement en temps réel et espace organisateur.

## Mise en route
1. Créer un **nouveau projet Firebase**, distinct de l'escape game.
2. Ajouter une application Web dans Firebase > Paramètres du projet et copier les valeurs de configuration.
3. Dans `index.html`, remplacer `REMPLACER_API_KEY`, `REMPLACER_PROJECT_ID` et `REMPLACER_APP_ID`.
4. Activer **Authentication > Anonyme** et **E-mail/Mot de passe**.
5. Créer un utilisateur organisateur e-mail/mot de passe et relever son **UID**.
6. Remplacer `REMPLACER_UID_ORGANISATEUR` dans `index.html` et `firestore.rules`.
7. Créer Firestore et publier les règles du fichier `firestore.rules` dans Firebase > Firestore Database > Règles.
8. Dans GitHub > Settings > Pages, choisir **Deploy from a branch**, branche **main**, dossier **/(root)**.
9. Ajouter `vajeux48-collab.github.io` aux domaines autorisés Firebase Authentication si nécessaire.
10. Tester avec deux navigateurs : un organisateur, un joueur.

Site attendu : https://vajeux48-collab.github.io/bodega-valou/

## Fonctionnement
Chaque invité choisit un pseudo et tire un défi. L'organisateur peut envoyer un défi à une personne ou à tous. Pour le Dé de la Bodega, les faces impaires concernent l'envoyeur et les faces paires le destinataire ; le nombre de gorgées facultatives est 1 à 3. Le résultat est enregistré sur Firestore et affiché dans l'espace organisateur.

## Limitations importantes
- Le site ne fonctionne pas tant que Firebase n'est pas configuré.
- Les défis apparaissent quand le site est ouvert ; aucune notification push lorsque le navigateur est fermé.
- Le tirage du dé s'effectue côté navigateur ; il n'est **pas infalsifiable**. Une Cloud Function est nécessaire pour sécuriser le hasard.
- Les règles Firestore fournies conviennent à un jeu convivial, **pas** à un classement anti-triche.
- Après connexion organisateur, rafraîchir la page si les données des joueurs ne s'affichent pas.
- Les écritures par lots Firestore sont limitées à 500 opérations.
- Toutes les consommations sont facultatives ; eau, boisson sans alcool, gage ou passer. Réservé aux adultes. Ne jamais conduire après avoir bu.
