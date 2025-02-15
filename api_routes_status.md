# API ROUTES STATUS

- /auth -> **terminé** ✅

  - /login -> **fait** ✅
  - /register -> **fait** `admin` `token` ✅
  - /logout -> **fait** ✅
  - /refresh-login -> **fait** `token` ✅

- /patients -> **à faire** `token`
- / -> _(GET tous)_
- /:id -> _(GET un)_
- /:id/soin/ -> _(POST créer)_
- /:id/soin/:id -> _(GET un)_
- /:id/soin/:id -> _(PATCH)_
- /:id/soin/:id -> _(DELETE)_
- / -> _(POST créer)_
- /:id -> _(DELETE)_
- /:id -> _(PATCH)_

- /etablissements -> **à faire** `token`
- / -> _(GET tous)_
- / -> _(POST créer)_
- /:id -> _(GET un)_
- /:id -> _(DELETE)_
- /:id -> _(PATCH)_

- /tuteurs -> **à faire** `token`
- / -> _(GET tous)_
- / -> _(POST créer)_
- /:id -> _(GET un)_
- /:id -> _(DELETE)_
- /:id -> _(PATCH)_

- /factures -> **à faire** `token`
- / -> _(GET tous)_
- / -> _(POST créer)_
- /:id -> _(GET un)_
- /:id -> _(DELETE)_
- /:id -> _(PATCH)_

✅ -> accomplie
🟠 -> priorité dépendante d'une autre tâche
🔴 -> priorité absolue
