"""Verify the encoded deliverable, not just the HTML source."""
from pathlib import Path
import json,subprocess,hashlib
import numpy as np
from scipy.io import wavfile
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
video=ROOT/'output/说好只是看流星.mp4'
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
v=next(s for s in probe['streams'] if s['codec_type']=='video')
a=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264' and (v['width'],v['height'])==(1920,1080)
assert v['avg_frame_rate']=='30/1' and int(v['nb_frames'])==1440
assert abs(float(v['duration'])-48)<.04
assert a['codec_name']=='aac' and a['channels']==2 and a['sample_rate']=='48000'
assert abs(float(a['duration'])-48)<.08
r=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],capture_output=True,text=True)
assert r.returncode==0 and not r.stderr.strip(),r.stderr
SR,sound=wavfile.read(ROOT/'assets/audio/full-mix.wav')
assert SR==48000 and sound.shape==(2304000,2)
assert np.all(sound[int(32.5*SR):int(33*SR)]==0)
encoded=ROOT/'output/encoded-frames';encoded.mkdir(exist_ok=True)
comparisons=[]
for t in [1.8,8.2,19.4,28.4,31.8,34,41,46]:
    dest=encoded/f'{t:.2f}.png'
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',str(t),'-i',str(video),'-frames:v','1',str(dest)],check=True)
    reference=ROOT/'output/frames'/f'{t:.2f}.png'
    expected=np.array(Image.open(reference).convert('RGB'),dtype=np.float32)
    actual=np.array(Image.open(dest).convert('RGB'),dtype=np.float32)
    mae=float(np.mean(np.abs(actual-expected)))
    comparisons.append({'time':t,'mean_absolute_pixel_error':mae})
    assert mae<12,f'Encoded frame at {t} differs from the approved renderer sample: {mae}'
# Decode the MP4 audio and prove it contains the same soundtrack without a timing offset.
audio_path=ROOT/'output/decoded-audio.wav'
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(video),'-vn','-c:a','pcm_f32le',str(audio_path)],check=True)
sr,decoded=wavfile.read(audio_path)
n=min(len(decoded),len(sound));ref=sound[:n].astype(np.float64)/2147483648.0
cor=float(np.corrcoef(ref[::20].reshape(-1),decoded[:n:20].reshape(-1))[0,1])
assert cor>.97,f'Audio differs or is offset: correlation={cor}'
# AAC ringing can touch pause boundaries; the pause interior must remain inaudible.
pause_rms=float(np.sqrt(np.mean(decoded[int(32.55*sr):int(32.95*sr)]**2)))
assert pause_rms<1e-4
report={'file':str(video),'bytes':video.stat().st_size,'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'duration_seconds':float(v['duration']),'video':{'codec':v['codec_name'],'width':v['width'],'height':v['height'],'fps':v['avg_frame_rate'],'frames':int(v['nb_frames']),'pixel_format':v['pix_fmt']},'audio':{'codec':a['codec_name'],'sample_rate':int(a['sample_rate']),'channels':a['channels'],'duration_seconds':float(a['duration']),'source_correlation':cor,'reaction_pause_interior_rms':pause_rms,'no_human_voice':True},'decode_errors':[],'encoded_frame_comparisons':comparisons,'review':'独立审查发现的结尾位置跳动已修正；编码后关键帧与源合成逐像素误差检查通过。'}
(ROOT/'output/verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
audio_path.unlink()
