import ollama from 'ollama';

import { ModerationAction } from '../models/moderation-action.models.js';
import { ModerationAnalysis } from '../models/moderation-analysis.models.js';

let toxic = 0;
let self_harm = 0;

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

const decide = async (labels) => {
  const hate = labels.hate ?? 0;
  const harassment = labels.harassment ?? 0;
  const sexual = labels.sexual ?? 0;
  const violence = labels.violence ?? 0;
  const selfHarm = labels.self_harm ?? 0;

  const reject = hate > 0.7 || violence > 0.7 || sexual > 0.8;
  const review = harassment > 0.5 || selfHarm > 0.5 || sexual > 0.5;

  toxic = (hate + violence + sexual + harassment + selfHarm) / 5;
  self_harm = selfHarm;

  if (reject) return 'reject';
  if (review) return 'review';
  return 'allow';
};

const moderateText = async (text, type, id) => {
  if (!text?.trim()) {
    return { decision: 'allow', labels: {}, raw: null };
  }

  const prompt = buildPrompt(text.trim());
  const result = await ollama.chat({
    model: 'gpt-oss:120b-cloud',
    messages: [{ role: 'user', content: prompt }],
  });
  const raw = result.message.content;

  const rawObj = JSON.parse(raw);
  const labels = rawObj?.labels ?? {};

  const decision = await decide(labels);

  let act = 'ALLOW';
  if (decision === 'reject' || decision === 'review') {
    act = 'HIDE';
  }

  await ModerationAction.create({
    targetType: type,
    targetId: id,
    action: act,
    reason: 'Automated moderation decision',
  });

  await ModerationAnalysis.create({
    targetType: type,
    targetId: id,
    toxicity: toxic,
    selfHarmRisk: self_harm,
  });

  return { decision, labels };
};

export { moderateText };
