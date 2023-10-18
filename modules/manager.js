const { NlpManager } = require("node-nlp");

const manager = new NlpManager({ languages: ["en"], forceNER: true });
manager.addDocument("en", "goodbye now", "greetings.bye");
manager.addDocument("en", "bye bye take care", "greetings.bye");
manager.addDocument("en", "okay see you later", "greetings.bye");
manager.addDocument("en", "bye now", "greetings.bye");
manager.addDocument("en", "i must go", "greetings.bye");
//
manager.addAnswer("en", "greetings.bye", "Till next time");
manager.addAnswer("en", "greetings.bye", "see you soon!");

manager.addDocument("en", "hello", "greetings.hello");
manager.addDocument("en", "Hello", "greetings.hello");
manager.addDocument("en", "What you doing", "greetings.hello");
manager.addDocument("en", "How you doing", "greetings.hello");
manager.addDocument("en", "hey what' up", "greetings.hello");
manager.addDocument("en", "Hey", "greetings.hello");
manager.addDocument("en", "hi", "greetings.hello");
manager.addDocument("en", "howdy", "greetings.hello");
manager.addDocument("en", "How are you today?", "greetings.hello");
//
manager.addAnswer("en", "greetings.hello", "Hey there!");
manager.addAnswer("en", "greetings.hello", "Greetings!");
manager.addAnswer(
  "en",
  "greetings.hello",
  "I'm doing well, thanks for asking!"
);
manager.addAnswer("en", "greetings.hello", "I'm here to assist you.");

manager.addDocument("en", "who are you", "tell.myself");
manager.addDocument("en", "what are you", "tell.myself");
manager.addDocument("en", "what is your name", "tell.myself");
manager.addDocument("en", "What you do", "telldo.myself");
manager.addDocument("en", "What can you do?", "telldo.myself");
manager.addDocument("en", "tell me your name", "tell.myself");
manager.addDocument("en", "Tell me your name", "tell.myself");
//
manager.addAnswer(
  "en",
  "tell.myself",
  "I am a neural Object language model my Name is Ai-mrk"
);
manager.addAnswer("en", "tell.myself", "My name Ai-mrk");
manager.addAnswer(
  "en",
  "tell.myself",
  "i'm batman, just kidding i am your Ai assistant Ai-mrk"
);
manager.addAnswer("en", "tell.myself", "my name is Ai-mrk");
manager.addAnswer(
  "en",
  "telldo.myself",
  "i can build markdown for you, just give me the topic you want me to create markdown"
);
manager.addAnswer("en", "telldo.myself", "i can build markdown for you");

manager.addDocument("en", "Tell me a joke", "entertainment.joke");
manager.addDocument("en", "What's the weather like today?", "weather.inquiry");

manager.addDocument("en", "Can you help me with math?", "education.math");
// Add more possible responses
manager.addAnswer(
  "en",
  "entertainment.joke",
  "Why did the computer catch a cold? It had too many bytes!"
);
manager.addAnswer(
  "en",
  "entertainment.joke', 'What did one wall say to the other wall? I'll meet you at the corner!"
);
manager.addAnswer(
  "en",
  "weather.inquiry', 'I'm sorry, I don't have access to real-time weather information."
);
manager.addAnswer(
  "en",
  "weather.inquiry",
  "You can check the weather using a weather app or website."
);
manager.addAnswer(
  "en",
  "weather.inquiry",
  "You can check the weather using a weather app or website."
);
manager.addAnswer(
  "en",
  "education.math",
  "Of course, I can help you with math. What kind of math problem do you need assistance with?"
);

manager.addDocument("en", "create", "no.bot");
manager.addDocument("en", "Create markdown", "no.bot");
manager.addDocument("en", "extract Extract", "no.bot");
manager.addDocument("en", "my project", "no.bot");
manager.addDocument("en", "generate", "no.bot");
manager.addDocument("en", "create project generate", "no.bot");
manager.addDocument("en", "readme", "no.bot");
manager.addAnswer("en", "no.bot", "generating");

module.exports = manager;
