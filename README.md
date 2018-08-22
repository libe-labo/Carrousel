# Carrousel (Commerçants)

Format crée à partir d'une série d'articles publiés dans un même dossier de libération.fr

ex : [Comment ça va le commerce](http://www.liberation.fr/apps/2017/03/comment-ca-va-le-commerce/), [Que la campagne est belle](http://www.liberation.fr/apps/2017/11/que-la-campagne-est-belle/)

Requière Node JS >= 8.5.0 : [télécharger et installer Node](https://nodejs.org/fr/) / Installer browser-sync via : `npm install -g browser-sync`

## Installation / Utilisation

- Install :

```
$ npm install
```

- Remplir le fichier `./json/config.json` :
`max_articles` est une valeur optionnelle, permettant d'afficher "article n/max_articles". Si la valeur est autre qu'un entier supérieur à 0, l'app affiche "article n/nb-d-articles-trouvés"
`order` est également optionnel, l'app affiche les articles dans l'ordre antéchronologique si la valeur est différente de `"chrono"`

```json
{
  "dossier": 123456789,
  "date": "YYYY/MM",
  "slug": "url-du-projet",
  "titre": "Le titre du projet",
  "chapo": "La chapo du projet. Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus.",
  "auteur": "Nom Prenom",
  "max_articles": 0,
  "order": "antechrono"
}
```

- Créer le fichiers de datas :

```
$ npm run build
```

- Tester :

```
$ browser-sync start -s "dist"
```

## Mise en ligne

1. Compléter les meta-tags dans `./dist/index.html`
2. Compléter les tracking-tags dans `./dist/index.html`
3. Ajouter une image d'appel dans `./dist/social.jpg`
4. Uploader sur le ftp le contenu du dossier `./dist/`

## Mise à jour

- Remplir le fichier `./json/ftp.json` avec le host, l'utilisateur et le mot de passe du ftp :

```json
{
  "host": "--.---.--.---",
  "port": 22,
  "username": "utilisateur",
  "password": "**********"
}
```

- Mettre à jour automatiquement l'app une fois par heure (implique de laisser ouverte la fenêtre de terminal, et donc de ne pas éteindre l'ordinateur qui exécute cette commande)

```
$ npm run auto-update
```

- Mettre à jour l'app une seule fois :

```
$ npm run update
```

## License

> The MIT License (MIT)
>
> Copyright (c) Libé Six Plus 2017
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without > limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following > conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO > EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR > THE USE OR OTHER DEALINGS IN THE SOFTWARE.
