import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-3-flash-preview',
  generationConfig: {
    temperature: 0,
    topP: 0.2,
    topK: 5,
  },
});

const buildPrompt = (text) => `
You are a strict content moderation classifier.
Analyze the text and output ONLY valid JSON that matches this schema exactly:
{
  "labels": {
    "hate": 0.0-1.0,
    "harassment": 0.0-1.0,
    "sexual": 0.0-1.0,
    "violence": 0.0-1.0,
    "self_harm": 0.0-1.0
  }
}
Rules:
- Output JSON only. No extra text, no markdown, no code fences.
- Use decimal numbers between 0 and 1.
- If unsure, choose a cautious higher score.
Text: """${text}"""
`;

const decide = (labels) => {
  const hate = labels.hate ?? 0;
  const harassment = labels.harassment ?? 0;
  const sexual = labels.sexual ?? 0;
  const violence = labels.violence ?? 0;
  const selfHarm = labels.self_harm ?? 0;

  const reject = hate > 0.7 || violence > 0.7 || sexual > 0.8;
  const review = harassment > 0.5 || selfHarm > 0.5 || sexual > 0.5;

  if (reject) return 'reject';
  if (review) return 'review';
  return 'allow';
};

const parseJsonFromText = (raw) => {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '');
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch ? jsonMatch[0] : cleaned;

  try {
    return JSON.parse(jsonText);
  } catch {
    const repaired = jsonText
      .replace(/\n/g, ' ')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/'/g, '"');

    try {
      return JSON.parse(repaired);
    } catch {
      return null;
    }
  }
};

const moderateText = async (text) => {
  if (!text?.trim()) {
    return { decision: 'allow', labels: {}, raw: null };
  }

  const prompt = buildPrompt(text.trim());
  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  const parsed = parseJsonFromText(raw);

  const labels = parsed?.labels ?? {};
  const decision = decide(labels);

  return { decision, labels, raw };
};

export { moderateText };
