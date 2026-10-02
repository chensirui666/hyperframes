"""Original 48-second picture-synchronized chiptune score for the pixel meteor short.

Run with Python 3, NumPy, SciPy and system FFmpeg. All oscillators and drums
are synthesized here; there are no sampled songs or external audio inputs.
"""
from pathlib import Path
import json
import math
import subprocess

import numpy as np
from scipy import signal
from scipy.io import wavfile


ROOT = Path(__file__).resolve().parents[1] / "assets" / "audio"
SR = 48000
DURATION = 48.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DURATION)
RNG = np.random.default_rng(20261002)
TRACK_NAMES = ["01_主旋律", "02_琶音", "03_和声", "04_低音", "05_鼓组", "06_转场音色", "07_游戏说话音", "08_动作音效", "09_环境声"]
TRACKS = {name: np.zeros((N, 2), dtype=np.float64) for name in TRACK_NAMES}
EVENTS = []


def midi(note):
    if isinstance(note, (int, float)):
        return float(note)
    pitch = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}[note[0]]
    if len(note) > 2:
        pitch += {"#": 1, "b": -1}[note[1]]
    return (int(note[-1]) + 1) * 12 + pitch


def hz(note):
    return 440 * 2 ** ((midi(note) - 69) / 12)


def envelope(duration, attack=.006, decay=.07, sustain=.55, release=.055):
    count = max(1, round((duration + release) * SR))
    t = np.arange(count) / SR
    attack = min(attack, duration * .25)
    decay = min(decay, max(.003, duration - attack))
    env = np.where(t < attack, t / attack,
                   sustain + (1 - sustain) * np.exp(-4 * np.maximum(t - attack, 0) / decay))
    released = t >= duration
    release_level = sustain + (1 - sustain) * np.exp(-4 * max(duration - attack, 0) / decay)
    env[released] = release_level * np.maximum(1 - (t[released] - duration) / release, 0) ** 2
    return t, env


def oscillator(freq, t, kind="pulse", duty=.5):
    phase = 2 * np.pi * freq * t
    if kind == "triangle":
        result = np.zeros_like(t)
        for h in range(1, 18, 2):
            if freq * h > 13000:
                break
            result += ((-1) ** ((h - 1) // 2)) * np.sin(h * phase) / h ** 2
        return result * (8 / np.pi ** 2)
    if kind == "sine":
        return np.sin(phase)
    if kind == "bell":
        return (.78 * np.sin(phase) + .16 * np.sin(phase * 2) * np.exp(-5 * t)
                + .06 * np.sin(phase * 3) * np.exp(-10 * t))
    result = np.zeros_like(t)
    for h in range(1, min(30, int(10000 / freq)) + 1):
        coefficient = 2 * np.sin(np.pi * h * duty) / (np.pi * h)
        result += coefficient * np.cos(h * phase) * np.exp(-(freq * h / 5500) ** 1.5)
    return result * 1.65


def place(track, audio, start, volume=1, pan=0):
    start_index = round(start * SR)
    if start_index >= N:
        return
    if audio.ndim == 1:
        angle = (pan + 1) * np.pi / 4
        audio = np.column_stack((audio * np.cos(angle), audio * np.sin(angle)))
    stop = min(start_index + len(audio), N)
    TRACKS[track][start_index:stop] += audio[:stop - start_index] * volume


def note(track, pitch, beat, length, volume=.12, kind="pulse", pan=0, duty=.5, sustain=.55):
    duration = length * BEAT
    t, env = envelope(duration, sustain=sustain,
                      release=.13 if kind == "bell" else .048)
    wave = oscillator(hz(pitch), t, kind, duty)
    if kind == "bell":
        wave *= np.exp(-3.5 * t)
    if track == "01_主旋律":
        wave = .92 * wave + .08 * np.sin(2 * np.pi * hz(pitch) * t)
    place(track, wave * env, beat * BEAT, volume, pan)
    EVENTS.append({"track": track, "pitch": pitch, "beat": beat, "length_beats": length})


def harmony(pitches, start_beat, length_beats, level=.038):
    for i, pitch in enumerate(pitches):
        note("03_和声", pitch, start_beat, length_beats, level,
             "triangle", pan=(-.48 + i * .32), sustain=.70)


def arpeggio(pitches, start_beat, length_beats=4, step=.5, level=.055, boss=False):
    pattern = [0, 1, 2, 1] if not boss else [0, 1, 2, 3, 2, 1, 3, 1]
    for i in range(round(length_beats / step)):
        pitch = pitches[pattern[i % len(pattern)] % len(pitches)]
        note("02_琶音", pitch, start_beat + i * step, step * .63,
             level * (1 if i % 2 == 0 else .78), "pulse" if boss else "bell",
             pan=-.45 if i % 2 == 0 else .45, duty=.25, sustain=.23)


def bass(root, fifth, start_beat, boss=False):
    pattern = [(0, root), (1, fifth), (2, root), (3, fifth)]
    if boss:
        pattern = [(0, root), (.75, root), (1.5, fifth), (2, root), (2.75, root), (3.5, fifth)]
    for offset, pitch in pattern:
        note("04_低音", pitch, start_beat + offset, .47 if boss else .68,
             .235 if boss else .15, "triangle", sustain=.65)


def drum(kind, beat, velocity=1, pan=0):
    duration = {"kick": .25, "snare": .16, "hat": .07, "open": .18, "tom": .18}[kind]
    t = np.arange(round(duration * SR)) / SR
    noise = RNG.normal(size=len(t))
    if kind == "kick":
        freq = 49 + 115 * np.exp(-t * 45)
        phase = 2 * np.pi * np.cumsum(freq) / SR
        wave = np.sin(phase) * np.exp(-t * 17) + .07 * noise * np.exp(-t * 240)
        volume = .40
    elif kind == "snare":
        filt = signal.sosfilt(signal.butter(2, [1400, 8200], btype="bandpass", fs=SR, output="sos"), noise)
        wave = .55 * filt * np.exp(-t * 36) + .25 * np.sin(2 * np.pi * 184 * t) * np.exp(-t * 43)
        volume = .28
    elif kind == "tom":
        phase = 2 * np.pi * np.cumsum(90 + 85 * np.exp(-t * 20)) / SR
        wave = np.sin(phase) * np.exp(-t * 24)
        volume = .21
    else:
        filt = signal.sosfilt(signal.butter(2, [5700, 11500], btype="bandpass", fs=SR, output="sos"), noise)
        wave = filt * np.exp(-t * (70 if kind == "hat" else 22))
        volume = .065 if kind == "hat" else .055
    wave *= np.minimum(t / .0015, 1) * np.minimum((duration - t) / .006, 1)
    place("05_鼓组", wave, beat * BEAT, volume * velocity, pan)


def rhythm(start_beat, boss=False):
    for b in ([0, 1.5, 2, 2.75] if boss else [0, 2.5]):
        drum("kick", start_beat + b, 1 if boss else .70)
    for b in [1, 3]:
        drum("snare", start_beat + b, 1 if boss else .62, pan=.08)
    step = .25 if boss else .5
    for i in range(round(4 / step)):
        drum("hat", start_beat + i * step, .84 if i % 2 == 0 else .47, pan=(-.3 if i % 2 else .3))
    if boss:
        drum("open", start_beat + 3.5, .8, pan=.35)


MAJOR_MOTIF = [(0, "E5", .45), (.75, "G5", .22), (1, "A5", .42), (1.5, "G5", .37),
               (2, "E5", .40), (2.5, "D5", .32), (3, "C5", .72)]
BOSS_MOTIF = [(0, "C5", .45), (.75, "E5", .22), (1, "F5", .42), (1.5, "E5", .37),
              (2, "C5", .40), (2.5, "B4", .32), (3, "A4", .72)]


def melody(pattern, start, boss=False):
    for offset, pitch, length in pattern:
        note("01_主旋律", pitch, start + offset, length,
             .19 if boss else .135, "pulse", duty=.375 if boss else .5)
        if boss:
            note("01_主旋律", midi(pitch) + 12, start + offset, length,
                 .027, "triangle", pan=.12)



# Everything below is authored on the same absolute-second cue sheet as the picture.
CUES=json.loads((ROOT.parents[1]/'output/timing.json').read_text())
FX=[]
def tone(track,pitch,start,duration,volume=.1,kind='pulse',pan=0):
    note(track,pitch,start/BEAT,duration/BEAT,volume,kind,pan=pan)
def gliss(start,duration,f0,f1,volume=.10,track='08_动作音效',noise=False,pan=0):
    t=np.arange(round(duration*SR))/SR
    f=f0*(f1/f0)**(t/max(duration,.001))
    wave=np.sin(2*np.pi*np.cumsum(f)/SR)
    if noise:
        n=RNG.normal(size=len(t));n=signal.sosfilt(signal.butter(2,[350,6000],btype='band',fs=SR,output='sos'),n)
        wave=.4*wave+.35*n
    env=np.sin(np.pi*np.minimum(t/duration,1))**.6
    place(track,wave*env,start,volume,pan);FX.append({'type':'gliss','time':start,'duration':duration,'f0':f0,'f1':f1})
def chord(pitches,t,dur,volume=.04):
    harmony(pitches,t/BEAT,dur/BEAT,volume)
def bar(t,ch,ar,root,fifth,boss=False,level=1):
    harmony(ch,t/BEAT,3.8,.044*level)
    arpeggio(ar,t/BEAT,step=.25 if boss else .5,level=.056*level,boss=boss)
    bass(root,fifth,t/BEAT,boss=boss);rhythm(t/BEAT,boss=boss)
def hook(t,boss=False):melody(BOSS_MOTIF if boss else MAJOR_MOTIF,t/BEAT,boss=boss)
major=[(['C4','E4','G4'],['C5','E5','G5','C6'],'C3','G2'),(['G3','B3','D4'],['G4','B4','D5','G5'],'G2','D3'),(['F3','A3','C4'],['F4','A4','C5','F5'],'F2','C3')]
minor=[(['A3','C4','E4'],['A4','C5','E5','A5'],'A2','E3'),(['F3','A3','C4'],['F4','A4','C5','F5'],'F2','C3'),(['E3','G#3','B3'],['E4','G#4','B4','E5'],'E2','B2')]
# Warm day; theme leaves space for TV bleeps and character reactions.
for i,t in enumerate([0,2,4]):bar(t,*major[i],level=.7)
hook(0);hook(4)
# Ring and panel openings suspend most of the band.
chord(['C4','E4','G4'],6,1.4,.024)
for t,p in [(6,'G5'),(6.35,'E5'),(6.58,'C6'),(6.81,'G5')]:tone('02_琶音',p,t,.11,.055,'bell')
for i,t in enumerate([7.5,9.5,11.5]):
    chord(major[i][0],t,1.8,.026)
    arpeggio(major[i][1],t/BEAT,length_beats=4,level=.029)
    bass(major[i][2],major[i][3],t/BEAT)
# Walk / grill montage picks up at the actual cut at 13.
for i,t in enumerate([13,15,17]):bar(t,*major[i],level=.9)
hook(13)
melody([(0,'C5',.4),(.5,'E5',.4),(1,'F5',.5),(2,'A5',.6),(3,'G5',.5)],30)
# Stargazing: bell harmonics and space, no drum loop.
chord(['C4','E4','G4','B4'],18,3.8,.029)
for i,p in enumerate(['E5','G5','B5','G5','E5','D5','G5','C6']):tone('02_琶音',p,18+i*.46,.24,.046,'bell',(-1)**i*.45)
# The accelerating meteor controls pulse spacing and pitch, not a fixed music loop.
chord(['E3','G#3','B3','D4'],22,4.85,.033)
for i in range(28):
    u=i/27;sec=22+4.8*(1-(1-u)**1.55)
    tone('04_低音','E2',sec,.09,.11+.075*u,'triangle')
    tone('02_琶音',[64,68,71,74][i%4],sec,.07,.027+.043*u,'pulse',pan=(-1)**i*.32)
    if i>17:drum('snare',sec/BEAT,.24+.45*u)
gliss(22,4.95,65,220,.045,'06_转场音色',noise=True)
for t in [25.0,25.38,25.70,26.0,26.26,26.48,26.67,26.85]:
    gliss(t,.11,820,620,.055)
# Device reveal: pull out the low end; a precise rise starts with the hand.
chord(['E4','B4'],27,1.7,.025)
for i,p in enumerate(['E4','G#4','B4','E5','G#5','B5','E6']):tone('06_转场音色',p,27.6+i*.19,.12,.04+i*.008,'pulse')
gliss(28.0,.95,160,1500,.10,'06_转场音色')
# Transformation / hero reveal; motif transforms into the minor Boss version.
bar(29,*minor[0],boss=True,level=1.06);hook(29)
for i,p in enumerate(['A4','C5','E5','A5','C6','E6']):tone('06_转场音色',p,29+i*.075,.20,.07,'bell',pan=-.5+i*.2)
chord(['A3','C4','E4','A4','E5'],31.5,.93,.067)
for p in ['A5','C6','E6']:tone('01_主旋律',p,31.5,.7,.045,'pulse')
drum('kick',31.5/BEAT,1.3);gliss(31.5,.45,210,65,.12)
# 32.5–36 musical hold; 32.5–33 also contains no character bleeps.
# Restart is anchored to the first giant step.
for i,t in enumerate([36,38,40]):bar(t,*minor[i],boss=True,level=1.12)
hook(36);hook(40,True)
# Successful trajectory change resolves toward the bright major theme.
for i,t in enumerate([42,44]):bar(t,*major[i],boss=True,level=1.12)
hook(42)
# Space tail: withdraw drums then bass; final star is its own cue.
chord(['C4','E4','G4','C5'],45,2.1,.042)
for i,p in enumerate(['C6','G5','E5','C5']):tone('02_琶音',p,45+i*.43,.35,.065,'bell',pan=(-1)**i*.35)
for i,p in enumerate(['C6','E6','G6']):tone('06_转场音色',p,47.1+i*.027,.12,.056,'bell')

# Music stems get deterministic, picture-driven envelopes.
TIME=np.arange(N)/SR
music_names=TRACK_NAMES[:6]
for name in music_names:
    gain=np.ones(N)
    # Actual scene transitions cut the unwanted tails of earlier notes.
    gain[(TIME>=18)&(TIME<22)]=.82
    if name in ['04_低音','05_鼓组']:
        gain[(TIME>=18)&(TIME<22)]=0
        gain[(TIME>=27)&(TIME<29)]=0
        gain[TIME>=45]=0
    gain[(TIME>=32.5)&(TIME<36)]=0
    gain*=np.minimum(TIME/.035,1)
    gain*=np.clip((48-TIME)/.35,0,1)
    # Contact ducks the band at the precise hand/rock impact.
    gain[(TIME>=39.3)&(TIME<39.45)]*=.22
    for d in CUES['dialogue']:
        if d['start']<32.5:gain[(TIME>=d['start'])&(TIME<d['end'])]*=.64
    # Pull back dense instruments during the phone split.
    if name in ['01_主旋律','05_鼓组']:gain[(TIME>=6)&(TIME<13)]=0
    TRACKS[name]*=gain[:,None]

# Synthetic character speech. There are no human recordings or speech models.
for j,d in enumerate(CUES['dialogue']):
    start=d['start']+.055;available=d['end']-start-.10
    if d['speaker']=='green' and start>32.5:
        offsets=[0,.18,.48,.66,.86,1.03,1.25,1.42,1.60]
    else:offsets=list(np.arange(0,max(.1,available),.17 if d['speaker']!='yellow' else .22))
    for i,dt in enumerate(offsets):
        if dt>available:continue
        if i%5==4:continue
        pitch=d['pitch']+[0,3,-2,5,2,-3][(i+j)%6]
        if d['speaker']=='tv':pitch=d['pitch']+[0,0,2,0][i%4]
        dur=.043+.017*(i%3)
        tone('07_游戏说话音',pitch,start+dt,dur,.095 if d['speaker']=='tv' else .12,'pulse',pan={'yellow':-.55,'blue':-.55,'green':.42,'purple':.65}.get(d['speaker'],0))
        FX.append({'type':'game-dialogue','speaker':d['speaker'],'time':round(start+dt,4),'duration':dur,'text':d['text']})
# Tiny wordless puff for the hiking foodie.
for t in [14.93,15.18]:tone('07_游戏说话音',48,t,.065,.10,'triangle',pan=-.3)

# Actions: phone, props, footfalls, fire, atmosphere, takeoff, contact.
for t,f in [(3.12,740),(3.23,1100),(4.46,380),(5.2,940)]:gliss(t,.075,f,f*.75,.1)
for start in [6.0,6.45]:
    t=np.arange(round(.27*SR))/SR;wave=(np.sin(2*np.pi*480*t)+np.sin(2*np.pi*620*t))*.5*np.sin(np.pi*t/.27)**.5;place('08_动作音效',wave,start,.10)
for i,t in enumerate([6.12,6.35,6.58,6.81]):gliss(t,.09,680+i*90,1000+i*100,.055,pan=-.65+i*.42)
for t in [13.17,14.6,14.85,15.10,15.35,15.6,15.85,16.20,16.95]:
    tt=np.arange(round(.12*SR))/SR;place('08_动作音效',np.sin(2*np.pi*120*tt)*np.exp(-tt*45),t,.10)
for t in [16.18,16.68,17.3]:gliss(t,.1,1500,800,.065)
for t in [18.86,19.0,19.14,19.28,19.42]:tone('08_动作音效','G6',t,.055,.05,'bell')
gliss(20.25,.72,1650,680,.048)
# Seeded crackling / soft night air.
for start,dur,level in [(16,2,.011),(18,4,.009)]:
    nn=RNG.normal(size=round(dur*SR));nn=signal.sosfilt(signal.butter(2,[1200,8000],btype='band',fs=SR,output='sos'),nn);env=np.minimum(np.arange(len(nn))/SR/.1,1)*np.minimum(np.arange(len(nn))[::-1]/SR/.2,1);place('09_环境声',nn*env,start,level)
# Approach rumble grows with the meteor's screen area.
tt=np.arange(round(5*SR))/SR;nn=RNG.normal(size=len(tt));rumble=signal.sosfilt(signal.butter(2,160,fs=SR,output='sos'),nn);place('08_动作音效',rumble*(.2+tt/5)**2,22,.42)
for t in [25.12,25.28,25.44,25.60]:gliss(t,.10,350,800,.075)
for t in [27.1,28.7,29.0]:gliss(t,.11,1500,260,.08)
gliss(29,.65,400,3100,.065,noise=True)
for t in [36.15,36.85]:gliss(t,.24,110,35,.22)
gliss(37.6,1.4,180,1100,.17,noise=True)
# Deep nonverbal contact; the first sample is on the contact frame.
tt=np.arange(round(.7*SR))/SR;freq=42+100*np.exp(-tt*25);impact=np.sin(2*np.pi*np.cumsum(freq)/SR)*np.exp(-tt*8);place('08_动作音效',impact,39.3,.4)
gliss(39.3,.34,340,60,.12,noise=True)
# Continuous thrust slowly opens as the trajectory reverses.
gliss(40,4.7,90,280,.05,noise=True)
for t in [42.0,42.2,42.4]:tone('08_动作音效',['C5','E5','G5'][round((t-42)/.2)],t,.16,.04,'bell')
# Enforce the deliberate reaction pause across every audible track.
for name in TRACK_NAMES:
    TRACKS[name][int(32.5*SR):int(33*SR)]=0
    TRACKS[name]*=np.clip((48-TIME)/.18,0,1)[:,None]
mix=sum(TRACKS.values())
# A gentle linked limiter retains game transients with a little headroom.
peak=float(np.max(np.abs(mix)));gain=10**(-1.5/20)/peak
mix*=gain
ROOT.mkdir(parents=True,exist_ok=True);(ROOT/'stems').mkdir(exist_ok=True)
for name in TRACK_NAMES:wavfile.write(ROOT/'stems'/f'{name}.wav',SR,(TRACKS[name]*gain).astype(np.float32))
wavfile.write(ROOT/'mix-float.wav',SR,mix.astype(np.float32))
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(ROOT/'mix-float.wav'),'-c:a','pcm_s24le',str(ROOT/'full-mix.wav')],check=True)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(ROOT/'full-mix.wav'),'-c:a','libmp3lame','-b:a','192k',str(ROOT/'full-mix.mp3')],check=True)
report={'duration_seconds':DURATION,'sample_rate':SR,'channels':2,'peak_dbfs':float(20*np.log10(np.max(np.abs(mix)))),'rms_dbfs':float(20*np.log10(np.sqrt(np.mean(mix**2)))),'silence_seconds':[32.5,33.0],'silence_samples_per_channel':24000,'no_human_voice':True,'dialogue_presentation':'in-scene comic speech bubbles','stems':TRACK_NAMES,'action_events':FX,'note_events':EVENTS}
(ROOT.parents[1]/'output/audio-cues.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
assert np.all(mix[int(32.5*SR):int(33*SR)]==0)
assert mix.shape==(2304000,2) and np.all(np.isfinite(mix))
print(json.dumps({k:v for k,v in report.items() if k not in ['action_events','note_events','stems']},ensure_ascii=False))
