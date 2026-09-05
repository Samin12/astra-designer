import * as T from 'three';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
const canvas=document.querySelector('#hero-canvas'),holder=document.querySelector('#sculpture'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let r;try{r=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch(e){canvas.hidden=true;}
if(r){r.setPixelRatio(Math.min(devicePixelRatio,1.7));r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.2;r.outputColorSpace=T.SRGBColorSpace;
const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,12);const pm=new T.PMREMGenerator(r);scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture;
scene.add(new T.AmbientLight(0xc9dbb3,.8));const light=new T.DirectionalLight(0xf0ffdf,6);light.position.set(-4,8,5);scene.add(light);const edge=new T.DirectionalLight(0xffffff,4);edge.position.set(5,-2,-2);scene.add(edge);
const group=new T.Group();scene.add(group);group.rotation.set(.17,.48,-.12);
const silver=new T.MeshStandardMaterial({color:0xb9c1ae,metalness:1,roughness:.22});const dark=new T.MeshStandardMaterial({color:0x252d20,metalness:.9,roughness:.28});const lime=new T.MeshStandardMaterial({color:0xc5ec42,metalness:.55,roughness:.27});const load=new T.TextureLoader();const parts=[];let ready=0;
function bar(w,h,d,mat){return new T.Mesh(new RoundedBoxGeometry(w,h,d,4,.06),mat)}
for(let i=0;i<4;i++){const panel=new T.Group();const w=2.7,h=4.3,th=.13;const mat=i===0?lime:silver;
for(const x of [-w/2,w/2]){const m=bar(.16,h+.12,th,mat);m.position.x=x;panel.add(m)}for(const y of [-h/2,h/2]){const m=bar(w,.16,th,mat);m.position.y=y;panel.add(m)}
if(i===3||i===1){const tex=load.load('assets/'+(i===3?'frame-09.jpg':'frame-04.jpg'),()=>{ready++;if(ready===2)holder.classList.add('scene-ready')});tex.colorSpace=T.SRGBColorSpace;const face=new T.Mesh(new T.PlaneGeometry(w-.19,h-.2),new T.MeshBasicMaterial({map:tex}));face.position.z=.025;panel.add(face)}
if(i===2){for(let j=0;j<9;j++){const m=bar(.055,.25+Math.abs(Math.sin(j*1.7))*.9,.06,lime);m.position.set((j-4)*.22,-1.15,.06);panel.add(m)}for(const y of [-.5,.6]){const m=bar(2.1,.025,.02,silver);m.position.y=y;panel.add(m)}}
for(const x of [-1.35,1.35])for(const y of [-2.15,2.15]){const rivet=new T.Mesh(new T.CylinderGeometry(.052,.052,.04,12),dark);rivet.rotation.x=Math.PI/2;rivet.position.set(x,y,.095);panel.add(rivet)}
panel.position.set((i-1.5)*.60,(i-1.5)*.19,(i-1.5)*.86);parts.push(panel);group.add(panel)}
const base=bar(4.7,.10,2.8,dark);base.position.set(.2,-3,-.5);base.visible=false;scene.add(base);
let mx=0,my=0,rx=0,ry=0,visible=true,last=0;addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5);my=e.clientY/innerHeight-.5},{passive:true});new IntersectionObserver(([e])=>visible=e.isIntersecting).observe(holder);
function draw(){const p=Math.min(1,scrollY/innerHeight);rx+=(mx-rx)*.05;ry+=(my-ry)*.05;group.rotation.y=.48+(reduced.matches?0:rx*.3+p*.25);group.rotation.x=.15+(reduced.matches?0:ry*.16);group.rotation.z=-.13+(reduced.matches?0:p*.08);group.position.y=.15;parts.forEach((part,i)=>{part.position.z=(i-1.5)*(.82+p*.32)});r.render(scene,camera);canvas.dataset.rendered='true';canvas.dataset.progress=p.toFixed(3)}
function resize(){const w=holder.clientWidth,h=holder.clientHeight;r.setSize(w,h,false);camera.aspect=w/h;camera.position.z=innerWidth<800?14.7:12.8;camera.updateProjectionMatrix();draw()}new ResizeObserver(resize).observe(holder);function tick(t){requestAnimationFrame(tick);if(!visible||document.hidden||t-last<33)return;last=t;draw()}resize();requestAnimationFrame(tick);
}
