# Bataille Navale - README

## Introduction
Ce code JavaScript représente une version du jeu de bataille navale, implémentée en utilisant HTML, CSS et JavaScript. Le jeu se joue entre le joueur et l'ordinateur.

## Composants Principaux
### HTML
- Le fichier HTML contient un conteneur pour le plateau de jeu, les options de placement des bateaux, des boutons pour démarrer et redémarrer le jeu, et des éléments d'affichage d'informations.
- La structure HTML est utilisée pour placer les tableaux de jeu du joueur et de l'ordinateur ainsi que les images représentant les joueurs.

### CSS
- Les styles CSS sont utilisés pour le positionnement des éléments, la mise en forme du plateau de jeu, des boutons, etc.

### JavaScript
- **Création du Plateau de Jeu** : Deux tableaux de jeu sont créés pour le joueur et l'ordinateur, avec des blocs représentant les cellules du tableau.
- **Placement Aléatoire des Bateaux** : Les bateaux du joueur et de l'ordinateur sont placés aléatoirement sur leur tableau respectif.
- **Interaction Drag and Drop** : Les bateaux du joueur peuvent être déplacés et déposés sur le tableau de jeu.
- **Déroulement du Jeu** : Le joueur commence en plaçant ses bateaux, puis la partie commence. Les joueurs alternent entre les tours. Le joueur clique pour tirer sur une case et tenter de toucher un bateau de l'adversaire.
- **Détection des Touches et Victoire** : Les tirs réussis et les bateaux coulés sont détectés pour déterminer la fin de la partie.

## Fonctions et Classes Principales
- `flip()`: Change l'orientation des bateaux du joueur avant le placement.
- `createBoard()`: Crée le plateau de jeu pour le joueur et l'ordinateur.
- `Ship Class`: Définit les caractéristiques des différents types de bateaux.
- `getValidity()`: Vérifie la validité du placement des bateaux.
- `addShipPiece()`: Place les bateaux sur le plateau.
- `dragStart()`, `dragOver()`, `dropShip()`: Gèrent le déplacement des bateaux par glisser-déposer.
- `startGame()`: Commence la partie.
- `handleClick()`: Gère les tirs du joueur sur la grille de l'ordinateur.
- `computerGo()`: Gère le tour de l'ordinateur.
- `checkScore()`: Vérifie le score pour déterminer la fin de la partie.

## Utilisation
- Chargez le fichier HTML dans un navigateur web pour jouer à la bataille navale.
- Placez les bateaux en les déplaçant avec la souris.
- Commencez la partie en cliquant sur "Commencer".

## Conclusion
Ce code JavaScript offre une version simplifiée du jeu de bataille navale, permettant aux joueurs de placer des bateaux et de tirer sur la grille de l'adversaire pour tenter de les couler.
