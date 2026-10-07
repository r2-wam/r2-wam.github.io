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
function selectVideo(task,group){player.pause();player.poster=`${videoDirectory}/${group.id}_poster.jpg`;player.src=`${videoDirectory}/${group.file||`${group.id}_6grid_5x.mp4`}`;player.load();document.querySelector("#gallery-title").textContent=task==="fold"?"Fold Shirt":"Clean Table";document.querySelectorAll(".recording").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.group===group.id)))}
function renderGallery(task){currentTask=task;document.querySelectorAll("[data-task]").forEach(b=>{b.classList.toggle("active",b.dataset.task===task);b.setAttribute("aria-selected",String(b.dataset.task===task));b.tabIndex=b.dataset.task===task?0:-1});const gallery=document.querySelector("#gallery");gallery.setAttribute("aria-labelledby",`tab-${task}`);gallery.classList.toggle("clean-groups",task==="clean");gallery.replaceChildren();for(const [index,group] of groups[task].entries()){const b=document.createElement("button");b.className="recording";b.dataset.group=group.id;b.setAttribute("aria-label",`${task==="fold"?"Fold Shirt":"Clean Table"} demonstration video ${index+1}`);b.innerHTML=`<img src="videos/plain/5x/${group.id}_poster.jpg" alt="" loading="lazy">`;b.addEventListener("click",()=>selectVideo(task,group));gallery.append(b)}selectVideo(task,groups[task][0])}
document.querySelectorAll("[data-task]").forEach(b=>{b.addEventListener("click",()=>renderGallery(b.dataset.task));b.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();const next=currentTask==="fold"?"clean":"fold";renderGallery(next);document.querySelector(`#tab-${next}`).focus()}})});
document.querySelector("[data-go-fold]").addEventListener("click",()=>renderGallery("fold"));document.querySelector("[data-go-clean]").addEventListener("click",()=>renderGallery("clean"));const dialog=document.querySelector("#figure-dialog");document.querySelectorAll("[data-image]").forEach(b=>b.addEventListener("click",()=>{document.querySelector("#enlarged-figure").src=b.dataset.image;dialog.showModal()}));document.querySelector(".dialog-close").addEventListener("click",()=>dialog.close());dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});document.addEventListener("visibilitychange",()=>{if(document.hidden)player.pause()});renderGallery("fold");
