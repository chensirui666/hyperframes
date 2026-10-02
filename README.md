# 说好只是看流星

48 秒原创像素动画短片，1920×1080，30 fps，16:9。HTML/CSS/JavaScript Canvas 2D + GSAP 制作，由 HyperFrames 输出 H.264/AAC MP4。

## 成片与工程

- [下载最终 MP4](https://github.com/chensirui666/hyperframes/raw/refs/heads/main/output/%E8%AF%B4%E5%A5%BD%E5%8F%AA%E6%98%AF%E7%9C%8B%E6%B5%81%E6%98%9F.mp4)：带配乐和音效的 48 秒成片。
- [下载制作工程压缩包](https://github.com/chensirui666/hyperframes/raw/refs/heads/main/output/production-project.zip)：源码、素材、完整混音与九条音频分轨。
- `index.html`：HyperFrames 主合成。
- `src/timeline.js`：16 镜头、角色气泡和关键动作的统一时间表。
- `src/actors.js`：六个像素角色及动作、表情、道具绘制。
- `src/art.js`、`src/scenes-life.js`、`src/scenes-action.js`：画面绘制。
- `assets/home.png`、`camp.png`、`sky.png`：用户已确认的三张场景图副本。
- `assets/audio/full-mix.wav`：48 kHz、24-bit、立体声最终混音。
- `assets/audio/stems/`：九条分轨（旋律、琶音、和声、低音、鼓、转场、角色电子短音、动作音效、环境）。
- `scripts/compose_score.py`：原创音符与合成音效源文件；没有真人声音、TTS 或外部音乐采样。
- `output/timing.json`、`output/audio-cues.json`：实际成片的画面/声音事件表。

台词全部在画面内漫画气泡中，尾巴指向人物或电视；不使用视频底部字幕。角色按原角色设定的发型、配色与标志道具绘制为可动画的像素小人。保留原始三视图在 `/workspace/asset/人物/`，不覆盖已确认素材；工程压缩包另附于 `approved-character-references/`。

## 播放与编辑

直接播放单独交付的 MP4 即可观看。源工程包不重复包含 MP4；可将它放进 `output/`，供预览页的下载链接使用。编辑源文件后可在 HyperFrames Studio 预览：

```sh
npm ci
npx hyperframes preview --background
```

也可先运行 `python -m http.server 8090`，访问 `player.html` 查看 HTML 动画与配乐实时播放。`index.html` 本身是由 HyperFrames 控制的暂停合成，不会自行播放。

## 重新渲染

需要 Node.js 22+、Chrome/Chromium 和 FFmpeg。本工程使用固定的 HyperFrames 0.8.111。

```sh
npm test
npx hyperframes lint
HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium npx hyperframes render -o output/说好只是看流星.mp4 --fps 30 --quality delivery --workers 2
```

其他系统将 `HYPERFRAMES_BROWSER_PATH` 改为本机 Chrome 路径；若已安装 HyperFrames 托管浏览器，可省略此环境变量。

## 重建音频

需要 Python 3、NumPy、SciPy 和 FFmpeg。先将时间表同步到 JSON，再合成：

```sh
node --input-type=module -e 'import {DIALOGUE,EVENTS,SHOTS} from "./src/timeline.js"; import fs from "node:fs"; fs.writeFileSync("output/timing.json",JSON.stringify({dialogue:DIALOGUE,events:EVENTS,shots:SHOTS}));'
python scripts/compose_score.py
```

画面驱动声音：22 秒流星开始变大，27 秒抽棒收窄声部，29 秒展开变身，31.5 秒英雄显形重音，32.5–33 秒完整静默，36 秒助跑恢复主题，37.6 秒离地，39.3 秒双掌接触，42 秒推动改变轨迹，47.1 秒最后星光。

## 核验

`npm test` 验证镜头连续性、气泡时间与关键同步点；`scripts/check-browser.mjs` 在本地 8090 端口抽取关键帧、记录气泡边界并检查时间轴乱序跳转的一致性。`output/verification.json` 记录成片的 FFprobe、解码与音频检查结果。
