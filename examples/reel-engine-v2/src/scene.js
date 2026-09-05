import * as THREE from 'three';
const holder=document.getElementById('film-world'),canvas=document.getElementById('film-canvas'),act=document.getElementById('opening'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{canvas.hidden=true;}
if(renderer){renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,0,13);
scene.add(new THREE.AmbientLight(0xffffff,2.1));const key=new THREE.DirectionalLight(0xfff3dd,4);key.position.set(-4,6,8);scene.add(key);const fill=new THREE.DirectionalLight(0xffffff,3);fill.position.set(5,0,-3);scene.add(fill);
const film=new THREE.Group();scene.add(film);film.rotation.set(-.16,-.22,-.22);
const frames=[],loader=new THREE.TextureLoader();let loaded=0;const N=11;
for(let i=0;i<N;i++){
 const group=new THREE.Group();
 const backing=new THREE.Mesh(new THREE.BoxGeometry(1.15,2.18,.085),new THREE.MeshStandardMaterial({color:0x252321,metalness:.65,roughness:.25}));group.add(backing);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(backing.geometry),new THREE.LineBasicMaterial({color:0x776b5a}));group.add(edge);
 const texture=loader.load(`assets/frame-${String(i+1).padStart(2,'0')}.jpg`,()=>{loaded++;if(loaded===N){holder.classList.add('film-ready');render(0);}});texture.colorSpace=THREE.SRGBColorSpace;
 const image=new THREE.Mesh(new THREE.PlaneGeometry(.99,1.75),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));image.position.z=.05;group.add(image);
 for(const y of [-.99,.99])for(let j=0;j<5;j++){const hole=new THREE.Mesh(new THREE.PlaneGeometry(.11,.1),new THREE.MeshBasicMaterial({color:0xe9e7e1}));hole.position.set(-.44+j*.22,y,.045);group.add(hole);}
 frames.push(group);film.add(group);
}
// A continuous pair of film edges bridges the photographic frames.
const edgeMaterial=new THREE.MeshStandardMaterial({color:0xee542c,metalness:.3,roughness:.35});let rails=[];
function pathAt(t,p){const phase=t*Math.PI*1.65-.9;const spread=1-p*.20;return new THREE.Vector3(Math.sin(phase)*3.35*spread,Math.cos(phase)*1.65+(p-.5)*.4,Math.sin(phase*1.4)*1.4);}
const reel=new THREE.Group();scene.add(reel);reel.position.set(1.7,-.5,-2);reel.rotation.set(Math.PI/2-.5,.2,-.2);
const metal=new THREE.MeshStandardMaterial({color:0x9d998e,metalness:.92,roughness:.26});
for(const z of [-.20,.20]){const disk=new THREE.Mesh(new THREE.TorusGeometry(1.45,.12,12,80),metal);disk.position.z=z;reel.add(disk);const hub=new THREE.Mesh(new THREE.TorusGeometry(.32,.11,12,40),metal);hub.position.z=z;reel.add(hub);for(let i=0;i<6;i++){const spoke=new THREE.Mesh(new THREE.BoxGeometry(1.03,.16,.06),metal);const a=i*Math.PI/3;spoke.position.set(Math.cos(a)*.86,Math.sin(a)*.86,z);spoke.rotation.z=a;reel.add(spoke);}}
const cylinder=new THREE.Mesh(new THREE.CylinderGeometry(1.34,1.34,.34,64),new THREE.MeshStandardMaterial({color:0x28241f,metalness:.2,roughness:.55}));cylinder.rotation.x=Math.PI/2;reel.add(cylinder);
let progress=0,lastP=-1,pointer={x:0,y:0},inView=true,lastTime=0;
function render(time){const p=reduce.matches?.55:parseFloat(act.style.getPropertyValue('--sc-p'))||0;progress=reduce.matches?p:progress+(p-progress)*.12;const mobile=innerWidth<650;
 frames.forEach((f,i)=>{const t=i/(N-1);const pos=pathAt(t,progress);const next=pathAt(Math.min(t+.01,1.01),progress);const angle=Math.atan2(next.y-pos.y,next.x-pos.x);const flatten=THREE.MathUtils.smoothstep(progress,.35,.78);const rowX=(i-(N-1)/2)*1.07;pos.lerp(new THREE.Vector3(rowX,Math.sin(i*.8)*.04,0),flatten*.9);f.position.copy(pos);f.rotation.set(Math.sin(t*5)*.22*(1-flatten),Math.cos(t*5)*.65*(1-flatten),angle*(1-flatten));const settle=THREE.MathUtils.smoothstep(progress,.80,1);f.position.lerp(new THREE.Vector3((i-5)*.18,(i-5)*.12,-Math.abs(i-5)*.22),settle*.86);f.rotation.z*=1-settle*.85;});
 film.rotation.z=-.25+progress*.30;film.rotation.y=-.25+progress*.20+(reduce.matches?0:pointer.x*.08);film.position.x=mobile?0:.3;film.position.y=mobile?-.1:.15;
 reel.rotation.z=-progress*2.4;reel.scale.setScalar(1-progress*.35);reel.position.x=2.2-progress;
 if(Math.abs(progress-lastP)>.015||lastP===-1){rails.forEach(r=>{film.remove(r);r.geometry.dispose()});rails=[];for(const offset of [-1.10,1.10]){const points=frames.map(f=>new THREE.Vector3(f.position.x-Math.sin(f.rotation.z)*offset,f.position.y+Math.cos(f.rotation.z)*offset,f.position.z-.025));const curve=new THREE.CatmullRomCurve3(points);const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,80,.018,5,false),edgeMaterial);film.add(tube);rails.push(tube);}lastP=progress;}
 renderer.render(scene,camera);canvas.dataset.progress=progress.toFixed(3);canvas.dataset.rendered='true';}
function size(){renderer.setSize(holder.clientWidth,holder.clientHeight,false);camera.aspect=holder.clientWidth/holder.clientHeight;camera.position.z=innerWidth<650?17.7:13.8;camera.updateProjectionMatrix();render(0);}new ResizeObserver(size).observe(holder);
new IntersectionObserver(e=>{inView=e[0].isIntersecting;}).observe(holder);window.addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5;},{passive:true});
function tick(time){requestAnimationFrame(tick);if(!inView||document.hidden||time-lastTime<32)return;lastTime=time;render(time);}requestAnimationFrame(tick);size();
}
