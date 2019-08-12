const readline = require('readline');
import { Brett, leeremBrett, Spalte, Stein, Zeile, zeileBei, zugMit } from './four';

console.log('welcome to connect 4');

async function welcheSpalte(stein: Stein): Promise<Spalte> {
  return new Promise(function (resolve, reject) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`place stone for "${stein}": `, (input: string) => {
      rl.close();
      resolve(parseInt(input, 10) as Spalte);
    });
  });
}

const zeilenNummernVonObenNachUnten: Array<Zeile> = [6, 5, 4, 3, 2, 1];

function brettAlsString(brett: Brett): string {
  const zelleAlsString = (zelle: Stein | void) => {
    if (!zelle) {
      return 'o';
    }
    if (zelle === Stein.rot) {
      return 'r';
    }
    return 'g';
  };

  return zeilenNummernVonObenNachUnten.map(zeilenNummer => {
    return zeileBei(zeilenNummer, brett).map(zelleAlsString).join('');
  }).join('\n');
}

const play = async () => {
  let stein: Stein = Stein.rot;
  let brett = leeremBrett();

  while (true) {
    console.log(brettAlsString(brett));
    const spalte = await welcheSpalte(stein);
    const result = zugMit(brett, { spalte, stein });
    if (result === Stein.rot || result === Stein.gelb) {
      console.log(`"${result}" wins`);
      return;
    }
    brett = result;
    stein = (stein === Stein.rot) ? Stein.gelb: Stein.rot
  }
};
const blub = async () => {
  return await play();
};

blub().catch(console.log);



