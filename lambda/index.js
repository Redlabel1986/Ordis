/**
 * index.js
 * ----------------------------------------------------------------------------
 * Alexa Custom Skill – Cephalon-Persönlichkeit
 * SDK: ask-sdk-core (Node.js)
 * ----------------------------------------------------------------------------
 */

'use strict';

const Alexa = require('ask-sdk-core');
const ordis = require('./ordis');
const lines = require('./lines');
const { askLlm } = require('./llm');

// ---------------------------------------------------------------------------
// Kleine Helfer
// ---------------------------------------------------------------------------

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Antwort bauen: SSML sprechen + Session offen halten. */
function reply(handlerInput, ssml, repromptSsml) {
  const b = handlerInput.responseBuilder.speak(ssml);
  if (repromptSsml) b.reprompt(repromptSsml);
  return b.getResponse();
}

// ---------------------------------------------------------------------------
// LaunchRequest – "Alexa, öffne Ordis Cephalon"
// ---------------------------------------------------------------------------

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const greeting = pick(lines.GREETINGS);
    const ssml = ordis.manualGlitch(
      greeting.before,
      greeting.burst,
      greeting.recovery,
      greeting.after
    );
    return reply(handlerInput, ssml, ordis.say(pick(lines.REPROMPTS), { noGlitch: true }));
  },
};

// ---------------------------------------------------------------------------
// StatusIntent – "Wie geht es dir?" / "Systemstatus"
// ---------------------------------------------------------------------------

const StatusIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'StatusIntent'
    );
  },
  handle(handlerInput) {
    const ssml = ordis.say(pick(lines.STATUS), { forceGlitch: true });
    return reply(handlerInput, ssml, ordis.say(pick(lines.REPROMPTS), { noGlitch: true }));
  },
};

// ---------------------------------------------------------------------------
// JokeIntent – Ordis' berüchtigt schlechte Witze
// ---------------------------------------------------------------------------

const JokeIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'JokeIntent'
    );
  },
  handle(handlerInput) {
    const ssml = ordis.say(pick(lines.JOKES), { noGlitch: true });
    return reply(handlerInput, ssml, ordis.say(pick(lines.REPROMPTS), { noGlitch: true }));
  },
};

// ---------------------------------------------------------------------------
// ChatIntent – freies Gespräch, optional via LLM
// ---------------------------------------------------------------------------

const ChatIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChatIntent'
    );
  },
  async handle(handlerInput) {
    const query = Alexa.getSlotValue(handlerInput.requestEnvelope, 'query') || '';

    // Kurzes Gesprächsgedächtnis in den Session-Attributen halten.
    const attrs = handlerInput.attributesManager.getSessionAttributes();
    const history = Array.isArray(attrs.history) ? attrs.history : [];

    let answer;
    try {
      answer = await askLlm(query, history);
    } catch (err) {
      console.error('LLM-Fehler:', err);
      answer = null;
    }

    if (!answer) {
      // Fallback ohne LLM – der Skill funktioniert auch ohne API-Key.
      const ssml = ordis.say(pick(lines.CONFUSED), { forceGlitch: true });
      return reply(handlerInput, ssml, ordis.say(pick(lines.REPROMPTS), { noGlitch: true }));
    }

    history.push({ role: 'user', content: query });
    history.push({ role: 'assistant', content: answer });
    // Nur die letzten 6 Turns behalten – Alexa-Sessions sind kurzlebig.
    attrs.history = history.slice(-12);
    handlerInput.attributesManager.setSessionAttributes(attrs);

    return reply(
      handlerInput,
      ordis.say(answer),
      ordis.say(pick(lines.REPROMPTS), { noGlitch: true })
    );
  },
};

// ---------------------------------------------------------------------------
// Standard-Intents
// ---------------------------------------------------------------------------

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const ssml = ordis.say(lines.HELP, { noGlitch: true });
    return reply(handlerInput, ssml, ordis.say(pick(lines.REPROMPTS), { noGlitch: true }));
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    if (Alexa.getRequestType(handlerInput.requestEnvelope) !== 'IntentRequest') {
      return false;
    }
    const name = Alexa.getIntentName(handlerInput.requestEnvelope);
    return name === 'AMAZON.CancelIntent' || name === 'AMAZON.StopIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(ordis.say(pick(lines.FAREWELLS), { forceGlitch: true }))
      .withShouldEndSession(true)
      .getResponse();
  },
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    const ssml = ordis.say(pick(lines.CONFUSED), { forceGlitch: true });
    return reply(handlerInput, ssml, ordis.say(pick(lines.REPROMPTS), { noGlitch: true }));
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(
      'Session beendet:',
      JSON.stringify(handlerInput.requestEnvelope.request.reason)
    );
    return handlerInput.responseBuilder.getResponse();
  },
};

// Fängt alle übrigen Intents ab, damit der Skill nie hart abbricht.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
  },
  handle(handlerInput) {
    const ssml = ordis.say(pick(lines.CONFUSED), { noGlitch: true });
    return reply(handlerInput, ssml, ordis.say(pick(lines.REPROMPTS), { noGlitch: true }));
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error('Handler-Fehler:', error);
    // Auf SessionEndedRequest darf nicht mit Sprache geantwortet werden.
    if (Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest') {
      return handlerInput.responseBuilder.getResponse();
    }
    const ssml = ordis.manualGlitch(
      'Ein Fehler in Ordis Subsystemen.',
      'ALLES BRENNT. ALLES BRENNT—',
      'Verzeihung, Operator.',
      'Bitte versuchen Sie es erneut.'
    );
    return handlerInput.responseBuilder
      .speak(ssml)
      .reprompt(ordis.say('Ordis hört zu.', { noGlitch: true }))
      .getResponse();
  },
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    StatusIntentHandler,
    JokeIntentHandler,
    ChatIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent('cephalon-skill/v1')
  .lambda();
