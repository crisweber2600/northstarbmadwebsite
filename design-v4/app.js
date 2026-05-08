/* Enable hidden-initial-state for reveal animations only when JS is alive */
document.documentElement.classList.add('js-reveal');

/* Sticky nav */
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 24) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

/* Scroll reveal */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, {threshold:.05, rootMargin:'0px 0px 200px 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Robustness: after the page settles, force any remaining hidden reveals
   visible — in case observer hasn't fired (e.g. some headless screenshot
   modes, JS-disabled accessibility tools, slow paints). */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
  }, 1500);
});

/* ================================================================
   PYRAMID — interactive layer details
================================================================ */
const layerData = {
  1: {
    color: '#82B5DA',
    tagBg: '#82B5DA',
    tag: 'Layer 1 — The Student',
    title: 'Student & Family',
    tagline: 'Every morning starts with Joey.',
    body: "When students log into NorthStar, they're greeted by Joey the Kangaroo — their virtual learning guide. Joey helps students understand their day, set goals, stay focused, and grow as learners. For families, NorthStar provides visibility into goals, simple ways to support learning, and clear progress snapshots.",
    list: [
      'A friendly check-in and clear daily learning focus',
      'Personalized learning pathways aligned to each student',
      'Daily managed-independent-learning matched to needs',
      'Reflection, recognition, and growth celebrations',
      'Standards-based portfolios that grow across PreK–8',
      'Family visibility into goals and shared support moves'
    ],
    anchor: 'Students don\'t need to manage the complexity. Joey helps make learning manageable and meaningful.'
  },
  2: {
    color: '#4F8AC4',
    tagBg: '#4F8AC4',
    tag: 'Layer 2 — The Practice',
    title: 'Instruction & Intervention',
    tagline: 'Guided instruction. Evidence-based intervention. Built into the system.',
    body: "NorthStar includes a complete, science-of-reading–aligned written code continuum — phonics, grammar, morphology, and vocabulary — with Joey-guided practice and intervention. Joey analyzes student performance along the continuum and guides students to targeted practice at the right point in the progression.",
    list: [
      'PreK–8 vertically aligned literacy curriculum',
      'Phonemic awareness, phonics, morphology, syntax & vocabulary games',
      'Joey-analyzed daily artifacts linked to standards',
      'Know-Need-Teach-Check sheets that guide instructional planning',
      'Whole-group, small-group, and one-on-one conferring guides',
      'Intervention guided by evidence, not guesswork'
    ],
    anchor: 'Districts don\'t need to layer multiple language programs to achieve coherence — it\'s built in.'
  },
  3: {
    color: '#1B4F8C',
    tagBg: '#1B4F8C',
    tag: 'Layer 3 — The Educators',
    title: 'Teacher-Centered Coaching Around Student-Centered Learning',
    tagline: 'Joey finds the patterns. Teachers and coaches drive the change.',
    body: "Teachers receive a role-based dashboard combining classroom tools, personalized professional learning, and a virtual systems coach. Coaches get coaching cycle workflows, observation tools, and trend insights — so they can focus on people and practice while the system handles organization.",
    list: [
      'Instructional planning, differentiation, and goal alignment',
      'Embedded progress monitoring and evidence collection',
      'Personalized micro-credentials tied to classroom practice',
      'Coaching cycles, observation, and feedback workflows',
      'Just-in-time guidance from the virtual systems coach',
      'Real classroom video — no need for separate observation platforms'
    ],
    anchor: 'NorthStar fits into the flow of teaching rather than pulling teachers away from it.'
  },
  4: {
    color: '#163C66',
    tagBg: '#163C66',
    tag: 'Layer 4 — The Teams',
    title: 'Shared Leadership Teams — District & Building',
    tagline: 'Joey organizes the learning. Leadership teams guide the improvement.',
    body: "School and district leadership teams get a shared dashboard where Joey aggregates classroom evidence into school- and system-wide insight. Teams see patterns instead of isolated examples, and conversations stay focused on instruction and learning.",
    list: [
      'Grade-level and team-level learning trends',
      'Visibility into instructional implementation',
      'Progress toward shared improvement goals',
      'Interactive continuous-improvement plans (district + building)',
      'Coaching cycle activity, micro-credential progress, and evidence cycles',
      'Aligned focus across instructional coaches, interventionists, and leadership'
    ],
    anchor: 'Leadership conversations become focused, collaborative, and actionable — grounded in evidence, not assumptions.'
  },
  5: {
    color: '#0E2A4A',
    tagBg: '#0E2A4A',
    tag: 'Layer 5 — The System',
    title: 'Administrative Leadership — District & Building',
    tagline: 'Visibility without micromanagement.',
    body: "School and district administrators get a strategic dashboard where Joey turns daily classroom activity into actionable system-level insight. Administrators see how students are learning, where support is needed, and how growth is progressing across schools.",
    list: [
      'School- and district-wide learning trends',
      'Implementation progress by school, role, or initiative',
      'Goal alignment to district priorities',
      'Targeted, wrap-around coaching and resource alignment',
      'Continuity across leadership transitions',
      'Board-ready reporting on system health and outcomes'
    ],
    anchor: 'Leadership with insight — not compliance, not control.'
  }
};

const detailEl = document.getElementById('pyramidDetail');
const layerNodes = document.querySelectorAll('.pyramid-svg .layer');

function showLayer(id){
  const d = layerData[id];
  if (!d) return;

  // Clear active states
  layerNodes.forEach(n => n.classList.remove('active'));
  const target = document.querySelector(`.layer[data-layer="${id}"]`);
  if (target) target.classList.add('active');

  detailEl.innerHTML = `
    <div class="detail-content">
      <span class="detail-tag" style="background:${d.tagBg}">${d.tag}</span>
      <h3>${d.title}</h3>
      <p class="detail-tagline">${d.tagline}</p>
      <p class="detail-body">${d.body}</p>
      <ul class="detail-list">
        ${d.list.map(item => `<li>${item}</li>`).join('')}
      </ul>
      <p class="detail-anchor">${d.anchor}</p>
    </div>
  `;
}

// Bind clicks
layerNodes.forEach(node => {
  node.addEventListener('click', () => {
    const id = node.getAttribute('data-layer');
    showLayer(id);
  });
  // Keyboard accessibility
  node.setAttribute('tabindex', '0');
  node.setAttribute('role', 'button');
  node.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showLayer(node.getAttribute('data-layer'));
    }
  });
});

// Initial render: show layer 1
showLayer(1);

// Build the print-only "all layers" grid using the same data,
// plus a closing synthesis card that fills the orphan slot
const printLayersEl = document.getElementById('printLayers');
if (printLayersEl) {
  const layerCards = Object.entries(layerData).map(([id, d]) => `
    <div class="print-layer">
      <span class="detail-tag" style="background:${d.tagBg}">${d.tag}</span>
      <h4>${d.title}</h4>
      <p class="pl-tagline">${d.tagline}</p>
      <p>${d.body}</p>
      <ul>
        ${d.list.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const synthesisCard = `
    <div class="print-layer print-synthesis">
      <span class="detail-tag" style="background:#163C66">The Whole Picture</span>
      <h4>One System. Five Layers. Many Roles.</h4>
      <p class="pl-tagline">Coherence is the product.</p>
      <p>When every layer has the right tools, learning, and guidance, the
        system improves faster. NorthStar gives each role a dashboard built
        for their day-to-day work — while keeping the system coherent end
        to end.</p>
      <ul>
        <li><strong>Workspace</strong> — Tools that make each job easier and more effective.</li>
        <li><strong>Pathways</strong> — Personalized learning for students and adults, anchored in real evidence.</li>
        <li><strong>Coach</strong> — Just-in-time guidance, embedded in every role's day.</li>
      </ul>
      <p class="synth-close">Joey adapts the system to the learner — not the learner to the system.</p>
    </div>
  `;

  printLayersEl.innerHTML = layerCards + synthesisCard;
}

// Footer "jump" links select a specific layer
document.querySelectorAll('[data-jump]').forEach(a => {
  a.addEventListener('click', () => {
    const id = a.getAttribute('data-jump');
    setTimeout(() => showLayer(id), 600);
  });
});
