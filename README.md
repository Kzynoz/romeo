### Roméo - votre asssitant facturation

Roméo est une application web dédiée aux professionnels de santé paramédicaux (pédicure-podologues, kinés, etc.)
pour faciliter la gestion des soins, des factures, et des patients, en particulier dans des contextes
spécifiques comme les EHPAD ou les patients sous tutelle.


### FONCTIONNALITÉS PRINCIPALES

## Ajout d'entités

Il est possible d'ajouter des 'patients', 'tuteurs', 'EHPAD', 'soin'.
Le 'patient' est mis en relation avec un tuteur et une EHPAD
Pour chaque patients, nous pouvons suivre les soins qu'il a réçu avec la date du soin, les informations du soins, le type, le prix
Pour chaque soin, une facture est générée en PDF

# Ajout de Patients

L'application permet l'ajout de nouveaux patients. Lors de l'enregistrement d'un patient, les informations de base telles que le nom, le prénom, la les coordonnées sont saisies. De plus, il est possible d'associer un patient à un tuteur et à un EHPAD (Établissement d'Hébergement pour Personnes Âgées Dépendantes). Cette étape est cruciale pour garantir que chaque patient dispose de toutes les informations nécessaires pour le suivi des soins et de la facturation

# Gestion des Tuteurs

Chaque patient peut être lié à un tuteur qui en assure la gestion, notamment pour des raisons légales ou familiales. Lors de l'ajout d'un patient, le tuteur peut être sélectionné. Un tuteur peut être une personne de la famille, un représentant légal ou encore un établissement. Les informations relatives au tuteur, telles que le nom, le prénom, la relation avec le patient, ainsi que les coordonnées (numéro de téléphone, adresse, e-mail) sont enregistrées pour un suivi optimal.

# Association à un EHPAD

Les patients peuvent également être associés à un EHPAD, ce qui permet de suivre leur prise en charge dans un établissement de soins spécifique.

# Suivi des Soins

Chaque patient bénéficie d’un suivi détaillé de ses soins. Les soins peuvent inclure des actes paramédicaux comme des bilans podologiques, des pédicures. Pour chaque soin effectué, des informations spécifiques sont collectées, telles que : - Date du soin : Permet de connaître quand le soin a été réalisé. - Type de soin : Le type de soin effectué (par exemple, pédicure ou bilan podologique). - Prix du soin : Le coût associé à chaque soin réalisé. - Informations détaillées sur le soin : Des informations complémentaires sur les procédures effectuées, les résultats obtenus, etc.

# Génération des Factures

Pour chaque soin effectué, une facture est générée automatiquement.
La facture contient les informations suivantes : - Détails du soin : Description complète du soin, y compris le type de soin et la date de réalisation. - Prix : Le coût associé au soin. - État de la facture : Une fois la facture générée, son état est suivi pour savoir si elle a été envoyée, payée ou est encore en attente. - Téléchargement en PDF : La facture peut être téléchargée au format PDF pour une gestion facile et professionnelle.

Les factures sont automatiquement créées et peuvent être téléchargées par le tuteur ou le patient, selon les autorisations données, pour faciliter la gestion administrative et financière.

# Statistiques (uniquement pour l'admin)

Le suivi des statistiques pour le praticien est une fonctionnalité clé dans l'application, permettant de mesurer et analyser l'efficacité et l'activité. Voici un aperçu des principales statistiques disponibles pour un praticien : - Nombre de soins réalisés pour une période donnée (mois ou année) - Revenus générés (soins facturés et factures réglées)

# Accès tuteur

L’accès pour les tuteurs dans l'application permet de gérer et suivre les informations relatives à leurs patients, tout en ayant une visibilité sur les soins et les factures générées. Pour accèder à la plateforme, un lien de première connexion sera envoyé par email à tuteur, celui-ci à l'aide de son email pour choisir son mot de passe (sécurisé). Une fois le mot de passe choisit, le token dans la BDD est expiré et du coup il ne sera plus possible de s'enregistrer à nouveau.

### V2

Bien que le site soit déjà fonctionnel, une série de petites améliorations et de nouvelles fonctionnalités seront ajoutées dans cette version pour améliorer l'expérience utilisateur et étendre les capacités de l'application.

# Praticien (admin)

**Modification des informations personnelles :** Le praticien (admin) pourra désormais modifier ses informations personnelles, telles que son nom, son adresse email, etc.
**Ajout de nouveaux praticiens :** Le rôle admin permettra également l'ajout de nouveaux praticiens, afin de gérer une équipe de soins. Chaque praticien pourra être associé à ses patients et à ses soins.
**\*Ajout de nouveaux types de soin :** L'admin pourra définir de nouveaux types de soins, afin de mieux catégoriser et organiser les traitements effectués.
**Système de notifications :** Un système de notification sera mis en place pour alerter les administrateurs (praticiens) lorsque des factures sont envoyées mais non payées depuis plus d'un mois. Cela aidera à garder une trace des paiements en retard.

# Praticien

**Ajout de patients et soins :** Tout comme les tuteurs, les praticiens auront la possibilité d'ajouter leurs propres patients et de définir les soins qu'ils ont effectués. Cela permettra de personnaliser l'expérience en fonction des soins spécifiques dispensés par chaque praticien.
**Modification des informations personnelles :** Les praticiens pourront également modifier leurs informations personnelles (alias, email, mot de passe) directement depuis leur profil.

# Tuteur

**Inscription et gestion du mot de passe :** Le processus d'inscription pour les tuteurs sera simplifié, permettant à ces derniers de s'inscrire, de définir un mot de passe et d'accéder à leur espace personnel.
**Modification des informations personnelles et du mot de passe :** Les tuteurs pourront mettre à jour leurs informations personnelles, y compris leur mot de passe, en toute sécurité.

# Soins

**Filtrage des soins :** Afin de faciliter la gestion des soins, des options de filtrage seront ajoutées pour permettre de trier les soins en fonction de leur statut de paiement :

- Soins "acquittés" (payés)
- Soins "impayés"
- Soins "en attente"

# Statistiques

**Export des statistiques en CSV :** Un outil d'exportation des données sera disponible, permettant aux utilisateurs (principalement les administrateurs) de télécharger les statistiques des soins et des paiements sous format CSV. Cela aidera à analyser les données et à préparer des rapports.

# Factures

**Envoi des factures par email :** Lorsqu'un soin est ajouté ou mis à jour, une facture sera envoyée automatiquement par email au tuteur ou au patient, selon les besoins. Cela garantit que les informations sont toujours communiquées rapidement.
**Modification des factures :** En cas de modification d'un soin (par exemple, changement de prix ou d'informations), la facture correspondante sera également mise à jour automatiquement pour refléter ces changements.

# Log

**Table Log :** Bien que la table des logs existe déjà dans la base de données, elle n'est pas encore utilisée. Elle sera prochainement implémentée pour suivre les actions réalisées sur la plateforme, comme l'ajout de patients, la modification de soins, etc. Cela offrira une meilleure traçabilité des opérations effectuées, utile pour la gestion des erreurs et la sécurité.