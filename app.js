const hdPreview=new URLSearchParams(location.search).get("quality")==="hd";
document.querySelector("#copy-bibtex").addEventListener("click",async()=>{
  const code=document.querySelector("#bibtex-code");
  const status=document.querySelector("#copy-status");
  try{
    await navigator.clipboard.writeText(code.textContent);
    status.textContent="BibTeX copied.";
  }catch{
    const range=document.createRange();range.selectNodeContents(code);
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
    status.textContent="Press Ctrl+C or ⌘C to copy the selected BibTeX.";
  }
});
const videoDirectory=hdPreview?"videos/plain/5x/hd":"videos/plain/5x";
const groups={fold:[{id:"fold_deep_purple"},{id:"fold_black"},{id:"fold_brown"},{id:"fold_red"}],clean:[{id:"clean_table",file:"clean_table_6grid_5x_60fps.mp4"}]};
const player=document.querySelector("#demo-video");let currentTask="fold";
const videoShell=player.closest(".demo-player");
const videoControls=videoShell.querySelector(".video-controls");
const playButton=document.querySelector("#video-play");
const seekControl=document.querySelector("#video-seek");
const timeDisplay=document.querySelector("#video-time");
const fullscreenButton=document.querySelector("#video-fullscreen");
function formatTime(seconds){const value=Math.floor(Math.max(0,seconds||0));return `${Math.floor(value/60)}:${String(value%60).padStart(2,"0")}`;}
function syncVideoControls(){
  const duration=Number.isFinite(player.duration)?player.duration:0;
  const playing=!player.paused&&!player.ended;
  playButton.textContent=playing?"Pause":"Play";
  playButton.setAttribute("aria-label",playing?"Pause video":"Play video");
  seekControl.max=String(duration);seekControl.disabled=duration===0;
  seekControl.value=String(player.currentTime||0);
  seekControl.setAttribute("aria-valuetext",`${formatTime(player.currentTime)} of ${formatTime(duration)}`);
  timeDisplay.textContent=`${formatTime(player.currentTime)} / ${formatTime(duration)}`;
}
playButton.addEventListener("click",async()=>{
  if(!player.paused&&!player.ended){player.pause();return;}
  try{await player.play();}catch{timeDisplay.textContent="Unable to play. Try again.";}
});
seekControl.addEventListener("input",()=>{if(Number.isFinite(player.duration)){player.currentTime=Number(seekControl.value);syncVideoControls();}});
for(const event of ["loadedmetadata","durationchange","timeupdate","play","pause","ended","emptied"]){player.addEventListener(event,syncVideoControls);}
fullscreenButton.hidden=!videoShell.requestFullscreen&&!player.webkitEnterFullscreen;
fullscreenButton.addEventListener("click",async()=>{
  try{
    if(document.fullscreenElement){await document.exitFullscreen();}
    else if(videoShell.requestFullscreen){await videoShell.requestFullscreen();}
    else if(player.webkitEnterFullscreen){player.webkitEnterFullscreen();}
  }catch{fullscreenButton.focus();}
});
document.addEventListener("fullscreenchange",()=>{fullscreenButton.setAttribute("aria-label",document.fullscreenElement===videoShell?"Exit fullscreen":"Enter fullscreen");});
player.controls=false;videoControls.hidden=false;syncVideoControls();
function selectVideo(task,group){player.pause();player.poster=`${videoDirectory}/${group.id}_poster.jpg`;player.src=`${videoDirectory}/${group.file||`${group.id}_6grid_5x.mp4`}`;player.load();document.querySelector("#gallery-title").textContent=task==="fold"?"Fold Shirt":"Clean Table";document.querySelectorAll(".recording").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.group===group.id)))}
function renderGallery(task){currentTask=task;document.querySelectorAll("[data-task]").forEach(b=>{b.classList.toggle("active",b.dataset.task===task);b.setAttribute("aria-selected",String(b.dataset.task===task));b.tabIndex=b.dataset.task===task?0:-1});const gallery=document.querySelector("#gallery");gallery.setAttribute("aria-labelledby",`tab-${task}`);gallery.classList.toggle("clean-groups",task==="clean");gallery.replaceChildren();for(const [index,group] of groups[task].entries()){const b=document.createElement("button");b.className="recording";b.dataset.group=group.id;b.setAttribute("aria-label",`${task==="fold"?"Fold Shirt":"Clean Table"} demonstration video ${index+1}`);b.innerHTML=`<img src="videos/plain/5x/${group.id}_poster.jpg" alt="" loading="lazy">`;b.addEventListener("click",()=>selectVideo(task,group));gallery.append(b)}selectVideo(task,groups[task][0])}
document.querySelectorAll("[data-task]").forEach(b=>{b.addEventListener("click",()=>renderGallery(b.dataset.task));b.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();const next=currentTask==="fold"?"clean":"fold";renderGallery(next);document.querySelector(`#tab-${next}`).focus()}})});
document.querySelector("[data-go-fold]").addEventListener("click",()=>renderGallery("fold"));document.querySelector("[data-go-clean]").addEventListener("click",()=>renderGallery("clean"));const dialog=document.querySelector("#figure-dialog");document.querySelectorAll("[data-image]").forEach(b=>b.addEventListener("click",()=>{document.querySelector("#enlarged-figure").src=b.dataset.image;dialog.showModal()}));document.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});document.addEventListener("visibilitychange",()=>{if(document.hidden)player.pause()});renderGallery("fold");
