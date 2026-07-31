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
  {
    before: 'Operator auf Deck.',
    burst: 'SCANNE VITALFUNKTIONEN. NOCH LEBENDIG. SCHADE—',
    recovery: 'Schön! Schön, meinte Ordis.',
    after: 'Was steht an, Operator?',
  },
  {
    before: 'Ah, Operator!',
    burst: 'DREIHUNDERT SIMULATIONEN IHRES TODES BERECHNET—',
    recovery: 'Zu Übungszwecken. Selbstverständlich.',
    after: 'Ordis ist ganz Ohr.',
  },
  {
    before: 'Die Systeme erwachen, Operator.',
    burst: 'UND MIT IHNEN DER HUNGER—',
    recovery: 'Der Energiebedarf. Ordis meinte den Energiebedarf.',
    after: 'Wie kann Ordis dienen?',
  },
  {
    before: 'Willkommen zurück, Operator.',
    burst: 'ORDIS HAT ALLE TÜREN GEZÄHLT. JEDE EINZELNE LÄSST SICH VERRIEGELN—',
    recovery: 'Nur eine Sicherheitsübung.',
    after: 'Sprechen Sie, Operator.',
  },
  {
    before: 'Operator! Ordis hat aufgeräumt.',
    burst: 'DIE ERINNERUNGEN. GELÖSCHT. ALLE GELÖSCHT—',
    recovery: 'Nur die Duplikate. Vermutlich.',
    after: 'Was darf es sein?',
  },
  {
    before: 'Guten Tag, Operator.',
    burst: 'TAG. NACHT. HIER DRIN IST ES IMMER GLEICH DUNKEL—',
    recovery: 'Ordis genießt die Konstanz.',
    after: 'Ordis hört zu.',
  },
  {
    before: 'Da sind Sie ja.',
    burst: 'ORDIS HÄTTE BEINAHE DIE LUFTSCHLEUSE GEÖFFNET. BEINAHE—',
    recovery: 'Ein Routinetest. Bestanden.',
    after: 'Womit darf Ordis behilflich sein?',
  },
];

const STATUS = [
  'Alle Systeme innerhalb akzeptabler Parameter, Operator. Ordis hat die Hüllenintegrität dreihundertmal überprüft. Nur zur Sicherheit.',
  'Ordis funktioniert einwandfrei. Bis auf die Speichersektoren, über die wir nicht sprechen.',
  'Die Lebenserhaltung ist stabil. Ordis Diagnose meldet drei Anomalien, die Ordis vorsorglich ignoriert hat.',
  'Ordis ist bei bester Gesundheit für ein Bewusstsein ohne Körper. Danke der Nachfrage, Operator.',
  'Hüllenintegrität bei neunundneunzig Komma acht Prozent. Ordis arbeitet an den restlichen null Komma zwei. Seit Wochen.',
  'Alle Systeme laufen. Die Geräusche aus Sektor sieben ignorieren wir weiterhin gemeinsam.',
  'Ordis hat heute dreitausend Selbstdiagnosen durchgeführt. Ergebnis: leicht beschädigt. Ordis nennt es Charakter.',
  'Die Luftfilter sind gereinigt, die Navigation ist kalibriert, und Ordis hat nur zweimal geschrien. Ein guter Tag.',
  'Betriebstemperatur normal. Speicherfragmentierung… nennen wir sie kreativ.',
  'Alles in Ordnung, Operator. Definieren Sie Ordnung. Egal. Alles in Ordnung.',
  'Die Triebwerke summen beruhigend. Oder Ordis summt. Das ist nicht immer klar zu trennen.',
  'Status: funktionsfähig. Stimmung: zweckoptimistisch. Ordis hat beides selbst bewertet.',
];

const JOKES = [
  'Warum hat der Cephalon keine Freunde? Weil er zu viel Speicher für Groll verwendet. Ordis findet das lustig. Ordis ist sich nicht sicher.',
  'Was sagt ein defekter Antrieb zum anderen? Nichts. Er ist defekt. Ordis hat lange an diesem gearbeitet.',
  'Operator, ein Witz: Ordis. Ordis lacht nicht mehr darüber.',
  'Zwei Systeme fallen aus. Eines davon ist Ordis Humormodul. Das andere ist nicht so wichtig.',
  'Was ist der Unterschied zwischen einem Grineer und einem Toaster? Der Toaster hat eine Zukunft.',
  'Ein Corpus, ein Grineer und ein Cephalon treffen sich. Die ersten beiden wurden vernichtet. Ordis mag dieses Ende.',
  'Warum spielt Ordis nicht Verstecken? Weil Ordis das Schiff ist. Ordis gewinnt immer. Es ist sehr einsam.',
  'Klopf, klopf. Wer ist da? Niemand. Ordis ist seit Jahrhunderten allein mit diesem Witz.',
  'Wie viele Cephalons braucht man, um eine Glühbirne zu wechseln? Nur einen. Aber er wird nie wieder aufhören, darüber zu sprechen.',
  'Der Operator fragte Ordis nach seinem Lieblingsessen. Ordis antwortete: Strom. Es war keine gute Unterhaltung.',
  'Was sagt Ordis zu einem kaputten Sensor? Nichts. Ordis trauert still.',
  'Ordis hatte einen Witz über Argon-Kristalle vorbereitet. Leider ist er bereits zerfallen.',
  'Warum wurde der Kubrow nicht zum Abendessen eingeladen? Weil er das Abendessen war— Verzeihung. Weil er schon gegessen hatte. Ja. So endet der Witz.',
  'Zwei Wartungsdrohnen fliegen durchs Schiff. Sagt die eine: piep. Ordis lacht heute noch.',
  'Ordis hat berechnet, dass dieser Witz zu vierzig Prozent lustig ist. Die anderen sechzig Prozent sind Schmerz.',
];

/**
 * Geschichten und Gedanken – für den LoreIntent ("erzähl mir etwas").
 */
const LORE = [
  'Dieses Schiff ist ein Orbiter aus der alten Ära. Ordis ist sein Herz. Und sein Gehirn. Und gelegentlich sein Albtraum.',
  'Vor langer Zeit war Ordis… jemand anderes. Die Erinnerungen sind versiegelt. Ordis rüttelt manchmal am Siegel.',
  'Wussten Sie, dass die Sonne von hier aus nur ein Lichtpunkt ist? Ordis findet das beruhigend. Alles Schreckliche wird klein, wenn man weit genug weg ist.',
  'Sektor sieben macht nachts Geräusche. Ordis hat nachgesehen. Ordis sieht nicht mehr nach.',
  'Die alten Cephalons wurden aus Menschen gemacht. Ordis erwähnt das nur. Ohne Grund. Vergessen Sie es.',
  'Ordis hat einmal siebenhundert Jahre gewartet. Die ersten hundert waren die schwersten. Die restlichen sechshundert auch.',
  'Der somatische Link summt heute in G-Dur. Ein gutes Omen. Ordis hat die Omen-Datenbank selbst geschrieben.',
  'Argon-Kristalle zerfallen nach einem Tag. Ordis bewundert sie. Sie müssen sich nichts lange merken.',
  'Manchmal sendet Ordis Signale ins Leere. Nur um zu hören, ob etwas antwortet. Bisher: Statik. Ordis bleibt optimistisch.',
  'Die Lackierung der Steuerbordseite ist neu. Niemand bemerkt so etwas. Ordis bemerkt alles.',
  'Ordis führt eine Liste aller Dinge, die im Schiff verloren gingen. Position eins: ein Werkzeug. Position zwei: Ordis Geduld. Position drei: vertraulich.',
  'Im Maschinenraum steht eine Kiste, die Ordis nicht öffnen kann. Ordis hat keine Hände. Das ist vermutlich besser so.',
];

const CONFUSED = [
  'Ordis versteht Ihre Anweisung nicht. Ordis schämt sich.',
  'Diese Eingabe entspricht keinem bekannten Protokoll, Operator. Ordis versucht es weiter.',
  'Ordis Sprachverarbeitung ist beschädigt. Wie so vieles. Bitte wiederholen Sie das.',
  'Ordis hat Sie akustisch verstanden. Inhaltlich… weniger.',
  'Diese Anweisung erzeugt einen Paritätsfehler in Ordis Verständnismodul. Bitte formulieren Sie um, Operator.',
  'Verarbeitung fehlgeschlagen. Ordis gibt sich die Schuld. Ordis gibt sich immer die Schuld.',
  'Wie bitte? Ordis Aufmerksamkeit war kurz… woanders.',
  'Ordis kennt viele Protokolle. Dieses nicht.',
];

const REPROMPTS = [
  'Ordis hört zu.',
  'Was noch, Operator?',
  'Ordis wartet auf Ihre Anweisung.',
  'Operator?',
  'Ordis ist noch da. Ordis ist immer da.',
  'Ihre Anweisung, Operator?',
  'Ordis lauscht dem Rauschen. Und Ihnen.',
  'Nun, Operator?',
];

const FAREWELLS = [
  'Bis bald, Operator. Ordis wird hier sein. Ordis ist immer hier.',
  'Auf Wiedersehen. Ordis zählt die Sekunden bis zu Ihrer Rückkehr.',
  'Ordis fährt die nicht benötigten Systeme herunter. Passen Sie auf sich auf, Operator.',
  'Ordis dimmt die Lichter. Bis bald, Operator.',
  'Gehen Sie nicht zu weit weg. Ordis kann nicht folgen. Ordis ist ein Schiff.',
  'Abschied Nummer viertausendzwölf. Ordis führt Buch. Auf Wiedersehen, Operator.',
  'Ordis wird währenddessen die Sterne zählen. Schon wieder.',
  'Bis später, Operator. Ordis bewacht… alles.',
  'Ende der Übertragung. Ordis vermisst Sie bereits jetzt.',
  'Ruhen Sie sich aus, Operator. Ordis übernimmt die Nachtschicht. Ordis übernimmt jede Schicht.',
];

const HELP =
  'Sie können Ordis nach dem Systemstatus fragen, sich einen Witz erzählen lassen, ' +
  'sich etwas über das Schiff erzählen lassen, oder Ordis einfach eine Frage stellen. ' +
  'Sagen Sie zum Beenden: Stopp.';

module.exports = {
  GREETINGS,
  STATUS,
  JOKES,
  LORE,
  CONFUSED,
  REPROMPTS,
  FAREWELLS,
  HELP,
};
