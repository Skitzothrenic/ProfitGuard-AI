// File: /chatparser.js

function getActionsForMessage(message, keywordPairs) {
  console.log('[ChatParser] Checking message:', message);

  if (!Array.isArray(keywordPairs)) {
    console.warn('[ChatParser] Invalid keywordPairs, expected array:', keywordPairs);
    return [];
  }

  const triggered = [];
  const lowerMessage = message.toLowerCase();

  keywordPairs.forEach((entry, index) => {
    const keyword = entry.keyword?.toLowerCase();
    const enabled = entry.enabled !== false; // default true if missing
    const categoryEnabled = entry.categoryEnabled !== false; // default true if missing

    if (!keyword) {
      console.warn(`[ChatParser] Skipping entry ${index}: missing keyword`);
      return;
    }

    if (!enabled) {
      console.log(`[ChatParser] Skipping disabled trigger: "${keyword}"`);
      return;
    }

    if (!categoryEnabled) {
      console.log(`[ChatParser] Skipping trigger due to disabled category: "${keyword}"`);
      return;
    }

    if (lowerMessage.includes(keyword)) {
      console.log(`[ChatParser] ✅ Keyword matched: "${keyword}"`);
      triggered.push(entry.action);
    }
  });

  if (triggered.length === 0) {
    console.log('[ChatParser] No actions triggered.');
  }

  return triggered;
}

module.exports = { getActionsForMessage };
