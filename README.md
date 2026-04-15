# Shopping List API

REST API pro správu nákupních seznamů postavené na Node.js a Express.js.

## Požadavky

- Node.js
- npm

## Instalace

```bash
npm install
```

## Spuštění

```bash
# vývojový režim (nodemon)
npm run dev

# produkční režim
npm start
```

Server běží na `http://localhost:3000`.

## Autorizace

API simuluje přihlášeného uživatele pomocí hlavičky `x-user-id`.

Dostupní uživatelé:
| ID | Jméno |
|----|-------|
| u1 | Petr Novák |
| u2 | Anna Nováková |
| u3 | Mike Novák |

Příklad:
```
x-user-id: u1
```

## Profily

- **Authenticated User** — přihlášený uživatel. Může vytvářet a zobrazovat nákupní seznamy.
- **Member** — člen seznamu. Může zobrazovat detail, přidávat/odebírat položky, označovat jako vyřešené a odejít ze seznamu.
- **Owner** — vlastník seznamu. Má veškerá oprávnění člena + může přejmenovávat, mazat, archivovat seznam a spravovat členy.

## Endpointy

### Nákupní seznamy

| Metoda | Cesta | Oprávnění | Popis |
|--------|-------|-----------|-------|
| POST | /lists | Authenticated User | Vytvoření nového seznamu |
| GET | /lists | Authenticated User | Zobrazení všech seznamů uživatele |
| GET | /lists/:listId | Member, Owner | Zobrazení detailu seznamu |
| POST | /lists/:listId | Owner | Úprava názvu seznamu |
| DELETE | /lists/:listId | Owner | Smazání seznamu |
| POST | /lists/:listId/archive | Owner | Archivace seznamu |
| POST | /lists/:listId/members | Owner | Přidání člena |
| DELETE | /lists/:listId/members/:userId | Owner | Odebrání člena |
| DELETE | /lists/:listId/members/me | Member | Odchod ze seznamu |

### Položky seznamu

| Metoda | Cesta | Oprávnění | Popis |
|--------|-------|-----------|-------|
| POST | /lists/:listId/items | Member, Owner | Přidání položky |
| POST | /lists/:listId/items/:itemId | Member, Owner | Úprava položky |
| DELETE | /lists/:listId/items/:itemId | Member, Owner | Smazání položky |
| POST | /lists/:listId/items/:itemId/resolve | Member, Owner | Označení položky jako vyřešené |

## Příklady použití

### Vytvoření seznamu
```
POST /lists
x-user-id: u1
Content-Type: application/json

{
  "name": "Nákup na víkend"
}
```

### Přidání položky
```
POST /lists/list1/items
x-user-id: u1
Content-Type: application/json

{
  "name": "Mléko"
}
```

### Označení položky jako vyřešené
```
POST /lists/list1/items/i1/resolve
x-user-id: u1
```

## Struktura projektu

```
src/
├── routes/
│   ├── shoppingList.js        # endpointy pro správu seznamů
│   └── shoppingListItem.js    # endpointy pro správu položek
├── middleware/
│   ├── auth.js                # autorizace a simulovaná data
│   └── validate.js            # validace vstupních dat
└── app.js                     # hlavní soubor aplikace
```

