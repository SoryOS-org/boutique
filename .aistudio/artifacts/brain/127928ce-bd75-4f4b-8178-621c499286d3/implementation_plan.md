# Plan d'implémentation : Alignement horizontal des 3 boutons d'action sur mobile

Ce plan détaille la modification de la barre d'action inférieure de la fiche produit (`ProductModal`) afin d'aligner parfaitement les trois boutons (Discussion WhatsApp, Ajouter au panier, Acheter maintenant) sur une seule et même ligne horizontale, y compris sur les écrans mobiles.

---

### Analyse de l'état actuel
- Dans `src/components/ProductModal.tsx` (lignes 571-620), le conteneur des boutons utilise actuellement la classe Tailwind `flex flex-col sm:flex-row items-center gap-3`.
- Sur mobile (< 640px), cette classe impose un empilement vertical (`flex-col`), ce qui affiche le bouton rond WhatsApp au-dessus, suivi de "Ajouter au panier", puis de "Acheter maintenant".

---

### Modifications prévues

#### 1. Mise en page du conteneur (`src/components/ProductModal.tsx`)
- Remplacer `flex flex-col sm:flex-row items-center gap-3` par :
  `flex flex-row items-center gap-2 sm:gap-3 w-full`
- Maintenir une hauteur homogène (`h-12`) pour les 3 éléments afin d'obtenir un alignement vertical et horizontal parfait.

#### 2. Bouton WhatsApp (Discussion directe)
- Dimensions fixes carrées compactes (`w-12 h-12 shrink-0 rounded-2xl`) pour ne pas empiéter sur l'espace des deux boutons d'action principaux.
- Conservation de l'icône WhatsApp (`MessageCircle className="w-5 h-5"`), de la bordure et du fond vert émeraude doux.

#### 3. Bouton « Ajouter au panier »
- Répartition flexible (`flex-1 min-w-0 h-12 rounded-2xl`).
- Typographie responsive : taille de texte adaptée (`text-xs sm:text-sm`) avec icône panier (`ShoppingBag className="w-4 h-4 shrink-0"`).
- Libellé adaptatif pour garantir l'absence de coupure ou de retour à la ligne sur les smartphones étroits :
  - Mobile : `Panier`
  - Desktop / Tablette : `Ajouter au panier`

#### 4. Bouton « Acheter maintenant »
- Répartition flexible (`flex-1 min-w-0 h-12 rounded-2xl bg-orange-600`).
- Typographie responsive (`text-xs sm:text-sm`) avec icône éclair (`Zap className="w-4 h-4 shrink-0"`).
- Libellé adaptatif :
  - Mobile : `Acheter`
  - Desktop / Tablette : `Acheter maintenant`

---

### Vérification et validation
1. **Compilation TypeScript & Lint** : exécuter `npm run lint` (`tsc --noEmit`) pour valider l'intégrité du code.
2. **Build Vite** : compiler avec `npm run build` pour certifier l'absence d'erreurs de bundling.
3. **Tests d'intégration réels** : exécuter `npm test` pour garantir le bon fonctionnement continu de l'application et de Firebase.
4. **Synchronisation Git & GitHub** : commit et push de la modification vers le dépôt GitHub `SoryOS-org/boutique`.
