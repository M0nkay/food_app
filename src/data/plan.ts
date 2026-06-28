import type { Plan } from "./types";

// Generato dal piano "menù estate Padova rev.2" — fonte dati unica dell'app.
// Modifica qui i contenuti (settimane, piatti, spesa, riferimenti, filtri).
export const PLAN: Plan = {
  "days": [
    {
      "key": "lun",
      "short": "Lun",
      "full": "Lunedì"
    },
    {
      "key": "mar",
      "short": "Mar",
      "full": "Martedì"
    },
    {
      "key": "mer",
      "short": "Mer",
      "full": "Mercoledì"
    },
    {
      "key": "gio",
      "short": "Gio",
      "full": "Giovedì"
    },
    {
      "key": "ven",
      "short": "Ven",
      "full": "Venerdì"
    },
    {
      "key": "sab",
      "short": "Sab",
      "full": "Sabato"
    },
    {
      "key": "dom",
      "short": "Dom",
      "full": "Domenica"
    }
  ],
  "weeks": [
    {
      "n": 1,
      "theme": "Italo-giapponese estivo",
      "days": [
        {
          "key": "lun",
          "lunch": {
            "name": "Spaghetti freddi al sesamo (gomadare) con edamame, zenzero, semi tostati",
            "prepTime": "15 min",
            "equipment": [
              "Pentola"
            ],
            "tag": "assembla",
            "note": "Salsa di sesamo delicata, niente pomodoro, freschi.",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Tataki di manzo con ponzu, rucola e scaglie + carote confit",
            "prepTime": "15 min",
            "equipment": [
              "Padella",
              "Roner"
            ],
            "tag": "fresco",
            "note": "Carne scottata rara e leggera; il ponzu agrumato sgrassa. (Le carote confit sono congelabili.)",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Lun",
          "full": "Lunedì"
        },
        {
          "key": "mar",
          "lunch": {
            "name": "Onigiri ripieni (tonno con poca maionese, salmone) + edamame + insalata",
            "prepTime": "riso 30 min + 15 min",
            "equipment": [
              "Cuociriso"
            ],
            "tag": "assembla",
            "note": "Portatili.",
            "cuisine": [
              "Giappone"
            ]
          },
          "dinner": {
            "name": "Orata al cartoccio con zenzero, lime e zucchine + riso",
            "prepTime": "10 + 25 min",
            "equipment": [
              "Forno",
              "Cuociriso"
            ],
            "tag": "fresco",
            "note": "Pesce bianco magro, salsa agrumata.",
            "cuisine": [
              "Italia"
            ]
          },
          "short": "Mar",
          "full": "Martedì"
        },
        {
          "key": "mer",
          "session": "Sessione B · batch",
          "lunch": {
            "name": "Poke italo-giapponese (riso, salmone o tonno, avocado, edamame, carote, alga, ponzu)",
            "prepTime": "15 min",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone"
            ]
          },
          "dinner": {
            "name": "Polpette glassate teriyaki con riso e fagiolini gomae",
            "prepTime": "20 min",
            "equipment": [
              "Padella"
            ],
            "tag": "congelabile",
            "note": "Polpette dal freezer, glassi a fine cottura. Glassa leggera, non fritto.",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Mer",
          "full": "Mercoledì"
        },
        {
          "key": "gio",
          "lunch": {
            "name": "Insalata di riso con gamberi, edamame, mais, zenzero",
            "prepTime": "assemblaggio",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone"
            ]
          },
          "dinner": {
            "name": "Maiale in agrodolce in friggitrice ad aria con riso e verdure saltate dolci",
            "prepTime": "25 min",
            "equipment": [
              "Friggitrice"
            ],
            "tag": "fresco",
            "note": "Air fryer al posto del fritto; agrodolce dallo stash.",
            "cuisine": [
              "Cina"
            ]
          },
          "short": "Gio",
          "full": "Giovedì"
        },
        {
          "key": "ven",
          "lunch": {
            "name": "Soba fredde con verdure e salsa tsuyu + uovo morbido",
            "prepTime": "15 min",
            "equipment": [
              "Pentola"
            ],
            "tag": "assembla",
            "note": "Grano saraceno digeribile e rinfrescante.",
            "cuisine": [
              "Giappone"
            ]
          },
          "dinner": {
            "name": "Gyoza dal freezer (vapore poi scottate) + insalata + salsa",
            "prepTime": "15 min",
            "equipment": [
              "Padella"
            ],
            "tag": "congelabile",
            "note": "Al vapore, leggere.",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Ven",
          "full": "Venerdì"
        },
        {
          "key": "sab",
          "session": "Sessione A · batch",
          "lunch": {
            "name": "Tagliata di manzo con salsa al miso, carote confit e patate arrosto",
            "prepTime": "20 min",
            "equipment": [
              "Padella",
              "Forno"
            ],
            "tag": "fresco",
            "note": "",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Tagliere freddo italo-giapponese (arrosto a fette, verdure confit, edamame, grissini)",
            "prepTime": "10 min",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "short": "Sab",
          "full": "Sabato"
        },
        {
          "key": "dom",
          "session": "Domenica · sfizio fine dining",
          "lunch": {
            "name": "Crudo di branzino (sashimi-grade, olio evo, yuzu/limone, sale Maldon, erba cipollina) + tonno scottato su letto di vellutata d'asparagi con verdurine glassate",
            "prepTime": "35 min",
            "equipment": [
              "Roner",
              "Padella",
              "Bimby"
            ],
            "tag": "fresco",
            "note": "Qui la vellutata è solo salsa sotto il pesce, mai piatto.",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Leggera: riso saltato con uovo, piselli e verdure",
            "prepTime": "15 min",
            "equipment": [
              "Padella",
              "Cuociriso"
            ],
            "tag": "fresco",
            "note": "",
            "cuisine": [
              "Cina"
            ]
          },
          "short": "Dom",
          "full": "Domenica"
        }
      ]
    },
    {
      "n": 2,
      "theme": "Italia d'estate + tocchi nipponici e indiani",
      "days": [
        {
          "key": "lun",
          "lunch": {
            "name": "Pasta fredda con bottarga, limone e zucchine grigliate",
            "prepTime": "15 min",
            "equipment": [
              "Pentola"
            ],
            "tag": "assembla",
            "note": "La bottarga dà umami senza pomodoro.",
            "cuisine": [
              "Italia"
            ]
          },
          "dinner": {
            "name": "Vitello tonnato (fatto la sera prima) con patate novelle e capperi",
            "prepTime": "prep anticipata, 10 min servizio",
            "equipment": [
              "Roner",
              "Bimby"
            ],
            "tag": "fresco",
            "note": "Make-ahead, freddo. Classico estivo magro, salsa leggera.",
            "cuisine": [
              "Italia"
            ]
          },
          "short": "Lun",
          "full": "Lunedì"
        },
        {
          "key": "mar",
          "lunch": {
            "name": "Bowl di riso con vitello tonnato avanzo, rucola, carote",
            "prepTime": "10 min",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Italia"
            ]
          },
          "dinner": {
            "name": "Pollo tandoori (cosce, marinato yogurt-spezie) in friggitrice + basmati + raita alla menta (senza cetriolo)",
            "prepTime": "25 min",
            "equipment": [
              "Friggitrice",
              "Cuociriso"
            ],
            "tag": "fresco",
            "note": "Marinata anticipata. Cosce saporite, spezie dolci; piccante a parte.",
            "cuisine": [
              "India"
            ]
          },
          "short": "Mar",
          "full": "Martedì"
        },
        {
          "key": "mer",
          "session": "Sessione B · batch",
          "lunch": {
            "name": "Insalata di farro/orzo con primosale, zucchine, menta, mandorle",
            "prepTime": "30 min cereali + assemblaggio",
            "equipment": [
              "Cuociriso"
            ],
            "tag": "fresco",
            "note": "",
            "cuisine": [
              "Italia"
            ]
          },
          "dinner": {
            "name": "Filetto di pesce con salsa verde e carote confit + patate",
            "prepTime": "25 min",
            "equipment": [
              "Forno"
            ],
            "tag": "fresco",
            "note": "La combo preferita: filetto + verdure + salsa.",
            "cuisine": [
              "Italia"
            ]
          },
          "short": "Mer",
          "full": "Mercoledì"
        },
        {
          "key": "gio",
          "lunch": {
            "name": "Insalata di riso con pollo tandoori avanzo, carote, menta",
            "prepTime": "assemblaggio",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "India"
            ]
          },
          "dinner": {
            "name": "Polpette in glassa al miso con riso e spinaci ohitashi (al sesamo)",
            "prepTime": "20 min",
            "equipment": [
              "Padella"
            ],
            "tag": "congelabile",
            "note": "Polpette dal freezer.",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Gio",
          "full": "Giovedì"
        },
        {
          "key": "ven",
          "lunch": {
            "name": "Spaghetti freddi al sesamo con zucchine e mandorle",
            "prepTime": "15 min",
            "equipment": [
              "Pentola"
            ],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Gyoza dal freezer + verdure saltate + salsa",
            "prepTime": "15 min",
            "equipment": [
              "Padella"
            ],
            "tag": "congelabile",
            "note": "",
            "cuisine": [
              "Giappone",
              "Cina"
            ]
          },
          "short": "Ven",
          "full": "Venerdì"
        },
        {
          "key": "sab",
          "session": "Sessione A · batch",
          "lunch": {
            "name": "Korma di pollo o verdure (base anacardi/yogurt, senza pomodoro, mite) + basmati + naan (planetaria, opz.)",
            "prepTime": "40 min",
            "equipment": [
              "Pentola",
              "Planetaria"
            ],
            "tag": "congelabile",
            "note": "Sugo congelabile. Cremosità da anacardi, niente acido di pomodoro.",
            "cuisine": [
              "India"
            ]
          },
          "dinner": {
            "name": "Tagliere + avanzi + verdure confit",
            "prepTime": "10 min",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Italia"
            ]
          },
          "short": "Sab",
          "full": "Sabato"
        },
        {
          "key": "dom",
          "session": "Domenica · sfizio",
          "lunch": {
            "name": "Carpaccio di manzo con rucola, grana e olio al limone + salmone saikyo-yaki (marinato al miso) al forno con schiacciata di patate alla punta di wasabi e asparagi",
            "prepTime": "35 min",
            "equipment": [
              "Forno",
              "Bimby"
            ],
            "tag": "fresco",
            "note": "Salmone al miso elegante e digeribile; wasabi per carattere.",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Leggera: riso saltato con gamberi e verdure",
            "prepTime": "15 min",
            "equipment": [
              "Padella"
            ],
            "tag": "fresco",
            "note": "",
            "cuisine": [
              "Cina"
            ]
          },
          "short": "Dom",
          "full": "Domenica"
        }
      ]
    },
    {
      "n": 3,
      "theme": "Giappone comfort + Cina leggera",
      "days": [
        {
          "key": "lun",
          "lunch": {
            "name": "Poke bowl (riso, pesce crudo o gambero cotto, edamame, avocado, carote, ponzu)",
            "prepTime": "15 min",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone"
            ]
          },
          "dinner": {
            "name": "Gyudon (manzo a striscioline glassato su riso) con cipollotto e uovo",
            "prepTime": "20 min",
            "equipment": [
              "Padella",
              "Cuociriso"
            ],
            "tag": "fresco",
            "note": "Comfort leggero, niente fritto.",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Lun",
          "full": "Lunedì"
        },
        {
          "key": "mar",
          "lunch": {
            "name": "Spaghetti freddi gomadare con edamame e zenzero",
            "prepTime": "15 min",
            "equipment": [
              "Pentola"
            ],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Oyakodon (pollo a bocconcini + uovo su riso, brodo dashi)",
            "prepTime": "20 min",
            "equipment": [
              "Padella"
            ],
            "tag": "fresco",
            "note": "Dashi dal freezer. Morbido ma con riso da masticare, brodo delicato.",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Mar",
          "full": "Martedì"
        },
        {
          "key": "mer",
          "session": "Sessione B · batch",
          "lunch": {
            "name": "Insalata di riso con tonno, edamame, mais, sesamo",
            "prepTime": "assemblaggio",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone"
            ]
          },
          "dinner": {
            "name": "Maiale saltato con verdure e salsa di soia + riso (stir-fry)",
            "prepTime": "20 min",
            "equipment": [
              "Padella",
              "Cuociriso"
            ],
            "tag": "fresco",
            "note": "Saltato veloce, verdure croccanti.",
            "cuisine": [
              "Cina"
            ]
          },
          "short": "Mer",
          "full": "Mercoledì"
        },
        {
          "key": "gio",
          "lunch": {
            "name": "Onigiri + edamame + insalata",
            "prepTime": "riso",
            "equipment": [
              "Cuociriso"
            ],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone"
            ]
          },
          "dinner": {
            "name": "Katsu di maiale o pollo in friggitrice con cavolo a julienne e salsa tonkatsu",
            "prepTime": "25 min",
            "equipment": [
              "Friggitrice"
            ],
            "tag": "fresco",
            "note": "Panato croccante ma cotto ad aria, non fritto.",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Gio",
          "full": "Giovedì"
        },
        {
          "key": "ven",
          "lunch": {
            "name": "Soba fredde con verdure e tsuyu",
            "prepTime": "15 min",
            "equipment": [
              "Pentola"
            ],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone"
            ]
          },
          "dinner": {
            "name": "Gyoza dal freezer + riso saltato veloce",
            "prepTime": "15 min",
            "equipment": [
              "Padella"
            ],
            "tag": "congelabile",
            "note": "",
            "cuisine": [
              "Giappone",
              "Cina"
            ]
          },
          "short": "Ven",
          "full": "Venerdì"
        },
        {
          "key": "sab",
          "session": "Sessione A · batch",
          "lunch": {
            "name": "Tagliata con salsa al miso, carote confit e patate",
            "prepTime": "20 min",
            "equipment": [
              "Padella",
              "Forno"
            ],
            "tag": "fresco",
            "note": "",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Tagliere + avanzi",
            "prepTime": "10 min",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Italia"
            ]
          },
          "short": "Sab",
          "full": "Sabato"
        },
        {
          "key": "dom",
          "session": "Domenica · sfizio",
          "lunch": {
            "name": "Tonno scottato in crosta di sesamo su letto di vellutata di piselli con verdurine glassate",
            "prepTime": "35 min",
            "equipment": [
              "Padella",
              "Bimby"
            ],
            "tag": "fresco",
            "note": "Vellutata come salsa sotto, non come piatto.",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Leggera: gamberi in tempura (friggitrice) con salsa e insalata",
            "prepTime": "20 min",
            "equipment": [
              "Friggitrice"
            ],
            "tag": "fresco",
            "note": "",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Dom",
          "full": "Domenica"
        }
      ]
    },
    {
      "n": 4,
      "theme": "Italia estiva + agrodolce e fusion",
      "days": [
        {
          "key": "lun",
          "lunch": {
            "name": "Pasta fredda alla genovese (pesto, fagiolini, patate)",
            "prepTime": "15 min",
            "equipment": [
              "Pentola"
            ],
            "tag": "assembla",
            "note": "Pesto, niente pomodoro.",
            "cuisine": [
              "Italia"
            ]
          },
          "dinner": {
            "name": "Arrosto alla menta con patate arrosto speziate + carote confit",
            "prepTime": "20 min + cottura",
            "equipment": [
              "Forno",
              "Roner"
            ],
            "tag": "fresco",
            "note": "Arrosto a fette congelabile. Cottura asciutta, più leggero di una pasta pasticciata.",
            "cuisine": [
              "Italia"
            ]
          },
          "short": "Lun",
          "full": "Lunedì"
        },
        {
          "key": "mar",
          "lunch": {
            "name": "Bowl con arrosto avanzo a fette, riso, rucola, salsa verde",
            "prepTime": "10 min",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Italia"
            ]
          },
          "dinner": {
            "name": "Filetto di pesce al cartoccio con limone, erbe e zucchine + patate novelle",
            "prepTime": "25 min",
            "equipment": [
              "Forno"
            ],
            "tag": "fresco",
            "note": "",
            "cuisine": [
              "Italia"
            ]
          },
          "short": "Mar",
          "full": "Martedì"
        },
        {
          "key": "mer",
          "session": "Sessione B · batch",
          "lunch": {
            "name": "Insalata di riso con gamberi, edamame, carote, sesamo",
            "prepTime": "assemblaggio",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone"
            ]
          },
          "dinner": {
            "name": "Polpette in agrodolce (friggitrice/padella) con riso e verdure saltate",
            "prepTime": "20 min",
            "equipment": [
              "Padella",
              "Friggitrice"
            ],
            "tag": "congelabile",
            "note": "Polpette dal freezer; agrodolce dallo stash. Air fryer.",
            "cuisine": [
              "Cina"
            ]
          },
          "short": "Mer",
          "full": "Mercoledì"
        },
        {
          "key": "gio",
          "lunch": {
            "name": "Spaghetti freddi gomadare con verdure",
            "prepTime": "15 min",
            "equipment": [
              "Pentola"
            ],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Gyoza dal freezer + insalata + salsa",
            "prepTime": "15 min",
            "equipment": [
              "Padella"
            ],
            "tag": "congelabile",
            "note": "",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Gio",
          "full": "Giovedì"
        },
        {
          "key": "ven",
          "lunch": {
            "name": "Pasta fredda con bottarga, limone e zucchine",
            "prepTime": "15 min",
            "equipment": [
              "Pentola"
            ],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Italia"
            ]
          },
          "dinner": {
            "name": "Pollo (cosce) teriyaki al forno/friggitrice con riso e fagiolini gomae",
            "prepTime": "25 min",
            "equipment": [
              "Forno",
              "Friggitrice"
            ],
            "tag": "fresco",
            "note": "Cosce glassate e saporite.",
            "cuisine": [
              "Giappone"
            ]
          },
          "short": "Ven",
          "full": "Venerdì"
        },
        {
          "key": "sab",
          "session": "Sessione A · batch",
          "lunch": {
            "name": "Vitello tonnato (make-ahead) con patate e capperi",
            "prepTime": "servizio 10 min",
            "equipment": [
              "Roner",
              "Bimby"
            ],
            "tag": "fresco",
            "note": "Make-ahead, freddo.",
            "cuisine": [
              "Italia"
            ]
          },
          "dinner": {
            "name": "Tagliere freddo + verdure confit + avanzi",
            "prepTime": "10 min",
            "equipment": [],
            "tag": "assembla",
            "note": "",
            "cuisine": [
              "Italia"
            ]
          },
          "short": "Sab",
          "full": "Sabato"
        },
        {
          "key": "dom",
          "session": "Domenica · sfizio fine dining",
          "lunch": {
            "name": "Crudo di pesce italo-giapponese (carpaccio, olio evo, agrumi, sale Maldon) + filetto di manzo scottato su letto di vellutata d'asparagi, carote confit e patate schiacciate",
            "prepTime": "40 min",
            "equipment": [
              "Roner",
              "Padella",
              "Bimby"
            ],
            "tag": "fresco",
            "note": "Il piatto composito: proteina + vellutata-salsa + contorni con consistenza.",
            "cuisine": [
              "Giappone",
              "Italia"
            ]
          },
          "dinner": {
            "name": "Leggera: riso saltato con uovo e verdure",
            "prepTime": "15 min",
            "equipment": [
              "Padella"
            ],
            "tag": "fresco",
            "note": "",
            "cuisine": [
              "Cina"
            ]
          },
          "short": "Dom",
          "full": "Domenica"
        }
      ]
    }
  ],
  "shopping": [
    {
      "n": 1,
      "sections": [
        {
          "reparto": "Ortofrutta",
          "items": [
            {
              "name": "Zenzero",
              "format": "1 radice",
              "use": "lun/mar/gio + smoothie"
            },
            {
              "name": "Carote",
              "format": "1 kg",
              "use": "confit lun/sab, poke/insalate"
            },
            {
              "name": "Zucchine",
              "format": "~600 g",
              "use": "cartoccio mar"
            },
            {
              "name": "Avocado",
              "format": "2",
              "use": "poke mer"
            },
            {
              "name": "Rucola",
              "format": "1 busta",
              "use": "tataki/tagliata"
            },
            {
              "name": "Fagiolini",
              "format": "500 g",
              "use": "gomae mer"
            },
            {
              "name": "Cipollotti",
              "format": "1 mazzo",
              "use": ""
            },
            {
              "name": "Lime / limoni",
              "format": "1 rete",
              "use": ""
            },
            {
              "name": "Patate",
              "format": "sacco 1,5 kg",
              "use": "sab + dom; avanzo contorni"
            },
            {
              "name": "Piselli surgelati",
              "format": "1 busta",
              "use": "dom"
            },
            {
              "name": "Insalata",
              "format": "2 buste",
              "use": ""
            },
            {
              "name": "Edamame surgelati",
              "format": "1 sacco 500 g",
              "use": "lun/mar/mer/gio + snack"
            },
            {
              "name": "Frutta",
              "format": "anguria/melone, pesche 1 kg, frutti di bosco 1 vaschetta",
              "use": ""
            }
          ]
        },
        {
          "reparto": "Pesce / carne",
          "items": [
            {
              "name": "Manzo per tataki/tagliata",
              "format": "~600 g",
              "use": "lun/sab"
            },
            {
              "name": "Macinato manzo o maiale",
              "format": "1 kg",
              "use": "polpette + gyoza, freezer"
            },
            {
              "name": "Orata",
              "format": "2 pz (~300 g)",
              "use": "mar"
            },
            {
              "name": "Salmone o tonno sashimi-grade",
              "format": "~300 g",
              "use": "poke mer"
            },
            {
              "name": "Branzino sashimi-grade + tonno",
              "format": "~400 g",
              "use": "dom"
            },
            {
              "name": "Gamberi",
              "format": "1 vaschetta ~300 g",
              "use": "gio"
            },
            {
              "name": "Fettine di maiale",
              "format": "~500 g",
              "use": "agrodolce gio"
            }
          ]
        },
        {
          "reparto": "Latticini / uova",
          "items": [
            {
              "name": "Uova",
              "format": "conf. 10",
              "use": "soba ven, riso saltato, dom"
            },
            {
              "name": "Grana",
              "format": "pezzo 200 g",
              "use": "dura settimane"
            },
            {
              "name": "Yogurt greco",
              "format": "500 g",
              "use": ""
            }
          ]
        },
        {
          "reparto": "Carboidrati",
          "items": [
            {
              "name": "Riso (per sushi/bowl)",
              "format": "1 kg",
              "use": ""
            },
            {
              "name": "Spaghetti",
              "format": "500 g",
              "use": ""
            },
            {
              "name": "Soba",
              "format": "1 conf.",
              "use": ""
            }
          ]
        }
      ],
      "leftover": "Edamame e riso girano su tutta la settimana; carote confit lun→sab; manzo lun→sab; patate sab→dom."
    },
    {
      "n": 2,
      "sections": [
        {
          "reparto": "Ortofrutta",
          "items": [
            {
              "name": "Zucchine",
              "format": "~800 g",
              "use": "lun/mer/ven"
            },
            {
              "name": "Carote",
              "format": "1 kg",
              "use": "confit mer, bowl mar/gio"
            },
            {
              "name": "Rucola",
              "format": "1 busta",
              "use": ""
            },
            {
              "name": "Menta",
              "format": "1 vaschetta",
              "use": "raita mar, mer, gio"
            },
            {
              "name": "Mandorle",
              "format": "1 conf.",
              "use": "mer/ven"
            },
            {
              "name": "Patate novelle",
              "format": "1 kg",
              "use": "lun/mer"
            },
            {
              "name": "Asparagi",
              "format": "1 mazzo",
              "use": "dom"
            },
            {
              "name": "Spinaci",
              "format": "1 busta",
              "use": "gio ohitashi"
            },
            {
              "name": "Limoni",
              "format": "1 rete",
              "use": ""
            },
            {
              "name": "Insalata",
              "format": "2 buste",
              "use": ""
            },
            {
              "name": "Edamame",
              "format": "scorta dalla sett. prec. o 1 sacco",
              "use": ""
            },
            {
              "name": "Frutta",
              "format": "melone, pesche/albicocche 1 kg, frutti di bosco",
              "use": ""
            }
          ]
        },
        {
          "reparto": "Pesce / carne",
          "items": [
            {
              "name": "Vitello (girello/magatello)",
              "format": "~500 g",
              "use": "tonnato lun"
            },
            {
              "name": "Cosce di pollo",
              "format": "~1 kg",
              "use": "tandoori mar + korma sab"
            },
            {
              "name": "Filetti di pesce",
              "format": "~500 g",
              "use": "mer"
            },
            {
              "name": "Macinato per polpette/gyoza",
              "format": "500 g",
              "use": ""
            },
            {
              "name": "Salmone",
              "format": "~400 g",
              "use": "saikyo dom"
            },
            {
              "name": "Gamberi",
              "format": "~300 g",
              "use": "dom"
            },
            {
              "name": "Manzo per carpaccio",
              "format": "~250 g",
              "use": "dom"
            }
          ]
        },
        {
          "reparto": "Latticini / uova",
          "items": [
            {
              "name": "Uova",
              "format": "conf. 6",
              "use": ""
            },
            {
              "name": "Primosale",
              "format": "200 g",
              "use": "mer"
            },
            {
              "name": "Yogurt greco",
              "format": "1 kg",
              "use": "tonnato/tandoori/raita/korma"
            }
          ]
        },
        {
          "reparto": "Carboidrati",
          "items": [
            {
              "name": "Riso basmati",
              "format": "1 kg",
              "use": ""
            },
            {
              "name": "Farro o orzo",
              "format": "500 g",
              "use": ""
            },
            {
              "name": "Spaghetti / soba",
              "format": "",
              "use": ""
            }
          ]
        }
      ],
      "leftover": "Vitello tonnato lun→mar; pollo tandoori mar→gio; yogurt copre 4 piatti; asparagi dom (resto in frittata/contorno)."
    },
    {
      "n": 3,
      "sections": [
        {
          "reparto": "Ortofrutta",
          "items": [
            {
              "name": "Carote",
              "format": "1 kg",
              "use": "poke lun, confit sab"
            },
            {
              "name": "Avocado",
              "format": "2",
              "use": "poke lun"
            },
            {
              "name": "Cipollotti",
              "format": "1 mazzo",
              "use": "gyudon lun"
            },
            {
              "name": "Cavolo cappuccio",
              "format": "1",
              "use": "katsu gio"
            },
            {
              "name": "Zenzero",
              "format": "1 radice",
              "use": ""
            },
            {
              "name": "Verdure miste da saltare (zucchine, carote, peperone per il wok)",
              "format": "~600 g",
              "use": "il peperone qui è per il saltato, non come contorno"
            },
            {
              "name": "Patate",
              "format": "sacco 1 kg",
              "use": "sab"
            },
            {
              "name": "Asparagi/piselli per vellutata dom",
              "format": "1 mazzo o 1 busta surgelati",
              "use": "dom"
            },
            {
              "name": "Insalata",
              "format": "2 buste",
              "use": ""
            },
            {
              "name": "Edamame",
              "format": "1 sacco",
              "use": ""
            },
            {
              "name": "Frutta",
              "format": "anguria, pesche 1 kg, banane",
              "use": ""
            }
          ]
        },
        {
          "reparto": "Pesce / carne",
          "items": [
            {
              "name": "Manzo a striscioline",
              "format": "~400 g",
              "use": "gyudon lun"
            },
            {
              "name": "Manzo per tagliata",
              "format": "~400 g",
              "use": "sab"
            },
            {
              "name": "Cosce di pollo",
              "format": "~500 g",
              "use": "oyakodon mar"
            },
            {
              "name": "Fettine di maiale",
              "format": "~600 g",
              "use": "stir-fry mer + katsu gio"
            },
            {
              "name": "Tonno sashimi-grade",
              "format": "~300 g",
              "use": "dom"
            },
            {
              "name": "Tonno in scatola",
              "format": "3×80 g",
              "use": "insalata mer"
            },
            {
              "name": "Gamberi",
              "format": "~300 g",
              "use": "tempura dom"
            },
            {
              "name": "Macinato per gyoza/polpette",
              "format": "500 g",
              "use": ""
            }
          ]
        },
        {
          "reparto": "Latticini / uova",
          "items": [
            {
              "name": "Uova",
              "format": "conf. 10",
              "use": "gyudon/oyakodon/riso saltato"
            },
            {
              "name": "Yogurt greco",
              "format": "500 g",
              "use": ""
            }
          ]
        },
        {
          "reparto": "Carboidrati",
          "items": [
            {
              "name": "Riso",
              "format": "1 kg",
              "use": ""
            },
            {
              "name": "Soba",
              "format": "",
              "use": ""
            },
            {
              "name": "Panko",
              "format": "da dispensa",
              "use": ""
            }
          ]
        }
      ],
      "leftover": "Riso e edamame su tutta la settimana; maiale mer→gio; manzo lun→sab; uova su 3 don/saltati."
    },
    {
      "n": 4,
      "sections": [
        {
          "reparto": "Ortofrutta",
          "items": [
            {
              "name": "Fagiolini",
              "format": "500 g",
              "use": "genovese lun, gomae ven"
            },
            {
              "name": "Patate",
              "format": "sacco 1,5 kg",
              "use": "lun/mar/sab"
            },
            {
              "name": "Carote",
              "format": "1 kg",
              "use": "confit, insalate"
            },
            {
              "name": "Zucchine",
              "format": "~600 g",
              "use": "cartoccio mar, pasta ven"
            },
            {
              "name": "Rucola",
              "format": "1 busta",
              "use": ""
            },
            {
              "name": "Basilico",
              "format": "1 vaso",
              "use": "pesto lun"
            },
            {
              "name": "Asparagi",
              "format": "1 mazzo",
              "use": "dom"
            },
            {
              "name": "Limoni",
              "format": "1 rete",
              "use": ""
            },
            {
              "name": "Insalata",
              "format": "2 buste",
              "use": ""
            },
            {
              "name": "Edamame",
              "format": "1 sacco",
              "use": ""
            },
            {
              "name": "Frutta",
              "format": "melone, pesche 1 kg, frutti di bosco",
              "use": ""
            }
          ]
        },
        {
          "reparto": "Pesce / carne",
          "items": [
            {
              "name": "Arrosto (girello/lonza)",
              "format": "~1 kg",
              "use": "lun + avanzi mar"
            },
            {
              "name": "Filetti di pesce",
              "format": "~500 g",
              "use": "mar"
            },
            {
              "name": "Cosce di pollo",
              "format": "~800 g",
              "use": "teriyaki ven"
            },
            {
              "name": "Vitello",
              "format": "~500 g",
              "use": "tonnato sab"
            },
            {
              "name": "Gamberi",
              "format": "~300 g",
              "use": "mer"
            },
            {
              "name": "Manzo per scottata/carpaccio",
              "format": "~400 g",
              "use": "dom"
            },
            {
              "name": "Macinato per gyoza/polpette",
              "format": "500 g",
              "use": ""
            }
          ]
        },
        {
          "reparto": "Latticini / uova",
          "items": [
            {
              "name": "Uova",
              "format": "conf. 6",
              "use": "riso saltato dom"
            },
            {
              "name": "Grana",
              "format": "scorta",
              "use": ""
            },
            {
              "name": "Pinoli",
              "format": "1 conf. piccola",
              "use": "pesto"
            },
            {
              "name": "Yogurt greco",
              "format": "1 kg",
              "use": "tonnato + colazioni"
            }
          ]
        },
        {
          "reparto": "Carboidrati",
          "items": [
            {
              "name": "Riso",
              "format": "1 kg",
              "use": ""
            },
            {
              "name": "Pasta corta",
              "format": "500 g",
              "use": ""
            },
            {
              "name": "Spaghetti",
              "format": "",
              "use": ""
            }
          ]
        }
      ],
      "leftover": "Arrosto lun→mar; pesto lun (resto congelabile); patate lun/mar/sab; fagiolini lun→ven."
    }
  ],
  "dispensa": {
    "base": {
      "title": "Dispensa di base",
      "note": "Una tantum, dura settimane.",
      "items": [
        "Olio evo",
        "Sale (anche in fiocchi tipo Maldon)",
        "Aceto di vino",
        "Miele",
        "Pasta / riso di scorta",
        "Avena",
        "Granola"
      ]
    },
    "fusion": {
      "title": "Dispensa fusion",
      "note": "Una tantum, lunga conservazione. Da qui in poi compri soprattutto deperibili.",
      "items": [
        "Salsa di soia",
        "Mirin",
        "Sake (o vino bianco per sfumare)",
        "Pasta di miso",
        "Aceto di riso",
        "Olio di sesamo",
        "Semi di sesamo",
        "Alga nori",
        "Dashi (granulare, o kombu + katsuobushi)",
        "Panko",
        "Bottarga",
        "Wasabi (tubetto)",
        "Anacardi",
        "Latte di cocco",
        "Spezie indiane (curry, garam masala, curcuma, cumino)",
        "Zucchero"
      ]
    }
  },
  "reference": [
    {
      "id": "criteri",
      "title": "Criteri",
      "kicker": "Come è pensato",
      "theme": "bento",
      "summary": "I quattro principi che reggono tutta la rotazione.",
      "blocks": [
        {
          "type": "list",
          "items": [
            {
              "t": "Anti-acidità e digeribilità",
              "d": "Poco o niente pomodoro cotto, niente fritto pesante (friggitrice ad aria), pochi grassi e niente panne pesanti, aglio e cipolla cotti. Sapore da umami e agrumi, non da acido o piccante."
            },
            {
              "t": "Texture",
              "d": "Piatti da masticare (scottature, tataki, katsu croccante, gyoza, verdure arrosto, noodles), niente sfilza di puree come piatto principale."
            },
            {
              "t": "Poco calore nei momenti caldi",
              "d": "Cottura concentrata in 2 sessioni batch; nei giorni roventi si assembla o si scalda 10–15 min."
            },
            {
              "t": "Freezer + anti-spreco",
              "d": "Pochi «mattoni» surgelati + uno stash di salse in frigo; ogni avanzo si chiude entro la settimana."
            }
          ]
        }
      ]
    },
    {
      "id": "batch",
      "title": "Strategia batch",
      "kicker": "Due sessioni, freezer pieno",
      "theme": "pozzetto",
      "summary": "I mattoni da congelare, lo stash di salse e le due sessioni di cottura.",
      "blocks": [
        {
          "type": "table",
          "title": "Mattoni del freezer",
          "cols": [
            "Mattone",
            "Attrezzatura",
            "Porziona",
            "Durata"
          ],
          "rows": [
            [
              "Gyoza (manzo o maiale + verza + zenzero) crudi",
              "Planetaria + a mano",
              "vassoio poi sacchetto",
              "1–2 mesi"
            ],
            [
              "Polpette neutre cotte (manzo/maiale) — le glassi al momento",
              "Friggitrice / forno",
              "sacchetti da 4–5",
              "3 mesi"
            ],
            [
              "Verdure / carote confit (cotte lente in olio e aromi)",
              "Forno / pentola",
              "vasetti",
              "frigo 1–2 sett. / freezer 2 mesi"
            ],
            [
              "Dashi / brodo leggero",
              "Bimby / pentola",
              "cubetti o sacchetti 250 ml",
              "6 mesi"
            ],
            [
              "Ragù bianco (no pomodoro: carne bianca o funghi)",
              "Bimby",
              "vaschette 300 g",
              "3 mesi"
            ],
            [
              "Pesto + salsa verde",
              "Bimby",
              "vasetti / cubetti",
              "3 mesi"
            ],
            [
              "Arrosto a fette (manzo/maiale)",
              "Forno / roner",
              "fette singole",
              "3 mesi"
            ]
          ]
        },
        {
          "type": "callout",
          "t": "Fresco (no freezer)",
          "d": "Riso del cuociriso, crudi/carpacci, insalate di cereali, frittate, verdure arrosto fresche, pesce in giornata."
        },
        {
          "type": "chips",
          "title": "Stash salse in frigo · 1–2 settimane",
          "items": [
            "Teriyaki leggera",
            "Glassa al miso",
            "Gomadare (sesamo)",
            "Ponzu (agrumi + soia)",
            "Tonkatsu",
            "Agrodolce",
            "Tonnato",
            "Salsa verde",
            "Yogurt-erbe"
          ]
        },
        {
          "type": "callout",
          "tag": "piccante",
          "t": "Piccante a parte",
          "d": "Rāyu (olio al peperoncino e sesamo), olio al peperoncino, peperoncini sott'aceto — sempre serviti a lato."
        },
        {
          "type": "list",
          "title": "Le due sessioni",
          "items": [
            {
              "t": "Sessione A · weekend (~2–2,5 h)",
              "d": "Giro di gyoza per il freezer, polpette neutre, verdure confit, dashi, un ragù bianco, l'arrosto, rabbocco salse."
            },
            {
              "t": "Sessione B · pomeriggio infrasettimanale (~1 h)",
              "d": "Riso/cereali per bowl e insalate, una proteina pronta, verdure fresche."
            }
          ]
        },
        {
          "type": "callout",
          "t": "Giorni roventi",
          "d": "Mattone dal freezer + riso/noodle già pronti + una verdura confit o cruda + una salsa dallo stash. Spesso zero fornelli."
        }
      ]
    },
    {
      "id": "conservazione",
      "title": "Conservazione & freezer",
      "kicker": "Pozzetto in ordine",
      "theme": "pozzetto",
      "summary": "Porzionatura, etichette, durate e scongelamento.",
      "blocks": [
        {
          "type": "list",
          "title": "Porzionatura",
          "items": [
            {
              "t": "Salse, dashi, ragù bianco",
              "d": "Sacchetti piatti: gelano in fretta e si impilano «ad archivio» nel pozzetto."
            },
            {
              "t": "Gyoza e polpette",
              "d": "Prima distese su vassoio, poi in sacchetto: non si attaccano, ne prendi quante ne servono."
            },
            {
              "t": "Mix di formati",
              "d": "Monoporzioni per i pranzi, da 3–4 per le cene."
            }
          ]
        },
        {
          "type": "callout",
          "t": "Etichettatura",
          "d": "Nome + data + n° porzioni (nastro di carta + pennarello). Categorie separate (gyoza/polpette · salse · arrosto · confit) e regola FIFO."
        },
        {
          "type": "table",
          "title": "Durate indicative",
          "cols": [
            "Mattone",
            "Durata"
          ],
          "rows": [
            [
              "Gyoza crudi",
              "1–2 mesi"
            ],
            [
              "Polpette cotte",
              "3 mesi"
            ],
            [
              "Verdure confit",
              "2 mesi freezer · 1–2 sett. frigo"
            ],
            [
              "Dashi / brodo",
              "6 mesi"
            ],
            [
              "Ragù bianco",
              "3 mesi"
            ],
            [
              "Pesto",
              "3 mesi"
            ],
            [
              "Arrosto a fette",
              "3 mesi"
            ],
            [
              "Pesce crudo abbattuto",
              "2–3 mesi"
            ],
            [
              "Salse (stash frigo)",
              "1–2 settimane"
            ]
          ]
        },
        {
          "type": "list",
          "title": "Scongelamento",
          "items": [
            {
              "t": "",
              "d": "In frigo la notte prima."
            },
            {
              "t": "",
              "d": "Gyoza e polpette si cuociono direttamente da congelate (vapore/padella)."
            },
            {
              "t": "",
              "d": "Salse e dashi direttamente in pentola o microonde."
            },
            {
              "t": "",
              "d": "Non ricongelare il crudo già scongelato."
            }
          ]
        },
        {
          "type": "callout",
          "t": "Cosa NON congelare",
          "d": "Crudi/carpacci (in giornata), insalate e foglie, riso lessato, avocado, patate lesse intere, latticini freschi."
        },
        {
          "type": "callout",
          "t": "Trucco «kit assembla»",
          "d": "Prepara qualche kit pranzo (riso + proteina + verdure + salsina in vaschette separate): nei giorni roventi apri e impiatti in 5 minuti senza accendere nulla."
        }
      ]
    },
    {
      "id": "digeribilita",
      "title": "Note di digeribilità",
      "kicker": "Perché funziona",
      "theme": "bento",
      "summary": "Perché i piatti meno ovvi restano leggeri e adatti al caldo.",
      "blocks": [
        {
          "type": "list",
          "items": [
            {
              "t": "Umami al posto del pomodoro",
              "d": "Miso, soia, dashi, sesamo, bottarga e parmigiano danno gusto pieno senza l'acidità del sugo."
            },
            {
              "t": "Tataki / crudi / carpacci",
              "d": "Cottura minima o assente, magri ed eleganti; gli agrumi sgrassano. Usa pesce sashimi-grade abbattuto."
            },
            {
              "t": "Air fryer per katsu, tempura, agrodolce",
              "d": "Croccantezza senza l'olio della frittura, molto più leggero sullo stomaco."
            },
            {
              "t": "Cosce di pollo marinate",
              "d": "Tandoori o teriyaki: saporite e succose, lontane dalla «tristezza» del petto."
            },
            {
              "t": "Korma senza pomodoro",
              "d": "Cremosità da anacardi e yogurt, speziatura mite: niente acido, niente bruciore."
            },
            {
              "t": "Vellutate come salsa-letto",
              "d": "La consistenza vellutata è solo un accompagnamento sotto una proteina con texture, mai il pasto."
            },
            {
              "t": "Carote / verdure confit",
              "d": "Cottura lenta e dolce, facilissime da digerire, contorno-firma riutilizzabile."
            },
            {
              "t": "Soba / spaghetti freddi",
              "d": "Rinfrescanti, il grano saraceno è leggero; le salse (sesamo, tsuyu) sono delicate."
            }
          ]
        }
      ]
    },
    {
      "id": "colazioni",
      "title": "Colazioni & spuntini",
      "kicker": "Per me, da solo",
      "theme": "laguna",
      "summary": "Colazioni e spuntini per una persona, gentili con lo stomaco.",
      "blocks": [
        {
          "type": "list",
          "title": "Colazioni",
          "items": [
            {
              "t": "",
              "d": "Yogurt greco + frutta estiva (pesche, melone, frutti di bosco) + avena/granola + miele."
            },
            {
              "t": "",
              "d": "Overnight oats (avena + yogurt/latte + frutta), pronti dalla sera."
            },
            {
              "t": "",
              "d": "Pane tostato + ricotta + miele o marmellata."
            },
            {
              "t": "",
              "d": "Smoothie (Bimby): yogurt, banana, frutti di bosco, avena — matcha opzionale."
            },
            {
              "t": "",
              "d": "Budino di chia con frutta."
            },
            {
              "t": "",
              "d": "Uovo morbido + pane nei giorni con più fame."
            }
          ]
        },
        {
          "type": "list",
          "title": "Spuntini",
          "items": [
            {
              "t": "",
              "d": "Frutta acquosa (anguria, melone, pesche)."
            },
            {
              "t": "",
              "d": "Edamame al volo (anche dal freezer, 5 min) con sale e sesamo."
            },
            {
              "t": "",
              "d": "Onigiri singolo (avanzo riso)."
            },
            {
              "t": "",
              "d": "Yogurt + miele; crackers + hummus."
            },
            {
              "t": "",
              "d": "Pane + bresaola."
            },
            {
              "t": "",
              "d": "Sorbetto/gelato Bimby (frutta congelata + yogurt + miele)."
            }
          ]
        },
        {
          "type": "callout",
          "t": "Note stomaco",
          "d": "Yogurt lenitivo; banana e avena gentili; evita troppi agrumi a stomaco vuoto; lo zenzero aiuta; idratati con frutta acquosa."
        }
      ]
    },
    {
      "id": "condimenti",
      "title": "Piccante a parte",
      "kicker": "Sempre a lato",
      "theme": "bento",
      "summary": "Il piccante non entra nei piatti: è un condimento a dose personale.",
      "blocks": [
        {
          "type": "p",
          "d": "Il profilo è umami e agrumi, non acido o piccante. Il peperoncino resta un condimento da aggiungere a parte, dose personale, così lo stomaco decide."
        },
        {
          "type": "list",
          "title": "Lo stash piccante",
          "items": [
            {
              "t": "Rāyu",
              "d": "Olio al peperoncino e sesamo, perfetto per il fusion."
            },
            {
              "t": "Olio al peperoncino",
              "d": ""
            },
            {
              "t": "Peperoncini sott'aceto",
              "d": ""
            }
          ]
        }
      ]
    }
  ],
  "filters": [
    {
      "id": "no-fritto",
      "label": "no fritto",
      "kw": [
        "fritto",
        "frittura"
      ]
    },
    {
      "id": "no-cipolla",
      "label": "no cipolla",
      "kw": [
        "cipolla",
        "cipollotto"
      ]
    },
    {
      "id": "no-aglio",
      "label": "no aglio",
      "kw": [
        "aglio"
      ]
    },
    {
      "id": "no-soffritto",
      "label": "no soffritto",
      "kw": [
        "soffritto"
      ]
    },
    {
      "id": "no-pomodoro",
      "label": "no pomodoro",
      "kw": [
        "pomodoro"
      ]
    },
    {
      "id": "no-piccante",
      "label": "no piccante",
      "kw": [
        "piccante",
        "peperoncino",
        "rāyu",
        "rayu",
        "wasabi"
      ]
    },
    {
      "id": "no-latticini",
      "label": "no latticini",
      "kw": [
        "grana",
        "parmigian",
        "yogurt",
        "primosale",
        "ricotta",
        "latte",
        "burro",
        "raita",
        "scaglie",
        "formaggio",
        "mozzarella"
      ]
    }
  ],
  "equipment": [
    "Forno",
    "Friggitrice",
    "Bimby",
    "Cuociriso",
    "Planetaria",
    "Roner",
    "Padella",
    "Pentola"
  ],
  "cuisines": [
    "Giappone",
    "Italia",
    "India",
    "Cina"
  ]
};
