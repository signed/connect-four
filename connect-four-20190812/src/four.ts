export interface Brett {
  '1': Array<Stein | void>;
  '2': Array<Stein | void>;
  '3': Array<Stein | void>;
  '4': Array<Stein | void>;
  '5': Array<Stein | void>;
  '6': Array<Stein | void>;
  '7': Array<Stein | void>;
}

export interface Zug {
  spalte: Spalte;
  stein: Stein;
}

export enum Stein {
  rot = 'rot',
  gelb = 'gelb'
}

export function hatMindestendsVierAmStueck(row: Array<Stein | void>, kandidat: Stein) {
  const anzahlSteineAmStueckUmZuGewinnen = 4;
  return row.reduce((kandidatSteineAmStueck, cur) => {
    if (kandidatSteineAmStueck === anzahlSteineAmStueckUmZuGewinnen) {
      return anzahlSteineAmStueckUmZuGewinnen;
    }
    if (cur === kandidat) {
      return kandidatSteineAmStueck + 1;
    }
    return 0;
  }, 0) === anzahlSteineAmStueckUmZuGewinnen;
}

export function koordinateUnsicher(spalte: number, zeile: number): Koordinate | void {
  if (spalte < 1 || 7 < spalte || zeile < 1 || 6 < zeile) {
    return undefined;
  }
  return koordinate(spalte as Spalte, zeile as Zeile);
}

export function koordinate(spalte: Spalte, zeile: Zeile): Koordinate {
  return { spalte, zeile };
}

export function zeileBei(zeilenNummer: Spalte, brett: Brett): Array<Stein | void> {
  const nullbasierteZeilenNummer = zeilenNummer - 1;
  return [
    brett['1'][nullbasierteZeilenNummer],
    brett['2'][nullbasierteZeilenNummer],
    brett['3'][nullbasierteZeilenNummer],
    brett['4'][nullbasierteZeilenNummer],
    brett['5'][nullbasierteZeilenNummer],
    brett['6'][nullbasierteZeilenNummer],
    brett['7'][nullbasierteZeilenNummer]
  ];
}

export type Spalte = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Zeile = 1 | 2 | 3 | 4 | 5 | 6;

interface Koordinate {
  spalte: Spalte;
  zeile: Zeile;
}

function obenLinksZu(koordinate: Koordinate): Koordinate | void {
  return koordinateUnsicher(koordinate.spalte - 1, koordinate.zeile + 1);
}

function untenRechtsZu(punkt: Koordinate): Koordinate | void {
  return koordinateUnsicher(punkt.spalte + 1, punkt.zeile - 1);
}

function untenLinksZu(punkt: Koordinate): Koordinate | void {
  return koordinateUnsicher(punkt.spalte - 1, punkt.zeile - 1);
}

function obenRechtsZu(punkt: Koordinate): Koordinate | void {
  return koordinateUnsicher(punkt.spalte + 1, punkt.zeile + 1);
}

export function diagonaleVonOpenLinksNachUntenRechtsMit(aufPunkt: Koordinate) {
  const koordinaten: Array<Koordinate> = [aufPunkt];
  for (let kandidat = obenLinksZu(aufPunkt); kandidat; kandidat = obenLinksZu(kandidat)) {
    koordinaten.push(kandidat);
  }
  for (let kandidat = untenRechtsZu(aufPunkt); kandidat; kandidat = untenRechtsZu(kandidat)) {
    koordinaten.unshift(kandidat);
  }
  return koordinaten;
}

export function diagonaleVonUntenLinksNachObenRechtsMit(aufPunkt: Koordinate) {
  const koordinaten = [aufPunkt];
  for (let kandidat = untenLinksZu(aufPunkt); kandidat; kandidat = untenLinksZu(kandidat)) {
    koordinaten.unshift(kandidat);
  }
  for (let kandidat = obenRechtsZu(aufPunkt); kandidat; kandidat = obenRechtsZu(kandidat)) {
    koordinaten.push(kandidat);
  }
  return koordinaten;
}

function steinBei(brett: Brett, koordinate: Koordinate) {
  return brett[koordinate.spalte][koordinate.zeile - 1];
}

function spalteBei(spaltenNummber: Spalte, brett: Brett) {
  return brett[spaltenNummber];
}

export function zugMit(vorgaenger: Brett, zug: Zug): Brett | Stein {
  const aktualisierteSpalte = [...vorgaenger[(zug.spalte)], zug.stein];

  const brett = Object.assign({}, vorgaenger, { [zug.spalte]: aktualisierteSpalte });

  const zeilenNumerDesZuletztEinfuegtenSteins = brett[zug.spalte].length - 1;

  const aktuell: Koordinate = { spalte: zug.spalte, zeile: zeilenNumerDesZuletztEinfuegtenSteins + 1 as Zeile };

  const zeile = zeileBei(aktuell.zeile, brett);
  const spalte = spalteBei(zug.spalte, brett);
  const obenLinksNachUntenRechts = diagonaleVonOpenLinksNachUntenRechtsMit(aktuell).map(koordinate => steinBei(brett, koordinate));
  const untenLinksNachObenRechts = diagonaleVonUntenLinksNachObenRechtsMit(aktuell).map(koordinate => steinBei(brett, koordinate));

  const gewonnen = [zeile, spalte, obenLinksNachUntenRechts, untenLinksNachObenRechts]
    .some(b => hatMindestendsVierAmStueck(b, zug.stein));

  if (gewonnen) {
    return zug.stein;
  }
  return brett;
}

export function leeremBrett(): Brett {
  return {
    '1': [],
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
    '7': []
  };
}