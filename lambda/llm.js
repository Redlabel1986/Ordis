/**
 * llm.js
 * ----------------------------------------------------------------------------
 * OPTIONAL. Ohne API-Key funktioniert der Skill trotzdem – er fällt dann
 * auf die vorgeschriebenen Zeilen aus lines.js zurück.
 *
 * WICHTIG: Alexa erwartet die Antwort innerhalb von ~8 Sekunden.
 * Deshalb: kleines, schnelles Modell + hartes AbortController-Timeout.
 * ----------------------------------------------------------------------------
 */

'use strict';

const ordis = require('./ordis');

// ---------------------------------------------------------------------------
// Konfiguration
//
// Alexa-hosted Skills bieten KEINE Environment-Variablen im Konsolen-UI.
// Zwei Wege:
//   a) Key hier direkt eintragen (nur für private Skills, NIE ins Git!)
//   b) Eigene Lambda in deinem AWS-Account -> dort echte Env-Vars nutzen
// ---------------------------------------------------------------------------

const API_KEY = process.env.ANTHROPIC_API_KEY || '';   // <-- hier eintragen
const MODEL = 'claude-haiku-4-5-20251001';             // schnell = wichtig
const MAX_TOKENS = 150;                                // kurz halten, wird vorgelesen
const TIMEOUT_MS = 5500;                               // Puffer bis Alexas Limit

/**
 * Fragt das LLM und liefert reinen Klartext zurück.
 * Gibt null zurück, wenn kein Key gesetzt ist oder etwas schiefgeht –
 * der Aufrufer fällt dann auf die statischen Zeilen zurück.
 *
 * @param {string} query    Was der Operator gesagt hat
 * @param {Array}  history  Bisheriger Gesprächsverlauf [{role, content}]
 * @returns {Promise<string|null>}
 */
async function askLlm(query, history = []) {
  if (!API_KEY) return null;
  if (!query || !query.trim()) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: ordis.SYSTEM_PROMPT,
        messages: [...history, { role: 'user', content: query }],
      }),
    });

    if (!res.ok) {
      console.error('LLM HTTP', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join(' ')
      .trim();

    return text || null;
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('LLM-Timeout nach', TIMEOUT_MS, 'ms');
    } else {
      console.error('LLM-Fehler:', err);
    }
    return null;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { askLlm };
