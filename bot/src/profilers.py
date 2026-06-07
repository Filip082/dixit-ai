import abc
from sentence_transformers import SentenceTransformer, util
import torch
from pathlib import Path
import sys

MODEL_DIR = Path(__file__).resolve().parent.parent / "model"

class Profiler(abc.ABC):
    @abc.abstractmethod
    def profile_clue(self, clue: str):
        raise NotImplementedError("Profiler profile_clues not implemented")
    

class ClipProfiler(Profiler):
    def __init__(self) -> None:
        text_repo_id = "sentence-transformers/clip-ViT-B-32-multilingual-v1"
        text_target_dir = MODEL_DIR / text_repo_id
        if not text_target_dir.exists() or text_target_dir.stat().st_size == 0:
            print(f"Model not found at: {text_target_dir}")
            print("Please run: python3 bot/src/setup.py to download the model before starting the bot.", flush=True)
            sys.exit(1)

        self._model = SentenceTransformer(str(text_target_dir))

        self._feature_anchors = {
            "optymizm": ["radość", "szczęście", "nadzieja", "światło", "ładny", "miły", "przyjemny"],
            "pesymizm": ["smutek", "depresja", "ciemność", "brzydki", "paskudny", "okropny"],
            "neutralne": ["przedmiot", "miejsce", "zwierze"],
        }

        self._feature_anchors_embeddings = {
            feature: self._model.encode(words) for feature, words in self._feature_anchors.items()
        }


    def profile_clue(self, clue: str):
        haslo_embedding = self._model.encode([clue])
        
        feature_scores = []
        feature_names = []

        for feature, anchord_embeddings in self._feature_anchors_embeddings.items():
            sim = util.cos_sim(haslo_embedding, anchord_embeddings) * 100
            max_sim_for_feature = torch.max(sim)
            feature_scores.append(max_sim_for_feature)
            feature_names.append(feature)

        scores_tensor = torch.stack(feature_scores)
        softmaxed_scores = torch.nn.functional.softmax(scores_tensor, dim=0)

        retults = {name: round(score.item(), 4) for name, score in zip(feature_names, softmaxed_scores)}
        retults["best"] = feature_names[torch.argmax(scores_tensor).item()]
        return retults