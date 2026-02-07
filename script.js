// ------------------ SETTINGS ------------------
const PASSWORD = "0214";
const letterText = `Чамтай танилцсанаас хойш
жижиг зүйл хүртэл гоё санагддаг болсон.

Чи миний өдөр бүрийн инээд,
миний тайвшрал, миний аз жаргал.

Happy Valentine’s Day 💗`;

// ------------------ SAFE GET ------------------
function $(id){
  const el = document.getElementById(id);
  if(!el) console.warn("Missing element:", id);
  return el;
}

// ------------------ ELEMENTS ------------------
const screens = {
  lock: $("screen-lock"),
  ask: $("screen-ask"),
  love: $("screen-love")
};

const pw = $("pw");
const pwErr = $("pwErr");
const unlockBtn = $("unlockBtn");

const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const plea = $("plea");
const ctaRow = $("ctaRow");

const music = $("music");
const musicBtn = $("musicBtn");

const restartBtn = $("restartBtn");

const secLetter = $("sec-letter");
const secPhotos = $("sec-photos");
const secVideos = $("sec-videos");

const confettiCanvas = $("confetti");
const ctx = confettiCanvas?.getContext("2d");

// dropdown
const themeDD = $("themeDD");
const ddBtn = $("ddBtn");
const ddLabel = $("ddLabel");
const ddMenu = $("ddMenu");

// ------------------ HELPERS ------------------
function showScreen(name){
  Object.values(screens).forEach(s => s && s.classList.remove("screen-active"));
  screens[name] && screens[name].classList.add("screen-active");
}

function setTheme(theme){
  const map = {
    pink:  { a:"#ff4fa3", b:"#7c3aed" },
    violet:{ a:"#a855f7", b:"#22c55e" },
    rose:  { a:"#fb7185", b:"#f59e0b" }
  };
  const t = map[theme] || map.pink;
  document.documentElement.style.setProperty("--a", t.a);
  document.documentElement.style.setProperty("--b", t.b);
  localStorage.setItem("val_theme", theme);
}

function titleCase(s){ return s ? s[0].toUpperCase() + s.slice(1) : s; }

// ------------------ THEME DROPDOWN ------------------
(function initTheme(){
  if(!themeDD || !ddBtn || !ddLabel || !ddMenu) return;

  const savedTheme = localStorage.getItem("val_theme") || "pink";
  setTheme(savedTheme);
  ddLabel.textContent = titleCase(savedTheme);

  const items = Array.from(ddMenu.querySelectorAll(".dd-item"));
  items.forEach(i => i.classList.toggle("active", i.dataset.theme === savedTheme));

  ddBtn.addEventListener("click", () => {
    const open = themeDD.classList.toggle("open");
    ddBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  ddMenu.addEventListener("click", (e) => {
    const item = e.target.closest(".dd-item");
    if(!item) return;
    const t = item.dataset.theme;

    setTheme(t);
    ddLabel.textContent = titleCase(t);
    items.forEach(i => i.classList.toggle("active", i === item));

    themeDD.classList.remove("open");
    ddBtn.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("click", (e) => {
    if(!themeDD.contains(e.target)){
      themeDD.classList.remove("open");
      ddBtn.setAttribute("aria-expanded", "false");
    }
  });
})();

// ------------------ MUSIC ------------------
function setMusicButton(isPlaying){
  if(!musicBtn) return;
  musicBtn.textContent = isPlaying ? "shh 🤫" : "Play 🎵";
}

async function playMusic(){
  if(!music) return;
  try{
    await music.play();
    setMusicButton(true);
  }catch(e){
    setMusicButton(false);
  }
}

function pauseMusic(){
  if(!music) return;
  music.pause();
  setMusicButton(false);
}

if(musicBtn){
  musicBtn.addEventListener("click", async () => {
    if(!music) return;
    if(music.paused) await playMusic();
    else pauseMusic();
  });
  setMusicButton(false);
}

// ------------------ PASSWORD ------------------
if(unlockBtn){
  unlockBtn.addEventListener("click", async () => {
    if(!pw || !pwErr) return;

    if(pw.value === PASSWORD){
      pwErr.textContent = "";
      showScreen("ask");

      // ✅ password зөв оруулмагц шууд дуу
      await playMusic();
    } else {
      pwErr.textContent = "Wrong password 💔";
    }
  });
}

if(pw && unlockBtn){
  pw.addEventListener("keydown", (e) => {
    if(e.key === "Enter") unlockBtn.click();
  });
}

// ------------------ NO TRAP ------------------
let noCount = 0;

function moveNo(){
  if(!ctaRow || !noBtn) return;
  const rect = ctaRow.getBoundingClientRect();
  const maxX = rect.width - noBtn.offsetWidth;
  const maxY = rect.height - noBtn.offsetHeight;

  const x = Math.max(0, Math.floor(Math.random() * Math.max(1, maxX)));
  const y = Math.max(0, Math.floor(Math.random() * Math.max(1, maxY)));

  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top  = y + "px";
}

function updatePlea(){
  if(!plea) return;
  const lines = [
    "Гуйяаа 🥺",
    "Үгүй гэдэг товч ажиллахгүй байна 😭",
    "Нэг л удаа… тийм гэж хэлээч 💗",
    "Тийм дарвал surprise нээгдэнэ ✨"
  ];
  plea.textContent = lines[Math.min(noCount, lines.length - 1)];
}

if(noBtn){
  ["mouseenter","touchstart"].forEach(evt=>{
    noBtn.addEventListener(evt, (e) => {
      if(evt==="touchstart") e.preventDefault();
      noCount++;
      moveNo();
      updatePlea();
    }, {passive:false});
  });

  noBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    noCount++;
    moveNo();
    updatePlea();
  });
}

// ------------------ TYPEWRITER ------------------
let typed = 0;
let typingStarted = false;

function typewriter(){
  const el = $("type");
  if(!el) return;

  if(typed < letterText.length){
    el.textContent += letterText.charAt(typed++);
    setTimeout(typewriter, 26);
  }
}

// ------------------ REVEAL ------------------
function revealBlock(el){
  if(!el) return;
  el.classList.remove("hidden-block");
  el.classList.add("show-block");
}

// ------------------ YES CLICK ------------------
if(yesBtn){
  yesBtn.addEventListener("click", async () => {
    showScreen("love");
    burstConfetti();

    if(music && music.paused) await playMusic();

    if(!typingStarted){
      typingStarted = true;
      typed = 0;
      const t = $("type");
      if(t) t.textContent = "";
      typewriter();
    }

    setTimeout(() => revealBlock(secPhotos), 2600);
    setTimeout(() => revealBlock(secVideos), 5200);

    setTimeout(() => {
      secLetter && secLetter.scrollIntoView({behavior:"smooth", block:"start"});
    }, 250);
  });
}

// ------------------ CONFETTI ------------------
let particles = [];
let confettiOn = false;

function resizeCanvas(){
  if(!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function burstConfetti(){
  if(!confettiCanvas || !ctx) return;
  confettiOn = true;

  const count = 180;
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;

  for(let i=0;i<count;i++){
    particles.push({
      x: w/2,
      y: h*0.25,
      vx: (Math.random()-0.5)*10,
      vy: Math.random()*-9 - 6,
      g: 0.18 + Math.random()*0.12,
      r: 3 + Math.random()*3,
      rot: Math.random()*Math.PI,
      vr: (Math.random()-0.5)*0.2,
      life: 120 + Math.floor(Math.random()*60)
    });
  }
  requestAnimationFrame(tickConfetti);
  setTimeout(()=>{ confettiOn = false; }, 2600);
}

function tickConfetti(){
  if(!confettiCanvas || !ctx) return;
  ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);

  particles = particles.filter(p => p.life > 0);
  particles.forEach(p=>{
    p.vy += p.g; p.x += p.vx; p.y += p.vy;
    p.rot += p.vr; p.life--;

    const a = getComputedStyle(document.documentElement).getPropertyValue("--a").trim();
    const b = getComputedStyle(document.documentElement).getPropertyValue("--b").trim();
    ctx.fillStyle = (Math.random() > 0.5) ? a : b;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillRect(-p.r, -p.r, p.r*2.2, p.r*1.6);
    ctx.restore();
  });

  if(confettiOn || particles.length) requestAnimationFrame(tickConfetti);
}

// ------------------ RESTART ------------------
if(restartBtn){
  restartBtn.addEventListener("click", ()=>{
    typed = 0;
    typingStarted = false;
    const t = $("type"); if(t) t.textContent = "";

    if(secPhotos){ secPhotos.classList.add("hidden-block"); secPhotos.classList.remove("show-block"); }
    if(secVideos){ secVideos.classList.add("hidden-block"); secVideos.classList.remove("show-block"); }

    noCount = 0;
    if(plea) plea.textContent = "";
    if(noBtn){
      noBtn.style.position = "";
      noBtn.style.left = "";
      noBtn.style.top = "";
    }

    pauseMusic();

    showScreen("ask");
    window.scrollTo({top:0, behavior:"smooth"});
  });
}
