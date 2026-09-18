import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()


class GeminiModels:
    @staticmethod
    def get_model(system_instruction: str, response_schema=None):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")
        client = genai.Client(api_key=api_key)

        class AsyncModelWrapper:
            def __init__(self, client, system_instruction, response_schema):
                self.client = client
                self.system_instruction = system_instruction
                self.response_schema = response_schema

            async def generate_content_async(self, prompt: str):
                config = types.GenerateContentConfig(
                    system_instruction=self.system_instruction,
                    temperature=0.2,
                )
                if self.response_schema:
                    config.response_mime_type = "application/json"
                    config.response_schema = self.response_schema

                response = await self.client.aio.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=config,
                )
                return response

        return AsyncModelWrapper(client, system_instruction, response_schema)
