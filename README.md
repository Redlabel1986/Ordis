# Ordis Cephalon — Alexa Skill

Ein privater Alexa Custom Skill mit der Persönlichkeit eines beschädigten Cephalon.
Ausgelegt auf **Alexa-hosted Skills** — kein eigener AWS-Account nötig, kostenlos.

---

## Dateien

```
lambda/
  index.js     Request-Handler (Launch, Status, Witz, Chat, Standard-Intents)
  ordis.js     SSML-/Persönlichkeits-Engine  ← Klangfarbe, Glitch-Logik
  lines.js     Alle Textbausteine            ← hier schreibst du den Charakter
  llm.js       Optionale LLM-Anbindung (Skill läuft auch ohne)
  package.json

skill-package/
  skill.json                                   Skill-Manifest
  interactionModels/custom/de-DE.json           Intents + Sample Utterances
```

---

## Setup — Schritt für Schritt

### 1. Developer-Account

https://developer.amazon.com/alexa/console/ask — mit deinem normalen
Amazon-Konto einloggen (dem, mit dem auch dein Echo verknüpft ist!).
Kostenlos, keine Kreditkarte.

### 2. Skill anlegen

**Create Skill** klicken, dann:

| Feld | Wert |
|---|---|
| Skill name | `Ordis Cephalon` |
| Primary locale | `Deutsch (DE)` |
| Experience type | **Other** |
| Model | **Custom** |
| Hosting | **Alexa-hosted (Node.js)** |
| Template | **Start from Scratch** |

Die Provisionierung dauert 1–2 Minuten.

### 3. Interaction Model einspielen

Links im Menü: **Build → Interaction Model → JSON Editor**

Kompletten Inhalt löschen, `skill-package/interactionModels/custom/de-DE.json`
hineinkopieren. Dann **Save Model**, danach **Build Model**
(dauert ~1 Minute).

> **Zum Invocation Name:** `ordis cephalon` ist zweiwortig, weil Amazon
> einwortige Invocation Names in der Zertifizierung ablehnt (Ausnahme:
> eingetragene Marken). Für private Beta-Skills ist es meist trotzdem egal —
> wenn du es einwortig willst, probier `ordis` und schau, ob der Build durchgeht.

### 4. Code einspielen

Oben auf **Code** wechseln. Du siehst einen Editor mit `index.js`,
`package.json` und einem `util.js`.

1. `index.js` — kompletten Inhalt durch meine Version ersetzen
2. `package.json` — durch meine Version ersetzen
3. Neue Dateien anlegen (Rechtsklick im Dateibaum → *New File*):
   - `ordis.js`
   - `lines.js`
   - `llm.js`
4. **Save** → **Deploy**

Der Deploy installiert die npm-Dependencies automatisch und dauert 1–2 Minuten.

### 5. Testen

Oben auf **Test**, das Dropdown links von *Development* umstellen.
Dann tippen oder sprechen:

```
öffne ordis cephalon
wie geht es dir
erzähl mir einen witz
```

Rechts im Panel siehst du die JSON-Response inkl. dem generierten SSML —
sehr nützlich zum Debuggen.

### 6. Auf deinem echten Echo

Sobald der Skill deployed ist und du **denselben Amazon-Account** benutzt,
ist er auf deinen Geräten automatisch als Entwickler-Skill aktiv:

```
"Alexa, öffne Ordis Cephalon"
```

Kein Store, keine Zertifizierung, keine Veröffentlichung nötig.

---

## Feintuning

### Klang

In `ordis.js`, Block `CONFIG`:

```js
voice: 'Hans',        // de-DE Polly-Stimmen: Hans, Marlene, Vicki
                      // null = Alexas Standardstimme
basePitch: '-12%',    // tiefer = maschineller
baseRate: '96%',
glitchChance: 0.35,   // 0 = nie, 1 = jeder Satz
```

Schneller Weg zum Experimentieren: **Test → Voice & Tone**
im Developer-Console-Simulator. Da kannst du SSML direkt einfügen und anhören,
ohne jedes Mal zu deployen.

### Charakter

`lines.js` ist die Datei, die du am häufigsten anfassen wirst. Alles Klartext,
kein SSML. Die `GREETINGS` haben handgesetzte Bruchstellen, alles andere
kriegt den Glitch automatisch von `ordis.js` aufgesetzt.

Die Ausbrüche selbst stehen in `ordis.js` unter `CORRUPTIONS`.

### Soundeffekte

`CONFIG.glitchSfx` zeigt aktuell auf einen Sci-Fi-Sound aus Amazons Bibliothek.
Weitere IDs: https://developer.amazon.com/en-US/docs/alexa/custom-skills/ask-soundlibrary.html

Auf `null` setzen, wenn es dir zu viel wird.

---

## Freies Gespräch (optional)

Ohne API-Key beantwortet der `ChatIntent` alles mit einer der `CONFUSED`-Zeilen.
Mit Key wird echt geantwortet.

In `llm.js`:

```js
const API_KEY = 'sk-ant-...';   // direkt eintragen
```

**Wichtig:** Alexa-hosted Skills bieten keine Environment-Variablen im UI.
Der Key steht also im Code — für einen rein privaten Skill akzeptabel, aber
committe das Repo dann nicht öffentlich. Wenn dich das stört: eigene Lambda im
eigenen AWS-Account deployen, dort gibt es echte Env-Vars.

**Latenz beachten:** Alexa killt die Response nach ~8 Sekunden. Deshalb
ein hartes 5,5-Sekunden-Timeout und `max_tokens: 150`. Wenn's rausläuft, fällt
der Skill sauber auf die statischen Zeilen zurück.

---

## Eigene Stimme statt Polly

Der nächste Ausbaustufe: Lines mit XTTS-v2 / ElevenLabs / Piper rendern,
als MP3 auf S3 legen, per `<audio>` einbinden.

Format-Anforderungen (sonst spielt Alexa nichts ab):

```bash
ffmpeg -i input.wav -ac 2 -codec:a libmp3lame -b:a 48k -ar 24000 \
       -write_xing 0 output.mp3
```

Limits: max. 5 Audio-Dateien pro Response, HTTPS-Hosting mit gültigem
Zertifikat, kein selbstsigniertes.

Alexa-hosted Skills bringen einen eigenen S3-Bucket mit — im Code-Editor
unter **Media** erreichbar.

Damit funktionieren allerdings nur **vorgerenderte** Zeilen. Für dynamische
Antworten in der eigenen Stimme müsstest du in der Lambda live TTS erzeugen
und hochladen — bei 8 Sekunden Budget sportlich, aber mit einem schnellen
TTS-Endpoint machbar.

---

## Rechtliches

Ordis ist geistiges Eigentum von Digital Extremes. Dieser Skill bleibt
**privat und unveröffentlicht** — kein Skill Store, keine Zertifizierung.
Für den Eigengebrauch auf deinen Geräten ist das der pragmatische Weg.

Wenn du Zeilen mit einer geklonten Stimme des Original-Sprechers vertonst,
bewegst du dich zusätzlich im Bereich Persönlichkeitsrecht. Privat ist das
Risiko gering, aber es ist eine bewusste Entscheidung, keine Formalie.
