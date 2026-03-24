import httpx
from typing import Optional


class TelegramService:
    """Service for sending messages via Telegram bot"""

    def __init__(self, bot_token: Optional[str] = None, chat_id: Optional[str] = None):
        self.bot_token = bot_token
        self.chat_id = chat_id
        self.base_url = "https://api.telegram.org"

    def is_configured(self) -> bool:
        """Check if Telegram is properly configured"""
        return bool(self.bot_token and self.chat_id)

    async def send_message(self, message: str) -> dict:
        """
        Send a message to Telegram chat

        Args:
            message: The message text to send

        Returns:
            dict: Response from Telegram API

        Raises:
            ValueError: If Telegram is not configured
            httpx.HTTPError: If the request fails
        """
        if not self.is_configured():
            raise ValueError("Telegram bot token or chat ID is not configured")

        url = f"{self.base_url}/bot{self.bot_token}/sendMessage"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json={
                    "chat_id": self.chat_id,
                    "text": message,
                    "parse_mode": "HTML",
                },
                timeout=10.0,
            )
            response.raise_for_status()
            return response.json()

    async def send_contact_message(
        self, user_email: str, user_name: str, subject: str, message: str
    ) -> dict:
        """
        Send a formatted contact message to Telegram

        Args:
            user_email: Email of the user sending the message
            user_name: Name of the user
            subject: Subject of the message
            message: Message content

        Returns:
            dict: Response from Telegram API
        """
        formatted_message = f"""
<b>📧 New Contact Message</b>

<b>From:</b> {user_name}
<b>Email:</b> {user_email}
<b>Subject:</b> {subject}

<b>Message:</b>
{message}
"""
        return await self.send_message(formatted_message)
