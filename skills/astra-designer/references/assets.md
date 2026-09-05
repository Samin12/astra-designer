# Higgsfield media workflow

Use owned photos, footage and approved logos first. Generation is optional. Provider names belong in setup documentation, not the delivered site's visible branding.

## Connect
Install the official CLI from https://github.com/higgsfield-ai/cli if absent. Inspect its installation instructions first. Run `higgsfield account status`; if unauthenticated, the user completes `higgsfield auth login`. Never store account credentials in this repository or browser code.

Discover current models with `higgsfield model list --json`, then inspect the selected model with `higgsfield model get MODEL --json`. Prefer GPT Image 2 for general images and Seedance 2.0 for cinematic video when available; honor explicit provider/model choices. Validate supported duration, resolution, aspect ratio and reference roles before submitting. No generation is needed for installation or a smoke test.

## Generate
The bundled helper forwards arguments to the official CLI without a shell and waits for completion:

```bash
node <skill>/scripts/media.mjs models
node <skill>/scripts/media.mjs inspect gpt_image_2
node <skill>/scripts/media.mjs generate gpt_image_2 --prompt "YOUR ART-DIRECTED SCENE" --aspect_ratio 16:9
node <skill>/scripts/media.mjs inspect seedance_2_0
node <skill>/scripts/media.mjs generate seedance_2_0 --prompt "YOUR CAMERA MOVE" --start-image ./hero.png --duration 5
```

Examples assume those models and parameters remain available; live schema wins. Use `--image` for supplied product references or model-supported reference flags. Preserve identity and packaging. Plan clean background plates and genuine transparent foreground cutouts rather than asking one flattened image to supply every layer. Use one consistent style preamble, deliberate negative space for copy, and separate portrait art direction.

A generation request authorizes the requested assets, not unlimited rerolls. Follow the user's budget. Keep completed job IDs/receipts and reuse results before resubmitting after a timeout. `higgsfield generate get ID --json` inspects an existing job; `higgsfield generate wait ID` resumes waiting. Do not expose credentials or private account data in delivery.

## Use the actual output
Retrieve the completed job's actual asset URL or local file through the CLI's supported output/download mechanism. Never invent a URL or put an expiring generation URL directly into a production site. Save permitted media in the build's assets folder, verify MIME type and inspect the image or beginning/middle/end of the video. Record provider, model, prompt, local path and receipt in the private build notes. If generation is unavailable, continue with owned assets or a polished static composition and report the limitation.

For scrub clips, strip audio and encode for seeking:

```bash
bash <skill>/scripts/encode.sh ./raw/hero.mp4 ./assets/hero.mp4
bash <skill>/scripts/encode.sh ./raw/hero.mp4 ./assets/hero-mobile.mp4 mobile
```

Extract the poster from the actual clip's first frame with the full ffmpeg binary identified by doctor. A separately generated poster causes a jump. Use at most two scrub acts unless the brief requires more. Test a short encode first, preserve subject framing on phones, and visually inspect all outputs.

For an explicitly requested continuous flight, read [worldflight.md](worldflight.md), align seam frames and test seek/decoder behavior. Separate scenes are usually simpler and more robust.
