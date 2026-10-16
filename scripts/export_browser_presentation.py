"""Package validated artifact-tool slide renders into a self-contained offline viewer."""
from pathlib import Path
import base64
import hashlib
import html
import json
import zipfile
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
PPTX=ROOT/'presentations/v2/output/LabTrack_Execution_Presentation_v2.2.pptx'
BUILD=ROOT/'.artifacts/presentation-build'
receipt=json.loads((BUILD/'validation-v2.2.json').read_text(encoding='utf-8'))
assert hashlib.sha256(PPTX.read_bytes()).hexdigest()==receipt['finalSha256']
ns={'a':'http://schemas.openxmlformats.org/drawingml/2006/main'}
slides=[]
with zipfile.ZipFile(PPTX) as archive:
    for index in range(1,23):
        slide=ET.fromstring(archive.read(f'ppt/slides/slide{index}.xml'))
        text=[el.text or '' for el in slide.findall('.//a:t',ns)]
        notes=ET.fromstring(archive.read(f'ppt/notesSlides/notesSlide{index}.xml'))
        note='\n'.join(el.text or '' for el in notes.findall('.//a:t',ns))
        image=base64.b64encode((BUILD/f'slide-{index:02}.png').read_bytes()).decode('ascii')
        slides.append(f'<section class="slide" aria-label="Slide {index}" {"" if index==1 else "hidden"}><img src="data:image/png;base64,{image}" alt="{html.escape(text[1] if len(text)>1 else text[0],quote=True)}"><div class="sr-only">{html.escape(". ".join(text))}</div></section>')
        slides[-1]+='<template class="speaker-note">'+html.escape(note)+'</template>'
page=r'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LabTrack execution presentation</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#102b2a;color:#f4f7e9;font-family:Arial,sans-serif;height:100dvh;display:flex;flex-direction:column}main{min-height:0;flex:1;display:flex;align-items:center;justify-content:center;padding:12px}.slide{width:100%;height:100%;display:flex;align-items:center;justify-content:center}.slide[hidden]{display:none}.slide img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}footer{display:flex;gap:8px;align-items:center;justify-content:center;flex-wrap:wrap;padding:10px 12px;background:#0b2120}button{background:transparent;border:1px solid #799480;color:#f4f7e9;border-radius:5px;padding:9px 12px;font:inherit;cursor:pointer}button:hover,button:focus-visible{background:#294c42;outline:2px solid #c6dd93}button:disabled{opacity:.4;cursor:default}#position{min-width:65px;text-align:center;font-size:14px}aside{position:fixed;right:12px;bottom:70px;max-width:600px;max-height:60vh;overflow:auto;white-space:pre-wrap;background:#f5f6ef;color:#183b34;padding:24px;border:1px solid #6d8373;line-height:1.5;font-size:16px;box-shadow:0 8px 40px #0008}aside[hidden]{display:none}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(max-width:500px){main{padding:0}footer{gap:6px}button{font-size:13px;padding:9px}aside{left:10px;right:10px;bottom:115px}}@media print{body{display:block;height:auto;background:white}main{display:block;padding:0}.slide,.slide[hidden]{display:block;width:100%;height:auto;break-after:page}.slide img{width:100%;max-height:none}footer,aside{display:none}}
</style></head><body><main aria-label="Presentation slides">__SLIDES__</main><aside id="notes" aria-label="Speaker notes" hidden></aside><footer><button id="previous" aria-label="Previous slide">Previous</button><span id="position" aria-live="polite">1 / 22</span><button id="next" aria-label="Next slide">Next</button><button id="toggle-notes" aria-expanded="false" aria-controls="notes">Notes</button><button id="fullscreen">Fullscreen</button></footer>
<script>
const slides=[...document.querySelectorAll('.slide')],notes=[...document.querySelectorAll('.speaker-note')];let current=0;
const notePanel=document.getElementById('notes'),toggle=document.getElementById('toggle-notes');
function show(n){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>s.hidden=i!==current);document.getElementById('position').textContent=`${current+1} / ${slides.length}`;document.getElementById('previous').disabled=current===0;document.getElementById('next').disabled=current===slides.length-1;notePanel.textContent=notes[current].content.textContent;location.hash=`slide-${current+1}`;}
function noteToggle(){notePanel.hidden=!notePanel.hidden;toggle.setAttribute('aria-expanded',String(!notePanel.hidden));}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.getElementById('fullscreen').textContent='Fullscreen unavailable';}}
document.getElementById('previous').onclick=()=>show(current-1);document.getElementById('next').onclick=()=>show(current+1);toggle.onclick=noteToggle;document.getElementById('fullscreen').onclick=fullscreen;
document.addEventListener('keydown',e=>{if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1);}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1);}else if(e.key==='Home'){e.preventDefault();show(0);}else if(e.key==='End'){e.preventDefault();show(slides.length-1);}else if(e.key.toLowerCase()==='n')noteToggle();else if(e.key.toLowerCase()==='f')void fullscreen();else if(e.key==='Escape'){notePanel.hidden=true;toggle.setAttribute('aria-expanded','false');}});
show(Number(location.hash.match(/slide-(\d+)/)?.[1]||1)-1);
</script></body></html>'''.replace('__SLIDES__','\n'.join(slides))
output=PPTX.with_suffix('.html');output.write_text(page,encoding='utf-8')
print(json.dumps({'output':str(output),'slides':22,'self_contained':True,'source_pptx_sha256':receipt['finalSha256']}))
