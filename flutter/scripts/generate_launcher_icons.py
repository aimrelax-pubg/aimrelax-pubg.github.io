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

def draw_icon(size):
    image = Image.new("RGBA", (size, size), BLACK)
    draw = ImageDraw.Draw(image)
    margin = round(size * 0.025)
    stroke = max(2, round(size * 0.047))
    draw.ellipse((margin, margin, size - margin - 1, size - margin - 1),
                 outline=ORANGE, width=stroke)
    font = font_for(round(size * 0.56))
    text = "AR"
    box = draw.textbbox((0, 0), text, font=font, stroke_width=0)
    tw, th = box[2] - box[0], box[3] - box[1]
    # Keep the letters centered and safely inside the circular border.
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
    icon = draw_icon(size)
    icon.save(target / "ic_launcher.png")
    icon.save(target / "ic_launcher_round.png")

print("Generated orange AR launcher icons in all Android densities.")
