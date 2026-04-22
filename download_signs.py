import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont
import io
import os
import re

url = 'https://izmirparksurucukursu.com/trafik-levhalarinin-anlamlari/'
resp = requests.get(url)
soup = BeautifulSoup(resp.content, 'html.parser')

output_dir = '/Users/efe49/Desktop/rukisin ehliyet dünyası'
os.makedirs(output_dir, exist_ok=True)

def wrap_text(text, font, max_width):
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        # Check width
        line_str = ' '.join(current_line)
        # getsize is deprecated, use getbbox if available, otherwise getsize
        if hasattr(font, 'getbbox'):
            w = font.getbbox(line_str)[2]
        else:
            w = font.getsize(line_str)[0]
            
        if w > max_width:
            if len(current_line) == 1:
                lines.append(current_line[0])
                current_line = []
            else:
                current_line.pop()
                lines.append(' '.join(current_line))
                current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))
    return lines

idx = 1
for img in soup.find_all('img'):
    src = img.get('src')
    if not src or 'izmirparksuruculogo' in src or 'placeholder' in src or 'letter' in src or 'telephone' in src or 'otomag' in src or '9c234d22dd44' in src:
        continue
    
    parent = img.parent
    prev = parent.find_previous_sibling()
    text = ''
    if prev and prev.name in ['p', 'div']:
        text = prev.get_text(strip=True)
    
    if not text:
        text = "Trafik Levhası"

    print(f'Processing: {src}')
    
    # Download image
    try:
        img_resp = requests.get(src)
        img_resp.raise_for_status()
        base_img = Image.open(io.BytesIO(img_resp.content))
        if base_img.mode != 'RGB':
            base_img = base_img.convert('RGB')
    except Exception as e:
        print(f"Failed to download or open {src}: {e}")
        continue

    # Setup text rendering
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 16)
    except Exception:
        font = ImageFont.load_default()

    # Image dimensions
    img_w, img_h = base_img.size
    
    # Ensure min width for text readability
    canvas_w = max(img_w + 40, 400)
    
    # Wrap text
    lines = wrap_text(text, font, canvas_w - 40)
    
    # Calculate text block height
    line_height = 20
    text_height = len(lines) * line_height
    
    # Total canvas height
    canvas_h = img_h + text_height + 60
    
    # Create canvas
    canvas = Image.new('RGB', (canvas_w, canvas_h), color='white')
    
    # Paste image
    img_x = (canvas_w - img_w) // 2
    canvas.paste(base_img, (img_x, 20))
    
    # Draw text
    draw = ImageDraw.Draw(canvas)
    y_text = img_h + 40
    for line in lines:
        if hasattr(font, 'getbbox'):
            lw = font.getbbox(line)[2]
        else:
            lw = font.getsize(line)[0]
        x_text = (canvas_w - lw) // 2
        draw.text((x_text, y_text), line, font=font, fill='black')
        y_text += line_height

    # Generate filename
    # Sanitize text for filename or use index
    clean_name = re.sub(r'[^A-Za-z0-9]', '_', text.split(':')[0])[:30]
    filename = f"{idx:02d}_{clean_name}.jpg"
    filepath = os.path.join(output_dir, filename)
    
    canvas.save(filepath, 'JPEG')
    print(f'Saved: {filepath}')
    idx += 1

print("Done!")
