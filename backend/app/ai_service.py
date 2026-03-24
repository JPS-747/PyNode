import httpx
import anthropic
import openai
from typing import Optional


class AIService:
    """Service for interacting with AI providers (Anthropic Claude or OpenAI)"""

    def __init__(
        self,
        provider: str,
        anthropic_api_key: Optional[str] = None,
        openai_api_key: Optional[str] = None,
    ):
        self.provider = provider.lower()
        self.anthropic_api_key = anthropic_api_key
        self.openai_api_key = openai_api_key

        if self.provider == "anthropic":
            if not self.anthropic_api_key:
                raise ValueError("Anthropic API key is required")
            self.anthropic_client = anthropic.Anthropic(
                api_key=self.anthropic_api_key
            )
        elif self.provider == "openai":
            if not self.openai_api_key:
                raise ValueError("OpenAI API key is required")
            self.openai_client = openai.OpenAI(api_key=self.openai_api_key)
        else:
            raise ValueError(f"Unsupported AI provider: {provider}")

    def is_configured(self) -> bool:
        """Check if the AI provider is properly configured"""
        if self.provider == "anthropic":
            return bool(self.anthropic_api_key)
        elif self.provider == "openai":
            return bool(self.openai_api_key)
        return False

    async def chat(self, message: str) -> str:
        """Send a message to the configured AI provider and get a response"""
        if self.provider == "anthropic":
            return await self._chat_with_claude(message)
        elif self.provider == "openai":
            return await self._chat_with_openai(message)
        raise ValueError(f"Unsupported AI provider: {self.provider}")

    async def _chat_with_claude(self, message: str) -> str:
        """Chat with Anthropic Claude using official SDK"""
        try:
            response = self.anthropic_client.messages.create(
                model="claude-sonnet-4.6",
                max_tokens=1024,
                messages=[{"role": "user", "content": message}],
            )
            if response.content and len(response.content) > 0:
                return response.content[0].text
            raise ValueError("No response from Claude API")
        except anthropic.APIError as e:
            raise ValueError(f"Claude API error: {str(e)}")

    async def _chat_with_openai(self, message: str) -> str:
        """Chat with OpenAI GPT using official SDK"""
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": message}],
                max_tokens=1024,
            )
            if response.choices and len(response.choices) > 0:
                return response.choices[0].message.content or ""
            raise ValueError("No response from OpenAI API")
        except openai.APIError as e:
            raise ValueError(f"OpenAI API error: {str(e)}")
