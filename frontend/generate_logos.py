import os

LOGOS_DIR = "c:\\ConstructIA_MVP\\frontend\\public\\logos"
os.makedirs(LOGOS_DIR, exist_ok=True)

companies = [
    {"name": "BHP", "file": "bhp.svg", "bg": "#f9620b", "text": "white", "label": "BHP"},
    {"name": "Codelco", "file": "codelco.svg", "bg": "#008375", "text": "white", "label": "CODELCO"},
    {"name": "Collahuasi", "file": "collahuasi.svg", "bg": "#1e3a8a", "text": "white", "label": "COLLAHUASI"},
    {"name": "Anglo American", "file": "anglo.svg", "bg": "#004b87", "text": "white", "label": "ANGLO"},
    {"name": "Teck", "file": "teck.svg", "bg": "#007ac3", "text": "white", "label": "TECK"},
    {"name": "Glencore", "file": "glencore.svg", "bg": "#54565b", "text": "white", "label": "GLENCORE"},
    {"name": "Capstone", "file": "capstone.svg", "bg": "#006747", "text": "white", "label": "CAPSTONE"},
    {"name": "Antofagasta Minerals", "file": "amsas.svg", "bg": "#003366", "text": "white", "label": "AMSA"},
    {"name": "Lundin Mining", "file": "lundin.svg", "bg": "#003057", "text": "white", "label": "LUNDIN"},
    {"name": "Minera Escondida", "file": "escondida.svg", "bg": "#f9620b", "text": "white", "label": "MEL"}, # BHP Variant
    {"name": "Cerro Colorado", "file": "cerro_colorado.svg", "bg": "#f9620b", "text": "white", "label": "CMCC"}, # BHP Variant
    {"name": "Spence", "file": "spence.svg", "bg": "#f9620b", "text": "white", "label": "SPENCE"}, # BHP Variant
    {"name": "Zaldivar", "file": "zaldivar.svg", "bg": "#003366", "text": "white", "label": "ZALDIVAR"}, # AMSA Variant
    {"name": "Los Pelambres", "file": "pelambres.svg", "bg": "#003366", "text": "white", "label": "PELAMBRES"}, # AMSA Variant
]

svg_template = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="{bg}" rx="10" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="24" fill="{text}">{label}</text>
</svg>"""

for co in companies:
    content = svg_template.format(bg=co["bg"], text=co["text"], label=co["label"])
    with open(os.path.join(LOGOS_DIR, co["file"]), "w", encoding="utf-8") as f:
        f.write(content)

print("Logos generated successfully.")
