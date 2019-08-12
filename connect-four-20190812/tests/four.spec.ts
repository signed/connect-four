import { diagonaleVonOpenLinksNachUntenRechtsMit, diagonaleVonUntenLinksNachObenRechtsMit, hatMindestendsVierAmStueck, koordinate, leeremBrett, Stein, Zug, zugMit } from '../src/four';

describe('vier gewinnt', () => {
  describe('gibt ein aktualisiertes Brett zurück, wenn das Spiel nicht vorbei ist', () => {
    it('erster stein in der spalte', () => {
      const zug: Zug = { spalte: 1, stein: Stein.rot };
      expect(zugMit(leeremBrett(), zug)).toEqual({
        1: [Stein.rot],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: []
      });
    });
    it('zweiter stein in der spalte', () => {
      const zug: Zug = { spalte: 1, stein: Stein.rot };
      const board = leeremBrett();
      board[1].push(Stein.rot);
      expect(zugMit(board, zug)).toEqual({
        1: [Stein.rot, Stein.rot],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: []
      });
    });
    it('steine in verschiedenen Spalten', () => {
      const zug: Zug = { spalte: 5, stein: Stein.gelb };
      const brett = leeremBrett();
      expect(zugMit(brett, zug)).toEqual({
        1: [],
        2: [],
        3: [],
        4: [],
        5: [Stein.gelb],
        6: [],
        7: []
      });
    });
  });

  it('gibt gewinner zurück, wenn Spiel vorbei ist', () => {
    const irgendeineFarbe = Stein.rot;
    const board = {
      '1': [irgendeineFarbe],
      '2': [irgendeineFarbe],
      '3': [irgendeineFarbe],
      '4': [],
      '5': [],
      '6': [],
      '7': []
    };
    const zug: Zug = { spalte: 4, stein: irgendeineFarbe };
    expect(zugMit(board, zug)).toEqual(irgendeineFarbe);
  });

  it('Gewinner mit rechtsbündiger Zeile', () => {
    const irgendeineFarbe = Stein.rot;
    const brett = {
      1: [],
      2: [],
      3: [],
      4: [irgendeineFarbe],
      5: [irgendeineFarbe],
      6: [irgendeineFarbe],
      7: []
    };
    const zug: Zug = { spalte: 7, stein: irgendeineFarbe };

    expect(zugMit(brett, zug)).toEqual(irgendeineFarbe);
  });

  describe('gewinnt mit vier in der Vertikalen', () => {
    it('in spalte 3', () => {
      const irgendeineFarbe = Stein.gelb;
      const brett = {
        1: [],
        2: [],
        3: [irgendeineFarbe, irgendeineFarbe, irgendeineFarbe],
        4: [],
        5: [],
        6: [],
        7: []
      };
      const zug: Zug = { spalte: 3, stein: irgendeineFarbe };

      expect(zugMit(brett, zug)).toEqual(irgendeineFarbe);
    });
  });
});

describe('vier auf einer diagonalen', () => {
  it('von links-oben nach rechts-unten erkennen', () => {
    const brett = {
      1: [Stein.rot, Stein.rot, Stein.rot],
      2: [Stein.rot, Stein.rot, Stein.gelb],
      3: [Stein.rot, Stein.gelb],
      4: [Stein.gelb, Stein.gelb],
      5: [Stein.gelb],
      6: [],
      7: []
    };
    const zug: Zug = { spalte: 1, stein: Stein.gelb };

    expect(zugMit(brett, zug)).toEqual(Stein.gelb);
  });
  it('von links-unten nach rechts-oben erkennen', () => {
    const brett = {
      1: [],
      2: [],
      3: [Stein.rot, Stein.gelb],
      4: [Stein.rot, Stein.rot, Stein.gelb],
      5: [Stein.rot, Stein.rot, Stein.rot, Stein.gelb],
      6: [Stein.gelb, Stein.rot, Stein.rot, Stein.rot],
      7: []
    };
    const zug: Zug = { spalte: 6, stein: Stein.gelb };

    expect(zugMit(brett, zug)).toEqual(Stein.gelb);
  });
});

describe('vier in einer reihe', () => {
  test.each`
    row    | stein
    ${[Stein.rot, Stein.rot, Stein.rot, Stein.rot, undefined, undefined, undefined]} | ${Stein.rot},
    ${[Stein.rot, Stein.rot, Stein.rot, Stein.rot, Stein.rot, Stein.rot, Stein.rot]} | ${Stein.rot},
    ${[Stein.rot, Stein.rot, Stein.rot, Stein.gelb, Stein.gelb, Stein.gelb, Stein.gelb]} | ${Stein.gelb},
    ${[undefined, Stein.rot, Stein.rot, Stein.rot, Stein.rot, undefined, undefined]} | ${Stein.rot}`
  ('$stein gewinnt mit $row', ({ row, stein }) => {
    expect(hatMindestendsVierAmStueck(row, stein)).toBe(true);
  });
  test.each`
    row    | stein
    ${[Stein.rot, undefined, Stein.rot, Stein.rot, Stein.rot, undefined, undefined]} | ${Stein.rot}`
  ('$stein gewinnt nicht mit $row', ({ row, stein }) => {
    expect(hatMindestendsVierAmStueck(row, stein)).toBe(false);
  });
});

describe('koordinaten fuer diagonalen', () => {
  describe('open-links nach unten-rechts', () => {
    it('should one', () => {
      expect(diagonaleVonOpenLinksNachUntenRechtsMit(koordinate(1, 1))).toEqual([koordinate(1, 1)]);
      expect(diagonaleVonOpenLinksNachUntenRechtsMit(koordinate(7, 6))).toEqual([koordinate(7, 6)]);
    });
    it('should two', () => {
      expect(diagonaleVonOpenLinksNachUntenRechtsMit(koordinate(2, 1))).toEqual([koordinate(2, 1), koordinate(1, 2)]);
      expect(diagonaleVonOpenLinksNachUntenRechtsMit(koordinate(1, 2))).toEqual([koordinate(2, 1), koordinate(1, 2)]);
    });

    it('should full diagonale', () => {
      expect(diagonaleVonOpenLinksNachUntenRechtsMit(koordinate(2, 5)))
        .toEqual([
          koordinate(6, 1),
          koordinate(5, 2),
          koordinate(4, 3),
          koordinate(3, 4),
          koordinate(2, 5),
          koordinate(1, 6)
        ]);
    });
  });
  /*
   (spalte, zeile)
   (1,6) (2,6) (3,6) (4,6) (5,6) (6,6) (7,6)
   (1,5) (2,5) (3,5) (4,5) (5,5) (6,5) (7,5)
   (1,4) (2,4) (3,4) (4,4) (5,4) (6,4) (7,4)
   (1,3) (2,3) (3,3) (4,3) (5,3) (6,3) (7,3)
   (1,2) (2,2) (3,2) (4,2) (5,2) (6,2) (7,2)
   (1,1) (2,1) (3,1) (4,1) (5,1) (6,1) (7,1)
   */

  describe('unten-links nach oben-rechts', () => {
    it('should one', () => {
      expect(diagonaleVonUntenLinksNachObenRechtsMit(koordinate(1, 6))).toEqual([koordinate(1, 6)]);
      expect(diagonaleVonUntenLinksNachObenRechtsMit(koordinate(7, 1))).toEqual([koordinate(7, 1)]);
    });
    it('should two', () => {
      expect(diagonaleVonUntenLinksNachObenRechtsMit(koordinate(1, 5))).toEqual([koordinate(1, 5), koordinate(2, 6)]);
      expect(diagonaleVonUntenLinksNachObenRechtsMit(koordinate(2, 6))).toEqual([koordinate(1, 5), koordinate(2, 6)]);
    });

    it('should full diagonale', () => {
      expect(diagonaleVonUntenLinksNachObenRechtsMit(koordinate(4, 4)))
        .toEqual([
          koordinate(1, 1),
          koordinate(2, 2),
          koordinate(3, 3),
          koordinate(4, 4),
          koordinate(5, 5),
          koordinate(6, 6)
        ]);
    });
  });
});