# LLM Agent Tool

## Overview

> A lightweight tool to prototype LLM agents with custom tools to extend the model's capabilities. Inspired by the [Frontend Masters LLM Agents Workshop](https://frontendmasters.com/), built for experimenting with OpenAI function calling and tool chaining.

---

## Features

- **Agent with tool usage** — Supports OpenAI function-calling interface
- **Plug-and-play custom tools** — Easily extend with translation, TTS, etc.
- **History tracking** — Retains conversation history across steps
- **CLI-based testing** — Run command prompts with `npm start "..."`

---

## Requirements

- Node.js **v22+**
- OpenAI API Key (`OPENAI_API_KEY` environment variable)

---

## Installation

Clone and install dependencies:

```bash
git clone https://github.com/designbydc/llm-agent-tool.git
cd llm-agent-tool
npm install
```

Then create a `.env` file with your API key:

```env
OPENAI_API_KEY='YOUR_API_KEY'
```

---

## Usage

Run the translator tool:

```bash
npm start "Use the translator tool to translate the following text to Italian: 'Hello, how are you?'"
```

Run the audio tool:

```bash
npm start "Use the audio tool to say: 'Today is a wonderful day!'"
```

You can test tools using natural language prompts in the CLI.

---

## Built-in Tools

### `translator`

Translates given text into a target language using function call arguments.

### `audio`

Uses OpenAI TTS to convert text to speech. Saves audio to `speech.mp3` locally.

---

## Adding a New Tool

1. Create a new file in `src/tools/yourTool.ts`
2. Export your tool definition:

```ts
export const yourToolDefinition = {
  name: 'Your tool name',
  parameters: z.object({ ... })
}

export const yourToolFn: ToolFn = async (args) => {
  // Your logic here
}
```

3. Register it inside `toolHandler.ts`

---

## Tool Call Response Flow (Important)

When using OpenAI tools (tool_calls), it's important to maintain the correct message order in your conversation history. Make sure your stored history (e.g. db.json) reflects this structure exactly. This applies whether you're storing in-memory, in files, or in a database.

```json
{
  "role": "user",
  "content": "...",
  ...
},
{
  "role": "assistant",
  "content": null,
  "tool_calls": [
    {
      "id": "call_diV4yXzfVVzld7e9JlgEUMZC",
      "type": "function",
      "function": {
        "name": "translator",
        "arguments": "..."
      }
    }
  ],
  ...
},
{
  "role": "tool",
  "content": "...",
  ...
},
```
