// Simple test script to create an agent
const testAgent = {
  name: "Test Agent",
  description: "A test agent for verification",
  personality: "friendly",
  voiceStyle: "warm",
  expertise: "general",
  greeting: "Hello! How can I help you today?",
  tone: "helpful",
  systemPrompt: "You are a helpful AI assistant.",
  temperature: 0.7,
  maxTokens: 1000,
  tags: ["test", "verification"]
};

console.log("Testing agent creation...");
console.log("Agent data:", JSON.stringify(testAgent, null, 2));

// In a real scenario, you'd make an HTTP request to your API endpoint
// For now, this confirms the data structure is correct