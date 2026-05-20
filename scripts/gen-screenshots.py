from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "mentalia-app", "public", "screenshots")
os.makedirs(OUT, exist_ok=True)

W, H = 1080, 1920

# Colors
DARK   = (45, 106, 79)    # #2D6A4F
MED    = (64, 145, 108)   # #40916C
LIGHT  = (216, 243, 220)  # #D8F3DC
WHITE  = (253, 252, 250)  # #FDFCFA
GRAY   = (107, 114, 128)
LGRAY  = (243, 244, 246)
BLACK  = (17, 24, 39)
MINT   = (240, 250, 243)

def font(size, bold=False):
    try:
        name = "arialbd.ttf" if bold else "arial.ttf"
        return ImageFont.truetype(name, size)
    except Exception:
        return ImageFont.load_default(size)

def rounded_rect(draw, xy, radius, fill):
    x0, y0, x1, y1 = xy
    draw.rectangle([x0 + radius, y0, x1 - radius, y1], fill=fill)
    draw.rectangle([x0, y0 + radius, x1, y1 - radius], fill=fill)
    draw.ellipse([x0, y0, x0 + 2*radius, y0 + 2*radius], fill=fill)
    draw.ellipse([x1 - 2*radius, y0, x1, y0 + 2*radius], fill=fill)
    draw.ellipse([x0, y1 - 2*radius, x0 + 2*radius, y1], fill=fill)
    draw.ellipse([x1 - 2*radius, y1 - 2*radius, x1, y1], fill=fill)

def card(draw, x, y, w, h, title, subtitle, accent=None, bg=None):
    bg = bg or WHITE
    rounded_rect(draw, (x, y, x+w, y+h), 20, bg)
    if accent:
        draw.rectangle([x, y, x+6, y+h], fill=accent)
    draw.text((x+28, y+24), title, fill=BLACK, font=font(38, bold=True))
    if subtitle:
        draw.text((x+28, y+76), subtitle, fill=GRAY, font=font(30))

def status_dot(draw, x, y, color):
    draw.ellipse([x, y, x+18, y+18], fill=color)

# ─────────────────────────────────────────────
# SCREENSHOT 1 — Dashboard profesional
# ─────────────────────────────────────────────
img = Image.new("RGB", (W, H), WHITE)
draw = ImageDraw.Draw(img)

# Sidebar
draw.rectangle([0, 0, 220, H], fill=DARK)
draw.text((30, 60), "Mentalia", fill=WHITE, font=font(44, bold=True))
items = [("Inicio", True), ("Agenda", False), ("Pacientes", False), ("Historia", False), ("Mensajes", False), ("Pagos", False)]
for i, (label, active) in enumerate(items):
    y = 200 + i * 100
    if active:
        draw.rectangle([0, y-8, 220, y+56], fill=MED)
    draw.text((30, y), label, fill=WHITE if active else (200, 220, 210), font=font(34, bold=active))

# Header
draw.rectangle([220, 0, W, 110], fill=WHITE)
draw.line([220, 110, W, 110], fill=LGRAY, width=2)
draw.text((260, 32), "Mi consultorio", fill=BLACK, font=font(52, bold=True))
draw.text((260, 94), "Lunes 19 de mayo, 2025", fill=GRAY, font=font(28))

# Welcome card
rounded_rect(draw, (240, 140, W-40, 310), 20, MINT)
draw.text((280, 170), "Buen día, Dr. Martínez", fill=DARK, font=font(40, bold=True))
draw.text((280, 228), "Tenés 3 sesiones programadas para hoy.", fill=GRAY, font=font(30))

# Stat cards
stats = [
    ("8", "Pacientes activos", MED),
    ("3", "Sesiones hoy", DARK),
    ("5", "Esta semana", (82, 183, 136)),
]
cx = 240
for val, label, color in stats:
    cw = (W - 280) // 3 - 10
    rounded_rect(draw, (cx, 340, cx+cw, 500), 20, WHITE)
    draw.text((cx + cw//2 - 20, 365), val, fill=color, font=font(72, bold=True))
    draw.text((cx + 20, 455), label, fill=GRAY, font=font(26))
    cx += cw + 15

# Próxima sesión
rounded_rect(draw, (240, 530, W-40, 700), 20, WHITE)
draw.text((280, 558), "Próxima sesión", fill=DARK, font=font(34, bold=True))
draw.line([240, 600, W-40, 600], fill=LGRAY, width=1)
rounded_rect(draw, (280, 618, W-80, 680), 16, MINT)
draw.text((310, 637), "15:00 hs  —  María González", fill=DARK, font=font(32, bold=True))

# Sesiones del día
draw.text((260, 730), "Sesiones de hoy", fill=BLACK, font=font(36, bold=True))
sessions = [
    ("10:00 hs", "Juan P.", "Confirmada", MED),
    ("12:30 hs", "Laura M.", "Confirmada", MED),
    ("15:00 hs", "María G.", "Próxima", DARK),
    ("17:00 hs", "Carlos R.", "Pendiente", (156, 163, 175)),
]
for i, (hora, nombre, estado, color) in enumerate(sessions):
    y = 790 + i * 105
    rounded_rect(draw, (240, y, W-40, y+88), 16, WHITE)
    draw.rectangle([240, y, 246, y+88], fill=color)
    status_dot(draw, W-130, y+34, color)
    draw.text((270, y+16), hora, fill=GRAY, font=font(28))
    draw.text((270, y+50), nombre, fill=BLACK, font=font(34, bold=True))
    draw.text((W-200, y+50), estado, fill=color, font=font(26))

# Bottom bar
rounded_rect(draw, (240, 1240, W-40, 1600), 20, WHITE)
draw.text((280, 1268), "Resumen de ingresos", fill=DARK, font=font(36, bold=True))
draw.line([240, 1318, W-40, 1318], fill=LGRAY, width=1)
draw.text((280, 1348), "Este mes", fill=GRAY, font=font(28))
draw.text((280, 1395), "$ 148.000 ARS", fill=DARK, font=font(56, bold=True))
# mini bar chart
bars = [60, 80, 55, 90, 75, 100, 70]
bw = 60
bx = 280
for bv in bars:
    bh = int(bv * 1.2)
    draw.rectangle([bx, 1580-bh, bx+bw-8, 1580], fill=LIGHT)
    bx += bw + 12
draw.text((280, 1600), "Lu   Ma   Mi   Ju   Vi   Sá   Do", fill=GRAY, font=font(24))

# Branding
rounded_rect(draw, (0, H-90, W, H), 0, DARK)
draw.text((W//2 - 80, H-62), "mentaliasalud.online", fill=(200, 230, 210), font=font(28))

img.save(os.path.join(OUT, "screenshot1.png"))
print("screenshot1.png OK")


# ─────────────────────────────────────────────
# SCREENSHOT 2 — Agenda semanal
# ─────────────────────────────────────────────
img = Image.new("RGB", (W, H), WHITE)
draw = ImageDraw.Draw(img)

# Header
draw.rectangle([0, 0, W, 160], fill=DARK)
draw.text((60, 40), "Mentalia", fill=WHITE, font=font(36, bold=True))
draw.text((60, 92), "Agenda de la semana", fill=(200, 230, 210), font=font(28))

# Week navigator
rounded_rect(draw, (40, 180, W-40, 260), 20, MINT)
draw.text((80, 205), "< ", fill=DARK, font=font(36, bold=True))
draw.text((200, 200), "19 – 25 de mayo, 2025", fill=DARK, font=font(36, bold=True))
draw.text((W-120, 205), " >", fill=DARK, font=font(36, bold=True))

# Day headers
days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
nums = ["19", "20", "21", "22", "23", "24"]
col_w = (W - 80) // 6
for i, (d, n) in enumerate(zip(days, nums)):
    cx = 40 + i * col_w + col_w // 2
    if i == 0:
        draw.ellipse([cx-30, 285, cx+30, 345], fill=MED)
        draw.text((cx-14, 298), n, fill=WHITE, font=font(32, bold=True))
    else:
        draw.text((cx-14, 298), n, fill=BLACK, font=font(32))
    draw.text((cx-20, 355), d, fill=GRAY, font=font(26))

# Time slots
hours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
row_h = 110
top = 405
events = {
    (0, 0): ("María G.", MED),
    (0, 2): ("Juan P.", MED),
    (1, 1): ("Laura M.", DARK),
    (1, 4): ("Carlos R.", MED),
    (2, 0): ("Andrea S.", DARK),
    (2, 3): ("Martín L.", MED),
    (3, 1): ("Sofia T.", MED),
    (3, 6): ("Pedro N.", DARK),
    (4, 0): ("Elena R.", MED),
    (4, 2): ("Diego A.", DARK),
    (5, 3): ("Ana V.", MED),
}

for r, hour in enumerate(hours):
    y = top + r * row_h
    draw.line([0, y, W, y], fill=LGRAY, width=1)
    draw.text((10, y + 8), hour, fill=GRAY, font=font(22))

for (col, row), (name, color) in events.items():
    x = 40 + col * col_w + 4
    y = top + row * row_h + 4
    rounded_rect(draw, (x, y, x + col_w - 8, y + row_h - 8), 12, color)
    short = name.split()[0]
    draw.text((x + 10, y + 12), short, fill=WHITE, font=font(24, bold=True))
    draw.text((x + 10, y + 44), "55 min", fill=(200, 230, 210), font=font(20))

# CTA
rounded_rect(draw, (40, top + len(hours)*row_h + 30, W-40, top + len(hours)*row_h + 130), 20, MED)
draw.text((W//2 - 130, top + len(hours)*row_h + 60), "+ Nueva sesión", fill=WHITE, font=font(38, bold=True))

# Branding
draw.rectangle([0, H-90, W, H], fill=DARK)
draw.text((W//2 - 80, H-62), "mentaliasalud.online", fill=(200, 230, 210), font=font(28))

img.save(os.path.join(OUT, "screenshot2.png"))
print("screenshot2.png OK")


# ─────────────────────────────────────────────
# SCREENSHOT 3 — Mis pacientes
# ─────────────────────────────────────────────
img = Image.new("RGB", (W, H), WHITE)
draw = ImageDraw.Draw(img)

# Header
draw.rectangle([0, 0, W, 160], fill=DARK)
draw.text((60, 40), "Mentalia", fill=WHITE, font=font(36, bold=True))
draw.text((60, 92), "Mis pacientes", fill=(200, 230, 210), font=font(28))

# Search bar
rounded_rect(draw, (40, 180, W-40, 260), 16, LGRAY)
draw.text((80, 205), "Buscar paciente...", fill=GRAY, font=font(30))

# Stats row
for i, (val, label) in enumerate([("8", "Activos"), ("2", "Alta reciente"), ("1", "En seguimiento")]):
    x = 40 + i * 340
    rounded_rect(draw, (x, 280, x+320, 380), 16, MINT)
    draw.text((x+20, 295), val, fill=DARK, font=font(48, bold=True))
    draw.text((x+20, 347), label, fill=GRAY, font=font(26))

pacientes = [
    ("María González", "Última sesión: hoy 15:00", "Activa", MED),
    ("Juan Pérez", "Última sesión: ayer", "Activo", MED),
    ("Laura Martínez", "Última sesión: hace 3 días", "Activa", MED),
    ("Carlos Rodríguez", "Última sesión: hace 5 días", "Activo", DARK),
    ("Andrea Sánchez", "Última sesión: hace 1 semana", "Seguimiento", (245, 158, 11)),
    ("Martín López", "Última sesión: hace 2 semanas", "Inactivo", (156, 163, 175)),
    ("Sofía Torres", "Última sesión: ayer", "Activa", MED),
    ("Pedro Navarro", "Última sesión: hoy 10:00", "Activo", MED),
]

initials_colors = [MED, DARK, (82, 183, 136), DARK, (245, 158, 11), (107, 114, 128), MED, DARK]

for i, ((name, last, status, color), ic) in enumerate(zip(pacientes, initials_colors)):
    y = 410 + i * 155
    rounded_rect(draw, (40, y, W-40, y+138), 16, WHITE)
    # Avatar
    draw.ellipse([60, y+24, 130, y+114], fill=ic)
    initials = "".join(w[0] for w in name.split()[:2])
    draw.text((76, y+50), initials, fill=WHITE, font=font(32, bold=True))
    # Info
    draw.text((150, y+24), name, fill=BLACK, font=font(36, bold=True))
    draw.text((150, y+72), last, fill=GRAY, font=font(26))
    # Status badge
    bw = len(status) * 17 + 30
    rounded_rect(draw, (W-80-bw, y+72, W-60, y+110), 14, (*color, 30) if len(color) == 3 else LIGHT)
    draw.text((W-75-bw+10, y+82), status, fill=color, font=font(24, bold=True))
    # Separator
    draw.line([40, y+138, W-40, y+138], fill=LGRAY, width=1)

# Add button
rounded_rect(draw, (40, 410 + 8*155 + 20, W-40, 410 + 8*155 + 120), 20, MED)
draw.text((W//2 - 130, 410 + 8*155 + 50), "+ Nuevo paciente", fill=WHITE, font=font(38, bold=True))

draw.rectangle([0, H-90, W, H], fill=DARK)
draw.text((W//2 - 80, H-62), "mentaliasalud.online", fill=(200, 230, 210), font=font(28))

img.save(os.path.join(OUT, "screenshot3.png"))
print("screenshot3.png OK")


# ─────────────────────────────────────────────
# SCREENSHOT 4 — App paciente: Diario emocional
# ─────────────────────────────────────────────
img = Image.new("RGB", (W, H), WHITE)
draw = ImageDraw.Draw(img)

# Header
draw.rectangle([0, 0, W, 160], fill=MED)
draw.text((60, 40), "Mentalia", fill=WHITE, font=font(36, bold=True))
draw.text((60, 92), "Mi espacio", fill=(200, 230, 210), font=font(28))

# Main question
draw.text((60, 200), "¿Cómo te sentís hoy?", fill=BLACK, font=font(52, bold=True))
draw.text((60, 272), "Lunes, 19 de mayo", fill=GRAY, font=font(30))

# Mood emojis
moods = [
    ("😔", "Mal"),
    ("😐", "Regular"),
    ("🙂", "Bien"),
    ("😊", "Muy bien"),
    ("🤩", "Excelente"),
]
em_w = (W - 80) // 5
for i, (emoji, label) in enumerate(moods):
    x = 40 + i * em_w + em_w // 2
    selected = i == 3
    if selected:
        draw.ellipse([x-60, 340, x+60, 460], fill=LIGHT)
        draw.ellipse([x-58, 342, x+58, 458], fill=LIGHT)
    draw.text((x-36, 355), emoji, font=font(68), fill=BLACK)
    draw.text((x - len(label)*8, 462), label, fill=DARK if selected else GRAY, font=font(24, bold=selected))

# Slider
draw.text((60, 530), "Intensidad  7 / 10", fill=BLACK, font=font(34, bold=True))
draw.rectangle([60, 584, W-60, 620], fill=LGRAY)
draw.rectangle([60, 584, 60 + int((W-120)*0.7), 620], fill=MED)
draw.ellipse([60 + int((W-120)*0.7) - 24, 576, 60 + int((W-120)*0.7) + 24, 624], fill=DARK)

# Emotions chips
draw.text((60, 660), "¿Qué estás sintiendo?", fill=BLACK, font=font(34, bold=True))
emotions = [("Tranquilidad", True), ("Alegría", True), ("Esperanza", False), ("Ansiedad", False), ("Cansancio", False), ("Gratitud", True), ("Incertidumbre", False), ("Motivación", False)]
ex, ey = 60, 720
for em, sel in emotions:
    ew = len(em) * 22 + 40
    if ex + ew > W - 60:
        ex = 60
        ey += 80
    rounded_rect(draw, (ex, ey, ex+ew, ey+58), 29, MED if sel else LGRAY)
    draw.text((ex+20, ey+14), em, fill=WHITE if sel else GRAY, font=font(28, bold=sel))
    ex += ew + 16

# Notes
ey += 100
draw.text((60, ey), "Nota del día (opcional)", fill=BLACK, font=font(34, bold=True))
rounded_rect(draw, (60, ey+50, W-60, ey+230), 16, LGRAY)
draw.text((90, ey+80), "Hoy tuve una buena jornada. Me sentí con", fill=GRAY, font=font(28))
draw.text((90, ey+118), "energía y pude concentrarme mejor que", fill=GRAY, font=font(28))
draw.text((90, ey+156), "otros días...", fill=GRAY, font=font(28))

# Progress section
py = ey + 270
draw.text((60, py), "Tu semana", fill=BLACK, font=font(36, bold=True))
days_w = ["L", "M", "M", "J", "V", "S", "D"]
vals   = [6, 7, 5, 8, 7, 0, 0]
bw2 = (W - 120) // 7
for i, (d, v) in enumerate(zip(days_w, vals)):
    bx2 = 60 + i * bw2
    bh2 = int(v * 14)
    if v:
        rounded_rect(draw, (bx2+10, py+140-bh2, bx2+bw2-10, py+140), 8, MED if i < 4 else LIGHT)
    else:
        rounded_rect(draw, (bx2+10, py+120, bx2+bw2-10, py+140), 8, LGRAY)
    draw.text((bx2 + bw2//2 - 10, py+150), d, fill=GRAY, font=font(26))

# CTA
rounded_rect(draw, (60, py+200, W-60, py+300), 20, MED)
draw.text((W//2-130, py+232), "Guardar registro", fill=WHITE, font=font(40, bold=True))

# Next session
rounded_rect(draw, (60, py+330, W-60, py+460), 20, MINT)
draw.text((100, py+358), "Próxima sesión con tu psicólogo/a", fill=DARK, font=font(28))
draw.text((100, py+400), "Miércoles 21 a las 17:00 hs", fill=DARK, font=font(36, bold=True))

draw.rectangle([0, H-90, W, H], fill=DARK)
draw.text((W//2 - 80, H-62), "mentaliasalud.online", fill=(200, 230, 210), font=font(28))

img.save(os.path.join(OUT, "screenshot4.png"))
print("screenshot4.png OK")
print("\nTodas las capturas generadas.")
