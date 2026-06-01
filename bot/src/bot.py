from functools import lru_cache
from dataclasses import dataclass
import os

from src.narrators import Narrator, GeminiNarrator
from src.matchers import Matcher, SentenceTransformersMatcher, OpenClipMatcher


@dataclass(frozen=True)
class BotConfig:
    narrator: str
    matcher: str

@lru_cache(maxsize=1)
def get_bot_config() -> BotConfig:
    return BotConfig("gemini", "sentence_transformers")


@lru_cache(maxsize=1)
def get_narrator() -> Narrator:
    narrator = get_bot_config().narrator
    if narrator == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY is not set.")
        return GeminiNarrator(api_key=api_key)
    
    raise RuntimeError("Invalid narrator config")


@lru_cache(maxsize=1)
def get_matcher() -> Matcher:
    matcher = get_bot_config().matcher
    if matcher == "sentence_transformers":
        return SentenceTransformersMatcher()
    elif matcher == "open_clip":
        return OpenClipMatcher()
    
    raise RuntimeError("Invalid matcher config")