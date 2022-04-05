# escape-lab-back

`S` => emit par le **serveur**

`C` => emit par le **client**
__________
## 1 - connexion

|   | Name                                |            Action            |  |
|---|-------------------------------------|:----------------------------:|---|
| C | `connection`                        | connecter au server socket ||
| C | `connectToRoom`                     | utilisateur qui se conencte à une room||
| S | `userConnected`                     | utilisateur connecté à la room ||
| C | `disconnect`                        | utilisateur deconnecte ||
| S | `userDisconnected`                  | utilisateur deconnecté de la room ||
| C | `isReady`                           | utilisateur est prêt ||
| S | `playerIsReady`                     | utilisateur de la room est prêt ||
| S | `startGame`                         | départ du jeu ||
