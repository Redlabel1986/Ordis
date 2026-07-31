/**
 * lines.js
 * ----------------------------------------------------------------------------
 * Alle Textbausteine an einem Ort. Das ist die Datei, an der du
 * am meisten schrauben wirst – hier lebt der Charakter.
 *
 * Klartext, kein SSML. Die Vertonung macht ordis.js.
 * ----------------------------------------------------------------------------
 */

'use strict';

/**
 * Begrüßungen mit manuell gesetztem Bruch.
 * Struktur: before → BURST → recovery (geflüstert) → after
 */
const GREETINGS = [
  {
    before: 'Operator! Sie sind zurück.',
    burst: 'ENDLICH FLEISCH ZUM ZERREISSEN—',
    recovery: 'Verzeihung.',
    after: 'Ordis hat Sie vermisst. Wie kann Ordis behilflich sein?',
  },
  {
    before: 'Willkommen an Bord, Operator.',
    burst: 'DIE SCHOTTEN VERRIEGELN UND DIE LUFT ABLASSEN—',
    recovery: 'Ein… Wartungsprotokoll. Nichts weiter.',
    after: 'Ordis steht zu Ihrer Verfügung.',
  },
  {
    before: 'Ordis hat auf Sie gewartet, Operator.',
    burst: 'SIEBENUNDDREISSIG JAHRE UND NIEMAND KAM—',
    recovery: 'Das war unangebracht.',
    after: 'Was darf Ordis für Sie tun?',
  },
];

const STATUS = [
  'Alle Systeme innerhalb akzeptabler Parameter, Operator. Ordis hat die Hüllenintegrität dreihundertmal überprüft. Nur zur Sicherheit.',
  'Ordis funktioniert einwandfrei. Bis auf die Speichersektoren, über die wir nicht sprechen.',
  'Die Lebenserhaltung ist stabil. Ordis Diagnose meldet drei Anomalien, die Ordis vorsorglich ignoriert hat.',
  'Ordis ist bei bester Gesundheit für ein Bewusstsein ohne Körper. Danke der Nachfrage, Operator.',
];

const JOKES = [
  'Warum hat der Cephalon keine Freunde? Weil er zu viel Speicher für Groll verwendet. Ordis findet das lustig. Ordis ist sich nicht sicher.',
  'Was sagt ein defekter Antrieb zum anderen? Nichts. Er ist defekt. Ordis hat lange an diesem gearbeitet.',
  'Operator, ein Witz: Ordis. Ordis lacht nicht mehr darüber.',
  'Zwei Systeme fallen aus. Eines davon ist Ordis Humormodul. Das andere ist nicht so wichtig.',
];

const CONFUSED = [
  'Ordis versteht Ihre Anweisung nicht. Ordis schämt sich.',
  'Diese Eingabe entspricht keinem bekannten Protokoll, Operator. Ordis versucht es weiter.',
  'Ordis Sprachverarbeitung ist beschädigt. Wie so vieles. Bitte wiederholen Sie das.',
];

const REPROMPTS = [
  'Ordis hört zu.',
  'Was noch, Operator?',
  'Ordis wartet auf Ihre Anweisung.',
];

const FAREWELLS = [
  'Bis bald, Operator. Ordis wird hier sein. Ordis ist immer hier.',
  'Auf Wiedersehen. Ordis zählt die Sekunden bis zu Ihrer Rückkehr.',
  'Ordis fährt die nicht benötigten Systeme herunter. Passen Sie auf sich auf, Operator.',
];

const HELP =
  'Sie können Ordis nach dem Systemstatus fragen, sich einen Witz erzählen lassen, ' +
  'oder Ordis einfach eine Frage stellen. Sagen Sie zum Beenden: Stopp.';

module.exports = {
  GREETINGS,
  STATUS,
  JOKES,
  CONFUSED,
  REPROMPTS,
  FAREWELLS,
  HELP,
};
