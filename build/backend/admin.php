<?php
declare(strict_types=1);
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Snapiums CMS</title>
  <style>
    :root{
      --bg:#f1f5fb;
      --bg-accent:#e4ecf9;
      --panel:#ffffff;
      --line:#d7e2f1;
      --line-strong:#b8c9df;
      --text:#12243f;
      --muted:#5b6f8f;
      --brand:#0f66d8;
      --brand-ink:#0a4ea8;
      --brand-soft:#e9f2ff;
      --success:#1f8f56;
      --danger:#bf2f3f;
      --danger-soft:#fff0f2;
      --shadow-sm:0 6px 16px rgba(15,35,68,.08);
      --shadow-md:0 16px 36px rgba(15,35,68,.12);
      --radius:14px;
      --radius-sm:10px;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      min-height:100vh;
      color:var(--text);
      font-family:"Segoe UI",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
      background:
        radial-gradient(circle at 15% 0%,rgba(48,114,214,.12),transparent 36%),
        radial-gradient(circle at 90% 100%,rgba(24,152,126,.1),transparent 35%),
        linear-gradient(160deg,var(--bg) 0%,#f8fbff 55%,var(--bg-accent) 100%);
    }
    h1,h2,h3,h4,p{margin:0}
    p{color:var(--muted);line-height:1.45}
    input,textarea,select,button{
      font:inherit;
      border-radius:var(--radius-sm);
      border:1px solid var(--line);
      transition:box-shadow .2s ease,border-color .2s ease,background-color .2s ease,transform .12s ease,color .2s ease;
    }
    input,textarea,select{width:100%;background:#fff;color:var(--text)}
    input,select{height:40px;padding:0 12px}
    textarea{min-height:120px;padding:10px 12px;resize:vertical}
    input:focus,textarea:focus,select:focus{outline:none;border-color:var(--brand);box-shadow:0 0 0 3px rgba(15,102,216,.16)}
    button{height:40px;padding:0 14px;cursor:pointer;background:#edf3fc;color:#1d365a;font-weight:600;letter-spacing:.01em}
    button:hover{background:#e3ebf8}
    button:active{transform:translateY(1px)}
    button:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(15,102,216,.2)}
    button.primary{background:var(--brand);border-color:var(--brand);color:#fff}
    button.primary:hover{background:var(--brand-ink);border-color:var(--brand-ink)}
    button.danger{background:var(--danger-soft);color:var(--danger);border-color:#f0c2c9}
    button.danger:hover{background:#ffe4e9}
    button:disabled{opacity:.55;cursor:not-allowed;transform:none}
    label{
      display:block;
      font-size:11px;
      font-weight:700;
      text-transform:uppercase;
      letter-spacing:.08em;
      color:var(--muted);
      margin:12px 0 0;
    }
    label input,label textarea,label select{margin-top:6px}
    .auth{min-height:100vh;display:grid;place-items:center;padding:24px}
    .card{
      background:var(--panel);
      border:1px solid var(--line);
      border-radius:var(--radius);
      box-shadow:var(--shadow-sm);
      padding:16px;
    }
    .auth .card{
      width:min(560px,100%);
      padding:24px;
      background:linear-gradient(165deg,#ffffff 0%,#f7fbff 100%);
    }
    .auth-kicker{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--brand);margin-bottom:10px}
    .auth-copy{margin-top:8px;max-width:52ch}
    .auth-actions{display:flex;gap:10px;margin-top:12px}
    .app{display:none;min-height:100vh;grid-template-rows:auto 1fr}
    .top{
      position:sticky;
      top:0;
      z-index:20;
      display:flex;
      justify-content:space-between;
      gap:12px;
      align-items:center;
      padding:12px 18px;
      background:rgba(255,255,255,.92);
      backdrop-filter:blur(6px);
      border-bottom:1px solid var(--line);
    }
    .brand{display:flex;align-items:center;gap:10px;min-width:0}
    .brand-mark{
      width:34px;
      height:34px;
      border-radius:10px;
      display:grid;
      place-items:center;
      font-size:13px;
      font-weight:800;
      color:#fff;
      background:linear-gradient(145deg,#0f66d8,#1b8cb8);
      box-shadow:0 8px 18px rgba(15,102,216,.28);
    }
    .brand-text{display:flex;flex-direction:column;min-width:0}
    .brand-title{font-size:15px;font-weight:700;letter-spacing:.01em}
    .section-label{color:var(--muted);font-size:12px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
    .top-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .layout{display:grid;grid-template-columns:280px 1fr;min-height:0}
    .nav{
      border-right:1px solid var(--line);
      background:rgba(255,255,255,.9);
      backdrop-filter:blur(8px);
      padding:14px 12px;
      overflow:auto;
    }
    .nav-search{
      position:sticky;
      top:0;
      z-index:5;
      padding-bottom:10px;
      background:linear-gradient(to bottom,rgba(255,255,255,.95),rgba(255,255,255,.75) 75%,transparent);
    }
    .nav-search input{height:36px;border-radius:999px;padding:0 12px;background:#f8fbff}
    .nav-group{margin-bottom:14px}
    .nav-group-title{
      font-size:11px;
      text-transform:uppercase;
      letter-spacing:.11em;
      color:#6a7d99;
      margin:2px 4px 8px;
    }
    .nav button{
      width:100%;
      text-align:left;
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:8px;
      background:transparent;
      border:1px solid transparent;
      margin-bottom:4px;
      padding:0 12px;
      color:#27446a;
    }
    .nav button:hover{background:#eef4ff;border-color:#d4e2f8}
    .nav button.active{background:var(--brand-soft);border-color:#b9d2f8;color:#0e57b9;font-weight:700}
    .nav button .nav-hint{
      font-size:11px;
      min-width:18px;
      height:18px;
      padding:0 6px;
      border-radius:999px;
      border:1px solid #cfdef6;
      background:#e8f0ff;
      color:#40638f;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      line-height:1;
    }
    .nav button.active .nav-hint{background:#dceaff;color:#0f58bc;border-color:#bdd3f6}
    .nav-empty{
      border:1px dashed var(--line-strong);
      border-radius:10px;
      padding:12px;
      color:var(--muted);
      font-size:13px;
      text-align:center;
    }
    .main{padding:18px;overflow:auto}
    .main > * + *{margin-top:12px}
    .head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px}
    .head p{margin-top:4px}
    .head-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .badges{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
    .badge{
      display:inline-flex;
      align-items:center;
      gap:6px;
      padding:4px 10px;
      border-radius:999px;
      border:1px solid #c9d9f3;
      background:#f3f8ff;
      color:#2a4f80;
      font-size:11px;
      font-weight:700;
      letter-spacing:.04em;
      text-transform:uppercase;
    }
    .grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
    .item{
      background:var(--panel);
      border:1px solid var(--line);
      border-radius:var(--radius);
      padding:14px;
      box-shadow:0 2px 0 rgba(18,36,64,.02);
      transition:border-color .2s ease,box-shadow .2s ease,transform .15s ease;
    }
    .item:hover{border-color:#c4d8f5;box-shadow:var(--shadow-sm);transform:translateY(-1px)}
    .item h4{font-size:16px;margin-bottom:6px;line-height:1.3}
    .meta{font-size:12px;color:#4f6488;margin-bottom:6px;line-height:1.4}
    .snippet{font-size:13px;color:var(--muted);line-height:1.5;white-space:pre-wrap;word-break:break-word}
    .actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
    .empty{
      padding:24px;
      text-align:center;
      background:rgba(255,255,255,.85);
      border:1px dashed #bfd0e8;
      border-radius:var(--radius);
      color:var(--muted);
    }
    .form{display:grid;gap:10px}
    .form.compact{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));align-items:end}
    .modal{
      position:fixed;
      inset:0;
      background:rgba(15,23,42,.62);
      display:none;
      align-items:center;
      justify-content:center;
      padding:16px;
      z-index:40;
    }
    .modal.open{display:flex}
    .modal .card{width:min(920px,100%);max-height:90vh;overflow:auto;box-shadow:var(--shadow-md)}
    .modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:10px}
    .confirm-copy{margin-top:6px}
    .confirm-item{
      margin-top:10px;
      padding:8px 10px;
      border:1px dashed #d5e2f4;
      border-radius:10px;
      background:#f8fbff;
      color:#2f4f7b;
      font-size:13px;
      word-break:break-word;
    }
    .confirm-rule{
      margin-top:10px;
      font-size:12px;
      color:#5c7395;
    }
    .confirm-rule strong{color:#244879}
    .toast{
      position:fixed;
      right:14px;
      bottom:14px;
      z-index:50;
      background:#fff;
      border:1px solid var(--line);
      border-left:4px solid var(--success);
      padding:10px 12px;
      border-radius:10px;
      display:none;
      max-width:min(460px,calc(100vw - 28px));
      font-size:13px;
      box-shadow:var(--shadow-sm);
    }
    .toast.error{border-left-color:#db3f3f}
    .toast.show{display:block}
    .kpi{display:flex;align-items:center;justify-content:space-between;gap:8px}
    .kpi strong{font-size:28px;line-height:1.1;color:#113465}
    .analytics-stack>*+*{margin-top:10px}
    .analytics-toolbar{display:grid;gap:10px}
    .analytics-toolbar .actions{margin-top:0}
    .range-controls{
      border:1px dashed #c4d6ee;
      border-radius:12px;
      padding:10px 12px;
      background:#f8fbff;
    }
    .range-controls .chip-row{margin-top:8px}
    .range-custom{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin-top:10px}
    .analytics-quick{
      padding:12px 14px;
      border:1px dashed #c4d6ee;
      border-radius:12px;
      background:#f8fbff;
    }
    .analytics-quick h4{font-size:13px;color:#234775;margin-bottom:6px}
    .analytics-quick p{font-size:12px;margin-bottom:10px}
    .chip-group + .chip-group{margin-top:10px}
    .chip-title{
      font-size:11px;
      font-weight:700;
      letter-spacing:.08em;
      text-transform:uppercase;
      color:#5e7598;
      margin-bottom:6px;
    }
    .chip-title.spaced{margin-top:10px}
    .chip-row{display:flex;gap:8px;flex-wrap:wrap}
    button.chip{
      height:32px;
      border-radius:999px;
      padding:0 10px;
      background:#fff;
      border:1px solid #c8daf3;
      color:#2a4f80;
      font-size:12px;
      font-weight:600;
    }
    button.chip:hover{background:#ebf3ff}
    button.chip.active{background:#dbe9ff;border-color:#9fbff0;color:#0d58bc}
    .analytics-events-head .badges{margin-top:10px}
    .analytics-event-card{padding:12px}
    .analytics-event-head{
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:8px;
      margin-bottom:8px;
    }
    .analytics-event-head h4{margin:0}
    .event-time{
      display:inline-flex;
      align-items:center;
      height:24px;
      padding:0 8px;
      border-radius:999px;
      background:#eef5ff;
      border:1px solid #d0e0f7;
      color:#4d6890;
      font-size:11px;
      white-space:nowrap;
    }
    .event-meta-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
    .event-pill{
      display:inline-flex;
      align-items:center;
      min-height:22px;
      border-radius:999px;
      padding:2px 8px;
      border:1px solid #d8e6fb;
      background:#f5f9ff;
      font-size:11px;
      color:#3c5c87;
    }
    .event-details{margin:0}
    .analytics-empty-actions{display:flex;justify-content:center;gap:8px;margin-top:12px}
    .chart-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}
    .chart-card{
      background:#fff;
      border:1px solid var(--line);
      border-radius:var(--radius);
      padding:12px;
      box-shadow:0 2px 0 rgba(18,36,64,.02);
    }
    .chart-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start;margin-bottom:8px}
    .chart-head h4{margin:0;font-size:14px}
    .chart-head p{margin:3px 0 0;font-size:12px}
    .chart-kicker{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:22px;
      padding:0 8px;
      border-radius:999px;
      border:1px solid #d2e1f7;
      background:#eef4ff;
      color:#3b5e8e;
      font-size:11px;
      font-weight:700;
      letter-spacing:.04em;
      text-transform:uppercase;
      white-space:nowrap;
    }
    .chart-svg-wrap{
      width:100%;
      height:220px;
      border:1px solid #deebfb;
      border-radius:10px;
      background:linear-gradient(180deg,#f8fbff 0%,#f1f7ff 100%);
      overflow:hidden;
    }
    .chart-svg{
      width:100%;
      height:100%;
      display:block;
    }
    .chart-axis{font-size:10px;fill:#5d7294}
    .chart-grid-line{stroke:#d9e6f7;stroke-width:1}
    .chart-line{fill:none;stroke:#0f66d8;stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round}
    .chart-area{fill:rgba(15,102,216,.12)}
    .chart-point{fill:#0f66d8}
    .spark-row{display:grid;gap:6px;margin-top:8px}
    .spark-item{display:grid;gap:4px}
    .spark-label{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#3c5d88}
    .spark-track{
      width:100%;
      height:8px;
      border-radius:999px;
      background:#edf4ff;
      border:1px solid #d8e6f8;
      overflow:hidden;
    }
    .spark-fill{
      height:100%;
      border-radius:999px;
      background:linear-gradient(90deg,#2b79df,#2ba7bd);
    }
    .funnel-rows{display:grid;gap:8px}
    .funnel-step{display:grid;gap:5px}
    .funnel-meta{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#3d5f8a}
    .funnel-rate{font-size:11px;color:#5f7597}
    .funnel-track{
      height:9px;
      border-radius:999px;
      border:1px solid #d8e5f6;
      background:#eef4ff;
      overflow:hidden;
    }
    .funnel-fill{
      height:100%;
      border-radius:999px;
      background:linear-gradient(90deg,#0f66d8,#40a9bf);
    }
    .insight-grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
    .insight-list{display:grid;gap:6px}
    .insight-row{
      display:flex;
      justify-content:space-between;
      gap:10px;
      padding:6px 0;
      border-bottom:1px dashed #d7e4f5;
      font-size:12px;
      color:#3d5f8a;
    }
    .insight-row:last-child{border-bottom:0}
    .insight-row strong{color:#153a6a}
    .count-list>div{display:flex;justify-content:space-between;gap:10px;padding:5px 0;border-bottom:1px dashed #dfebfa}
    .count-list>div:last-child{border-bottom:0}
    .file-list{margin-top:10px}
    .file-list h4{margin-bottom:8px}
    .file-row{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:10px;
      padding:6px 0;
      border-bottom:1px dashed #d7e3f5;
    }
    .file-row:last-child{border-bottom:0}
    .file-name{font-size:13px;color:#4f6488;word-break:break-all}
    @media(max-width:1100px){
      .layout{grid-template-columns:1fr}
      .nav{border-right:0;border-bottom:1px solid var(--line);padding:10px}
      .nav-search{position:static}
      .nav-group{margin-bottom:10px}
      .nav-group-title{margin-bottom:6px}
    }
    @media(max-width:720px){
      .auth .card{padding:20px}
      .top{padding:10px 12px}
      .brand-mark{display:none}
      .main{padding:12px}
      .head{flex-direction:column}
      .head-actions{width:100%}
      .head-actions button{flex:1}
      .grid{grid-template-columns:1fr}
      .analytics-event-head{flex-direction:column}
      .analytics-empty-actions{flex-direction:column}
      .analytics-empty-actions button{width:100%}
      .chart-grid{grid-template-columns:1fr}
      .chart-svg-wrap{height:190px}
    }
  </style>
</head>
<body>
  <section id="auth" class="auth">
    <div class="card auth-card">
      <div class="auth-kicker">Admin Portal</div>
      <h1>Big Tree Media Content Dashboard</h1>
      <p class="auth-copy">Use this like a social CMS: choose a section, add, edit, and delete content cards with instant saves.</p>
      <label>Admin Token<input id="token" type="password" placeholder="input your token" autocomplete="off" /></label>
      <div class="auth-actions"><button id="connect" class="primary" type="button">Connect</button></div>
    </div>
  </section>

  <main id="app" class="app">
    <header class="top">
      <div class="brand">
        <div class="brand-mark">SC</div>
        <div class="brand-text">
          <strong class="brand-title">Big Tree Media CMS</strong>
          <span id="sectionLabel" class="section-label"></span>
        </div>
      </div>
      <div class="top-actions">
        <button id="refresh" type="button">Refresh</button>
        <button id="logout" type="button">Logout</button>
      </div>
    </header>
    <div class="layout">
      <aside id="nav" class="nav"></aside>
      <section id="main" class="main"></section>
    </div>
  </main>

  <div id="modal" class="modal" aria-hidden="true">
    <div class="card">
      <div class="head">
        <h3 id="modalTitle">Edit</h3>
        <button id="closeModal" type="button">Close</button>
      </div>
      <form id="modalForm" class="form"></form>
      <div class="modal-actions">
        <button id="cancelModal" type="button">Cancel</button>
        <button id="saveModal" class="primary" type="button">Save</button>
      </div>
    </div>
  </div>

  <div id="confirmModal" class="modal" aria-hidden="true">
    <div class="card">
      <div class="head">
        <h3 id="confirmTitle">Confirm Delete</h3>
      </div>
      <p id="confirmText" class="confirm-copy">This action cannot be undone.</p>
      <div id="confirmItem" class="confirm-item"></div>
      <p class="confirm-rule">Type <strong>DELETE</strong> to confirm this action.</p>
      <label>Confirmation<input id="confirmInput" type="text" autocomplete="off" placeholder="Type DELETE" /></label>
      <div class="modal-actions">
        <button id="confirmCancel" type="button">Cancel</button>
        <button id="confirmProceed" class="danger" type="button" disabled>Delete</button>
      </div>
    </div>
  </div>

  <div id="toast" class="toast"></div>

  <script>
    (() => {
      const API_URL = "./api/data.php";
      const SUBMISSIONS_API_URL = "./api/submissions.php";
      const ANALYTICS_API_URL = "./api/analytics.php";
      const TOKEN_KEY = "snapiums_admin_token";
      const cfg = {
        general:{type:"form",title:"General",path:"general",desc:"Brand basics.",fields:[f("logo","Logo URL"),f("email","Email"),f("address","Address")]},
        socials:{type:"list",title:"Social Links",path:"general.socials",desc:"Footer social profiles.",empty:{platform:"",url:""},summary:i=>i.platform||"Untitled",meta:i=>i.url||"",fields:[f("platform","Platform"),f("url","Profile URL")]},
        hero:{type:"form",title:"Hero Settings",path:"hero",desc:"Hero media links.",fields:[f("videoUrl","Video URL"),f("poster","Poster URL")]},
        heroSlides:{type:"list",title:"Hero Slides",path:"hero.slides",desc:"Main rotating copy.",empty:{title:"",subtitle:""},summary:i=>strip(i.title)||"Slide",meta:i=>i.subtitle||"",fields:[ft("title","Title (HTML allowed)"),ft("subtitle","Subtitle")]},
        comparisonPairs:{type:"list",title:"Hero Showcase Images",path:"hero.comparisonPairs",desc:"Single-image slider entries for the hero showcase.",empty:{label:"",image:""},summary:i=>i.label||"Item",meta:i=>i.image||"",fields:[f("label","Label"),f("image","Image URL")]},
        trust:{type:"plist",title:"Trust Logos",path:"trust",desc:"Logo URLs in trust strip.",empty:"",summary:i=>i||"URL",fields:[f("__value__","Logo URL")]},
        services:{type:"list",title:"Services",path:"services",desc:"Clothing and jewelry services.",empty:{id:"",segment:"clothing",title:"",seoTitle:"",seoDescription:"",keywords:[],icon:"",description:"",fullDescription:"",image:"",tags:[],deliverables:[]},summary:i=>i.title||i.id||"Service",meta:i=>[i.segment,i.id].filter(Boolean).join(" | "),fields:[f("id","Service ID"),fs("segment","Segment",["clothing","jewelry"]),f("title","Title"),f("seoTitle","SEO Title"),ft("seoDescription","SEO Description"),ftag("keywords","Keywords (comma separated)"),f("icon","Icon"),ft("description","Short Description"),ft("fullDescription","Full Description"),f("image","Cover Media URL (Image or Video)"),ftag("tags","Tags (comma separated)"),fl("deliverables","Deliverables (one per line)")]},
        projects:{type:"list",title:"Portfolio Projects",path:"projects",desc:"Portfolio case studies.",empty:{id:"",category:"",title:"",description:"",coverImage:"",images:[],videos:[],type:"image"},summary:i=>i.title||i.id||"Project",meta:i=>[projectCategoryLabel(i.category),inferProjectDeliveryType(i)].filter(Boolean).join(" | "),fields:[f("id","Project ID"),fs("category","Service Category",[]),f("title","Title"),ft("description","Description"),f("coverImage","Cover Media URL (Image or Video)"),fs("type","Delivery Type (auto from media)",["image","video","mixed"]),fl("images","Image URLs (one per line)"),fl("videos","Video URLs (one per line)")]},
        pricing:{type:"list",title:"Pricing",path:"pricing",desc:"Pricing tables.",empty:{title:"",icon:"",items:[]},summary:i=>i.title||"Plan",meta:i=>i.icon||"",fields:[f("title","Plan Title"),f("icon","Icon"),fp("items","Items (Name | Price, one per line)")]},
        testimonials:{type:"list",title:"Testimonials",path:"testimonials",desc:"Client testimonials.",empty:{id:0,quote:"",author:"",role:"",image:"",metrics:[]},summary:i=>i.author||"Client",meta:i=>i.role||"",fields:[fn("id","ID"),f("author","Author"),f("role","Role"),ft("quote","Quote"),f("image","Image URL"),fl("metrics","Metrics (one per line)")]},
        team:{type:"list",title:"Team",path:"team",desc:"Team members.",empty:{id:"",name:"",role:"",image:""},summary:i=>i.name||i.id||"Member",meta:i=>i.role||"",fields:[f("id","ID"),f("name","Name"),f("role","Role"),f("image","Image URL")]},
        faq:{type:"list",title:"FAQ",path:"faq",desc:"Questions and answers.",empty:{question:"",answer:""},summary:i=>i.question||"Question",meta:i=>i.answer||"",fields:[f("question","Question"),ft("answer","Answer")]},
        contactInbox:{type:"inbox",title:"Contact Submissions",submissionType:"contact",desc:"View and download contact form submissions."},
        trialInbox:{type:"inbox",title:"Trial Submissions",submissionType:"trial",desc:"View trial details and download uploaded files."},
        newsletterInbox:{type:"inbox",title:"Newsletter Subscriptions",submissionType:"newsletter",desc:"View and download newsletter subscriber records."},
        analyticsInbox:{type:"analytics",title:"Analytics",desc:"View funnel metrics, CTA activity, and recent tracking events."}
      };
      const sectionGroups = [
        {title:"Content", ids:["general","socials","hero","heroSlides","comparisonPairs","trust","services","projects","pricing","testimonials","team","faq"]},
        {title:"Submissions", ids:["contactInbox","trialInbox","newsletterInbox"]},
        {title:"Insights", ids:["analyticsInbox"]}
      ];
      const s = {
        token:"",
        data:null,
        active:"services",
        navQuery:"",
        modal:{open:false,section:"",index:-1,mode:"add"},
        inbox:{contact:[],trial:[],newsletter:[]},
        analytics:{
          filters:defaultAnalyticsFilters(),
          summary:null,
          events:[],
          ui:{search:"",sort:"newest"}
        }
      };

      const $ = (id) => document.getElementById(id);
      const auth = $("auth"), app = $("app"), nav = $("nav"), main = $("main"), token = $("token"), sectionLabel = $("sectionLabel");
      const modal = $("modal"), modalTitle = $("modalTitle"), modalForm = $("modalForm"), toast = $("toast");
      const saveModalBtn = $("saveModal");
      const confirmModal = $("confirmModal"), confirmTitle = $("confirmTitle"), confirmText = $("confirmText");
      const confirmItem = $("confirmItem"), confirmInput = $("confirmInput"), confirmCancel = $("confirmCancel"), confirmProceed = $("confirmProceed");
      let confirmResolver = null;

      $("connect").addEventListener("click", connect);
      $("refresh").addEventListener("click", refreshActiveSection);
      $("logout").addEventListener("click", logout);
      $("closeModal").addEventListener("click", closeModal);
      $("cancelModal").addEventListener("click", closeModal);
      saveModalBtn.addEventListener("click", saveModal);
      modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
      confirmCancel.addEventListener("click", () => closeConfirm(false));
      confirmProceed.addEventListener("click", () => closeConfirm(true));
      confirmInput.addEventListener("input", updateConfirmProceedState);
      confirmModal.addEventListener("click", (e) => { if (e.target === confirmModal) closeConfirm(false); });
      document.addEventListener("keydown", handleGlobalShortcuts);

      token.value = localStorage.getItem(TOKEN_KEY) || "";
      if (token.value.trim()) { s.token = token.value.trim(); connect(); }

      async function connect() {
        const t = token.value.trim();
        if (!t) return show("Enter admin token.", true);
        s.token = t;
        localStorage.setItem(TOKEN_KEY, t);
        if (!(await load(false))) return;
        auth.style.display = "none";
        app.style.display = "grid";
        renderNav();
        render();
        show("Connected.", false);
      }

      function logout() {
        if (confirmModal.classList.contains("open")) closeConfirm(false);
        s.token = "";
        s.data = null;
        s.navQuery = "";
        s.inbox = {contact:[],trial:[],newsletter:[]};
        s.analytics = {filters:defaultAnalyticsFilters(),summary:null,events:[],ui:{search:"",sort:"newest"}};
        localStorage.removeItem(TOKEN_KEY);
        token.value = "";
        sectionLabel.textContent = "";
        app.style.display = "none"; auth.style.display = "grid";
      }

      async function refreshActiveSection() {
        const def = cfg[s.active];
        if (!def) return;
        if (def.type === "inbox") {
          await loadInbox(def, true);
          return;
        }
        if (def.type === "analytics") {
          await loadAnalytics(def, true);
          return;
        }
        await load(true);
      }

      async function api(method, body) {
        const h = {"X-Admin-Token": s.token};
        const o = {method, headers:h};
        if (body !== undefined) { h["Content-Type"] = "application/json"; o.body = JSON.stringify(body); }
        const r = await fetch(API_URL, o);
        const j = await r.json().catch(() => ({ok:false,error:"Invalid server response."}));
        if (!r.ok || !j.ok) throw new Error(j.error || ("HTTP " + r.status));
        return j;
      }

      async function apiSubmissions(action, type, params, expectRaw) {
        const query = new URLSearchParams({action, type});
        Object.entries(params || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && String(value) !== "") {
            query.set(key, String(value));
          }
        });

        const response = await fetch(SUBMISSIONS_API_URL + "?" + query.toString(), {
          method: "GET",
          headers: {"X-Admin-Token": s.token}
        });

        if (expectRaw) {
          if (!response.ok) {
            const payload = await response.json().catch(() => ({error:"Download failed."}));
            throw new Error(payload.error || "Download failed.");
          }
          return response;
        }

        const payload = await response.json().catch(() => ({ok:false,error:"Invalid server response."}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || ("HTTP " + response.status));
        }
        return payload;
      }

      async function apiAnalytics(action, params, expectRaw) {
        const query = new URLSearchParams({action});
        Object.entries(params || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && String(value) !== "") {
            query.set(key, String(value));
          }
        });

        const response = await fetch(ANALYTICS_API_URL + "?" + query.toString(), {
          method: "GET",
          headers: {"X-Admin-Token": s.token}
        });

        if (expectRaw) {
          if (!response.ok) {
            const payload = await response.json().catch(() => ({error:"Analytics download failed."}));
            throw new Error(payload.error || "Analytics download failed.");
          }
          return response;
        }

        const payload = await response.json().catch(() => ({ok:false,error:"Invalid server response."}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || ("HTTP " + response.status));
        }
        return payload;
      }

      async function load(successToast) {
        try {
          const res = await api("GET");
          s.data = res.data;
          if (successToast) show("Data refreshed.", false);
          if (app.style.display !== "none") {
            renderNav();
            render();
          }
          return true;
        } catch (e) {
          show(e.message || "Load failed.", true);
          return false;
        }
      }

      async function save(msg) {
        try {
          await api("PUT", {path:"", value:s.data});
          show(msg || "Saved.", false);
          return true;
        } catch (e) {
          show(e.message || "Save failed.", true);
          return false;
        }
      }

      function renderNav() {
        nav.innerHTML = "";
        const searchWrap = document.createElement("div");
        searchWrap.className = "nav-search";
        const searchInput = document.createElement("input");
        searchInput.type = "search";
        searchInput.id = "navSearch";
        searchInput.placeholder = "Find section... (/)";
        searchInput.autocomplete = "off";
        searchInput.value = s.navQuery || "";
        searchInput.addEventListener("input", () => {
          s.navQuery = searchInput.value;
          filterNavButtons();
        });
        searchWrap.appendChild(searchInput);
        nav.appendChild(searchWrap);

        sectionGroups.forEach((group) => {
          const groupNode = document.createElement("div");
          groupNode.className = "nav-group";

          const groupTitle = document.createElement("div");
          groupTitle.className = "nav-group-title";
          groupTitle.textContent = group.title;
          groupNode.appendChild(groupTitle);

          group.ids.forEach((id) => {
            if (!cfg[id]) return;
            const b = document.createElement("button");
            const badge = document.createElement("span");
            const label = document.createElement("span");
            const badgeValue = navBadgeCount(id);

            b.type = "button";
            b.className = s.active === id ? "active" : "";
            b.dataset.navId = id;
            b.dataset.navLabel = String(cfg[id].title || "").toLowerCase();

            label.textContent = cfg[id].title;
            b.appendChild(label);

            badge.className = "nav-hint";
            badge.textContent = badgeValue;
            badge.style.display = badgeValue ? "" : "none";
            b.appendChild(badge);

            b.onclick = () => {
              s.active = id;
              renderNav();
              render();
            };
            groupNode.appendChild(b);
          });

          nav.appendChild(groupNode);
        });

        const empty = document.createElement("div");
        empty.className = "nav-empty";
        empty.textContent = "No matching sections.";
        nav.appendChild(empty);
        filterNavButtons();
      }

      function filterNavButtons() {
        const query = String(s.navQuery || "").trim().toLowerCase();
        let visibleCount = 0;
        nav.querySelectorAll(".nav-group").forEach((groupNode) => {
          let groupCount = 0;
          groupNode.querySelectorAll("button[data-nav-id]").forEach((button) => {
            const label = button.dataset.navLabel || "";
            const matches = !query || label.includes(query);
            button.style.display = matches ? "" : "none";
            if (matches) groupCount += 1;
          });
          groupNode.style.display = groupCount ? "" : "none";
          visibleCount += groupCount;
        });

        const empty = nav.querySelector(".nav-empty");
        if (empty) empty.style.display = visibleCount ? "none" : "";
      }

      function navBadgeCount(sectionId) {
        const def = cfg[sectionId];
        if (!def) return "";

        if (def.type === "inbox") {
          const inboxItems = s.inbox[def.submissionType];
          return Array.isArray(inboxItems) && inboxItems.length > 0 ? String(inboxItems.length) : "";
        }

        if (def.type === "analytics") {
          return Array.isArray(s.analytics.events) && s.analytics.events.length > 0 ? String(s.analytics.events.length) : "";
        }

        if (!s.data || !def.path) return "";
        const value = getPath(s.data, def.path);
        return Array.isArray(value) && value.length > 0 ? String(value.length) : "";
      }

      function render() {
        const def = cfg[s.active];
        if (!def) return (main.innerHTML = '<div class="empty">Section config missing.</div>');
        sectionLabel.textContent = def.title;
        if (def.type === "inbox") return renderInbox(def);
        if (def.type === "analytics") return renderAnalytics(def);
        if (!s.data) return (main.innerHTML = '<div class="empty">No data loaded.</div>');
        if (def.type === "form") return renderForm(def);
        if (def.type === "list" || def.type === "plist") return renderList(def);
        main.innerHTML = '<div class="empty">Unsupported section.</div>';
      }

      function renderForm(def) {
        const val = getPath(s.data, def.path) || {};
        main.innerHTML = ''
          + '<div class="head"><div><h2>' + esc(def.title) + '</h2><p>' + esc(def.desc || "") + '</p><div class="badges"><span class="badge">Single Record</span></div></div>'
          + '<div class="head-actions"><button id="saveForm" class="primary" type="button">Save Changes</button></div></div>'
          + '<div class="card"><form id="form" class="form"></form></div>';
        const form = $("form");
        def.fields.forEach((field) => form.appendChild(makeField(field, display(field, val[field.key]))));
        $("saveForm").onclick = async () => {
          const old = copy(s.data);
          const next = Object.assign({}, val);
          def.fields.forEach((field) => {
            const n = form.querySelector('[name="' + cesc(field.key) + '"]');
            next[field.key] = parse(field, n ? n.value : "");
          });
          setPath(s.data, def.path, next);
          if (!(await save(def.title + " updated."))) { s.data = old; render(); }
        };
      }

      function renderList(def) {
        const arr = getPath(s.data, def.path);
        const list = Array.isArray(arr) ? arr : [];
        const listCountLabel = list.length + " " + (list.length === 1 ? "item" : "items");
        let html = ''
          + '<div class="head"><div><h2>' + esc(def.title) + '</h2><p>' + esc(def.desc || "") + '</p><div class="badges"><span class="badge">' + esc(listCountLabel) + '</span></div></div>'
          + '<div class="head-actions"><button id="add" class="primary" type="button">Add New</button></div></div>';
        if (!list.length) html += '<div class="empty">No items yet. Click "Add New" to create your first entry.</div>';
        else {
          html += '<div class="grid">';
          list.forEach((item, i) => {
            const title = def.summary ? def.summary(item) : ("Item " + (i + 1));
            const meta = def.meta ? def.meta(item) : "";
            html += '<article class="item"><h4>' + esc(title || ("Item " + (i + 1))) + '</h4>';
            if (meta) html += '<div class="meta">' + esc(meta) + '</div>';
            html += '<div class="snippet">' + esc(snippet(item)) + '</div><div class="actions"><button data-a="e" data-i="' + i + '" type="button">Edit</button><button class="danger" data-a="d" data-i="' + i + '" type="button">Delete</button></div></article>';
          });
          html += '</div>';
        }
        main.innerHTML = html;
        $("add").onclick = () => openModal(s.active, -1, "add");
        main.querySelectorAll("button[data-a='e']").forEach((b) => b.onclick = () => openModal(s.active, Number(b.dataset.i), "edit"));
        main.querySelectorAll("button[data-a='d']").forEach((b) => b.onclick = () => removeItem(s.active, Number(b.dataset.i)));
      }

      function renderInbox(def) {
        const cachedItems = Array.isArray(s.inbox[def.submissionType]) ? s.inbox[def.submissionType] : [];
        const countLabel = cachedItems.length + " " + (cachedItems.length === 1 ? "submission" : "submissions");
        main.innerHTML = ''
          + '<div class="head"><div><h2>' + esc(def.title) + '</h2><p>' + esc(def.desc || "") + '</p><div class="badges"><span class="badge">' + esc(countLabel) + '</span></div></div>'
          + '<div class="head-actions"><button id="refreshInbox" type="button">Refresh</button></div></div>'
          + '<div class="empty">Loading submissions...</div>';
        $("refreshInbox").onclick = () => loadInbox(def, true);
        loadInbox(def, false);
      }

      async function loadInbox(def, showToastMessage) {
        try {
          const response = await apiSubmissions("list", def.submissionType, {limit: 500}, false);
          const items = (response.data && Array.isArray(response.data.items)) ? response.data.items : [];
          s.inbox[def.submissionType] = items;
          renderNav();
          drawInbox(def, items);
          if (showToastMessage) show(def.title + " refreshed.", false);
        } catch (error) {
          main.innerHTML = ''
            + '<div class="head"><div><h2>' + esc(def.title) + '</h2><p>' + esc(def.desc || "") + '</p></div>'
            + '<div class="head-actions"><button id="refreshInbox" type="button">Retry</button></div></div>'
            + '<div class="empty">' + esc(error.message || "Failed to load submissions.") + '</div>';
          const retryButton = $("refreshInbox");
          if (retryButton) retryButton.onclick = () => loadInbox(def, true);
        }
      }

      function drawInbox(def, items) {
        const countLabel = items.length + " " + (items.length === 1 ? "submission" : "submissions");
        let html = ''
          + '<div class="head"><div><h2>' + esc(def.title) + '</h2><p>' + esc(def.desc || "") + '</p><div class="badges"><span class="badge">' + esc(countLabel) + '</span></div></div>'
          + '<div class="head-actions"><button id="refreshInbox" type="button">Refresh</button></div></div>';
        if (!items.length) {
          html += '<div class="empty">No submissions yet.</div>';
        } else {
          html += '<div class="grid">';
          items.forEach((item) => {
            const isTrial = def.submissionType === "trial";
            const isNewsletter = def.submissionType === "newsletter";
            const name = isTrial
              ? (item.name || "Trial Submission")
              : isNewsletter
                ? (item.email || "Newsletter Subscriber")
                : ([item.firstName, item.lastName].filter(Boolean).join(" ") || "Contact Submission");
            const metaParts = [];
            if (isNewsletter) {
              if (item.subscribedAtUtc) metaParts.push(item.subscribedAtUtc);
              if (item.source) metaParts.push("Source: " + item.source);
              if (item.ipAddress) metaParts.push("IP: " + item.ipAddress);
            } else {
              if (item.submittedAtUtc) metaParts.push(item.submittedAtUtc);
              if (item.email) metaParts.push(item.email);
              if (item.ipAddress) metaParts.push("IP: " + item.ipAddress);
            }
            const meta = metaParts.join(" | ");
            const preview = isTrial
              ? (item.instructions || "No instructions.")
              : isNewsletter
                ? (item.ipAddress ? ("IP Address: " + item.ipAddress) : (item.ipFingerprint ? ("IP Fingerprint: " + item.ipFingerprint) : "Newsletter subscriber record."))
                : (item.message || "No message.");
            html += '<article class="item"><h4>' + esc(name) + '</h4>';
            html += '<div class="meta">' + esc(meta) + '</div>';
            if (isTrial) html += '<div class="meta">Files: ' + esc(String(item.fileCount || 0)) + '</div>';
            html += '<div class="snippet">' + esc(preview) + '</div>';
            html += '<div class="actions"><button type="button" data-action="view" data-id="' + esc(item.id || "") + '">View</button><button type="button" data-action="download-info" data-id="' + esc(item.id || "") + '">Download Info</button></div></article>';
          });
          html += '</div>';
        }

        main.innerHTML = html;
        $("refreshInbox").onclick = () => loadInbox(def, true);
        main.querySelectorAll("button[data-action='view']").forEach((button) => {
          button.onclick = () => openSubmissionDetail(def.submissionType, button.dataset.id || "");
        });
        main.querySelectorAll("button[data-action='download-info']").forEach((button) => {
          button.onclick = () => downloadSubmission(def.submissionType, button.dataset.id || "", "");
        });
      }

      function renderAnalytics(def) {
        const filters = ensureAnalyticsFilters();
        const ui = ensureAnalyticsUi();
        const requestFilters = resolveAnalyticsRequestFilters(filters);
        const activeFilters = [requestFilters.event, requestFilters.path, requestFilters.from, requestFilters.to]
          .filter((value) => String(value || "").trim() !== "").length;
        const badgeText = activeFilters > 0 ? (activeFilters + " Filters Active") : "Live Metrics";
        main.innerHTML = ''
          + '<div class="head"><div><h2>' + esc(def.title) + '</h2><p>' + esc(def.desc || "") + '</p><div class="badges"><span class="badge">' + esc(badgeText) + '</span><span class="badge">Duration: ' + esc(displayAnalyticsPreset(filters.preset)) + '</span></div></div>'
          + '<div class="head-actions"><button id="refreshAnalytics" type="button">Refresh</button><button id="downloadAnalytics" type="button">Download NDJSON</button></div></div>'
          + '<div class="card analytics-toolbar">'
          + '<div class="range-controls"><div class="chip-title">Duration</div><div id="analyticsRangeChips" class="chip-row">'
          + '<button class="chip" type="button" data-range-preset="24h">Last 24h</button>'
          + '<button class="chip" type="button" data-range-preset="7d">Last 7d</button>'
          + '<button class="chip" type="button" data-range-preset="30d">Last 30d</button>'
          + '<button class="chip" type="button" data-range-preset="90d">Last 90d</button>'
          + '<button class="chip" type="button" data-range-preset="all">All Time</button>'
          + '<button class="chip" type="button" data-range-preset="custom">Custom</button>'
          + '</div><div class="range-custom"><label>From Date<input id="analyticsFrom" type="date" /></label><label>To Date<input id="analyticsTo" type="date" /></label></div></div>'
          + '<div class="form compact">'
          + '<label>Limit<select id="analyticsLimit"><option value="100">100</option><option value="200">200</option><option value="500">500</option><option value="1000">1000</option></select></label>'
          + '<label>Event Filter<input id="analyticsEvent" type="text" placeholder="e.g. cta_click" autocomplete="off" /></label>'
          + '<label>Path Filter<input id="analyticsPath" type="text" placeholder="e.g. /free-trial" autocomplete="off" /></label>'
          + '</div><div class="form compact">'
          + '<label>Search Loaded Events<input id="analyticsSearch" type="search" placeholder="Search event, path, IP, details..." autocomplete="off" /></label>'
          + '<label>Sort Order<select id="analyticsSort"><option value="newest">Newest First</option><option value="oldest">Oldest First</option></select></label>'
          + '</div><div class="actions"><button id="applyAnalyticsFilters" class="primary" type="button">Apply Filters</button><button id="clearAnalyticsFilters" type="button">Reset Filters</button></div></div>'
          + '<div id="analyticsQuickFilters"></div>'
          + '<div id="analyticsSummary"><div class="empty">Loading analytics summary...</div></div>'
          + '<div id="analyticsCharts"><div class="empty">Loading charts...</div></div>'
          + '<div id="analyticsEvents"><div class="empty">Loading events...</div></div>';

        const limitInput = $("analyticsLimit");
        const eventInput = $("analyticsEvent");
        const pathInput = $("analyticsPath");
        const fromInput = $("analyticsFrom");
        const toInput = $("analyticsTo");
        const searchInput = $("analyticsSearch");
        const sortInput = $("analyticsSort");
        if (limitInput) limitInput.value = String(filters.limit || 200);
        if (eventInput) eventInput.value = String(filters.event || "");
        if (pathInput) pathInput.value = String(filters.path || "");
        if (searchInput) searchInput.value = String(ui.search || "");
        if (sortInput) sortInput.value = ui.sort === "oldest" ? "oldest" : "newest";
        if (fromInput) fromInput.value = toDateInputValue(filters.from || requestFilters.from);
        if (toInput) toInput.value = toDateInputValue(filters.to || requestFilters.to);
        syncAnalyticsRangeControls(filters);

        main.querySelectorAll("button[data-range-preset]").forEach((button) => {
          button.onclick = () => {
            const preset = String(button.dataset.rangePreset || "30d");
            filters.preset = normalizeAnalyticsPreset(preset);
            if (filters.preset === "custom") {
              if (fromInput) filters.from = String(fromInput.value || "");
              if (toInput) filters.to = String(toInput.value || "");
              syncAnalyticsRangeControls(filters);
              return;
            }
            const range = presetRangeToRequestWindow(filters.preset);
            filters.from = range.from;
            filters.to = range.to;
            if (fromInput) fromInput.value = toDateInputValue(range.from);
            if (toInput) toInput.value = toDateInputValue(range.to);
            syncAnalyticsRangeControls(filters);
            loadAnalytics(def, true);
          };
        });

        if (fromInput) {
          fromInput.onchange = () => {
            filters.preset = "custom";
            filters.from = String(fromInput.value || "");
            syncAnalyticsRangeControls(filters);
          };
        }
        if (toInput) {
          toInput.onchange = () => {
            filters.preset = "custom";
            filters.to = String(toInput.value || "");
            syncAnalyticsRangeControls(filters);
          };
        }

        $("refreshAnalytics").onclick = () => loadAnalytics(def, true);
        $("downloadAnalytics").onclick = downloadAnalytics;
        if (searchInput) {
          searchInput.oninput = () => {
            ui.search = String(searchInput.value || "");
            drawAnalytics(def, s.analytics.summary, s.analytics.events);
          };
        }
        if (sortInput) {
          sortInput.onchange = () => {
            ui.sort = sortInput.value === "oldest" ? "oldest" : "newest";
            drawAnalytics(def, s.analytics.summary, s.analytics.events);
          };
        }
        $("applyAnalyticsFilters").onclick = () => {
          filters.limit = normalizeAnalyticsLimit(limitInput ? limitInput.value : 200);
          filters.event = String(eventInput ? eventInput.value : "").trim();
          filters.path = String(pathInput ? pathInput.value : "").trim();
          filters.preset = normalizeAnalyticsPreset(filters.preset);
          if (filters.preset === "custom") {
            filters.from = String(fromInput ? fromInput.value : "").trim();
            filters.to = String(toInput ? toInput.value : "").trim();
          } else if (filters.preset === "all") {
            filters.from = "";
            filters.to = "";
          } else {
            const range = presetRangeToRequestWindow(filters.preset);
            filters.from = range.from;
            filters.to = range.to;
          }
          syncAnalyticsRangeControls(filters);
          loadAnalytics(def, true);
        };
        $("clearAnalyticsFilters").onclick = () => {
          s.analytics.filters = defaultAnalyticsFilters();
          ui.search = "";
          ui.sort = "newest";
          renderAnalytics(def);
        };

        if (s.analytics.summary || (Array.isArray(s.analytics.events) && s.analytics.events.length > 0)) {
          drawAnalytics(def, s.analytics.summary, s.analytics.events);
        }
        loadAnalytics(def, false);
      }

      async function loadAnalytics(def, showToastMessage) {
        const currentDef = def || cfg.analyticsInbox;
        const filters = ensureAnalyticsFilters();
        const requestFilters = resolveAnalyticsRequestFilters(filters);
        const summaryNode = $("analyticsSummary");
        const chartsNode = $("analyticsCharts");
        const eventsNode = $("analyticsEvents");

        if (summaryNode) summaryNode.innerHTML = '<div class="empty">Loading analytics summary...</div>';
        if (chartsNode) chartsNode.innerHTML = '<div class="empty">Loading charts...</div>';
        if (eventsNode) eventsNode.innerHTML = '<div class="empty">Loading events...</div>';

        try {
          const [summaryResponse, listResponse] = await Promise.all([
            apiAnalytics("summary", {event: requestFilters.event, path: requestFilters.path, from: requestFilters.from, to: requestFilters.to}, false),
            apiAnalytics("list", {limit: normalizeAnalyticsLimit(requestFilters.limit), event: requestFilters.event, path: requestFilters.path, from: requestFilters.from, to: requestFilters.to}, false)
          ]);

          s.analytics.summary = summaryResponse.data || {};
          s.analytics.events = (listResponse.data && Array.isArray(listResponse.data.items)) ? listResponse.data.items : [];
          renderNav();
          if (s.active === "analyticsInbox") {
            drawAnalytics(currentDef, s.analytics.summary, s.analytics.events);
          }
          if (showToastMessage) show(currentDef.title + " refreshed.", false);
        } catch (error) {
          if (summaryNode) {
            summaryNode.innerHTML = '<div class="empty">' + esc(error.message || "Failed to load analytics summary.") + '</div>';
          }
          if (chartsNode) {
            chartsNode.innerHTML = '<div class="empty">' + esc(error.message || "Failed to load analytics charts.") + '</div>';
          }
          if (eventsNode) {
            eventsNode.innerHTML = '<div class="empty">' + esc(error.message || "Failed to load analytics events.") + '</div>';
          }
          if (showToastMessage) show(error.message || "Failed to load analytics.", true);
        }
      }

      function drawAnalytics(def, summary, events) {
        const analyticsSummary = summary && typeof summary === "object" ? summary : {};
        const filters = resolveAnalyticsRequestFilters(ensureAnalyticsFilters());
        const ui = ensureAnalyticsUi();
        const funnel = analyticsSummary.funnel && typeof analyticsSummary.funnel === "object" ? analyticsSummary.funnel : {};
        const topEvents = Array.isArray(analyticsSummary.topEvents) ? analyticsSummary.topEvents : [];
        const topPaths = Array.isArray(analyticsSummary.topPaths) ? analyticsSummary.topPaths : [];
        const topCtas = Array.isArray(analyticsSummary.topCtas) ? analyticsSummary.topCtas : [];
        const topReferrers = Array.isArray(analyticsSummary.topReferrers) ? analyticsSummary.topReferrers : [];
        const eventsByHour = Array.isArray(analyticsSummary.eventsByHour) ? analyticsSummary.eventsByHour : [];
        const eventsByWeekday = Array.isArray(analyticsSummary.eventsByWeekday) ? analyticsSummary.eventsByWeekday : [];
        const rows = Array.isArray(events) ? events : [];
        const searchTerm = String(ui.search || "").trim().toLowerCase();
        const sortMode = ui.sort === "oldest" ? "oldest" : "newest";
        const trendData = normalizeAnalyticsTrend(analyticsSummary.trend, rows);
        const rangeLabel = formatAnalyticsRangeLabel(analyticsSummary.range, filters);

        const kpiCards = [
          {label:"Total Events", value: formatNumber(analyticsSummary.totalEvents || 0)},
          {label:"Unique Sessions", value: formatNumber(analyticsSummary.uniqueSessions || 0)},
          {label:"Unique Paths", value: formatNumber(analyticsSummary.uniquePaths || 0)},
          {label:"Events Loaded", value: formatNumber(rows.length)}
        ];

        const funnelRows = [
          {name:"Page Views", count:funnel.pageView || 0},
          {name:"CTA Clicks", count:funnel.ctaClick || 0},
          {name:"Free-Trial Clicks", count:funnel.freeTrialClick || 0},
          {name:"Upload Start", count:funnel.uploadStart || 0},
          {name:"Upload Success", count:funnel.uploadSuccess || 0},
          {name:"Contact Submit", count:funnel.contactSubmit || 0}
        ];

        let summaryHtml = '<div class="analytics-stack"><div class="grid">';
        kpiCards.forEach((card) => {
          summaryHtml += '<article class="item kpi"><div class="meta">' + esc(card.label) + '</div><strong>' + esc(String(card.value)) + '</strong></article>';
        });
        summaryHtml += '</div><div class="meta">Range: ' + esc(rangeLabel) + '</div></div>';

        const summaryNode = $("analyticsSummary");
        if (summaryNode) summaryNode.innerHTML = summaryHtml;
        drawAnalyticsQuickFilters(def, topEvents, topPaths);
        const chartsNode = $("analyticsCharts");
        if (chartsNode) {
          chartsNode.innerHTML = buildAnalyticsChartsMarkup({
            trend:trendData,
            funnelRows,
            topEvents,
            topPaths,
            topCtas,
            topReferrers,
            eventsByHour,
            eventsByWeekday
          });
        }

        const preparedRows = rows.map((item) => {
          const eventName = String(item && item.event ? item.event : "event");
          const timestampRaw = String((item && (item.timestampServerUtc || item.timestampClient)) || "");
          const timestampMs = parseAnalyticsTimestamp(timestampRaw);
          const pathValue = String(item && item.path ? item.path : "");
          const details = summarizeAnalyticsProperties(item && item.properties ? item.properties : {});
          const lookup = (eventName + " " + timestampRaw + " " + pathValue + " " + String(item && item.ipAddress ? item.ipAddress : "") + " " + details).toLowerCase();
          return {item, eventName, timestampRaw, timestampMs, pathValue, details, lookup};
        });
        const filteredRows = preparedRows.filter((row) => !searchTerm || row.lookup.includes(searchTerm));
        filteredRows.sort((a, b) => sortMode === "oldest" ? (a.timestampMs - b.timestampMs) : (b.timestampMs - a.timestampMs));

        const sortLabel = sortMode === "oldest" ? "Oldest First" : "Newest First";
        const shownLabel = formatNumber(filteredRows.length) + " of " + formatNumber(rows.length) + " events shown";
        let eventsHtml = '<div class="head analytics-events-head"><div><h3>Recent Events</h3><p>Use server filters for API queries and local search/sort for fast inspection.</p><div class="badges"><span class="badge">' + esc(shownLabel) + '</span><span class="badge">' + esc(sortLabel) + '</span>';
        if (searchTerm) eventsHtml += '<span class="badge">Search: ' + esc(ui.search) + '</span>';
        eventsHtml += '</div></div></div>';

        if (!rows.length) {
          eventsHtml += '<div class="empty">No analytics events found for current filters.</div>';
        } else if (!filteredRows.length) {
          eventsHtml += '<div class="empty">No analytics events match the current local search.</div>';
          eventsHtml += '<div class="analytics-empty-actions"><button id="clearAnalyticsSearch" type="button">Clear Search</button></div>';
        } else {
          eventsHtml += '<div class="grid">';
          filteredRows.forEach((row) => {
            const item = row.item || {};
            const exactTime = row.timestampRaw ? formatAnalyticsDateTime(row.timestampRaw) : "Unknown time";
            const relativeTime = row.timestampRaw ? formatRelativeTime(row.timestampRaw) : "";
            const metaPills = [];
            if (row.pathValue) metaPills.push("Path: " + row.pathValue);
            if (item.ipAddress) metaPills.push("IP: " + item.ipAddress);
            if (item.properties && item.properties.ctaId) metaPills.push("CTA: " + item.properties.ctaId);
            if (item.properties && item.properties.section) metaPills.push("Section: " + item.properties.section);
            eventsHtml += '<article class="item analytics-event-card">';
            eventsHtml += '<div class="analytics-event-head"><h4>' + esc(row.eventName) + '</h4><span class="event-time" title="' + esc(exactTime) + '">' + esc(relativeTime || exactTime) + '</span></div>';
            if (metaPills.length) {
              eventsHtml += '<div class="event-meta-row">';
              metaPills.forEach((pill) => {
                eventsHtml += '<span class="event-pill">' + esc(pill) + '</span>';
              });
              eventsHtml += '</div>';
            }
            eventsHtml += '<p class="snippet event-details">' + esc(row.details) + '</p>';
            eventsHtml += '</article>';
          });
          eventsHtml += '</div>';
        }

        const eventsNode = $("analyticsEvents");
        if (eventsNode) eventsNode.innerHTML = eventsHtml;
        const clearSearchButton = $("clearAnalyticsSearch");
        if (clearSearchButton) {
          clearSearchButton.onclick = () => {
            ui.search = "";
            const searchInput = $("analyticsSearch");
            if (searchInput) searchInput.value = "";
            drawAnalytics(def, summary, events);
          };
        }
      }

      function drawAnalyticsQuickFilters(def, topEvents, topPaths) {
        const quickNode = $("analyticsQuickFilters");
        if (!quickNode) return;

        const eventRows = Array.isArray(topEvents) ? topEvents.slice(0, 8) : [];
        const pathRows = Array.isArray(topPaths) ? topPaths.slice(0, 8) : [];
        const filters = ensureAnalyticsFilters();
        if (!eventRows.length && !pathRows.length) {
          quickNode.innerHTML = "";
          return;
        }

        let html = '<div class="card analytics-quick"><h4>Quick Filters</h4><p>Tap to apply server-side filters instantly.</p>';
        html += '<div class="chip-group"><div class="chip-title">Event</div><div class="chip-row">';
        html += '<button class="chip' + (!filters.event ? ' active' : '') + '" type="button" data-quick-type="event" data-quick-value="">All Events</button>';
        eventRows.forEach((row) => {
          const value = row && row.name !== undefined ? String(row.name) : "";
          const count = row && row.count !== undefined ? formatNumber(row.count) : "0";
          const activeClass = value === String(filters.event || "") ? " active" : "";
          html += '<button class="chip' + activeClass + '" type="button" data-quick-type="event" data-quick-value="' + esc(value) + '">' + esc(value || "Unknown") + ' (' + esc(count) + ')</button>';
        });
        html += '</div></div>';

        html += '<div class="chip-group"><div class="chip-title">Path</div><div class="chip-row">';
        html += '<button class="chip' + (!filters.path ? ' active' : '') + '" type="button" data-quick-type="path" data-quick-value="">All Paths</button>';
        pathRows.forEach((row) => {
          const value = row && row.name !== undefined ? String(row.name) : "";
          const count = row && row.count !== undefined ? formatNumber(row.count) : "0";
          const activeClass = value === String(filters.path || "") ? " active" : "";
          html += '<button class="chip' + activeClass + '" type="button" data-quick-type="path" data-quick-value="' + esc(value) + '">' + esc(value || "Unknown") + ' (' + esc(count) + ')</button>';
        });
        html += '</div></div></div>';
        quickNode.innerHTML = html;

        quickNode.querySelectorAll("button[data-quick-type]").forEach((button) => {
          button.onclick = () => {
            applyAnalyticsQuickFilter(button.dataset.quickType || "", button.dataset.quickValue || "", def);
          };
        });
      }

      function applyAnalyticsQuickFilter(type, value, def) {
        const filters = ensureAnalyticsFilters();
        const normalizedType = String(type || "").toLowerCase();
        if (normalizedType === "event") filters.event = String(value || "");
        if (normalizedType === "path") filters.path = String(value || "");
        filters.limit = normalizeAnalyticsLimit(filters.limit);
        const eventInput = $("analyticsEvent");
        const pathInput = $("analyticsPath");
        if (eventInput) eventInput.value = filters.event;
        if (pathInput) pathInput.value = filters.path;
        loadAnalytics(def || cfg.analyticsInbox, true);
      }

      async function openSubmissionDetail(submissionType, id) {
        if (!id) return;
        try {
          const response = await apiSubmissions("view", submissionType, {id}, false);
          openSubmissionModal(submissionType, response.data || {});
        } catch (error) {
          show(error.message || "Failed to load submission details.", true);
        }
      }

      function openSubmissionModal(submissionType, data) {
        s.modal = {open:true, section:submissionType, index:-1, mode:"viewSubmission", draft:data};
        saveModalBtn.style.display = "none";
        const titlePrefix = submissionType === "trial"
          ? "Trial Submission "
          : submissionType === "newsletter"
            ? "Newsletter Subscriber "
            : "Contact Submission ";
        modalTitle.textContent = titlePrefix + (data.id ? ("#" + data.id) : "");

        let html = '';
        const timestampLabel = submissionType === "newsletter" ? "Subscribed At" : "Submitted At";
        html += '<label>' + esc(timestampLabel) + '<input type="text" value="' + esc(data.submittedAtUtc || data.subscribedAtUtc || "") + '" disabled /></label>';
        if (submissionType === "trial") {
          html += '<label>Name<input type="text" value="' + esc(data.name || "") + '" disabled /></label>';
          html += '<label>Email<input type="text" value="' + esc(data.email || "") + '" disabled /></label>';
          html += '<label>IP Address<input type="text" value="' + esc(data.ipAddress || "") + '" disabled /></label>';
          html += '<label>User Agent<textarea disabled>' + esc(data.userAgent || "") + '</textarea></label>';
          html += '<label>Instructions<textarea disabled>' + esc(data.instructions || "") + '</textarea></label>';
          html += '<label>Submission Info<textarea disabled>' + esc(data.rawText || "") + '</textarea></label>';
          const files = Array.isArray(data.files) ? data.files : [];
          if (files.length) {
            html += '<div class="card file-list"><h4>Uploaded Files</h4>';
            files.forEach((file) => {
              html += '<div class="file-row">';
              html += '<span class="file-name">' + esc(file.storedName || "") + ' (' + esc(formatBytes(file.sizeBytes || 0)) + ')</span>';
              html += '<button type="button" data-download-file="' + esc(file.storedName || "") + '">Download</button>';
              html += '</div>';
            });
            html += '</div>';
          }
        } else if (submissionType === "newsletter") {
          html += '<label>Email<input type="text" value="' + esc(data.email || "") + '" disabled /></label>';
          html += '<label>Source<input type="text" value="' + esc(data.source || "") + '" disabled /></label>';
          html += '<label>IP Address<input type="text" value="' + esc(data.ipAddress || "") + '" disabled /></label>';
          html += '<label>IP Fingerprint<input type="text" value="' + esc(data.ipFingerprint || "") + '" disabled /></label>';
          html += '<label>User Agent<textarea disabled>' + esc(data.userAgent || "") + '</textarea></label>';
          html += '<label>Record JSON<textarea disabled>' + esc(data.rawText || "") + '</textarea></label>';
        } else {
          html += '<label>First Name<input type="text" value="' + esc(data.firstName || "") + '" disabled /></label>';
          html += '<label>Last Name<input type="text" value="' + esc(data.lastName || "") + '" disabled /></label>';
          html += '<label>Email<input type="text" value="' + esc(data.email || "") + '" disabled /></label>';
          html += '<label>IP Address<input type="text" value="' + esc(data.ipAddress || "") + '" disabled /></label>';
          html += '<label>User Agent<textarea disabled>' + esc(data.userAgent || "") + '</textarea></label>';
          html += '<label>Message<textarea disabled>' + esc(data.message || "") + '</textarea></label>';
          html += '<label>Submission Info<textarea disabled>' + esc(data.rawText || "") + '</textarea></label>';
        }
        html += '<div class="actions"><button type="button" data-download-main="1">Download Info File</button></div>';

        modalForm.innerHTML = html;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden","false");

        const mainDownloadButton = modalForm.querySelector("button[data-download-main='1']");
        if (mainDownloadButton) {
          mainDownloadButton.onclick = () => downloadSubmission(submissionType, data.id || "", "");
        }
        modalForm.querySelectorAll("button[data-download-file]").forEach((button) => {
          button.onclick = () => downloadSubmission(submissionType, data.id || "", button.dataset.downloadFile || "");
        });
      }

      async function downloadSubmission(submissionType, id, fileName) {
        if (!id) return;
        try {
          const params = {id};
          if (fileName) params.file = fileName;
          const response = await apiSubmissions("download", submissionType, params, true);
          const blob = await response.blob();
          const disposition = response.headers.get("Content-Disposition") || "";
          const downloadName = extractFileName(disposition) || (submissionType + "-" + id + (fileName ? ("-" + fileName) : "-info.txt"));

          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = downloadName;
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          URL.revokeObjectURL(url);
        } catch (error) {
          show(error.message || "Failed to download file.", true);
        }
      }

      async function downloadAnalytics() {
        try {
          const response = await apiAnalytics("download", {}, true);
          const blob = await response.blob();
          const disposition = response.headers.get("Content-Disposition") || "";
          const downloadName = extractFileName(disposition) || "analytics-events.ndjson";

          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = downloadName;
          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();
          URL.revokeObjectURL(url);
        } catch (error) {
          show(error.message || "Failed to download analytics file.", true);
        }
      }

      async function removeItem(sectionId, index) {
        const def = cfg[sectionId];
        const arr = getPath(s.data, def.path);
        if (!Array.isArray(arr) || index < 0 || index >= arr.length) return show("Invalid item.", true);
        const item = arr[index];
        const itemLabel = def.summary ? String(def.summary(item) || "") : "";
        const confirmed = await requestDeleteConfirmation({
          title:"Delete Item",
          message:"You are about to permanently delete this item.",
          itemLabel:itemLabel || (def.title + " #" + (index + 1))
        });
        if (!confirmed) return;
        const old = copy(s.data);
        arr.splice(index, 1);
        if (!(await save("Item deleted."))) { s.data = old; render(); return; }
        render();
      }

      function openModal(sectionId, index, mode) {
        const def = cfg[sectionId];
        const arr = getPath(s.data, def.path) || [];
        let draft = mode === "edit" && Array.isArray(arr) && index >= 0 && index < arr.length ? copy(arr[index]) : copy(def.empty);
        if (sectionId === "projects") {
          draft = normalizeProjectRecord(draft, getServiceIdList(s.data));
        }
        s.modal = {open:true, section:sectionId, index, mode, draft};
        saveModalBtn.style.display = "";
        modalTitle.textContent = (mode === "add" ? "Add " : "Edit ") + def.title;
        modalForm.innerHTML = "";
        if (def.type === "plist") {
          const resolved = resolveField(def, def.fields[0], draft);
          modalForm.appendChild(makeField(resolved, display(resolved, draft)));
        } else {
          def.fields.forEach((field) => {
            const resolved = resolveField(def, field, draft);
            modalForm.appendChild(makeField(resolved, display(resolved, draft[field.key])));
          });
        }
        modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
      }

      function closeModal() {
        s.modal.open = false;
        saveModalBtn.style.display = "";
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden","true");
      }

      async function requestDeleteConfirmation(options) {
        const title = options && options.title ? String(options.title) : "Confirm Delete";
        const message = options && options.message ? String(options.message) : "This action cannot be undone.";
        const itemLabel = options && options.itemLabel ? String(options.itemLabel) : "";
        confirmTitle.textContent = title;
        confirmText.textContent = message;
        confirmItem.textContent = itemLabel;
        confirmItem.style.display = itemLabel ? "" : "none";
        confirmInput.value = "";
        confirmModal.classList.add("open");
        confirmModal.setAttribute("aria-hidden","false");
        confirmModal.dataset.expected = "DELETE";
        updateConfirmProceedState();
        setTimeout(() => { confirmInput.focus(); }, 0);

        return new Promise((resolve) => {
          confirmResolver = resolve;
        });
      }

      function updateConfirmProceedState() {
        const expected = String(confirmModal.dataset.expected || "DELETE").toUpperCase();
        const value = String(confirmInput.value || "").trim().toUpperCase();
        confirmProceed.disabled = value !== expected;
      }

      function closeConfirm(confirmed) {
        confirmModal.classList.remove("open");
        confirmModal.setAttribute("aria-hidden","true");
        confirmInput.value = "";
        confirmProceed.disabled = true;
        const resolver = confirmResolver;
        confirmResolver = null;
        if (resolver) resolver(Boolean(confirmed));
      }

      function handleGlobalShortcuts(event) {
        if (event.key === "Escape") {
          if (confirmModal.classList.contains("open")) {
            event.preventDefault();
            closeConfirm(false);
            return;
          }
          if (s.modal.open) {
            event.preventDefault();
            closeModal();
            return;
          }
        }

        if (event.key === "/" && !isFormField(event.target)) {
          const navSearch = $("navSearch");
          if (navSearch) {
            event.preventDefault();
            navSearch.focus();
            navSearch.select();
          }
          return;
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
          if (confirmModal.classList.contains("open")) {
            return;
          }
          if (s.modal.open && s.modal.mode !== "viewSubmission") {
            event.preventDefault();
            saveModal();
            return;
          }
          const saveFormButton = $("saveForm");
          if (saveFormButton) {
            event.preventDefault();
            saveFormButton.click();
          }
        }
      }

      function isFormField(node) {
        if (!node || !node.tagName) return false;
        const tag = String(node.tagName).toLowerCase();
        return tag === "input" || tag === "textarea" || tag === "select" || Boolean(node.isContentEditable);
      }

      async function saveModal() {
        if (!s.modal.open || s.modal.mode === "viewSubmission") return;
        const def = cfg[s.modal.section];
        const arr = getPath(s.data, def.path);
        if (!Array.isArray(arr)) return show("Invalid list data.", true);
        const old = copy(s.data);
        let next;
        if (def.type === "plist") {
          const field = def.fields[0];
          const n = modalForm.querySelector('[name="' + cesc(field.key) + '"]');
          next = parse(field, n ? n.value : "");
        } else {
          next = {};
          def.fields.forEach((field) => {
            const n = modalForm.querySelector('[name="' + cesc(field.key) + '"]');
            next[field.key] = parse(field, n ? n.value : "");
          });
        }
        if (s.modal.section === "projects") {
          next = normalizeProjectRecord(next, getServiceIdList(s.data));
        }
        if (s.modal.mode === "add") arr.push(next);
        else if (s.modal.index >= 0 && s.modal.index < arr.length) arr[s.modal.index] = next;
        else return show("Invalid edit index.", true);
        if (!(await save("Item saved."))) { s.data = old; render(); return; }
        closeModal(); render();
      }

      function makeField(field, value) {
        const l = document.createElement("label");
        l.textContent = field.label;
        let el;
        if (field.type === "textarea" || field.type === "lines" || field.type === "price") {
          el = document.createElement("textarea");
          el.value = value || "";
        } else if (field.type === "select") {
          el = document.createElement("select");
          (field.options || []).forEach((opt) => {
            const optionValue = opt && typeof opt === "object" ? String(opt.value !== undefined ? opt.value : "") : String(opt);
            const optionLabel = opt && typeof opt === "object" ? String(opt.label !== undefined ? opt.label : optionValue) : String(opt);
            const o = document.createElement("option");
            o.value = optionValue;
            o.textContent = optionLabel;
            if (String(value) === optionValue) o.selected = true;
            el.appendChild(o);
          });
        } else {
          el = document.createElement("input");
          el.type = field.type === "number" ? "number" : "text";
          el.value = value || "";
        }
        el.name = field.key;
        l.appendChild(el);
        return l;
      }

      function display(field, val) {
        if (field.type === "tags") return Array.isArray(val) ? val.join(", ") : "";
        if (field.type === "lines") return Array.isArray(val) ? val.join("\n") : "";
        if (field.type === "price") return Array.isArray(val) ? val.map((x) => ((x && x.name) || "") + " | " + ((x && x.price) || "")).join("\n") : "";
        if (field.key === "__value__") return typeof val === "string" ? val : "";
        return val === undefined || val === null ? "" : String(val);
      }

      function parse(field, raw) {
        const v = String(raw || "").trim();
        if (field.type === "number") { const n = Number(v); return Number.isNaN(n) ? 0 : n; }
        if (field.type === "tags") return v ? v.split(",").map((x) => x.trim()).filter(Boolean) : [];
        if (field.type === "lines") return v ? v.split(/\r?\n/).map((x) => x.trim()).filter(Boolean) : [];
        if (field.type === "price") return v ? v.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => { const p = line.split("|"); return {name:(p[0]||"").trim(), price:(p[1]||"").trim()}; }) : [];
        return raw;
      }

      function normalizeUrlList(value) {
        if (!Array.isArray(value)) return [];
        return value.map((item) => String(item || "").trim()).filter(Boolean);
      }

      function isVideoMediaUrl(value) {
        const raw = String(value || "").trim();
        if (!raw) return false;
        return /\.(mp4|webm|mov|m4v|avi|mkv|wmv|flv|mpeg|mpg|3gp|m2ts|mts|ts|m3u8)(?:$|[?#])/i.test(raw);
      }

      function inferProjectDeliveryType(project) {
        const images = normalizeUrlList(project && project.images);
        const videos = normalizeUrlList(project && project.videos);
        const coverMedia = String(project && project.coverImage || "").trim();
        const coverIsVideo = isVideoMediaUrl(coverMedia);
        const hasVideo = videos.length > 0 || coverIsVideo;
        const hasImage = images.length > 0 || (coverMedia !== "" && !coverIsVideo);
        if (hasVideo && hasImage) return "mixed";
        if (hasVideo) return "video";
        if (hasImage) return "image";
        const declared = String(project && project.type || "").trim().toLowerCase();
        if (declared === "video") return "video";
        if (declared === "mixed") return "mixed";
        return "image";
      }

      function getServiceIdList(dataRoot) {
        const services = Array.isArray(dataRoot && dataRoot.services) ? dataRoot.services : [];
        const seen = new Set();
        const ids = [];
        services.forEach((service) => {
          const id = String(service && service.id || "").trim();
          if (!id || seen.has(id)) return;
          seen.add(id);
          ids.push(id);
        });
        return ids;
      }

      function getServiceLookup(dataRoot) {
        const lookup = new Map();
        const services = Array.isArray(dataRoot && dataRoot.services) ? dataRoot.services : [];
        services.forEach((service) => {
          const id = String(service && service.id || "").trim();
          if (!id) return;
          lookup.set(id, service);
        });
        return lookup;
      }

      function projectCategoryLabel(categoryId) {
        const id = String(categoryId || "").trim();
        if (!id) return "";
        const lookup = getServiceLookup(s.data);
        const service = lookup.get(id);
        if (!service) return id;
        const title = String(service.title || "").trim();
        return title ? (title + " (" + id + ")") : id;
      }

      function buildProjectCategoryOptions(draft) {
        const lookup = getServiceLookup(s.data);
        const options = [];
        lookup.forEach((service, id) => {
          const title = String(service && service.title || "").trim();
          options.push({value:id, label:title ? (title + " (" + id + ")") : id});
        });
        options.sort((left, right) => String(left.label).localeCompare(String(right.label)));
        const existingValue = String(draft && draft.category || "").trim();
        if (existingValue && !options.some((opt) => opt.value === existingValue)) {
          options.unshift({value:existingValue, label:existingValue + " (unmapped service id)"});
        }
        if (options.length === 0) {
          options.push({value:"", label:"No services available"});
        }
        return options;
      }

      function resolveField(def, field, draft) {
        if (!def || def.path !== "projects") return field;
        if (field.key === "category") {
          return Object.assign({}, field, {type:"select", options:buildProjectCategoryOptions(draft)});
        }
        if (field.key === "type") {
          return Object.assign({}, field, {type:"select", options:["image","video","mixed"]});
        }
        return field;
      }

      function normalizeProjectRecord(project, serviceIds) {
        const source = project && typeof project === "object" ? project : {};
        const cleaned = Object.assign({}, source);
        const allowedServices = Array.isArray(serviceIds) ? serviceIds : [];
        const normalizedId = String(cleaned.id || "").trim();
        const normalizedTitle = String(cleaned.title || "").trim();
        const normalizedDescription = String(cleaned.description || "").trim();
        const normalizedCoverImage = String(cleaned.coverImage || "").trim();
        const normalizedImages = normalizeUrlList(cleaned.images);
        const normalizedVideos = normalizeUrlList(cleaned.videos);
        const rawCategory = String(cleaned.category || "").trim();
        const hasValidCategory = rawCategory && allowedServices.includes(rawCategory);
        const normalizedCategory = hasValidCategory ? rawCategory : (allowedServices[0] || rawCategory || "");
        const normalizedType = inferProjectDeliveryType({
          images: normalizedImages,
          videos: normalizedVideos,
          type: cleaned.type
        });

        cleaned.id = normalizedId;
        cleaned.title = normalizedTitle;
        cleaned.description = normalizedDescription;
        cleaned.coverImage = normalizedCoverImage;
        cleaned.category = normalizedCategory;
        cleaned.images = normalizedImages;
        cleaned.videos = normalizedVideos;
        cleaned.type = normalizedType;
        return cleaned;
      }

      function snippet(item) {
        if (item === null || item === undefined) return "";
        if (typeof item === "string") return item;
        if (typeof item !== "object") return String(item);
        const keys = Object.keys(item);
        for (const k of keys) {
          const v = item[k];
          if (typeof v === "string" && v.trim()) return v.length > 180 ? v.slice(0, 180) + "..." : v;
          if (Array.isArray(v) && v.length) return k + ": " + v.length + " entries";
        }
        return "";
      }

      function getPath(root, path) { return String(path || "").split(".").filter(Boolean).reduce((acc, key) => acc && acc[key], root); }
      function setPath(root, path, val) {
        const p = String(path || "").split(".").filter(Boolean); if (!p.length) return;
        let c = root; for (let i = 0; i < p.length - 1; i += 1) { if (!c[p[i]] || typeof c[p[i]] !== "object") c[p[i]] = {}; c = c[p[i]]; }
        c[p[p.length - 1]] = val;
      }
      function strip(v) { return String(v || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
      function show(msg, isErr) {
        toast.textContent = msg; toast.className = "toast show" + (isErr ? " error" : "");
        clearTimeout(show.t); show.t = setTimeout(() => { toast.className = "toast"; }, 3200);
      }
      function extractFileName(disposition) {
        const match = disposition.match(/filename=\"([^\"]+)\"/i);
        return match ? match[1] : "";
      }
      function formatBytes(bytes) {
        const value = Number(bytes) || 0;
        if (value < 1024) return value + " B";
        if (value < 1024 * 1024) return (value / 1024).toFixed(2) + " KB";
        return (value / (1024 * 1024)).toFixed(2) + " MB";
      }
      function defaultAnalyticsFilters() {
        return {limit:200,event:"",path:"",preset:"30d",from:"",to:""};
      }
      function normalizeAnalyticsPreset(value) {
        const preset = String(value || "").toLowerCase();
        if (preset === "24h" || preset === "7d" || preset === "30d" || preset === "90d" || preset === "all" || preset === "custom") {
          return preset;
        }
        return "30d";
      }
      function displayAnalyticsPreset(value) {
        const preset = normalizeAnalyticsPreset(value);
        if (preset === "24h") return "Last 24h";
        if (preset === "7d") return "Last 7d";
        if (preset === "30d") return "Last 30d";
        if (preset === "90d") return "Last 90d";
        if (preset === "all") return "All Time";
        return "Custom";
      }
      function ensureAnalyticsFilters() {
        if (!s.analytics || typeof s.analytics !== "object") {
          s.analytics = {filters:defaultAnalyticsFilters(),summary:null,events:[],ui:{search:"",sort:"newest"}};
          return s.analytics.filters;
        }
        if (!s.analytics.filters || typeof s.analytics.filters !== "object") {
          s.analytics.filters = defaultAnalyticsFilters();
        }
        const filters = s.analytics.filters;
        filters.limit = normalizeAnalyticsLimit(filters.limit);
        filters.event = String(filters.event || "").trim();
        filters.path = String(filters.path || "").trim();
        filters.preset = normalizeAnalyticsPreset(filters.preset);
        filters.from = String(filters.from || "").trim();
        filters.to = String(filters.to || "").trim();
        return filters;
      }
      function ensureAnalyticsUi() {
        if (!s.analytics || typeof s.analytics !== "object") {
          s.analytics = {filters:defaultAnalyticsFilters(),summary:null,events:[],ui:{search:"",sort:"newest"}};
          return s.analytics.ui;
        }
        if (!s.analytics.ui || typeof s.analytics.ui !== "object") {
          s.analytics.ui = {search:"",sort:"newest"};
        }
        if (typeof s.analytics.ui.search !== "string") {
          s.analytics.ui.search = String(s.analytics.ui.search || "");
        }
        if (s.analytics.ui.sort !== "oldest" && s.analytics.ui.sort !== "newest") {
          s.analytics.ui.sort = "newest";
        }
        return s.analytics.ui;
      }
      function presetRangeToRequestWindow(preset) {
        const normalized = normalizeAnalyticsPreset(preset);
        const now = new Date();
        if (normalized === "all") {
          return {from:"",to:""};
        }
        if (normalized === "custom") {
          return {from:"",to:""};
        }
        const hours = normalized === "24h" ? 24 : normalized === "7d" ? 24 * 7 : normalized === "30d" ? 24 * 30 : 24 * 90;
        const from = new Date(now.getTime() - (hours * 60 * 60 * 1000));
        return {from:from.toISOString(), to:now.toISOString()};
      }
      function resolveAnalyticsRequestFilters(filters) {
        const source = filters || ensureAnalyticsFilters();
        const preset = normalizeAnalyticsPreset(source.preset);
        let from = String(source.from || "").trim();
        let to = String(source.to || "").trim();
        if (preset === "all") {
          from = "";
          to = "";
        } else if (preset !== "custom") {
          const range = presetRangeToRequestWindow(preset);
          from = range.from;
          to = range.to;
        }
        return {
          limit: normalizeAnalyticsLimit(source.limit),
          event: String(source.event || "").trim(),
          path: String(source.path || "").trim(),
          preset,
          from,
          to
        };
      }
      function toDateInputValue(value) {
        const raw = String(value || "").trim();
        if (!raw) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
        const parsed = parseAnalyticsTimestamp(raw);
        if (!parsed) return "";
        return new Date(parsed).toISOString().slice(0, 10);
      }
      function syncAnalyticsRangeControls(filters) {
        const normalizedPreset = normalizeAnalyticsPreset(filters && filters.preset ? filters.preset : "30d");
        main.querySelectorAll("button[data-range-preset]").forEach((button) => {
          const preset = String(button.dataset.rangePreset || "");
          button.classList.toggle("active", preset === normalizedPreset);
        });
        const fromInput = $("analyticsFrom");
        const toInput = $("analyticsTo");
        if (!fromInput || !toInput) return;
        const isCustom = normalizedPreset === "custom";
        fromInput.disabled = !isCustom;
        toInput.disabled = !isCustom;
        if (!isCustom) {
          const requestWindow = resolveAnalyticsRequestFilters(filters);
          fromInput.value = toDateInputValue(requestWindow.from);
          toInput.value = toDateInputValue(requestWindow.to);
        }
      }
      function formatAnalyticsRangeLabel(range, filters) {
        const info = range && typeof range === "object" ? range : {};
        const fromUtc = String(info.fromUtc || "").trim();
        const toUtc = String(info.toUtc || "").trim();
        if (fromUtc && toUtc) {
          return fromUtc + " to " + toUtc;
        }
        const fallback = resolveAnalyticsRequestFilters(filters);
        if (!fallback.from && !fallback.to) return "All available data";
        const fromLabel = fallback.from ? formatAnalyticsDateTime(fallback.from) : "Start";
        const toLabel = fallback.to ? formatAnalyticsDateTime(fallback.to) : "Now";
        return fromLabel + " to " + toLabel;
      }
      function parseAnalyticsTimestamp(value) {
        const raw = String(value || "").trim();
        if (!raw) return 0;
        const normalized = raw.replace(/\s+UTC$/i, "Z");
        let parsed = Date.parse(normalized);
        if (Number.isFinite(parsed)) return parsed;
        if (!/(z|[+-]\d{2}:?\d{2})$/i.test(normalized)) {
          parsed = Date.parse(normalized + "Z");
          if (Number.isFinite(parsed)) return parsed;
        }
        return 0;
      }
      function formatAnalyticsDateTime(value) {
        const parsed = parseAnalyticsTimestamp(value);
        if (!parsed) return String(value || "Unknown time");
        if (!formatAnalyticsDateTime.formatter) {
          formatAnalyticsDateTime.formatter = new Intl.DateTimeFormat("en-US", {
            year:"numeric",
            month:"short",
            day:"2-digit",
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit",
            hour12:true
          });
        }
        return formatAnalyticsDateTime.formatter.format(new Date(parsed));
      }
      function formatRelativeTime(value) {
        const parsed = parseAnalyticsTimestamp(value);
        if (!parsed) return "";
        const delta = parsed - Date.now();
        const abs = Math.abs(delta);
        const minute = 60 * 1000;
        const hour = 60 * minute;
        const day = 24 * hour;
        const week = 7 * day;
        let unit = "second";
        let amount = Math.round(delta / 1000);
        if (abs >= week) {
          unit = "day";
          amount = Math.round(delta / day);
        } else if (abs >= day) {
          unit = "day";
          amount = Math.round(delta / day);
        } else if (abs >= hour) {
          unit = "hour";
          amount = Math.round(delta / hour);
        } else if (abs >= minute) {
          unit = "minute";
          amount = Math.round(delta / minute);
        }
        if (!formatRelativeTime.rtf) {
          formatRelativeTime.rtf = new Intl.RelativeTimeFormat("en-US", {numeric:"auto"});
        }
        return formatRelativeTime.rtf.format(amount, unit);
      }
      function normalizeAnalyticsTrend(trend, rows) {
        if (trend && typeof trend === "object" && Array.isArray(trend.points)) {
          const points = trend.points.map((point) => {
            return {
              label:String((point && (point.bucketStartUtc || point.timestampUtc || point.label)) || ""),
              count:Math.max(0, Number(point && point.count !== undefined ? point.count : 0) || 0)
            };
          }).filter((point) => point.label !== "");
          if (points.length > 0) {
            return {granularity:String(trend.granularity || "day"), points};
          }
        }

        const map = new Map();
        (Array.isArray(rows) ? rows : []).forEach((row) => {
          const raw = String((row && (row.timestampServerUtc || row.timestampClient)) || "");
          const parsed = parseAnalyticsTimestamp(raw);
          if (!parsed) return;
          const bucket = new Date(parsed);
          bucket.setUTCHours(0, 0, 0, 0);
          const key = bucket.toISOString().slice(0, 10) + " 00:00:00 UTC";
          map.set(key, (map.get(key) || 0) + 1);
        });
        const points = Array.from(map.entries())
          .sort((left, right) => parseAnalyticsTimestamp(left[0]) - parseAnalyticsTimestamp(right[0]))
          .map(([label, count]) => ({label, count}));
        return {granularity:"day", points};
      }
      function buildAnalyticsChartsMarkup(data) {
        const trend = data && data.trend ? data.trend : {granularity:"day", points:[]};
        const trendPoints = Array.isArray(trend.points) ? trend.points : [];
        const topEvents = Array.isArray(data && data.topEvents) ? data.topEvents : [];
        const topPaths = Array.isArray(data && data.topPaths) ? data.topPaths : [];
        const topCtas = Array.isArray(data && data.topCtas) ? data.topCtas : [];
        const topReferrers = Array.isArray(data && data.topReferrers) ? data.topReferrers : [];
        const eventsByHour = Array.isArray(data && data.eventsByHour) ? data.eventsByHour : [];
        const eventsByWeekday = Array.isArray(data && data.eventsByWeekday) ? data.eventsByWeekday : [];
        const funnelRows = Array.isArray(data && data.funnelRows) ? data.funnelRows : [];

        let html = '<div class="chart-grid">';
        html += '<article class="chart-card"><div class="chart-head"><div><h4>Event Volume Trend</h4><p>Traffic shape across selected duration.</p></div><span class="chart-kicker">' + esc(String(trend.granularity || "day")) + '</span></div>';
        html += buildTrendChartMarkup(trendPoints);
        html += '</article>';

        html += '<article class="chart-card"><div class="chart-head"><div><h4>Funnel Conversion</h4><p>Step-to-step drop-off from page view to submit.</p></div><span class="chart-kicker">Conversion</span></div>';
        html += buildFunnelChartMarkup(funnelRows);
        html += '</article>';

        html += '<article class="chart-card"><div class="chart-head"><div><h4>Top Events</h4><p>Most frequent event names.</p></div><span class="chart-kicker">Ranked</span></div>';
        html += buildSparkRowsMarkup(topEvents, 8);
        html += '</article>';
        html += '</div>';

        html += '<div class="insight-grid">';
        html += '<article class="chart-card"><div class="chart-head"><div><h4>Top Paths</h4><p>High-activity routes.</p></div><span class="chart-kicker">Paths</span></div>' + buildInsightRowsMarkup(topPaths, 8, "No paths yet.") + '</article>';
        html += '<article class="chart-card"><div class="chart-head"><div><h4>Top CTAs</h4><p>Most-clicked CTA identifiers.</p></div><span class="chart-kicker">CTAs</span></div>' + buildInsightRowsMarkup(topCtas, 8, "No CTA clicks yet.") + '</article>';
        html += '<article class="chart-card"><div class="chart-head"><div><h4>Top Referrers</h4><p>External sources driving visits.</p></div><span class="chart-kicker">Sources</span></div>' + buildInsightRowsMarkup(topReferrers, 8, "No referrer data yet.") + '</article>';
        html += '<article class="chart-card"><div class="chart-head"><div><h4>Activity Patterns</h4><p>When users are most active.</p></div><span class="chart-kicker">Time</span></div>';
        html += '<div class="chip-title">Busiest Hours</div>' + buildSparkRowsMarkup(topRows(eventsByHour, 6), 6);
        html += '<div class="chip-title spaced">Busiest Weekdays</div>' + buildSparkRowsMarkup(topRows(eventsByWeekday, 7), 7);
        html += '</article>';
        html += '</div>';

        return html;
      }
      function buildTrendChartMarkup(points) {
        if (!Array.isArray(points) || points.length === 0) {
          return '<div class="empty">Not enough data to render trend chart.</div>';
        }
        return '<div class="chart-svg-wrap">' + buildTrendChartSvg(points) + '</div>';
      }
      function buildTrendChartSvg(points) {
        const width = 860;
        const height = 220;
        const padLeft = 44;
        const padRight = 16;
        const padTop = 16;
        const padBottom = 28;
        const chartWidth = width - padLeft - padRight;
        const chartHeight = height - padTop - padBottom;
        const maxCount = Math.max(1, ...points.map((point) => Number(point.count) || 0));
        const xForIndex = (index) => {
          if (points.length === 1) return padLeft + (chartWidth / 2);
          return padLeft + ((chartWidth * index) / (points.length - 1));
        };
        const yForCount = (count) => padTop + chartHeight - ((Math.max(0, Number(count) || 0) / maxCount) * chartHeight);
        const coords = points.map((point, index) => ({x:xForIndex(index), y:yForCount(point.count), label:point.label, count:Number(point.count) || 0}));
        const path = coords.map((coord, index) => (index === 0 ? "M" : "L") + coord.x.toFixed(2) + " " + coord.y.toFixed(2)).join(" ");
        const first = coords[0];
        const last = coords[coords.length - 1];
        const baseline = (padTop + chartHeight).toFixed(2);
        const areaPath = path + " L " + last.x.toFixed(2) + " " + baseline + " L " + first.x.toFixed(2) + " " + baseline + " Z";

        let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none" role="img" aria-label="Trend chart">';
        for (let step = 0; step <= 4; step += 1) {
          const value = Math.round((maxCount / 4) * (4 - step));
          const y = padTop + ((chartHeight / 4) * step);
          svg += '<line class="chart-grid-line" x1="' + padLeft + '" y1="' + y.toFixed(2) + '" x2="' + (width - padRight) + '" y2="' + y.toFixed(2) + '" />';
          svg += '<text class="chart-axis" x="' + (padLeft - 6) + '" y="' + (y + 3).toFixed(2) + '" text-anchor="end">' + esc(String(value)) + '</text>';
        }
        svg += '<path class="chart-area" d="' + areaPath + '" />';
        svg += '<path class="chart-line" d="' + path + '" />';
        const maxPoints = coords.length <= 60 ? coords.length : 30;
        const stepSize = Math.max(1, Math.floor(coords.length / maxPoints));
        coords.forEach((coord, index) => {
          if (index % stepSize !== 0 && index !== coords.length - 1) return;
          svg += '<circle class="chart-point" cx="' + coord.x.toFixed(2) + '" cy="' + coord.y.toFixed(2) + '" r="2.6"><title>' + esc(formatTrendLabel(coord.label)) + ': ' + esc(formatNumber(coord.count)) + '</title></circle>';
        });
        const labelIndexes = [0, Math.floor((coords.length - 1) / 2), coords.length - 1];
        const seen = new Set();
        labelIndexes.forEach((idx) => {
          if (idx < 0 || idx >= coords.length) return;
          if (seen.has(idx)) return;
          seen.add(idx);
          const coord = coords[idx];
          svg += '<text class="chart-axis" x="' + coord.x.toFixed(2) + '" y="' + (height - 8) + '" text-anchor="middle">' + esc(formatTrendLabel(coord.label)) + '</text>';
        });
        svg += '</svg>';
        return svg;
      }
      function formatTrendLabel(value) {
        const parsed = parseAnalyticsTimestamp(value);
        if (!parsed) return String(value || "");
        if (!formatTrendLabel.shortDate) {
          formatTrendLabel.shortDate = new Intl.DateTimeFormat("en-US", {month:"short", day:"numeric"});
          formatTrendLabel.shortHour = new Intl.DateTimeFormat("en-US", {month:"short", day:"numeric", hour:"numeric"});
        }
        const raw = String(value || "").toLowerCase();
        if (raw.includes(":00:00") || raw.includes(":00 utc")) {
          return formatTrendLabel.shortHour.format(new Date(parsed));
        }
        return formatTrendLabel.shortDate.format(new Date(parsed));
      }
      function buildFunnelChartMarkup(rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
          return '<div class="empty">No funnel data yet.</div>';
        }
        const firstCount = Math.max(1, Number(rows[0].count) || 0);
        let html = '<div class="funnel-rows">';
        rows.forEach((row, index) => {
          const count = Math.max(0, Number(row && row.count !== undefined ? row.count : 0) || 0);
          const width = Math.max(0, Math.min(100, (count / firstCount) * 100));
          const prevCount = index === 0 ? count : Math.max(1, Number(rows[index - 1] && rows[index - 1].count !== undefined ? rows[index - 1].count : 0) || 1);
          const fromPrevious = index === 0 ? 100 : Math.max(0, Math.min(100, (count / prevCount) * 100));
          html += '<div class="funnel-step"><div class="funnel-meta"><span>' + esc(String(row && row.name !== undefined ? row.name : "Step")) + '</span><strong>' + esc(formatNumber(count)) + '</strong></div>';
          html += '<div class="funnel-rate">Step Conversion: ' + esc(formatPercent(fromPrevious)) + '</div>';
          html += '<div class="funnel-track"><div class="funnel-fill" style="width:' + width.toFixed(2) + '%"></div></div></div>';
        });
        html += '</div>';
        return html;
      }
      function buildSparkRowsMarkup(rows, limit) {
        const list = (Array.isArray(rows) ? rows : []).slice(0, Math.max(1, Number(limit) || 8));
        if (list.length === 0) {
          return '<div class="empty">No data yet.</div>';
        }
        const maxCount = Math.max(1, ...list.map((row) => Math.max(0, Number(row && row.count !== undefined ? row.count : 0) || 0)));
        let html = '<div class="spark-row">';
        list.forEach((row) => {
          const name = String(row && row.name !== undefined ? row.name : "Unknown");
          const count = Math.max(0, Number(row && row.count !== undefined ? row.count : 0) || 0);
          const width = Math.max(0, Math.min(100, (count / maxCount) * 100));
          html += '<div class="spark-item"><div class="spark-label"><span>' + esc(name) + '</span><strong>' + esc(formatNumber(count)) + '</strong></div><div class="spark-track"><div class="spark-fill" style="width:' + width.toFixed(2) + '%"></div></div></div>';
        });
        html += '</div>';
        return html;
      }
      function buildInsightRowsMarkup(rows, limit, emptyMessage) {
        const list = (Array.isArray(rows) ? rows : []).slice(0, Math.max(1, Number(limit) || 8));
        if (list.length === 0) {
          return '<div class="empty">' + esc(emptyMessage || "No data yet.") + '</div>';
        }
        let html = '<div class="insight-list">';
        list.forEach((row) => {
          const name = String(row && row.name !== undefined ? row.name : "Unknown");
          const count = Math.max(0, Number(row && row.count !== undefined ? row.count : 0) || 0);
          html += '<div class="insight-row"><span>' + esc(name) + '</span><strong>' + esc(formatNumber(count)) + '</strong></div>';
        });
        html += '</div>';
        return html;
      }
      function topRows(rows, limit) {
        const list = Array.isArray(rows) ? rows.slice() : [];
        list.sort((left, right) => {
          const countCompare = (Number(right && right.count) || 0) - (Number(left && left.count) || 0);
          if (countCompare !== 0) return countCompare;
          return String(left && left.name || "").localeCompare(String(right && right.name || ""));
        });
        return list.slice(0, Math.max(1, Number(limit) || 6));
      }
      function formatPercent(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return "0%";
        return numeric.toFixed(1).replace(/\.0$/, "") + "%";
      }
      function normalizeAnalyticsLimit(value) {
        const parsed = Number.parseInt(String(value || "").trim(), 10);
        if (!Number.isFinite(parsed)) return 200;
        return Math.max(100, Math.min(parsed, 1000));
      }
      function formatNumber(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return "0";
        return new Intl.NumberFormat("en-US").format(Math.round(numeric));
      }
      function countRowsMarkup(rows) {
        if (!Array.isArray(rows) || rows.length === 0) {
          return '<div class="snippet">No data yet.</div>';
        }
        let html = '<div class="snippet count-list">';
        rows.forEach((row) => {
          const name = row && row.name !== undefined ? String(row.name) : "";
          const count = row && row.count !== undefined ? formatNumber(row.count) : "0";
          html += '<div><span>' + esc(name || "Unknown") + '</span><strong>' + esc(count) + '</strong></div>';
        });
        html += '</div>';
        return html;
      }
      function summarizeAnalyticsProperties(properties) {
        if (!properties || typeof properties !== "object") return "No properties.";
        const parts = [];
        if (properties.ctaId) parts.push("CTA: " + properties.ctaId);
        if (properties.section) parts.push("Section: " + properties.section);
        if (properties.destination) parts.push("Destination: " + properties.destination);
        if (properties.pagePath) parts.push("Page: " + properties.pagePath);
        if (properties.submissionId) parts.push("Submission: " + properties.submissionId);
        if (properties.fileCount !== undefined) parts.push("Files: " + properties.fileCount);
        if (properties.totalBytes !== undefined) parts.push("Total Bytes: " + properties.totalBytes);
        if (parts.length > 0) return parts.join(" | ");
        try {
          const raw = JSON.stringify(properties);
          if (raw && raw.length > 0) {
            return raw.length > 240 ? raw.slice(0, 240) + "..." : raw;
          }
        } catch (error) {
        }
        return "No properties.";
      }
      function esc(v) { return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"); }
      function cesc(v) { return window.CSS && CSS.escape ? CSS.escape(v) : String(v).replace(/"/g, '\\"'); }
      function copy(v) { return typeof structuredClone === "function" ? structuredClone(v) : JSON.parse(JSON.stringify(v)); }
      function f(key,label){return{key,label,type:"text"}} function ft(key,label){return{key,label,type:"textarea"}} function fl(key,label){return{key,label,type:"lines"}} function ftag(key,label){return{key,label,type:"tags"}} function fp(key,label){return{key,label,type:"price"}} function fn(key,label){return{key,label,type:"number"}} function fs(key,label,options){return{key,label,type:"select",options}}
    })();
  </script>
</body>
</html>
