
let pen={mode:'pen',color:'#e53935',width:4,history:[]};
function initPen(){const c=document.createElement('canvas');c.className='draw-layer';document.body.appendChild(c);const ctx=c.getContext('2d');function resize(){const old=document.createElement('canvas');old.width=c.width;old.height=c.height;old.getContext('2d').drawImage(c,0,0);c.width=innerWidth;c.height=innerHeight;ctx.drawImage(old,0,0)}resize();addEventListener('resize',resize);let drawing=false,last=null;function pos(e){let p=e.touches?e.touches[0]:e;return [p.clientX,p.clientY]};function start(e){drawing=true;pen.history.push(ctx.getImageData(0,0,c.width,c.height));last=pos(e);e.preventDefault()}function move(e){if(!drawing)return;let q=pos(e);ctx.lineCap='round';ctx.lineJoin='round';ctx.globalCompositeOperation=pen.mode==='erase'?'destination-out':'source-over';ctx.strokeStyle=pen.mode==='highlight'?pen.color+'66':pen.color;ctx.lineWidth=pen.mode==='highlight'?22:pen.mode==='erase'?28:4;ctx.beginPath();ctx.moveTo(...last);ctx.lineTo(...q);ctx.stroke();last=q;e.preventDefault()}function end(){drawing=false}c.addEventListener('pointerdown',start);c.addEventListener('pointermove',move);addEventListener('pointerup',end);window._canvas=c;window._ctx=ctx}
function toggleTools(){document.querySelector('.tools').classList.toggle('open')}
function mode(m){pen.mode=m;_canvas.classList.add('active')}
function color(x){pen.color=x;_canvas.classList.add('active')}
function undo(){let x=pen.history.pop();if(x)_ctx.putImageData(x,0,0)}
function clearPen(){_ctx.clearRect(0,0,_canvas.width,_canvas.height);pen.history=[]}
function closePen(){_canvas.classList.remove('active');document.querySelector('.tools').classList.remove('open')}
function teacherTools(){return `<div class="teacher"><button class="penbtn" onclick="toggleTools()">✏️</button><div class="tools"><button onclick="mode('pen')">✏️ قلم</button><button onclick="mode('highlight')">🖍️ محدد</button><button class="color" style="background:#e53935" onclick="color('#e53935')"></button><button class="color" style="background:#1976d2" onclick="color('#1976d2')"></button><button class="color" style="background:#f9a825" onclick="color('#f9a825')"></button><button class="color" style="background:#7b1fa2" onclick="color('#7b1fa2')"></button><button onclick="undo()">↶ تراجع</button><button onclick="mode('erase')">🧽 ممحاة</button><button onclick="clearPen()">🗑️ مسح الكل</button><button onclick="closePen()">✕ إغلاق</button></div></div>`}
function nav(prev,next){return `<div class="nav"><a href="${prev||'index.html'}">السابق</a><a class="home" href="index.html">🏠 الرئيسية</a><a href="${next||'index.html'}">التالي</a></div>`}
function initGreenVideos(){
  document.querySelectorAll('video.character').forEach(v=>{
    const c=document.createElement('canvas');
    c.className=v.className;
    c.classList.toggle('hidden',v.classList.contains('hidden'));
    c.setAttribute('role','button');
    c.setAttribute('aria-label','تشغيل أو إيقاف الفيديو');
    c.style.cursor='pointer';
    v.insertAdjacentElement('afterend',c);
    v.style.position='absolute';
    v.style.opacity='0';
    v.style.pointerEvents='none';
    const x=c.getContext('2d',{willReadFrequently:true});
    let raf=0;
    function frame(){
      if(v.videoWidth&&v.videoHeight){
        if(c.width!==v.videoWidth||c.height!==v.videoHeight){c.width=v.videoWidth;c.height=v.videoHeight}
        x.drawImage(v,0,0,c.width,c.height);
        const im=x.getImageData(0,0,c.width,c.height),d=im.data;
        for(let i=0;i<d.length;i+=4){
          const r=d[i],g=d[i+1],b=d[i+2];
          if(g>70&&g>r*1.18&&g>b*1.12){
            const strength=Math.min(1,(g-Math.max(r,b))/105);
            d[i+3]=Math.round(255*(1-strength));
            if(d[i+3]>0){d[i]=Math.min(255,r*1.06);d[i+1]=Math.min(255,g*.80)}
          }
        }
        x.putImageData(im,0,0);
      }
      if(!v.paused&&!v.ended)raf=requestAnimationFrame(frame)
    }
    function showFirstFrame(){
      if(v.readyState>=2){frame();return}
      v.addEventListener('loadeddata',frame,{once:true});
    }
    v.addEventListener('play',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)});
    v.addEventListener('pause',frame);
    v.addEventListener('seeked',frame);
    v.addEventListener('ended',()=>{
      frame();
      // Opening character clips should not remain over the lesson controls after speaking.
      const openingIds=['so','cq','to','do','wo'];
      if(openingIds.includes(v.id)){
        setTimeout(()=>v.classList.add('hidden'),180);
      }
    });
    c.addEventListener('click',()=>{if(v.paused||v.ended){if(v.ended)v.currentTime=0;v.play().catch(()=>{})}else v.pause()});
    c.addEventListener('pointerup',e=>e.stopPropagation());
    new MutationObserver(()=>c.classList.toggle('hidden',v.classList.contains('hidden'))).observe(v,{attributes:true,attributeFilter:['class']});
    showFirstFrame();
    if(v.autoplay){
      v.play().catch(()=>{showFirstFrame()});
    }
  })
}
document.addEventListener('DOMContentLoaded',()=>{document.body.insertAdjacentHTML('beforeend',teacherTools());initPen();initGreenVideos()});
