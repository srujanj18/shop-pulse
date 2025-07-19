const ChatMessage = ({ text, sender }: { text: string; sender: string }) => {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-sm ${
          isUser ? "bg-primary text-white" : "bg-white text-black"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;
