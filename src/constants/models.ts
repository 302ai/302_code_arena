export interface IModel {
  id: string;
  name: string;
  group: string;
}

export const MODEL_LIST: IModel[] = [
  {
    id: "qwen-max-latest",
    name: "qwen-max-latest",
    group: "Qwen-Max",
  },
  {
    id: "deepseek-chat",
    name: "deepseek-v3",
    group: "Deepseek-Chat",
  },
  {
    id: "deepseek-ai/DeepSeek-V3",
    name: "deepseek-v3",
    group: "Deepseek-Chat",
  },
  {
    id: "Pro/deepseek-ai/DeepSeek-V3",
    name: "deepseek-v3",
    group: "Deepseek-Chat",
  },
  {
    id: "deepseek-v3-huoshan",
    name: "deepseek-v3",
    group: "Deepseek-Chat",
  },
  {
    id: "deepseek-v3-baidu",
    name: "deepseek-v3",
    group: "Deepseek-Chat",
  },
  {
    id: "deepseek-v3",
    name: "deepseek-v3",
    group: "Deepseek-Chat",
  },
  {
    id: "deepseek-v3-302",
    name: "deepseek-v3",
    group: "Deepseek-Chat",
  },
  {
    id: "deepseek-v3-aliyun",
    name: "deepseek-v3",
    group: "Deepseek-Chat",
  },
  {
    id: "gpt-4o",
    name: "gpt-4o",
    group: "GPT-4o",
  },
  {
    id: "gpt-4o-2024-11-20",
    name: "gpt-4o-2024-11-20",
    group: "GPT-4o",
  },
  {
    id: "gpt-4o-mini",
    name: "gpt-4o-mini",
    group: "GPT-4o-mini",
  },
  {
    id: "llama3.1-405b",
    name: "llama3.1-405b",
    group: "Llama-3.1-405B",
  },
  {
    id: "meta-llama/Meta-Llama-3.1-405B-Instruct",
    name: "llama3.1-405b",
    group: "Llama-3.1-405B",
  },
  {
    id: "llama3.1-70b",
    name: "llama3.1-70b",
    group: "Llama-3.1-70B",
  },
  {
    id: "meta-llama/Meta-Llama-3.1-70B-Instruct",
    name: "llama3.1-70b",
    group: "Llama-3.1-70B",
  },
  {
    id: "chatgpt-4o-latest",
    name: "chatgpt-4o-latest",
    group: "Chatgpt-4o-latest",
  },
  {
    id: "qwen2.5-72b-instruct",
    name: "qwen2.5-72b-instruct",
    group: "Qwen-2.5-72B",
  },
  {
    id: "Qwen/Qwen2.5-72B-Instruct-128K",
    name: "qwen2.5-72b-instruct-128k",
    group: "Qwen-2.5-72B",
  },
  {
    id: "Vendor-A/Qwen/Qwen2.5-72B-Instruct",
    name: "qwen2.5-72b-instruct",
    group: "Qwen-2.5-72B",
  },
  {
    id: "llama3.2-90b",
    name: "llama3.2-90b",
    group: "Llama-3.2-90B",
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "claude-3-5-sonnet-20241022",
    group: "Claude-3.5-sonnet",
  },
  {
    id: "mistral-large-2411",
    name: "mistral-large-2411",
    group: "Mistral-Large",
  },
  {
    id: "llama3.3-70b",
    name: "llama3.3-70b",
    group: "Llama-3.3-70B",
  },
  {
    id: "meta-llama/Llama-3.3-70B-Instruct",
    name: "llama3.3-70b",
    group: "Llama-3.3-70B",
  },
  {
    id: "qwen2.5-coder-32b-instruct",
    name: "qwen2.5-coder-32b-instruct",
    group: "Qwen-2.5-coder-32B",
  },
  {
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    name: "qwen2.5-coder-32b-instruct",
    group: "Qwen-2.5-coder-32B",
  },
  {
    id: "o1",
    name: "o1",
    group: "O1",
  },
  {
    id: "o1-2024-12-17",
    name: "o1-2024-12-17",
    group: "O1",
  },
  {
    id: "grok-2-1212",
    name: "grok-2-1212",
    group: "Grok-2",
  },
  {
    id: "gemini-2.0-flash-thinking-exp-01-21",
    name: "gemini-2.0-flash-thinking-exp-01-21",
    group: "Gemini-2.0-Flash-thinking",
  },
  {
    id: "Doubao-1.5-pro-32k",
    name: "doubao-1.5-pro-32k",
    group: "Doubao-1.5-pro",
  },
  {
    id: "deepseek-r1",
    name: "deepseek-r1",
    group: "Deepseek-R1",
  },
  {
    id: "deepseek-reasoner",
    name: "deepseek-reasoner",
    group: "Deepseek-R1",
  },
  {
    id: "deepseek-ai/DeepSeek-R1",
    name: "deepseek-r1",
    group: "Deepseek-R1",
  },
  {
    id: "deepseek-r1-huoshan",
    name: "deepseek-r1",
    group: "Deepseek-R1",
  },
  {
    id: "deepseek-r1-baidu",
    name: "deepseek-r1",
    group: "Deepseek-R1",
  },
  {
    id: "deepseek-r1-302",
    name: "deepseek-r1",
    group: "Deepseek-R1",
  },
  {
    id: "Pro/deepseek-ai/DeepSeek-R1",
    name: "deepseek-r1",
    group: "Deepseek-R1",
  },
  {
    id: "deepseek-r1-aliyun",
    name: "deepseek-r1",
    group: "Deepseek-R1",
  },
  {
    id: "o3-mini",
    name: "o3-mini",
    group: "O3-mini",
  },
  {
    id: "o3-mini-2025-01-31",
    name: "o3-mini-2025-01-31",
    group: "O3-mini",
  },
  {
    id: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
    name: "deepseek-r1-distill-llama-70b",
    group: "Deepseek-R1-Llama-70B",
  },
  {
    id: "gemini-2.0-flash",
    name: "gemini-2.0-flash",
    group: "Gemini-2.0-Flash",
  },
  {
    id: "gemini-2.0-pro-exp-02-05",
    name: "gemini-2.0-pro-exp-02-05",
    group: "Gemini-2.0-Pro",
  },
];

export function getModelNameList() {
  return [...new Set(MODEL_LIST.map((model) => model.name))];
}

export function getModelIdByName(name: string) {
  const matchingModels = MODEL_LIST.filter((model) => model.name === name);
  if (matchingModels.length === 0) {
    const randomModel =
      getModelNameList()[Math.floor(Math.random() * getModelNameList().length)];
    return getModelIdByName(randomModel);
  }

  const randomIndex = Math.floor(Math.random() * matchingModels.length);
  return matchingModels[randomIndex].id;
}

export function getModelNameById(id: string) {
  const matchingModels = MODEL_LIST.filter((model) => model.id === id);
  if (matchingModels.length === 0)
    return getModelNameList()[
      Math.floor(Math.random() * getModelNameList().length)
    ];

  return matchingModels[0].name;
}
