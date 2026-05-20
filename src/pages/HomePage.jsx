import { useState, useEffect } from "react";

/* ── Font + Global Styles ── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: #0A0A0F;
      color: #F8FAFC;
      font-family: 'DM Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0A0A0F; }
    ::-webkit-scrollbar-thumb { background: #2d2d3d; border-radius: 3px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideRight {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(-8px); }
    }
    @keyframes chipIn {
      from { opacity: 0; transform: translateX(16px) scale(0.9); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes menuDown {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .aFadeUp    { animation: fadeUp    0.6s ease both; }
    .aSlideUp   { animation: slideUp   0.6s ease both; }
    .aSlideRight{ animation: slideRight 0.7s ease both; }
    .aFloat     { animation: float 4s ease-in-out infinite; }
    .aChip1     { animation: chipIn 0.5s ease 1.2s both; }
    .aChip2     { animation: chipIn 0.5s ease 1.6s both; }
    .aMenu      { animation: menuDown 0.2s ease both; }

    .gradText {
      background: linear-gradient(135deg,#a78bfa 0%,#f59e0b 60%,#f97316 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* nav blur */
    .navBlur {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    /* button transitions */
    .btnP { transition: background .2s, box-shadow .2s, transform .1s; }
    .btnP:hover { background:#818CF8!important; box-shadow:0 0 24px rgba(99,102,241,.45); }
    .btnP:active { transform:scale(.97); }

    .btnG { transition: border-color .2s, background .2s; }
    .btnG:hover { border-color:rgba(255,255,255,.35)!important; background:rgba(255,255,255,.06)!important; }

    /* card hover */
    .stepCard { transition: border-color .2s, background .2s, transform .2s; }
    .stepCard:hover { border-color:#a78bfa!important; background:rgba(99,102,241,.06)!important; transform:translateY(-3px); }

    .trackCard { transition: transform .25s, box-shadow .25s; }
    .trackCard:hover { transform:translateY(-6px); box-shadow:0 20px 50px rgba(0,0,0,.6); }

    .navLink {
      color:#94A3B8; text-decoration:none;
      font-family:'DM Sans',sans-serif; font-size:14px;
      font-weight:500; letter-spacing:.04em; text-transform:uppercase;
      transition:color .2s;
    }
    .navLink:hover { color:#F8FAFC; }

    .fLink {
      display:block; font-family:'DM Sans',sans-serif;
      font-size:14px; color:#94A3B8; text-decoration:none;
      margin-bottom:12px; transition:color .2s;
    }
    .fLink:hover { color:#F8FAFC; }

    .socBtn {
      width:36px; height:36px; border-radius:8px;
      background:rgba(255,255,255,.05);
      border:1px solid rgba(255,255,255,.08);
      color:#94A3B8; font-size:11px; font-weight:700;
      cursor:pointer; font-family:'DM Sans',sans-serif;
      transition: background .2s, border-color .2s, color .2s;
    }
    .socBtn:hover { background:rgba(255,255,255,.1)!important; color:#F8FAFC; }

    /* ── Layout helpers (CSS-only responsive) ── */

    /* hero */
    .heroGrid {
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:64px;
      align-items:center;
    }
    .heroCodeCol { display:flex; justify-content:flex-end; }

    /* steps */
    .stepsGrid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }

    /* tracks */
    .tracksGrid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }

    /* footer */
    .footerGrid { display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:48px; margin-bottom:64px; }
    .footerBottom { display:flex; justify-content:space-between; align-items:center; }

    /* padding */
    .pHero   { padding:100px 48px 120px; }
    .pSec    { padding:96px 48px; }
    .pNav    { padding:0 48px; }
    .pFooter { padding:64px 48px 32px; }

    /* type scale */
    .h1Size  { font-size:68px; }
    .h2Size  { font-size:40px; }

    /* desktop nav */
    .deskLinks { display:flex; }
    .deskAuth  { display:flex; }
    .burger    { display:none; }

    /* ── Tablet ── */
    @media(max-width:1023px){
      .heroGrid { grid-template-columns:1fr; gap:48px; text-align:center; }
      .heroCodeCol { justify-content:center; }
      .heroCta, .heroSocial { justify-content:center!important; }
      .heroBadge { display:flex; justify-content:center; }
      .heroBody  { margin-left:auto; margin-right:auto; }

      .stepsGrid  { grid-template-columns:1fr; gap:14px; }
      .tracksGrid { grid-template-columns:1fr; gap:14px; }
      .footerGrid { grid-template-columns:1fr 1fr; gap:32px; }
      .footerBrand{ grid-column:1/-1; }

      .h1Size  { font-size:50px; }
      .h2Size  { font-size:34px; }
      .pHero   { padding:72px 32px 80px; }
      .pSec    { padding:72px 32px; }
      .pNav    { padding:0 32px; }
      .pFooter { padding:56px 32px 28px; }
    }

    /* ── Mobile ── */
    @media(max-width:767px){
      .deskLinks { display:none!important; }
      .deskAuth  { display:none!important; }
      .burger    { display:flex!important; }

      .heroGrid   { gap:36px; }
      .stepsGrid  { grid-template-columns:1fr; gap:12px; }
      .tracksGrid { grid-template-columns:1fr; gap:12px; }
      .footerGrid { grid-template-columns:1fr; gap:28px; margin-bottom:40px; }
      .footerBrand{ grid-column:auto; }
      .footerBottom { flex-direction:column; gap:14px; text-align:center; }

      .h1Size  { font-size:36px; letter-spacing:-1px!important; }
      .h2Size  { font-size:26px; }
      .pHero   { padding:48px 20px 64px; }
      .pSec    { padding:56px 20px; }
      .pNav    { padding:0 20px; }
      .pFooter { padding:48px 20px 24px; }
    }

    /* ── Wide ── */
    @media(min-width:1281px){
      .h1Size { font-size:76px; }
    }
  `}</style>
);

/* ── useWidth hook ── */
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

/* ── Logo ── */
function Logo() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{
        width:34, height:34, borderRadius:8, background:"#6366F1", flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        <span style={{ color:"#fff", fontFamily:"'JetBrains Mono'", fontSize:12, fontWeight:500 }}>&lt;/&gt;</span>
      </div>
      <span style={{ fontFamily:"'Space Grotesk'", fontWeight:700, fontSize:15, letterSpacing:"0.08em", color:"#F8FAFC" }}>
        CODEPATH
      </span>
    </div>
  );
}

/* ── Navbar ── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const w = useWidth();
  const mob = w < 768;

  return (
    <nav className="navBlur" style={{
      position:"sticky", top:0, zIndex:100,
      background:"rgba(10,10,15,0.88)",
      borderBottom:"1px solid rgba(255,255,255,0.06)",
    }}>
      <div className="pNav" style={{ maxWidth:1280, margin:"0 auto" }}>
        {/* bar */}
        <div style={{ height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Logo />

          <div className="deskLinks" style={{ gap:36 }}>
            {["Tracks","Features","Community"].map(l=>(
              <a key={l} href="#" className="navLink">{l}</a>
            ))}
          </div>

          <div className="deskAuth" style={{ alignItems:"center", gap:12 }}>
            <a href="#" className="navLink">Log In</a>
            <button className="btnP" style={{
              background:"#6366F1", color:"#fff", border:"none", borderRadius:8,
              padding:"10px 22px", cursor:"pointer",
              fontFamily:"'Space Grotesk'", fontWeight:600, fontSize:13, letterSpacing:"0.06em",
            }}>Get Started</button>
          </div>

          {/* hamburger */}
          <button
            className="burger"
            onClick={()=>setOpen(o=>!o)}
            style={{
              background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.1)",
              borderRadius:8, width:40, height:40, cursor:"pointer",
              flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5,
            }}
          >
            {[0,1,2].map(i=>(
              <span key={i} style={{
                display:"block", width:18, height:2,
                background:"#F8FAFC", borderRadius:2, transition:"all .2s",
                transform: open
                  ? i===0 ? "rotate(45deg) translate(5px,5px)"
                  : i===2 ? "rotate(-45deg) translate(5px,-5px)"
                  : "scaleX(0)"
                  : "none",
                opacity: open && i===1 ? 0 : 1,
              }}/>
            ))}
          </button>
        </div>

        {/* mobile menu */}
        {open && mob && (
          <div className="aMenu" style={{
            borderTop:"1px solid rgba(255,255,255,.06)",
            padding:"20px 0 24px",
            display:"flex", flexDirection:"column", gap:4,
          }}>
            {["Tracks","Features","Community"].map(l=>(
              <a key={l} href="#" className="navLink" style={{
                padding:"12px 0", fontSize:15,
                borderBottom:"1px solid rgba(255,255,255,.04)",
              }}>{l}</a>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <a href="#" style={{
                flex:1, textAlign:"center", padding:"12px",
                border:"1px solid rgba(255,255,255,.15)", borderRadius:8,
                color:"#F8FAFC", textDecoration:"none",
                fontFamily:"'Space Grotesk'", fontWeight:600, fontSize:13, letterSpacing:"0.06em",
              }}>LOG IN</a>
              <button className="btnP" style={{
                flex:1, background:"#6366F1", color:"#fff",
                border:"none", borderRadius:8, padding:"12px", cursor:"pointer",
                fontFamily:"'Space Grotesk'", fontWeight:600, fontSize:13, letterSpacing:"0.06em",
              }}>GET STARTED</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ── Code Mockup ── */
function CodeMockup() {
  const lines = [
    [{t:"def ",c:"#FF7B72"},{t:"calculate_xp",c:"#D2A8FF"},{t:"(streak, base_xp):",c:"#F8FAFC"}],
    [{t:'  """Calculate XP with streak multiplier"""',c:"#8B949E",i:true}],
    [{t:"  multiplier ",c:"#F8FAFC"},{t:"= ",c:"#FF7B72"},{t:"1.0 ",c:"#79C0FF"},{t:"+ (streak * ",c:"#F8FAFC"},{t:"0.1",c:"#79C0FF"},{t:")",c:"#F8FAFC"}],
    [{t:"  current_streak ",c:"#F8FAFC"},{t:"= ",c:"#FF7B72"},{t:"12",c:"#79C0FF"}],
    [{t:"  earned_xp ",c:"#F8FAFC"},{t:"= ",c:"#FF7B72"},{t:"calculate_xp(current_streak, ",c:"#F8FAFC"},{t:"50",c:"#79C0FF"},{t:")",c:"#F8FAFC"}],
    [{t:'  print(f"🔥 Streak: {current_streak} days")',c:"#A5D6FF"}],
    [{t:'  print(f"⭐ Earned: {earned_xp} XP")',c:"#A5D6FF"}],
  ];

  return (
    <div className="aFloat" style={{ position:"relative", width:"100%" }}>
      {/* glow */}
      <div style={{
        position:"absolute", inset:-40,
        background:"radial-gradient(ellipse at center,rgba(99,102,241,.15) 0%,transparent 70%)",
        pointerEvents:"none",
      }}/>

      {/* window */}
      <div style={{
        background:"#0D1117", border:"1px solid rgba(255,255,255,.1)",
        borderRadius:14, overflow:"hidden",
        boxShadow:"0 24px 60px rgba(0,0,0,.6)", position:"relative",
      }}>
        {/* chrome */}
        <div style={{
          background:"#161B22", padding:"10px 16px",
          display:"flex", alignItems:"center", gap:8,
          borderBottom:"1px solid rgba(255,255,255,.06)",
        }}>
          {["#FF5F57","#FFBD2E","#28C840"].map(c=>(
            <span key={c} style={{ width:11,height:11,borderRadius:"50%",background:c,display:"inline-block" }}/>
          ))}
          <span style={{ flex:1, textAlign:"center", fontFamily:"'JetBrains Mono'", fontSize:11, color:"#484F58" }}>main.py</span>
        </div>

        {/* code */}
        <div style={{ padding:"16px 16px 16px 0", overflowX:"auto" }}>
          {lines.map((line,i)=>(
            <div key={i} style={{ display:"flex", marginBottom:3, minHeight:20 }}>
              <span style={{ width:32, textAlign:"right", paddingRight:12, fontFamily:"'JetBrains Mono'", fontSize:12, color:"#484F58", userSelect:"none", flexShrink:0 }}>{i+1}</span>
              <span style={{ fontFamily:"'JetBrains Mono'", fontSize:12, lineHeight:"20px", whiteSpace:"nowrap" }}>
                {line.map((tk,j)=>(
                  <span key={j} style={{ color:tk.c, fontStyle:tk.i?"italic":"normal" }}>{tk.t}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* chips */}
      <div className="aChip1" style={{
        position:"absolute", top:36, right:0,
        background:"rgba(15,15,26,.96)", border:"1px solid rgba(245,158,11,.4)",
        borderRadius:20, padding:"7px 13px",
        display:"flex", alignItems:"center", gap:6,
        backdropFilter:"blur(12px)", boxShadow:"0 4px 20px rgba(0,0,0,.5)", zIndex:2,
      }}>
        <span style={{fontSize:13}}>🔥</span>
        <span style={{ fontFamily:"'DM Sans'", fontWeight:600, fontSize:12, color:"#FCD34D" }}>12 Day Streak!</span>
      </div>

      <div className="aChip2" style={{
        position:"absolute", top:84, right:0,
        background:"rgba(15,15,26,.96)", border:"1px solid rgba(99,102,241,.4)",
        borderRadius:20, padding:"7px 13px",
        display:"flex", alignItems:"center", gap:6,
        backdropFilter:"blur(12px)", boxShadow:"0 4px 20px rgba(0,0,0,.5)", zIndex:2,
      }}>
        <span style={{fontSize:13}}>⭐</span>
        <span style={{ fontFamily:"'DM Sans'", fontWeight:600, fontSize:12, color:"#A5B4FC" }}>+50 XP Earned</span>
      </div>
    </div>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <div style={{ position:"relative", background:"#0A0A0F", overflow:"hidden" }}>
      <div style={{
        position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:"min(900px,100%)", height:500,
        background:"radial-gradient(ellipse at top,rgba(99,102,241,.12) 0%,transparent 65%)",
        pointerEvents:"none",
      }}/>

      <div className="pHero" style={{ maxWidth:1280, margin:"0 auto" }}>
        <div className="heroGrid">
          {/* text */}
          <div>
            <div className="aFadeUp heroBadge" style={{ animationDelay:".05s", marginBottom:24 }}>
              <span style={{
                display:"inline-flex", alignItems:"center", gap:6,
                background:"rgba(245,158,11,.12)", border:"1px solid rgba(245,158,11,.3)",
                borderRadius:20, padding:"5px 14px",
                fontFamily:"'DM Sans'", fontWeight:600, fontSize:11,
                color:"#FCD34D", letterSpacing:"0.1em", textTransform:"uppercase",
              }}>⚡ NEW: AI POWERED LEARNING PATHS</span>
            </div>

            <h1 className="aFadeUp h1Size" style={{
              animationDelay:".15s",
              fontFamily:"'Space Grotesk'", fontWeight:700,
              lineHeight:1.06, letterSpacing:"-2px", marginBottom:20,
            }}>
              <span style={{color:"#F8FAFC"}}>Your journey to</span><br/>
              <span className="gradText">becoming</span><br/>
              <span className="gradText">a</span>
              <span style={{color:"#F8FAFC"}}>developer</span>
              <span style={{color:"#F59E0B"}}>.</span>
            </h1>

            <p className="aFadeUp heroBody" style={{
              animationDelay:".25s",
              fontFamily:"'DM Sans'", fontSize:16, lineHeight:1.75,
              color:"#94A3B8", marginBottom:32, maxWidth:460,
            }}>
              Master coding through gamified tracks, real-world projects, and AI-driven feedback. Join thousands of developers building the future.
            </p>

            <div className="aFadeUp heroCta" style={{
              animationDelay:".35s",
              display:"flex", gap:12, marginBottom:36, flexWrap:"wrap",
            }}>
              <button className="btnP" style={{
                background:"#6366F1", color:"#fff", border:"none", borderRadius:8,
                padding:"13px 24px", cursor:"pointer",
                fontFamily:"'Space Grotesk'", fontWeight:600,
                fontSize:13, letterSpacing:"0.08em", textTransform:"uppercase",
                whiteSpace:"nowrap",
              }}>START LEARNING FREE →</button>
              <button className="btnG" style={{
                background:"transparent", color:"#F8FAFC",
                border:"1px solid rgba(255,255,255,.15)", borderRadius:8,
                padding:"13px 20px", cursor:"pointer",
                fontFamily:"'Space Grotesk'", fontWeight:600,
                fontSize:13, letterSpacing:"0.08em", textTransform:"uppercase",
                whiteSpace:"nowrap",
              }}>EXPLORE TRACKS ⠿</button>
            </div>

            <div className="aFadeUp heroSocial" style={{ animationDelay:".45s", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{display:"flex"}}>
                {["#6366F1","#F59E0B","#10B981","#3B82F6"].map((c,i)=>(
                  <div key={i} style={{
                    width:30,height:30,borderRadius:"50%",
                    background:c, border:"2px solid #0A0A0F",
                    marginLeft:i===0?0:-9,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:11,fontWeight:700,color:"#fff",flexShrink:0,
                  }}>{["A","B","C","D"][i]}</div>
                ))}
                <div style={{
                  width:30,height:30,borderRadius:"50%",
                  background:"#1A1A2E",border:"2px solid #0A0A0F",marginLeft:-9,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,fontWeight:700,color:"#94A3B8",flexShrink:0,
                }}>+2k</div>
              </div>
              <span style={{ fontFamily:"'DM Sans'", fontSize:14, color:"#94A3B8" }}>
                <strong style={{color:"#F8FAFC"}}>2,000+</strong> developers learning today
              </span>
            </div>
          </div>

          {/* code */}
          <div className="heroCodeCol">
            <div style={{ width:"100%", maxWidth:460 }}>
              <CodeMockup/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── How It Works ── */
function HowItWorks() {
  const steps = [
    { num:"01", title:"CHOOSE TRACK",     desc:"Select a learning path tailored to your goals, from frontend basics to advanced data science." },
    { num:"02", title:"COMPLETE LESSONS", desc:"Engage with bite-sized, interactive coding challenges that build real muscle memory." },
    { num:"03", title:"BUILD PROJECTS",   desc:"Apply your skills by building portfolio-ready projects with AI-assisted code reviews." },
  ];
  return (
    <section style={{background:"#0F0F1A"}}>
      <div className="pSec" style={{maxWidth:1280,margin:"0 auto"}}>
        <p style={{ fontFamily:"'DM Sans'",fontSize:12,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#6366F1",marginBottom:12 }}>
          // THE PROCESS
        </p>
        <h2 className="h2Size" style={{ fontFamily:"'Space Grotesk'",fontWeight:700,letterSpacing:"-1px",color:"#F8FAFC",marginBottom:48 }}>
          HOW IT WORKS
        </h2>
        <div className="stepsGrid">
          {steps.map((s,i)=>(
            <div key={s.num} className="stepCard aSlideUp" style={{
              animationDelay:`${.1*i}s`,
              background:"#0A0A0F",
              border:"1px solid rgba(255,255,255,.07)",
              borderLeft:"2px solid #6366F1",
              borderRadius:14, padding:"28px 24px 32px",
            }}>
              <div style={{ fontFamily:"'Space Grotesk'",fontSize:44,fontWeight:700,color:"rgba(255,255,255,.05)",lineHeight:1,marginBottom:14 }}>{s.num}</div>
              <h3 style={{ fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:15,letterSpacing:"0.04em",color:"#F8FAFC",marginBottom:10 }}>{s.title}</h3>
              <p style={{ fontFamily:"'DM Sans'",fontSize:14,lineHeight:1.65,color:"#94A3B8" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Track Card ── */
function TrackCard({ track, delay }) {
  const dc = { Beginner:"#10B981", Intermediate:"#F59E0B", Advanced:"#EF4444" }[track.difficulty] || "#94A3B8";
  return (
    <div className="trackCard aSlideUp" style={{
      animationDelay:delay,
      background:"#0F0F1A",
      border:"1px solid rgba(255,255,255,.08)",
      borderRadius:14, overflow:"hidden",
    }}>
      <div style={{height:5,background:track.color}}/>
      <div style={{padding:"22px 22px 26px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div style={{
            width:42,height:42,borderRadius:10,flexShrink:0,
            background:`${track.color}22`, border:`1px solid ${track.color}44`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
          }}>{track.icon}</div>
          <span style={{
            fontFamily:"'DM Sans'",fontSize:11,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",
            color:dc,background:`${dc}18`,border:`1px solid ${dc}33`,borderRadius:4,padding:"3px 8px",
          }}>{track.difficulty}</span>
        </div>
        <h3 style={{fontFamily:"'Space Grotesk'",fontWeight:700,fontSize:19,color:"#F8FAFC",marginBottom:8}}>{track.name}</h3>
        <p style={{fontFamily:"'DM Sans'",fontSize:13,lineHeight:1.6,color:"#94A3B8",marginBottom:18}}>{track.desc}</p>
        <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
          <span style={{fontFamily:"'DM Sans'",fontSize:13,color:"#94A3B8",display:"flex",alignItems:"center",gap:4}}>
            <span style={{color:"#6366F1"}}>⏱</span> {track.weeks}
          </span>
          <span style={{fontFamily:"'DM Sans'",fontSize:13,color:"#94A3B8",display:"flex",alignItems:"center",gap:4}}>
            <span style={{color:"#F59E0B"}}>★</span> {track.xp} XP
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Learning Tracks ── */
function LearningTracks() {
  const tracks = [
    { name:"HTML/CSS Foundation",    icon:"🌐", color:"#E34F26", difficulty:"Beginner",     weeks:"6 Weeks",  xp:"2500", desc:"Master the building blocks of the web. Learn semantic markup and modern styling techniques." },
    { name:"JavaScript Mastery",     icon:"⚡", color:"#F7DF1E", difficulty:"Intermediate", weeks:"8 Weeks",  xp:"5000", desc:"Deep dive into vanilla JS, DOM manipulation, asynchronous programming, and modern ES6+ syntax." },
    { name:"Python for Data",        icon:"🐍", color:"#3776AB", difficulty:"Beginner",     weeks:"6 Weeks",  xp:"4000", desc:"Learn Python fundamentals and explore data manipulation using Pandas, NumPy, and basic visualization." },
    { name:"Full Stack Engineering", icon:"🗂️", color:"#10B981", difficulty:"Advanced",     weeks:"12 Weeks", xp:"8500", desc:"Build complete web applications combining React frontend with Node.js/Express backend and databases." },
  ];
  return (
    <section style={{background:"#0A0A0F"}}>
      <div className="pSec" style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:40,flexWrap:"wrap",gap:16}}>
          <div>
            <p style={{fontFamily:"'DM Sans'",fontSize:12,fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase",color:"#6366F1",marginBottom:10}}>
              // PATHWAYS
            </p>
            <h2 className="h2Size" style={{fontFamily:"'Space Grotesk'",fontWeight:700,letterSpacing:"-1px",color:"#F8FAFC"}}>
              LEARNING TRACKS
            </h2>
          </div>
          <a href="#" style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:13,color:"#6366F1",textDecoration:"none",letterSpacing:"0.06em",textTransform:"uppercase"}}>
            VIEW ALL TRACKS →
          </a>
        </div>
        <div className="tracksGrid">
          {tracks.map((t,i)=><TrackCard key={t.name} track={t} delay={`${.08*i}s`}/>)}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer style={{background:"#0A0A0F",borderTop:"1px solid rgba(255,255,255,.06)"}}>
      <div className="pFooter" style={{maxWidth:1280,margin:"0 auto"}}>
        <div className="footerGrid">
          <div className="footerBrand">
            <Logo/>
            <p style={{fontFamily:"'DM Sans'",fontSize:14,lineHeight:1.7,color:"#94A3B8",marginTop:14,maxWidth:280}}>
              Empowering the next generation of software engineers through interactive, AI-driven learning experiences.
            </p>
            <div style={{display:"flex",gap:8,marginTop:18}}>
              {["𝕏","GH","DC"].map(icon=>(
                <button key={icon} className="socBtn">{icon}</button>
              ))}
            </div>
          </div>

          <div>
            <p style={{fontFamily:"'Space Grotesk'",fontWeight:600,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:"#F8FAFC",marginBottom:18}}>PLATFORM</p>
            {["All Tracks","Projects","Leaderboard","Pricing"].map(l=>(
              <a key={l} href="#" className="fLink">{l}</a>
            ))}
          </div>

          <div>
            <p style={{fontFamily:"'Space Grotesk'",fontWeight:600,fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",color:"#F8FAFC",marginBottom:18}}>COMPANY</p>
            {["About Us","Careers","Blog","Contact"].map(l=>(
              <a key={l} href="#" className="fLink">{l}</a>
            ))}
          </div>
        </div>

        <div style={{borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:22}}>
          <div className="footerBottom">
            <p style={{fontFamily:"'DM Sans'",fontSize:12,color:"#475569",letterSpacing:"0.04em",textTransform:"uppercase"}}>
              © 2026 CODEPATH. ALL RIGHTS RESERVED.
            </p>
            <div style={{display:"flex",gap:24}}>
              {["TERMS","PRIVACY"].map(l=>(
                <a key={l} href="#" style={{fontFamily:"'DM Sans'",fontSize:12,color:"#475569",textDecoration:"none",letterSpacing:"0.06em",transition:"color .2s"}}
                  onMouseOver={e=>e.target.style.color="#94A3B8"}
                  onMouseOut={e=>e.target.style.color="#475569"}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── App ── */
export default function HomePage() {
  return (
    <>
      <FontLink/>
      <div style={{minHeight:"100vh",background:"#0A0A0F"}}>
        <Navbar/>
        <Hero/>
        <HowItWorks/>
        <LearningTracks/>
        <Footer/>
      </div>
    </>
  );
}