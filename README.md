# escape-lab-back

`S` => emit par le **serveur**

`C` => emit par le **client**
__________
## 0 - connexion

|   | Name                                |            Action            |  |
|---|-------------------------------------|:----------------------------:|---|
| C | `connection`                        | connecter au server socket  ||
| C | `connectToRoom`                     | utilisateur qui se conencte à une room||
| S | `userConnected`                     | utilisateur connecté à la room ||
| C | `disconnect`                        | utilisateur deconnecte      ||
| S | `userDisconnected`                  | utilisateur deconnecté de la room ||
| C | `isReady`                           | utilisateur est prêt        ||
| S | `playerIsReady`                     | utilisateur de la room est prêt ||
| S | `startGame`                         | départ du jeu               ||
| S | `setStepGame`                       | change step game            ||
| S & C | `endEnigme`                     | on end enigme               ||
| S | `buildEnigme`                       | build enigme for            ||
| C | `readyEnigme`                       | on user build enigme        ||
| S | `startEnigme`                       | start enigme                ||
| S | `nextEnigme`                        | next Enigme                 ||


## 1 - Intro

|   | Name                                |            Action            |  |
|---|-------------------------------------|:----------------------------:|---|
| S | `intro-message`                     | envoyer un nouveau message  ||
| C | `intro-recevedMessage`              | utilisateur à reçu le message||
| S | `intro-startVideo`                  | Lancer vidéo sur les devices||
| C | `intro-endVideo`                    | la vidéo est fini           ||
