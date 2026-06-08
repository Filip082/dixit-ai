from pathlib import Path
from huggingface_hub import hf_hub_download
from sentence_transformers import SentenceTransformer
from src.bot import get_bot_config

MODEL_DIR = Path(__file__).resolve().parent.parent / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

def main() -> None:
    matcher = get_bot_config().matcher
    print(f"Setting up matcher: {matcher}")
    if matcher == "open_clip":
        repo_id = "laion/CLIP-ViT-B-32-laion2B-s34B-b79K"
        filename = "open_clip_pytorch_model.bin"

        target_dir = MODEL_DIR / repo_id
        target_dir.mkdir(parents=True, exist_ok=True)
        target = target_dir / filename
        if target.exists() and target.stat().st_size > 0:
            print(f"Model already exists at: {target}")
            return


        downloaded_path = hf_hub_download(
            repo_id=repo_id,
            filename=filename,
            local_dir=str(target_dir),
        )

        print(f"Downloaded to: {downloaded_path}")
        print(f"Expected model path: {target}")

    elif matcher == "sentence_transformers":
        text_repo_id = "sentence-transformers/clip-ViT-B-32-multilingual-v1"
        text_target_dir = MODEL_DIR / text_repo_id

        if not text_target_dir.exists() or text_target_dir.stat().st_size == 0:
            print("Downloading text model")
            text_model = SentenceTransformer(text_repo_id)
            text_model.save(text_target_dir)
            print(f"Downloaded to: {text_target_dir}")

        img_repo_id = "clip-ViT-B-32"
        img_target_dir = MODEL_DIR / img_repo_id

        if not img_target_dir.exists() or img_target_dir.stat().st_size == 0:
            print("Downloading image model")
            img_model = SentenceTransformer(img_repo_id)
            img_model.save(img_target_dir)
            print(f"Downloaded to: {img_target_dir}")
    else:
        print(f"Matcher: {matcher} not found")

if __name__ == "__main__":
    main()