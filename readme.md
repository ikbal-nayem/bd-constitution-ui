# Bangladesh Law Agent
This is an AI chatbot project that provides information about the Law of Bangladesh. The project is built using Next.js, a popular React framework for building server-side rendered applications.

A live version of this project is available at: https://bd-law-ai.vercel.app/


## Features

- **Law Information**: The chatbot can answer questions about the Laws of Bangladesh.

- **User-Friendly Interface**: The chat interface is designed to be intuitive and easy to use. Users can ask questions and receive answers in real-time.

- **Responsive Design**: The chatbot is responsive and works well on both desktop and mobile devices.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.

- **React**: A JavaScript library for building user interfaces.

- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs.

- **Shadcn/ui**: A collection of pre-built UI components for React.


API request will be sent to the FastAPI backend, which will process the request and return a response. The response will then be displayed in the chat interface.

Request format:
```json
{
  "messages": {
    "role": "user" | "assistant" | "system",
    "content": "string",
    "id?": "string"
  }[],
  // Add any other parameters your FastAPI expects
  "max_tokens?": "number",
  "temperature?": "number",
}

