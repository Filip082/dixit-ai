import abc
import google.genai as genai
from PIL import Image
import io


class Narrator(abc.ABC):
    @abc.abstractmethod
    def generate_clue(self, image: Image.Image, lang: str) -> str:
        raise NotImplementedError("Narrator generate_clue not implemented")
    
class GeminiNarrator(Narrator):
    def __init__(self, api_key: str, model_name: str = "gemini-3.1-flash-lite") -> None:
        self._client = genai.Client(api_key=api_key)
        self._model_name = model_name

    def generate_clue(self, image: Image.Image, lang: str) -> str:
        language_map = {
            "pl": "Polish",
            "en": "English",
            "de": "German",
            "es": "Spanish"
        }

        target_language = language_map.get(lang, "Polish")

        prompt = (
            f"CRITICAL: You must write your response strictly in the {target_language} language.\n\n"
            "Role: You are a Dixit narrator.\n"
            "Task: Create one short, poetic clue (3-5 words) for the provided image.\n"
            "Style: Imaginative, metaphorical, indirect, and artistic. Avoid literal descriptions.\n"
            "Output format: Return ONLY the raw clue text. Do not include quotes, explanations, or introductory text."
        )

        image_bytes_buffer = io.BytesIO()
        image.convert("RGB").save(image_bytes_buffer, format="PNG")

        response = self._client.models.generate_content(
            model=self._model_name,
            contents=[
                genai.types.Part.from_bytes(
                    data=image_bytes_buffer.getvalue(),
                    mime_type="image/png",
                ),
                prompt
            ]
        )
        
        if not response.text:
            raise RuntimeError("Gemini returned an empty clue.")
        return response.text