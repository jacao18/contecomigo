"""
Roda esse script UMA VEZ no seu computador.
Ele baixa as imagens do PokeAPI e embeda como base64 no template HTML.
Resultado: template-pokemon-final.html (funciona offline, sem URLs externas)

Uso: python embed_images.py
"""

import urllib.request
import base64
import re
import os

POKEMON = [
    ("mewtwo",    150),
    ("squirtle",  7),
    ("pikachu",   25),
    ("charizard", 6),
    ("charmander",4),
]

BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png"

def fetch_b64(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as r:
        data = r.read()
    return "data:image/png;base64," + base64.b64encode(data).decode()

print("Baixando imagens do PokeAPI...")
b64_map = {}
for name, pid in POKEMON:
    url = BASE_URL.format(id=pid)
    print(f"  {name} ({pid})...", end=" ", flush=True)
    try:
        b64_map[name] = fetch_b64(url)
        print(f"OK ({len(b64_map[name])//1024}kb)")
    except Exception as e:
        print(f"ERRO: {e}")
        b64_map[name] = ""

# Ler o template
script_dir = os.path.dirname(os.path.abspath(__file__))
template_path = os.path.join(script_dir, "template-pokemon.html")
with open(template_path, "r", encoding="utf-8") as f:
    html = f.read()

# Substituir cada src de URL pela versão base64
replacements = {
    "official-artwork/150.png": b64_map["mewtwo"],
    "official-artwork/7.png":   b64_map["squirtle"],
    "official-artwork/25.png":  b64_map["pikachu"],
    "official-artwork/6.png":   b64_map["charizard"],
    "official-artwork/4.png":   b64_map["charmander"],
}

for url_fragment, b64 in replacements.items():
    if b64:
        html = html.replace(
            f'src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/{url_fragment}"',
            f'src="{b64}"'
        )

out_path = os.path.join(script_dir, "template-pokemon-final.html")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"\n✅ Salvo em: {out_path}")
print("Abra esse arquivo no navegador — as imagens estarão embedadas!")
