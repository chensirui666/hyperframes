from pathlib import Path
import zipfile,json
ROOT=Path(__file__).resolve().parents[1]
archive=ROOT.parent/'说好只是看流星_制作工程.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for folder in ['src','assets','scripts','tests','docs']:
  for f in sorted((ROOT/folder).rglob('*')):
   if not f.is_file() or f.name=='mix-float.wav' or f.name in ['frame-probe.mjs','browser-probe.mjs']:continue
   z.write(f,Path('pixel-meteor-film')/f.relative_to(ROOT))
 for name in ['index.html','player.html','package.json','package-lock.json','README.md']:
  z.write(ROOT/name,Path('pixel-meteor-film')/name)
 for f in sorted((ROOT/'output').glob('*.json')):
  z.write(f,Path('pixel-meteor-film/output')/f.name)
 for f in sorted(Path('/workspace/asset/人物').glob('*.png')):
  z.write(f,Path('pixel-meteor-film/approved-character-references')/f.name)
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert 'pixel-meteor-film/assets/audio/full-mix.wav' in z.namelist()
print(json.dumps({'archive':str(archive),'bytes':archive.stat().st_size},ensure_ascii=False))
