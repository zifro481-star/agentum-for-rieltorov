import os
import sys
from rembg import remove, new_session
from PIL import Image

SRC = ".tmp-frames-src"
OUT = "public/manyasha/frames"
os.makedirs(OUT, exist_ok=True)

# u2net — универсальная модель сегментации
session = new_session("u2net")

files = sorted(f for f in os.listdir(SRC) if f.lower().endswith(".png"))
print(f"Найдено кадров: {len(files)}")

for i, name in enumerate(files, 1):
    src_path = os.path.join(SRC, name)
    with open(src_path, "rb") as fh:
        data = fh.read()
    # alpha_matting даёт более чистые края
    out = remove(
        data,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=3,
    )
    out_path = os.path.join(OUT, name)
    with open(out_path, "wb") as fh:
        fh.write(out)
    # автокроп прозрачных полей, чтобы фигура была по центру
    img = Image.open(out_path).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        img.crop(bbox).save(out_path)
    print(f"[{i}/{len(files)}] {name} готов")

print("Готово")
