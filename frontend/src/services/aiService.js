import { mockAIResponses, suggestedQuestions } from '../mock/aiResponses';

export async function sendMessage(message, context = {}) {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const lowerMsg = message.toLowerCase();
  let foundResponse = null;
  
  for (const item of mockAIResponses) {
    if (item.keywords.some(k => lowerMsg.includes(k))) {
      foundResponse = item.response;
      break;
    }
  }
  
  if (!foundResponse) {
    foundResponse = "I'm sorry, I don't have information on that specific topic. Is there anything else about the vessel's status or surroundings I can help you with?";
  }
  
  return { role: 'assistant', content: foundResponse };
}

export function getSuggestedQuestions() {
  return suggestedQuestions;
}
