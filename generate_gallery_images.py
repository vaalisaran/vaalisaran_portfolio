import os
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

out_dir = r"d:\Saran Projects\Downloads\portfolio\images"
os.makedirs(out_dir, exist_ok=True)

def gen_space():
    img = Image.new('RGB', (1200, 900), (8, 12, 28))
    draw = ImageDraw.Draw(img)
    for _ in range(70):
        cx, cy = random.randint(100, 1100), random.randint(100, 800)
        r = random.randint(120, 350)
        color = random.choice([(147, 51, 234), (79, 70, 229), (6, 182, 212), (236, 72, 153), (16, 185, 129)])
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=color)
    img = img.filter(ImageFilter.GaussianBlur(100))
    draw = ImageDraw.Draw(img)
    for _ in range(500):
        x, y = random.randint(0, 1200), random.randint(0, 900)
        s = random.choice([1, 1, 2, 2, 3, 4])
        b = random.randint(190, 255)
        draw.ellipse([x, y, x+s, y+s], fill=(b, b, b))
    # Glowing Core
    draw.ellipse([450, 320, 750, 580], fill=(240, 245, 255))
    img = img.filter(ImageFilter.GaussianBlur(12))
    img.save(os.path.join(out_dir, "gallery_space_nebula.jpg"), quality=92)

def gen_cyber():
    img = Image.new('RGB', (1200, 800), (5, 5, 15))
    draw = ImageDraw.Draw(img)
    for y in range(500):
        t = y / 500
        r = int(10 + t * 40)
        g = int(5 + t * 15)
        b = int(30 + t * 80)
        draw.line([(0, y), (1200, y)], fill=(r, g, b))
    for i in range(20):
        bx = i * 65 - 30
        bw = random.randint(55, 110)
        bh = random.randint(250, 620)
        by = 800 - bh
        c = random.choice([(15, 23, 42), (30, 27, 75), (17, 24, 39)])
        draw.rectangle([bx, by, bx+bw, 800], fill=c)
        neon = random.choice([(6, 182, 212), (244, 63, 94), (168, 85, 247), (250, 204, 21)])
        for wx in range(bx+8, bx+bw-8, 12):
            for wy in range(by+15, 780, 22):
                if random.random() > 0.35:
                    draw.rectangle([wx, wy, wx+6, wy+14], fill=neon)
    img.save(os.path.join(out_dir, "gallery_cyber_city.jpg"), quality=92)

def gen_sunset():
    img = Image.new('RGB', (1200, 800), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    for y in range(800):
        t = y / 800
        r = int(255 * (1 - t*0.5))
        g = int(110 * (1 - t*0.8) + 30 * t)
        b = int(60 * (1 - t) + 130 * t)
        draw.line([(0, y), (1200, y)], fill=(r, g, b))
    draw.ellipse([500, 200, 700, 400], fill=(255, 240, 180))
    for m, col in enumerate([(60, 20, 50), (40, 15, 40), (20, 8, 30)]):
        pts = [(0, 800)]
        for x in range(0, 1250, 40):
            my = 380 + m*90 + int(math.sin(x*0.008 + m)*110 + math.cos(x*0.02)*40)
            pts.append((x, my))
        pts.append((1200, 800))
        draw.polygon(pts, fill=col)
    img.save(os.path.join(out_dir, "gallery_sunset_mountains.jpg"), quality=92)

def gen_minimal_arch():
    img = Image.new('RGB', (900, 1200), (242, 239, 233))
    draw = ImageDraw.Draw(img)
    draw.rectangle([150, 300, 550, 1200], fill=(217, 119, 6)) # Terracotta pillar
    draw.rectangle([450, 150, 800, 950], fill=(14, 116, 144))  # Deep cyan block
    draw.ellipse([250, 100, 650, 500], fill=(245, 158, 11))  # Amber sun arc
    draw.polygon([(600, 400), (850, 700), (600, 1000)], fill=(30, 41, 59)) # Shadow triangle
    img.save(os.path.join(out_dir, "gallery_minimal_arch.jpg"), quality=92)

def gen_botanical():
    img = Image.new('RGB', (1000, 1000), (10, 30, 20))
    draw = ImageDraw.Draw(img)
    for _ in range(50):
        cx, cy = random.randint(100, 900), random.randint(100, 900)
        r = random.randint(80, 260)
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(16, 185, 129))
    img = img.filter(ImageFilter.GaussianBlur(60))
    draw = ImageDraw.Draw(img)
    # Draw leaf veins
    for i in range(12):
        angle = i * (math.pi / 6)
        x2 = 500 + int(math.cos(angle)*420)
        y2 = 500 + int(math.sin(angle)*420)
        draw.line([(500, 500), (x2, y2)], fill=(167, 243, 208), width=4)
        draw.ellipse([x2-20, y2-20, x2+20, y2+20], fill=(52, 211, 153))
    img.save(os.path.join(out_dir, "gallery_botanical_macro.jpg"), quality=92)

def gen_360_observatory():
    img = Image.new('RGB', (1600, 800), (10, 15, 30))
    draw = ImageDraw.Draw(img)
    # Horizon sky
    for y in range(400):
        draw.line([(0, y), (1600, y)], fill=(15, 23, 42 + int(y*0.1)))
    # Dome silhouette
    draw.ellipse([600, 200, 1000, 600], fill=(50, 65, 85))
    draw.rectangle([600, 400, 1000, 650], fill=(50, 65, 85))
    draw.rectangle([780, 220, 820, 600], fill=(15, 23, 42)) # Shutter slot
    # Star trails
    for r in range(50, 600, 25):
        draw.arc([800-r, 300-r, 800+r, 300+r], start=0, end=180, fill=(200, 225, 255), width=2)
    img.save(os.path.join(out_dir, "gallery_360_observatory.jpg"), quality=92)

def gen_retouch_before_after():
    # Before photo
    b_img = Image.new('RGB', (1000, 1000), (140, 130, 120))
    draw = ImageDraw.Draw(b_img)
    draw.ellipse([300, 250, 700, 750], fill=(190, 160, 140)) # Portrait head shape
    draw.ellipse([400, 420, 460, 470], fill=(80, 60, 50)) # Eyes
    draw.ellipse([540, 420, 600, 470], fill=(80, 60, 50))
    draw.line([(500, 470), (490, 560), (510, 560)], fill=(150, 120, 100), width=3) # Nose
    draw.arc([420, 600, 580, 660], start=10, end=170, fill=(160, 90, 90), width=6) # Mouth
    # Noise/Muted tones for before
    b_img = b_img.filter(ImageFilter.GaussianBlur(2))
    b_img.save(os.path.join(out_dir, "gallery_portrait_raw.jpg"), quality=90)
    
    # After photo (crisp, vibrance, color graded)
    a_img = Image.new('RGB', (1000, 1000), (30, 35, 45))
    draw = ImageDraw.Draw(a_img)
    draw.ellipse([300, 250, 700, 750], fill=(225, 180, 155)) # Warm skin
    draw.ellipse([395, 415, 465, 475], fill=(34, 211, 238)) # Vivid cyan iris
    draw.ellipse([535, 415, 605, 475], fill=(34, 211, 238))
    draw.line([(500, 470), (490, 560), (510, 560)], fill=(180, 130, 110), width=4)
    draw.arc([420, 600, 580, 660], start=10, end=170, fill=(244, 63, 94), width=8)
    a_img.save(os.path.join(out_dir, "gallery_portrait_retouched.jpg"), quality=95)

def gen_abstract_fluid():
    img = Image.new('RGB', (1200, 900), (15, 23, 42))
    draw = ImageDraw.Draw(img)
    for i in range(60):
        x = i * 20
        pts = []
        for y in range(0, 920, 10):
            dx = x + math.sin(y*0.015 + i*0.2) * 80 + math.cos(y*0.005) * 40
            pts.append((dx, y))
        col = (int(100 + 155*math.sin(i*0.1)), int(180 + 75*math.cos(i*0.1)), int(220 + 35*math.sin(i*0.2)))
        draw.line(pts, fill=col, width=6)
    img = img.filter(ImageFilter.GaussianBlur(15))
    img.save(os.path.join(out_dir, "gallery_abstract_fluid.jpg"), quality=92)

gen_space()
gen_cyber()
gen_sunset()
gen_minimal_arch()
gen_botanical()
gen_360_observatory()
gen_retouch_before_after()
gen_abstract_fluid()
print("All static gallery images generated successfully!")
