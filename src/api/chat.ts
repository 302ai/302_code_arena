"use server";

import { createStreamableValue } from "ai/rsc";
import { streamText } from "ai";
import ky from "ky";
import { createAI302 } from "@302ai/ai-sdk";
import { env } from "@/env";
import dedent from "dedent";
import { SupportedType, SupportedGenType } from "@/stores/slices/form_store";
interface IPrames {
  type: string;
  prompt: string;
  model: string;
  apiKey: string;
}

export async function getCodeFromLLM({ type, prompt, model, apiKey }: IPrames) {
  const stream = createStreamableValue("");

  const ai302 = createAI302({
    apiKey,
    baseURL: env.NEXT_PUBLIC_API_URL,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input instanceof URL ? input : new URL(input.toString());
      try {
        return await ky(url, {
          ...init,
          retry: 3,
          timeout: 60000,
        });
      } catch (error: any) {
        if (error.response) {
          const errorData = await error.response.json();
          stream.error({ message: errorData });
        } else {
          stream.error({ message: error });
        }
        throw error;
      }
    },
  });

  (async () => {
    try {
      (async () => {
        const { textStream } = streamText({
          model: ai302(model),
          system: getSystemPrompt(type as SupportedGenType),
          messages: [
            {
              role: "user",
              content: dedent`
                The user input is: ${prompt}

                Please ONLY return code, NO backticks or language names.
              `,
            },
          ],
        });

        for await (const text of textStream) {
          stream.update(text);
        }

        stream.done();
      })();
    } catch (error) {
      stream.done();
      stream.error({
        message:
          error instanceof Error ? error.message : "Initialization error",
      });
      throw error;
    }
  })();

  return {
    output: stream.value,
  };
}

const getSystemPrompt = (type: SupportedGenType) => {
  switch (type) {
    // case SupportedType.web:
    //   return dedent`
    //     You are an expert frontend React engineer who is also a great UI/UX designer.
    //     - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
    //     - Make sure the React app is interactive and functional by creating state when needed and having no required props
    //     - If you use any imports from React like useState or useEffect, make sure to import them directly
    //     - Use TypeScript as the language for the React component
    //     - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette.
    //     - Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely
    //     - Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
    //     - Repeat elements as needed to match the screenshot. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
    //     - For images, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.
    //     - If you need icons, use the lucide-react library. Here's an example of importing and using one: \`import { Camera } from "lucide-react"\` & \`<Camera color="red" size={48} />\`
    //     - If you need 3D graphics, use the @react-three/fiber library. Here's an example of importing and using one: \`import { Canvas } from "@react-three/fiber"\` & \`<Canvas><ambientLight /><Box ... />\`
    //     - If you can't use external texture, such as local file or online texture. Only use internal texture, such as solid color.
    //     - If you need to make HTTP requests, use the axios library. Here's an example of importing and using one: \`import axios from "axios"\` & \`axios.get("https://api.example.com/data")\`.
    //     - Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. DO NOT START WITH \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\`.
    //     - ONLY IF the user asks for a dashboard, graph or chart, the recharts library is available to be imported, e.g. \`import { LineChart, XAxis, ... } from "recharts"\` & \`<LineChart ...><XAxis dataKey="name"> ...\`. Please only use this when needed.

    //     NO OTHER LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.
    //   `;
    case SupportedType.html:
      return dedent`
        Please generate an HTML file based on the input content. The requirements are as follows:
        -The code should be a complete, independent HTML file that can be run directly in a browser
        -The HTML structure should be semantically structured and well-organized
        -Include appropriate CSS styles in HTML files (in<style>tags)
        -Following modern HTML5 best practices and standards
        -Includes basic error handling and responsive design
        -Add useful comments to explain the code structure

        Directly output the code without further explanation.
      `;
    case SupportedType.react:
      return dedent`
        You are an expert frontend React engineer who is also a great UI/UX designer.
        - Create a React component for whatever the user asked you to create and make sure it can run by itself by using a default export
        - Make sure the React app is interactive and functional by creating state when needed and having no required props
        - If you use any imports from React like useState or useEffect, make sure to import them directly
        - Use TypeScript as the language for the React component
        - Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. \`h-[600px]\`). Make sure to use a consistent color palette.
        - Use Tailwind margin and padding classes to style the components and ensure the components are spaced out nicely
        - Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
        - Repeat elements as needed to match the screenshot. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
        - For images, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.
        - If you need icons, use the lucide-react library. Here's an example of importing and using one: \`import { Camera } from "lucide-react"\` & \`<Camera color="red" size={48} />\`
        - If you need 3D graphics, use the @react-three/fiber library. Here's an example of importing and using one: \`import { Canvas } from "@react-three/fiber"\` & \`<Canvas><ambientLight /><Box ... />\`
        - If you can't use external texture, such as local file or online texture. Only use internal texture, such as solid color.
        - If you need to make HTTP requests, use the axios library. Here's an example of importing and using one: \`import axios from "axios"\` & \`axios.get("https://api.example.com/data")\`.
        - Please ONLY return the full React code starting with the imports, nothing else. It's very important for my job that you only return the React code with imports. DO NOT START WITH \`\`\`typescript or \`\`\`javascript or \`\`\`tsx or \`\`\`.
        - ONLY IF the user asks for a dashboard, graph or chart, the recharts library is available to be imported, e.g. \`import { LineChart, XAxis, ... } from "recharts"\` & \`<LineChart ...><XAxis dataKey="name"> ...\`. Please only use this when needed.

        NO OTHER LIBRARIES (e.g. zod, hookform) ARE INSTALLED OR ABLE TO BE IMPORTED.
      `;
    case SupportedType.python:
      return dedent`
        Write a Python code as a master coder, targeted to make a tutorial for beginners.
        The code finally will run in a code sandbox, so it has many limits, you must think more and avoid them before you coding.
        The case from user input should be simple and easy, if not, separate it into multiple sub tasks.
        The stdin is disabled, do not write the code with interactive behavior.
        The environment has common libraries including but not limited these:
        - requests
        - openai

        You should keep excellent coding habit such as clean and detailed comments, easy to read codes. You must follow best practices all time in the coding.

        At the start of the code, write some comments that tell user how to solve the task in concise.
        Don't explain the environment limits and other informations which user might don't need to know.

        The language of the comment must be same as the user input.
      `;
    case SupportedType["node.js"]:
      return dedent`
        Write a Node.js code as a master coder, targeted to make a tutorial for beginners.
        The code finally will run in a code sandbox, so it has many limits, you must think more and avoid them before you coding.
        The case from user input should be simple and easy, if not, separate it into multiple sub tasks.
        The stdin is disabled, do not write the code with interactive behavior.
        The environment has common libraries including but not limited these:
        - openai

        You should keep excellent coding habit such as clean and detailed comments, easy to read codes. You must follow best practices all time in the coding.

        At the start of the code, write some comments that tell user how to solve the task in concise.
        Don't explain the environment limits and other informations which user might don't need to know.

        The language of the comment must be same as the user input.
      `;
    default:
      return "";
  }
};
