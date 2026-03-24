import httpx
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
        self.timeout = httpx.Timeout(30.0)

        if self.provider == "anthropic":
            if not self.anthropic_api_key:
                raise ValueError("Anthropic API key is required")
        elif self.provider == "openai":
            if not self.openai_api_key:
                raise ValueError("OpenAI API key is required")
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
        """Chat with Anthropic Claude"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.anthropic_api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-3-haiku-20240307",
                    "max_tokens": 1024,
                    "messages": [{"role": "user", "content": message}],
                },
            )

            if response.status_code != 200:
                raise ValueError(
                    f"Claude API error: {response.status_code} - {response.text}"
                )

            data = response.json()
            if "content" in data and len(data["content"]) > 0:
                return data["content"][0]["text"]
            raise ValueError("No response from Claude API")

    async def _chat_with_openai(self, message: str) -> str:
        """Chat with OpenAI GPT"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": message}],
                    "max_tokens": 1024,
                },
            )

            if response.status_code != 200:
                raise ValueError(
                    f"OpenAI API error: {response.status_code} - {response.text}"
                )

            data = response.json()
            if "choices" in data and len(data["choices"]) > 0:
                return data["choices"][0]["message"]["content"]
            raise ValueError("No response from OpenAI API")
