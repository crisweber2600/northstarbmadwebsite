/* ========== Reveal init ========== */
document.documentElement.classList.add('js-reveal');

/* Sticky nav */
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 24) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* Reveal observer */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, {threshold:.05, rootMargin:'0px 0px 200px 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 1500);
});

/* Mobile menu */
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileMenu.querySelectorAll('a, .close-x').forEach(el => {
    el.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

/* Active nav-link tracking */
const sections = ['hero','promise','how-it-works','joey','pillars','pyramid','impact','contact'];
const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
const sectionIo = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && e.intersectionRatio > .35) {
      const id = e.target.id;
      links.forEach(l => {
        const href = l.getAttribute('href');
        if (href === '#' + id) l.classList.add('active');
        else l.classList.remove('active');
      });
    }
  });
}, {threshold:[.35, .6]});
sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionIo.observe(el);
});

/* ================================================================
   PYRAMID — 10 tiers
================================================================ */
const tierData = {
  1:  { role:'Student',         tagline:'Every morning starts with Joey.',
        body:'When students log in, Joey the Kangaroo greets them with a clear daily focus. NorthStar gives every student personalized pathways, daily managed-independent learning, and a portfolio that grows across PreK–8.',
        workspace:'A friendly daily check-in, focus list, and progress dashboard.',
        pathways:'Personalized learning aligned to each student\'s needs.',
        coach:'Joey — a virtual learning guide and daily companion.',
        features:[
          'Friendly check-in and clear daily learning focus',
          'Personalized pathways aligned to each student',
          'Daily managed-independent learning matched to needs',
          'Reflection, recognition, and growth celebrations',
          'Standards-based portfolios across PreK–8'
        ],
        anchor:'Students don\'t need to manage the complexity. Joey helps make learning manageable and meaningful.' },
  2:  { role:'Family',           tagline:'A clear window into how their child is growing.',
        body:'Families get visibility into goals, simple ways to support learning at home, and clear progress snapshots — without needing to interpret jargon or chase teachers for updates.',
        workspace:'A family dashboard with goals, progress, and gentle nudges.',
        pathways:'Suggested at-home routines tied to current learning.',
        coach:'A guide that helps their child stay organized and grow.',
        features:[
          'Visibility into goals and current learning',
          'Simple, jargon-free progress snapshots',
          'Suggested ways to support learning at home',
          'Two-way communication with the classroom',
          'Celebrations of growth and milestones'
        ],
        anchor:'Families become true partners — informed, included, and equipped to help.' },
  3:  { role:'Teacher',          tagline:'Joey finds the patterns. Teachers drive the change.',
        body:'Teachers get a role-based dashboard combining classroom tools, personalized professional learning, and a virtual systems coach — so the system handles organization while teachers focus on instruction.',
        workspace:'Planning, differentiation, progress monitoring, and conferring guides.',
        pathways:'Personalized micro-credentials tied to classroom practice.',
        coach:'Just-in-time guidance and embedded video models.',
        features:[
          'Instructional planning, differentiation, and goal alignment',
          'Embedded progress monitoring and evidence collection',
          'Personalized micro-credentials tied to classroom practice',
          'Just-in-time guidance from the virtual systems coach',
          'Real classroom video — built right in'
        ],
        anchor:'NorthStar fits into the flow of teaching rather than pulling teachers away from it.' },
  4:  { role:'Interventionist', tagline:'Evidence-based intervention, built into the system.',
        body:'Interventionists work alongside teachers with shared evidence, Joey-analyzed artifacts, and a complete science-of-reading–aligned written code continuum — so intervention is guided by evidence, not guesswork.',
        workspace:'Caseload, intervention plans, and progress monitoring tools.',
        pathways:'Diagnostic-aligned intervention pathways and resources.',
        coach:'Just-in-time intervention guidance from the virtual coach.',
        features:[
          'Caseload management with shared evidence across roles',
          'Joey-analyzed daily artifacts linked to standards',
          'PreK–8 vertically aligned written-code continuum',
          'Phonics, morphology, syntax, and vocabulary games',
          'Know-Need-Teach-Check planning sheets'
        ],
        anchor:'Intervention becomes precise, coherent, and connected to classroom instruction.' },
  5:  { role:'Coach',   tagline:'Coaching cycles, observation, and feedback — in one place.',
        body:'Building coaches get coaching-cycle workflows, observation tools, and trend insights so they can focus on people and practice while NorthStar handles organization.',
        workspace:'Coaching-cycle dashboard, schedule, and observation tools.',
        pathways:'Coaching micro-credentials and shared learning libraries.',
        coach:'Trend insights and recommended next actions for each teacher.',
        features:[
          'Coaching cycles, observation, and feedback workflows',
          'Trend insights aggregated across teachers and classrooms',
          'Embedded video for evidence and modeling',
          'Aligned focus across coaches, interventionists, and teachers',
          'Goal alignment to building priorities'
        ],
        anchor:'Coaches focus on people and practice; NorthStar carries the rest.' },
  6:  { role:'School Leadership Team',
        tagline:'A shared dashboard for shared improvement.',
        body:'School improvement teams get a shared dashboard where Joey aggregates classroom evidence into school-wide insight — patterns, not isolated examples — so conversations stay focused on instruction and learning.',
        workspace:'Interactive school improvement plan and team meeting hub.',
        pathways:'Team-based learning and shared improvement playbooks.',
        coach:'System-level recommendations for the team\'s next move.',
        features:[
          'Grade-level and team-level learning trends',
          'Visibility into instructional implementation',
          'Progress toward shared improvement goals',
          'Interactive continuous-improvement plans',
          'Coaching, micro-credential, and evidence cycle activity'
        ],
        anchor:'Leadership conversations become focused, collaborative, and grounded in evidence.' },
  7:  { role:'School Admin', tagline:'See the building. Lead the building.',
        body:'Principals get a strategic dashboard that turns daily classroom activity into actionable building-level insight — implementation, learning trends, and where support is needed.',
        workspace:'Building dashboard with implementation and learning insight.',
        pathways:'Leadership micro-credentials and routines.',
        coach:'Targeted next-best-action prompts for the building.',
        features:[
          'Building-wide learning trends and implementation insight',
          'Targeted, wrap-around coaching and resource alignment',
          'Goal alignment to district priorities',
          'Continuity across leadership transitions',
          'Insight without micromanagement'
        ],
        anchor:'Lead with insight — not compliance, not control.' },
  8:  { role:'District Coach',     tagline:'Coach across schools, with shared evidence.',
        body:'District coaches see across buildings — coaching-cycle activity, micro-credential progress, and patterns of practice — so cross-school coherence becomes possible without losing local context.',
        workspace:'Cross-building coaching dashboard and trend views.',
        pathways:'Cross-school learning libraries and coaching playbooks.',
        coach:'Pattern-spotting across buildings and grade levels.',
        features:[
          'Cross-building coaching-cycle visibility',
          'Pattern-spotting across grade levels and schools',
          'Shared video and resource libraries',
          'Aligned support for new initiatives',
          'Coherent coaching practice across the district'
        ],
        anchor:'District coaching becomes coherent — not duplicative, not isolated.' },
  9:  { role:'District Leadership Team',
        tagline:'Joey organizes the learning. The team guides the improvement.',
        body:'District improvement teams get an aggregated view of system health and improvement progress, anchored in real classroom evidence — so improvement plans live and breathe instead of sitting in a binder.',
        workspace:'District improvement plan and shared team workspace.',
        pathways:'Cross-role learning around district priorities.',
        coach:'Recommended next moves for the system.',
        features:[
          'Aggregated implementation, learning, and capacity data',
          'Interactive district continuous improvement plan',
          'Alignment across schools, roles, and initiatives',
          'Visibility without surveillance',
          'Continuity across leadership transitions'
        ],
        anchor:'Improvement plans become living systems, not static documents.' },
  10: { role:'District Admin',      tagline:'Insight without micromanagement.',
        body:'District administrators get a strategic dashboard where Joey turns daily classroom activity into actionable system-level insight — board-ready reporting, system health, and how growth is progressing across schools.',
        workspace:'District dashboard, board reports, and system signals.',
        pathways:'Leadership development and continuity planning.',
        coach:'System-level signals and recommended priorities.',
        features:[
          'School- and district-wide learning trends',
          'Implementation progress by school, role, or initiative',
          'Goal alignment to district priorities',
          'Targeted, wrap-around support and resource alignment',
          'Board-ready reporting on system health and outcomes'
        ],
        anchor:'Lead the system with clarity, coherence, and care.' }
};

/* Rainbow tier colors top→bottom (matches reference pyramid art) */
const tierColors = [
  '#9DD2EE', // 1 Student      - light blue
  '#5FB9E1', // 2 Family       - sky blue
  '#67C8A0', // 3 Teacher      - mint green
  '#B6D955', // 4 Interventionist - lime
  '#F4D247', // 5 Coach        - yellow
  '#F4B83D', // 6 School Leadership Team - gold
  '#ED8E45', // 7 School Admin - orange
  '#E66E4F', // 8 District Coach - red-orange
  '#D260A5', // 9 District Leadership Team - pink
  '#963E94'  // 10 District Admin - purple
];

/* Build the SVG pyramid (10 tiers) */
function buildPyramid(){
  const svg = document.getElementById('pyramidSvg');
  if (!svg) return;
  const W = 560, H = 600;
  const apex = {x: W/2, y: 60};
  const base = {leftX: 30, rightX: W - 30, y: H - 30};

  const tierHeight = (base.y - apex.y) / 10;
  const layersGroup = svg.querySelector('#layers');
  layersGroup.innerHTML = '';

  // Star above apex
  const star = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  star.setAttribute('x', apex.x);
  star.setAttribute('y', apex.y - 8);
  star.setAttribute('text-anchor', 'middle');
  star.setAttribute('font-size', '34');
  star.setAttribute('fill', '#F4C942');
  star.textContent = '★';
  layersGroup.appendChild(star);

  for (let i = 0; i < 10; i++){
    const t = i + 1;
    const yTop = apex.y + i * tierHeight;
    const yBot = apex.y + (i + 1) * tierHeight;
    const ratioTop = i / 10;
    const ratioBot = (i + 1) / 10;
    const halfTop = ((base.rightX - base.leftX) / 2) * ratioTop;
    const halfBot = ((base.rightX - base.leftX) / 2) * ratioBot;

    let pts;
    if (i === 0){
      pts = `${apex.x},${apex.y} ${apex.x - halfBot},${yBot} ${apex.x + halfBot},${yBot}`;
    } else {
      pts = `${apex.x - halfTop},${yTop} ${apex.x + halfTop},${yTop} ${apex.x + halfBot},${yBot} ${apex.x - halfBot},${yBot}`;
    }

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'layer');
    g.setAttribute('data-layer', t);
    g.setAttribute('tabindex','0');
    g.setAttribute('role','button');
    g.setAttribute('aria-label', `Tier ${t}: ${tierData[t].role}`);
    g.style.cursor = 'pointer';

    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', pts);
    poly.setAttribute('fill', tierColors[i]);
    poly.setAttribute('stroke', 'rgba(255,255,255,.65)');
    poly.setAttribute('stroke-width', '1.5');
    g.appendChild(poly);

    // role label centered in tier
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', apex.x);
    // pull tier-1 label down toward the bottom of its triangle so it fits
    label.setAttribute('y', i === 0 ? yBot - 6 : (yTop + yBot) / 2 + 5);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-family', 'Manrope, system-ui, sans-serif');
    label.setAttribute('font-weight', '700');
    label.setAttribute('font-size', i === 0 ? '11' : (i < 4 ? '13' : i < 7 ? '15' : 16));
    label.setAttribute('fill', i === 9 ? '#FFFFFF' : '#1A1A1A');
    label.setAttribute('pointer-events', 'none');
    label.textContent = tierData[t].role;
    g.appendChild(label);

    g.addEventListener('click', () => openTier(t));
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openTier(t); }
    });

    layersGroup.appendChild(g);
  }
}
buildPyramid();

/* ===== Tier modal ===== */
const tierModal = document.getElementById('tierModal');
const tierBody = document.getElementById('tierModalBody');

function openTier(t){
  const d = tierData[t];
  if (!d) return;
  document.querySelectorAll('.pyramid-svg .layer').forEach(n => n.classList.remove('active'));
  const node = document.querySelector(`.layer[data-layer="${t}"]`);
  if (node) node.classList.add('active');

  tierBody.innerHTML = `
    <button class="close" aria-label="Close">×</button>
    <div class="panel-grid">
      <div class="left">
        <div class="inner">
          <span class="tier-num">Tier ${t} of 10</span>
          <h2 class="tier-title">${d.role}</h2>
          <p class="tier-tag">${d.tagline}</p>
          <p class="tier-body">${d.body}</p>
          <div class="pillar-set">
            <div class="ps"><strong>${d.role} Workspace</strong><span>${d.workspace}</span></div>
            <div class="ps"><strong>${d.role} Pathways</strong><span>${d.pathways}</span></div>
            <div class="ps"><strong>${d.role} Coach — Joey</strong><span>${d.coach}</span></div>
          </div>
        </div>
      </div>
      <div class="right">
        <h3>Pillars of Support</h3>
        <p class="right-sub">What this role gets in NorthStar</p>
        <ul class="feature-list">
          ${d.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <div class="anchor-quote">${d.anchor}</div>
      </div>
    </div>
  `;
  tierModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  tierBody.querySelector('.close').addEventListener('click', closeTier);
}
function closeTier(){
  tierModal.classList.remove('open');
  document.body.style.overflow = '';
  document.querySelectorAll('.pyramid-svg .layer').forEach(n => n.classList.remove('active'));
}
tierModal.addEventListener('click', (e) => {
  if (e.target === tierModal) closeTier();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape'){ closeTier(); closeInfo(); }
});

/* ================================================================
   Info modal — Page 10 popups
================================================================ */
const infoData = {
  team: {
    tag:'Our People',
    title:'Meet the Team',
    body:`<p>NorthStarET is led by veteran educators, instructional coaches, and continuous-improvement leaders who have lived inside districts for decades. Our team brings classroom credibility, district-leadership experience, and modern product craft to every layer of the system.</p>
          <p>Founder Beth Swenson developed the North Star Student Support Structure in 2020 as a unifying framework for the way districts actually work. Joining her are instructional designers, learning scientists, and experienced school administrators — all building tools they wish they had had themselves.</p>`
  },
  start: {
    tag:'Origin Story',
    title:'How We Got Our Start',
    body:`<p>NorthStar began the way every good improvement story begins — inside a real district, with real leaders trying to solve a real problem: too many tools, too many initiatives, and not enough coherence.</p>
          <p>What started as a hand-drawn pyramid on a meeting-room whiteboard grew into a complete system: a shared structure, shared language, and a shared set of tools that every role in a school could use, every day. That whiteboard sketch is now the North Star pyramid you see today.</p>`
  },
  now: {
    tag:'Roadmap',
    title:'Now and When — Where We\'ll Grow With Your Support',
    body:`<p><strong>Now:</strong> A complete role-based platform with workspaces for ten roles, the Joey learning intelligence, the science-of-reading–aligned PreK–8 written-code continuum, and an interactive continuous improvement plan.</p>
          <p><strong>Next:</strong> Math content alignment, expanded coaching pathways, and stronger family workspaces.</p>
          <p><strong>Then:</strong> Open APIs for assessment partners, deeper analytics, and a research practice partnership program.</p>
          <p>With your support, we accelerate the roadmap and bring NorthStar to more districts faster — without compromising on the depth that makes it work.</p>`
  },
  stories: {
    tag:'Proof',
    title:'Success Stories',
    body:`<p>From a small rural district to a fast-growing suburban network, NorthStar partners are seeing what coherence makes possible: aligned coaching, stronger instructional implementation, and better student growth — without adding pressure to schools.</p>
          <p>Pilot districts report deeper teacher engagement with professional learning, more confident leadership conversations grounded in real evidence, and clearer pathways for students and families. Full case studies are available on request.</p>`
  }
};
const infoModal = document.getElementById('infoModal');
const infoBody = document.getElementById('infoModalBody');
function openInfo(key){
  const d = infoData[key];
  if (!d) return;
  infoBody.innerHTML = `
    <button class="close" aria-label="Close">×</button>
    <span class="info-tag">${d.tag}</span>
    <h2>${d.title}</h2>
    ${d.body}
  `;
  infoModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  infoBody.querySelector('.close').addEventListener('click', closeInfo);
}
function closeInfo(){
  infoModal.classList.remove('open');
  document.body.style.overflow = '';
}
infoModal.addEventListener('click', (e) => {
  if (e.target === infoModal) closeInfo();
});
document.querySelectorAll('[data-info]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openInfo(el.getAttribute('data-info'));
  });
});
