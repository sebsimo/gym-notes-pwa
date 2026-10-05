# GYM NOTES — TypeScript

Application web mobile pour noter ses entraînements. Les séances et favoris sont sauvegardés localement dans le navigateur.

## Ouvrir dans VS Code

Dans VS Code, choisissez **Fichier → Ouvrir un dossier…** et sélectionnez le dossier `gym-notes-typescript`.

## Lancer l’application

Il faut installer Node.js (version LTS), puis ouvrir le terminal intégré de VS Code dans ce dossier et exécuter :

```sh
npm install
npm run dev
```

Vite affichera une adresse locale à ouvrir dans le navigateur, généralement `http://localhost:5173`.

Pour générer le site final :

```sh
npm run build
```

Les fichiers compilés seront placés dans `dist/`.

## Installer comme application (PWA)

Après `npm run build`, publie le contenu de `dist/` sur un hébergement HTTPS (par exemple GitHub Pages, Netlify ou Vercel). Les service workers et l’installation nécessitent HTTPS en ligne; en développement, `localhost` convient.

Sur iPhone, ouvre le site dans Safari, touche **Partager**, puis **Sur l’écran d’accueil**. Sur Android/ordinateur, utilise **Installer l’application** ou **Ajouter à l’écran d’accueil** dans le menu du navigateur. Les données d’entraînement sont sauvegardées dans le navigateur de l’appareil.

## Publier avec GitHub Pages

Le projet contient un déploiement automatique. Après chaque envoi sur la branche `main`, GitHub compile le site et le publie.

1. Dans GitHub Desktop, choisis **File → Add Local Repository…** puis sélectionne le dossier `gym-notes-typescript`. Si GitHub Desktop propose de créer un dépôt dans ce dossier, accepte.
2. Clique sur **Publish repository** pour envoyer le projet sur ton compte GitHub.
3. Sur GitHub, ouvre le dépôt, puis **Settings → Pages**. Dans **Build and deployment**, choisis **GitHub Actions** comme source.
4. Dans l’onglet **Actions**, attends que le déploiement soit terminé. GitHub affichera l’adresse du site, normalement `https://TON-NOM.github.io/gym-notes-typescript/`.

Tu peux choisir un nom de dépôt disponible; le projet utilise des chemins relatifs qui conviennent aux dépôts GitHub Pages. Après un changement de code, utilise GitHub Desktop pour faire un commit et **Push origin**; GitHub republiera la nouvelle version automatiquement. Une publication peut prendre quelques minutes.


## Créer un fichier de sauvegarde sur le téléphone

Dans l’application, ouvre **Historique**, puis touche **Sauvegarder dans Fichiers**. Sur iPhone, choisis **Enregistrer dans Fichiers** dans la feuille de partage et sélectionne un emplacement, par exemple **Sur mon iPhone → Téléchargements** ou iCloud Drive. Garde ce fichier JSON : il contient les séances, exercices personnels et favoris.

Pour récupérer tes données plus tard, ouvre **Historique → Restaurer depuis un fichier**, sélectionne le fichier de sauvegarde et confirme. La restauration remplace les données présentes sur l’appareil par celles du fichier.

Le catalogue reprend les noms des exercices affichés par [Espace Musculation](https://www.espace-musculation.com/exercices). Leur classement par équipement dans l’application est indicatif.

Le catalogue de GYM NOTES peut être parcouru par groupe musculaire ou par matériel.

## Illustrations des exercices

Les illustrations apparaissent dans la liste et en trois étapes sur la fiche des exercices pris en charge. Les autres exercices conservent leur silhouette. Les illustrations sont de Bryl Lim / Everkinetic sous licence CC BY-SA 4.0; voir `public/exercises/ATTRIBUTION.md` et `public/exercises/LICENSE-ASSETS`.
