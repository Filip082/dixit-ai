import sentence_transformers
import open_clip
import torch
from typing import Any, List, Tuple
from pathlib import Path
import sys
from PIL import Image
import abc

MODEL_DIR = Path(__file__).resolve().parent.parent / "model"

class Matcher(abc.ABC):
    @abc.abstractmethod
    def choose_best_image(self, images: List[Image.Image], clue: str) -> Tuple[int, List[float]]:
        raise NotImplementedError("Matcher choose_best_image not implemented")
    
class OpenClipMatcher(Matcher):
    def __init__(self) -> None:
        repo_id = "laion/CLIP-ViT-B-32-laion2B-s34B-b79K"
        filename = "open_clip_pytorch_model.bin"
        MODEL_FILE = MODEL_DIR / repo_id / filename
        if not MODEL_FILE.exists() or MODEL_FILE.stat().st_size == 0:
            print(f"Model not found at: {MODEL_FILE}")
            print("Please run: python3 bot/src/setup.py to download the model before starting the bot.", flush=True)
            sys.exit(1)

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        model, _, preprocess = open_clip.create_model_and_transforms(
            "ViT-B-32", pretrained=str(MODEL_FILE)
        )
        self.model : Any = model.eval().to(self.device)
        self.preprocess : Any = preprocess
        self.tokenizer = open_clip.get_tokenizer("ViT-B-32")

    def choose_best_image(self, images: List[Image.Image], clue: str) -> Tuple[int, List[float]]:
        if not images:
            raise ValueError("At least one image is required")
        
        image_tensors = [self.preprocess(img).unsqueeze(0) for img in images]
        image_batch = torch.cat(image_tensors).to(self.device)
        text_tokens = self.tokenizer([clue]).to(self.device)

        with torch.no_grad():
            image_features = self.model.encode_image(image_batch)
            text_features = self.model.encode_text(text_tokens)

            image_features /= image_features.norm(dim=-1, keepdim=True)
            text_features /= text_features.norm(dim=-1, keepdim=True)

            probs_tensor = (100.0 * image_features @ text_features.T).softmax(dim=0).T
        
        probabilities = probs_tensor.squeeze(0).detach().cpu().tolist()
        best_index = probs_tensor.argmax().item()
        return best_index, probabilities

class SentenceTransformersMatcher(Matcher):
    def __init__(self) -> None:
        text_repo_id = "sentence-transformers/clip-ViT-B-32-multilingual-v1"
        text_target_dir = MODEL_DIR / text_repo_id
        if not text_target_dir.exists() or text_target_dir.stat().st_size == 0:
            print(f"Model not found at: {text_target_dir}")
            print("Please run: python3 bot/src/setup.py to download the model before starting the bot.", flush=True)
            sys.exit(1)

        img_repo_id = "clip-ViT-B-32"
        img_target_dir = MODEL_DIR / img_repo_id
        if not img_target_dir.exists() or img_target_dir.stat().st_size == 0:
            print(f"Model not found at: {img_target_dir}")
            print("Please run: python3 bot/src/setup.py to download the model before starting the bot.", flush=True)
            sys.exit(1)
        self._img_model = sentence_transformers.SentenceTransformer(str(img_target_dir))
        self._text_model = sentence_transformers.SentenceTransformer(str(text_target_dir))


    def choose_best_image(self, images: List[Image.Image], clue: str) -> Tuple[int, List[float]]:
        if not images:
            raise ValueError("At least one image is required")
        
        img_embeddings = self._img_model.encode(images)
        text_embeddings = self._text_model.encode([clue])

        cos_sim = sentence_transformers.util.cos_sim(text_embeddings, img_embeddings) * 100
        probs_tensor = cos_sim.softmax(dim=1)
        probabilities = probs_tensor.squeeze(0).detach().cpu().tolist()
        best_index = probs_tensor.argmax().item()
        return best_index, probabilities
    