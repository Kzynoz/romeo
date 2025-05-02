# Roméo - Votre assistant facturation

Roméo est une application web dédiée aux professionnels de santé paramédicaux (pédicure-podologues, kinés, etc.) pour faciliter la gestion des soins, des factures et des patients, en particulier dans des contextes spécifiques comme les EHPAD ou les patients sous tutelle.

## Fonctionnalités principales

### Ajout d'entités

Il est possible d'ajouter des **patients**, **tuteurs**, **EHPAD**, et **soins**.
- Un **patient** est mis en relation avec un **tuteur** et un **EHPAD**.
- Chaque **patient** bénéficie d’un suivi des soins reçus, incluant la date du soin, les informations du soin, le type de soin, et le prix.
- Pour chaque soin, une **facture** est générée en PDF.

### Ajout de Patients

L'application permet l'ajout de nouveaux **patients**. Lors de l'enregistrement, les informations de base telles que le nom, prénom, et les coordonnées sont saisies. De plus, il est possible d'associer un patient à un **tuteur** et à un **EHPAD**. Cette étape est cruciale pour garantir un suivi optimal des soins et des factures.

### Gestion des Tuteurs

Les patients peuvent être liés à un **tuteur** qui en assure la gestion. Les tuteurs peuvent être des membres de la famille, des représentants légaux ou des établissements. Les informations du tuteur, telles que le nom, prénom, relation avec le patient et coordonnées (téléphone, e-mail, adresse), sont enregistrées pour un suivi efficace.

### Association à un EHPAD

Les **patients** peuvent être associés à un **EHPAD**, permettant de suivre leur prise en charge dans un établissement spécifique.

### Suivi des Soins

Chaque patient bénéficie d’un suivi détaillé de ses soins. Pour chaque soin effectué, les informations suivantes sont collectées :
- **Date du soin** : pour savoir quand le soin a été réalisé.
- **Type de soin** : par exemple, pédicure ou bilan podologique.
- **Prix du soin** : coût du soin.
- **Informations détaillées** : informations complémentaires sur le soin.

### Génération des Factures

Pour chaque soin effectué, une **facture** est générée automatiquement. Elle comprend :
- Détails du soin : description complète, type de soin, date.
- Prix : coût associé au soin.
- État de la facture : envoyée, payée ou en attente.
- Téléchargement en PDF : possibilité de télécharger la facture au format PDF.

### Statistiques (uniquement pour l'admin)

Les statistiques sont cruciales pour le suivi des activités du praticien. Les statistiques disponibles incluent :
- Nombre de soins réalisés dans une période donnée (mois ou année).
- Revenus générés (soins facturés et factures réglées).

### Accès Tuteur

Les **tuteurs** peuvent gérer et suivre les informations relatives à leurs patients, y compris les soins et factures générées. Un lien de première connexion est envoyé par email aux tuteurs, leur permettant de choisir un mot de passe sécurisé. Une fois le mot de passe défini, le lien devient expiré pour des raisons de sécurité.

## V2 (Prochaines fonctionnalités)

### Praticien (Admin)

- **Modification des informations personnelles** : Permet aux praticiens (admin) de modifier leurs informations personnelles.
- **Ajout de nouveaux praticiens** : Les admins peuvent ajouter de nouveaux praticiens pour gérer une équipe de soins.
- **Ajout de nouveaux types de soin** : Les admins peuvent ajouter des types de soins pour mieux organiser les traitements.
- **Système de notifications** : Notifications pour les factures non payées après un mois.

### Praticien

- **Ajout de patients et soins** : Les praticiens peuvent ajouter leurs patients et définir les soins effectués.
- **Modification des informations personnelles** : Les praticiens peuvent modifier leurs informations personnelles.

### Tuteur

- **Inscription et gestion du mot de passe** : Les tuteurs peuvent s'inscrire et choisir un mot de passe sécurisé.
- **Modification des informations personnelles** : Les tuteurs peuvent mettre à jour leurs informations personnelles et leur mot de passe.

### Soins

- **Filtrage des soins** : Le filtrage des soins permet de trier les soins en fonction de leur statut de paiement (acquittés, impayés, en attente).

### Statistiques

- **Export des statistiques en CSV** : Les utilisateurs peuvent exporter les statistiques des soins et paiements en format CSV pour une analyse approfondie.

### Factures

- **Envoi des factures par email** : Lorsqu’un soin est ajouté ou mis à jour, une facture est envoyée par email au tuteur ou patient.
- **Modification des factures** : La facture est mise à jour automatiquement en cas de modification des soins (par exemple, changement de prix).

### Log

- **Table Log** : Bien que la table des logs soit déjà présente, elle sera prochainement utilisée pour suivre les actions effectuées sur la plateforme, comme l'ajout de patients, la modification des soins, etc.

## Technologies

### Back End ###
- Node.js
- Express.js
- Bcrypt
- JWT
- Morgan
- Nodemon
- Express-validator
- Cors
- Puppeter (génération de PDF depuis un HTML)

### Front End ###
- React
- React Router Dom
- Redux Toolkit
