from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent
RES = ROOT / "android" / "app" / "src" / "main" / "res"
ORANGE = (255, 103, 22, 255)
BLACK = (0, 0, 0, 255)

# Recreates the supplied black-and-orange AR mark as Android launcher icons.
# Each density gets a square icon with the circular AR mark centered.
DENSITIES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}
FONT_PATHS = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf",
]

def font_for(size):
    for path in FONT_PATHS:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()

def draw_mark(size, background):
    image = Image.new("RGBA", (size, size), background)
    draw = ImageDraw.Draw(image)
    margin = round(size * 0.025)
    stroke = max(2, round(size * 0.047))
    draw.ellipse((margin, margin, size - margin - 1, size - margin - 1),
                 outline=ORANGE, width=stroke)
    font = font_for(round(size * 0.56))
    text = "AR"
    box = draw.textbbox((0, 0), text, font=font, stroke_width=0)
    tw, th = box[2] - box[0], box[3] - box[1]
    max_width = size * 0.76
    if tw > max_width:
        font = font_for(round(font.size * max_width / tw))
        box = draw.textbbox((0, 0), text, font=font)
        tw, th = box[2] - box[0], box[3] - box[1]
    x = (size - tw) / 2 - box[0]
    y = (size - th) / 2 - box[1] - size * 0.015
    draw.text((round(x), round(y)), text, font=font, fill=ORANGE)
    return image

for folder, size in DENSITIES.items():
    target = RES / folder
    target.mkdir(parents=True, exist_ok=True)
    icon = draw_mark(size, BLACK)
    icon.save(target / "ic_launcher.png")
    icon.save(target / "ic_launcher_round.png")

# Android 8+ uses adaptive icons; replace the generated Flutter defaults too.
drawable = RES / "drawable"
drawable.mkdir(parents=True, exist_ok=True)
foreground = draw_mark(432, (0, 0, 0, 0))
foreground.save(drawable / "ar_launcher_foreground.png")

adaptive_dir = RES / "mipmap-anydpi-v26"
adaptive_dir.mkdir(parents=True, exist_ok=True)
adaptive_xml = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@android:color/black" />
    <foreground android:drawable="@drawable/ar_launcher_foreground" />
</adaptive-icon>
'''
(adaptive_dir / "ic_launcher.xml").write_text(adaptive_xml, encoding="utf-8")
(adaptive_dir / "ic_launcher_round.xml").write_text(adaptive_xml, encoding="utf-8")

print("Generated AR launcher icons including Android adaptive icons.")
