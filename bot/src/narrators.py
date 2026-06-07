import abc
import google.genai as genai
from google.genai.errors import APIError 
from PIL import Image
import io
import time
import re


class Narrator(abc.ABC):
    @abc.abstractmethod
    def generate_clue(self, image: Image.Image, lang: str) -> str:
        raise NotImplementedError("Narrator generate_clue not implemented")
    
class GeminiNarrator(Narrator):
    _max_attempts = 4

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

        last_error = None
        for attempt in range(1, self._max_attempts + 1): 
            try:
                response = self._client.models.generate_content(
                    model=self._model_name,
                    contents=[
                        genai.types.Part.from_bytes(
                            data=image_bytes_buffer.getvalue(),
                            mime_type="image/png",
                        ),
                        prompt,
                    ],
                )

                if not response.text:
                    raise RuntimeError("Gemini returned an empty clue.")
                return response.text

            except APIError as exc:
                last_error = exc
                if exc.code in [429, 503]:
                    if attempt == self._max_attempts:
                        break

                    error_str = str(exc)
                    match = re.search(r"'retryDelay':\s*'(\d+)s'", error_str)

                    if match:
                        sleep_time = int(match.group(1))
                        print(f"[Gemini {exc.code}] rate-limit. API demands waiting: {sleep_time}s.")

                    print(f"[Gemini Error {exc.code}] rate-limit. Attempt {attempt}/{self._max_attempts}. Retry in {sleep_time}s...")
                    time.sleep(sleep_time)
                else:
                    raise exc
                    
            except Exception as exc:
                last_error = exc
                if attempt == self._max_attempts:
                    break
                sleep_time = 2 ** attempt
                time.sleep(sleep_time)

        assert last_error is not None
        raise RuntimeError(f"Gemini failed after {self._max_attempts} attempts: {last_error}") from last_error