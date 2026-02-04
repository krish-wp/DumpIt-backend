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
You are a moderation classifier.
Return JSON only:
{
  "labels": {
    "hate": 0-1,
    "harassment": 0-1,
    "sexual": 0-1,
    "violence": 0-1,
    "self_harm": 0-1
  }
}
Text: """${text}"""
`;

const decide = (labels) => {
  const hate = labels.hate ?? 0;
  const harassment = labels.harassment ?? 0;
  const sexual = labels.sexual ?? 0;
  const violence = labels.violence ?? 0;
  const selfHarm = labels.self_harm ?? 0;

  const reject = hate > 0.7 || violence > 0.7 || sexual > 0.8;
  const review = harassment > 0.5 || selfHarm > 0.5;

  if (reject) return 'reject';
  if (review) return 'review';
  return 'allow';
};

const moderateText = async (text) => {
  if (!text?.trim()) {
    return { decision: 'allow', labels: {}, raw: null };
  }

  const prompt = buildPrompt(text.trim());
  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  console.log('message', result.response.text);
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = null;
  }

  const labels = parsed?.labels ?? {};
  const decision = decide(labels);

  console.log({ decision, labels, raw, parsed });
  return { decision, labels, raw };
};

export { moderateText };
