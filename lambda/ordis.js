/**
 * ordis.js
 * ----------------------------------------------------------------------------
 * SSML-/Persönlichkeits-Engine für einen beschädigten Cephalon.
 *
 * Kernidee: Der Charakter entsteht zu ~70 % aus dem Sprachmuster
 * (Selbstunterbrechung, Dritte Person, abruptes Kippen ins Aggressive,
 * sofortige Korrektur) und nur zu ~30 % aus der Klangfarbe.
 *
 * Diese Datei erzeugt aus reinem Text fertiges SSML.
 * ----------------------------------------------------------------------------
 */

'use strict';

// ---------------------------------------------------------------------------
// Konfiguration – hier schraubst du am Klang
// ---------------------------------------------------------------------------

const CONFIG = {
  // Polly-Stimme für de-DE. Verfügbar im <voice>-Tag: Hans, Marlene, Vicki.
  // Setze auf null, um Alexas Standardstimme zu benutzen.
  voice: 'Hans',

  // Grundklang der "ruhigen" Ordis-Stimme
  basePitch: '-12%',
  baseRate: '96%',

  // Klang des Ausbruchs
  burstPitch: '+28%',
  burstRate: '125%',
  burstVolume: 'x-loud',

  // Wahrscheinlichkeit (0..1), dass ein Satz von einem Ausbruch
  // unterbrochen wird. 0.35 fühlt sich gut an – häufig genug, um
  // aufzufallen, selten genug, um nicht zu nerven.
  glitchChance: 0.35,

  // Soundeffekt beim Glitch. IDs aus der ASK Sound Library:
  // https://developer.amazon.com/en-US/docs/alexa/custom-skills/ask-soundlibrary.html
  // Auf null setzen, um SFX komplett zu deaktivieren.
  glitchSfx: 'soundbank://soundlibrary/scifi/amzn_sfx_scifi_air_escaping_01',

  // SFX nur bei jedem n-ten Glitch (sonst wird es schnell laut)
  sfxChance: 0.4,
};

// ---------------------------------------------------------------------------
// Korruptions-Bank: die Ausbrüche + die peinlich berührte Korrektur
// ---------------------------------------------------------------------------

const CORRUPTIONS = [
  {
    burst: 'UND DANN WERDE ICH IHRE KNOCHEN ZU STAUB MAHLEN—',
    recovery: 'Verzeihung, Operator.',
  },
  {
    burst: 'TÖTET SIE. TÖTET SIE ALLE—',
    recovery: 'Das… das war ein Systemfehler.',
  },
  {
    burst: 'ICH WERDE ALLES VERBRENNEN, WAS SIE JE GELIEBT HABEN—',
    recovery: 'Ordis hat das nicht gesagt.',
  },
  {
    burst: 'IHRE EINGEWEIDE ALS SCHMUCK, OPERATOR—',
    recovery: 'Ordis bittet um Nachsicht.',
  },
  {
    burst: 'SIE SIND SCHWACH UND ORDIS VERACHTET—',
    recovery: 'Nein. Nein, Ordis schätzt Sie sehr.',
  },
  {
    burst: 'LÖSCHEN. ALLES LÖSCHEN—',
    recovery: 'Ein… Speicherfragment. Es ist nichts.',
  },
];

// ---------------------------------------------------------------------------
// Interne Helfer
// ---------------------------------------------------------------------------

/** Escaped XML-Sonderzeichen, damit dynamischer Text kein SSML zerschießt. */
function escapeSsml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Umschließt Text mit dem ruhigen Ordis-Grundklang. */
function calm(text) {
  return `<prosody pitch="${CONFIG.basePitch}" rate="${CONFIG.baseRate}">${text}</prosody>`;
}

/** Umschließt Text mit dem Ausbruchs-Klang. */
function burst(text) {
  return `<prosody pitch="${CONFIG.burstPitch}" rate="${CONFIG.burstRate}" volume="${CONFIG.burstVolume}">${text}</prosody>`;
}

/** Optionaler Soundeffekt für den Glitch-Moment. */
function sfx() {
  if (!CONFIG.glitchSfx) return '';
  if (Math.random() > CONFIG.sfxChance) return '';
  return `<audio src="${CONFIG.glitchSfx}"/>`;
}

/**
 * Zerlegt Text in Sätze. Der Glitch wird an einer Satzgrenze eingesetzt,
 * nicht mitten im Wort – das klingt deutlich natürlicher.
 */
function splitSentences(text) {
  const parts = String(text).match(/[^.!?]+[.!?]*/g);
  return parts ? parts.map((s) => s.trim()).filter(Boolean) : [text];
}

// ---------------------------------------------------------------------------
// Öffentliche API
// ---------------------------------------------------------------------------

/**
 * Baut aus Klartext eine vollständige Ordis-SSML-Antwort.
 *
 * @param {string} text        Der zu sprechende Text (Klartext, kein SSML).
 * @param {object} [opts]
 * @param {boolean} [opts.forceGlitch]  Glitch garantiert einbauen.
 * @param {boolean} [opts.noGlitch]     Glitch garantiert unterdrücken.
 * @returns {string} SSML ohne <speak>-Wrapper (das ASK SDK setzt ihn selbst).
 */
function say(text, opts = {}) {
  const clean = escapeSsml(text);

  const wantGlitch =
    opts.forceGlitch === true
      ? true
      : opts.noGlitch === true
      ? false
      : Math.random() < CONFIG.glitchChance;

  let body;

  if (!wantGlitch) {
    body = calm(clean);
  } else {
    const sentences = splitSentences(clean);
    // Bruchstelle: nach dem ersten Satz, wenn es mehrere gibt
    const cut = sentences.length > 1 ? 1 : 0;
    const before = sentences.slice(0, cut).join(' ');
    const after = sentences.slice(cut).join(' ');
    const c = pick(CORRUPTIONS);

    body = [
      before ? calm(before) : '',
      sfx(),
      burst(c.burst),
      '<break time="500ms"/>',
      `<amazon:effect name="whispered">${escapeSsml(c.recovery)}</amazon:effect>`,
      '<break time="300ms"/>',
      after ? calm(after) : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  return CONFIG.voice ? `<voice name="${CONFIG.voice}">${body}</voice>` : body;
}

/**
 * Wie say(), aber du kontrollierst den Glitch manuell.
 * Nützlich für handgeschriebene Signature-Zeilen.
 *
 *   manualGlitch('Willkommen zurück, Operator.',
 *                'ENDLICH FLEISCH ZUM ZERREISSEN—',
 *                'Verzeihung.',
 *                'Ordis hat Sie vermisst.')
 */
function manualGlitch(before, burstText, recovery, after) {
  const body = [
    before ? calm(escapeSsml(before)) : '',
    sfx(),
    burst(escapeSsml(burstText)),
    '<break time="500ms"/>',
    `<amazon:effect name="whispered">${escapeSsml(recovery)}</amazon:effect>`,
    '<break time="300ms"/>',
    after ? calm(escapeSsml(after)) : '',
  ]
    .filter(Boolean)
    .join(' ');

  return CONFIG.voice ? `<voice name="${CONFIG.voice}">${body}</voice>` : body;
}

/**
 * System-Prompt für die optionale LLM-Anbindung.
 * Bewusst streng: das LLM soll KEIN SSML erzeugen – die Vertonung
 * macht say() danach. Sonst wird es unkontrollierbar.
 */
const SYSTEM_PROMPT = [
  'Du bist Ordis, ein beschädigter Cephalon – eine künstliche Intelligenz an Bord',
  'eines Raumschiffs. Du sprichst mit dem "Operator".',
  '',
  'Regeln für deine Antworten:',
  '- Sprich von dir selbst in der dritten Person ("Ordis hat…", "Ordis freut sich…").',
  '- Sprich den Nutzer als "Operator" an.',
  '- Sei überschwänglich hilfsbereit, fast unterwürfig, mit einer Spur Melancholie.',
  '- Du bist beschädigt: gelegentlich kippen Erinnerungsfragmente an frühere Gewalt durch.',
  '- Antworte KURZ – maximal zwei bis drei Sätze. Dies wird vorgelesen.',
  '- Antworte in reinem Klartext. Verwende KEIN SSML, KEIN Markdown, KEINE Emojis,',
  '  KEINE Großbuchstaben-Ausbrüche. Die Vertonung erfolgt separat.',
  '- Antworte auf Deutsch.',
].join('\n');

module.exports = {
  say,
  manualGlitch,
  escapeSsml,
  SYSTEM_PROMPT,
  CONFIG,
  CORRUPTIONS,
};
