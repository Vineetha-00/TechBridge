require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';

const isAIConfigured = Boolean(apiKey && apiKey.length > 10 && !apiKey.includes('your-gemini-api-key'));

if (isAIConfigured) {
    console.log(`✅ External AI Service configured with model: ${modelName}`);
} else {
    console.log('ℹ️ External AI Key not configured in backend/.env. Using built-in intelligent CSE Guidance Engine.');
}

module.exports = {
    apiKey,
    modelName,
    isAIConfigured
};
