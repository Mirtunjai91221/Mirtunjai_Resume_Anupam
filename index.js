/* ==========================================================================
   Mirtunjai Kumar Anupam - Premium Portfolio Core Scripting
   Handles Canvas Particles, SQL Console, BI Dashboard, and Interactive Simulators
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Remove body loading state
    document.body.classList.remove('loading');

    // Initialize Subsystems
    initGlowFollower();
    initCanvasParticles();
    initMobileNav();
    initBIDashboard();
    initTerminalConsole();
    initProjectSimulators();
    initScrollReveal();
});

/* ==========================================================================
   1. Custom Mouse Glowing Tracker
   ========================================================================== */
function initGlowFollower() {
    const glow = document.getElementById('glow-follower');
    if (!glow) return;

    window.addEventListener('mousemove', (e) => {
        // Smooth cursor trace
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
}

/* ==========================================================================
   2. Canvas Particle Network (Cloud Data Streams)
   ========================================================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const maxParticles = 60;
    const connectionDist = 110;
    let mouse = { x: null, y: null, radius: 120 };

    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Blueprint
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interactions (push away slightly)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    let angle = Math.atan2(dy, dx);
                    this.x += Math.cos(angle) * force * 1.2;
                    this.y += Math.sin(angle) * force * 1.2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
            ctx.fill();
        }
    }

    // Spawn Particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    // Connect particles near each other
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    let alpha = (1 - dist / connectionDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   3. Mobile Navigation Layout
   ========================================================================== */
function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('mobile-active');
        const icon = toggle.querySelector('i');
        if (menu.classList.contains('mobile-active')) {
            icon.className = 'bx bx-x';
        } else {
            icon.className = 'bx bx-menu';
        }
    });

    // Close menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('mobile-active');
            toggle.querySelector('i').className = 'bx bx-menu';
        });
    });
}

/* ==========================================================================
   4. Executive Power BI Dashboard Interactions
   ========================================================================== */
function initBIDashboard() {
    const tabs = document.querySelectorAll('.db-tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    const refreshBtn = document.getElementById('db-refresh-btn');
    const timeText = document.querySelector('.db-update-time');

    if (tabs.length === 0) return;

    // Handle Tab Switches
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = `tab-${tab.dataset.tab}`;

            // Remove active classes
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Activate target
            tab.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');

                // Trigger nested chart animations
                if (tab.dataset.tab === 'summary') {
                    animateBarCharts();
                } else if (tab.dataset.tab === 'efficiency') {
                    animateLineChart();
                }
            }
        });
    });

    // Animate summary stats (Power BI style loading)
    function animateBarCharts() {
        const fills = document.querySelectorAll('.bar-fill');
        fills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 100);
        });
    }

    // Line chart dashoffset sweep animation
    function animateLineChart() {
        const path = document.querySelector('.chart-animated-path');
        if (!path) return;
        path.style.strokeDashoffset = '600';
        setTimeout(() => {
            path.style.strokeDashoffset = '0';
        }, 100);
    }

    // Number counters
    function runCounters() {
        const countElements = document.querySelectorAll('.kpi-value');
        countElements.forEach(el => {
            const finalVal = parseFloat(el.dataset.value);
            let startVal = 0;
            const duration = 1200;
            const steps = 30;
            const valStep = finalVal / steps;
            const timeStep = duration / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                startVal += valStep;
                
                if (finalVal % 1 === 0) {
                    el.textContent = Math.round(startVal);
                } else {
                    el.textContent = startVal.toFixed(1);
                }

                if (currentStep >= steps) {
                    el.textContent = finalVal;
                    clearInterval(timer);
                }
            }, timeStep);
        });
    }

    // Refresh simulation button click
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.innerHTML = "<i class='bx bx-loader-circle bx-spin'></i> Syncing Fabric...";
            refreshBtn.disabled = true;

            setTimeout(() => {
                refreshBtn.innerHTML = "<i class='bx bx-refresh'></i> Refresh Data";
                refreshBtn.disabled = false;
                
                // Get current time formatted
                const now = new Date();
                timeText.textContent = `Last Sync: Today ${now.toLocaleTimeString()}`;
                
                runCounters();
                animateBarCharts();
                animateLineChart();
            }, 1500);
        });
    }

    // Initial triggers
    setTimeout(() => {
        runCounters();
        animateBarCharts();
    }, 500);
}

/* ==========================================================================
   5. Interactive SQL / AI Terminal Console System
   ========================================================================== */
function initTerminalConsole() {
    const input = document.getElementById('console-input');
    const log = document.getElementById('console-log');
    const body = document.getElementById('console-body');
    const quickButtons = document.querySelectorAll('.quick-cmd-btn');

    if (!input || !log) return;

    // Listen to Enter Key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                processCommand(command);
                input.value = '';
            }
        }
    });

    // Quick Command Buttons
    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.dataset.cmd;
            processCommand(cmd);
        });
    });

    // Process terminal execution logic
    function processCommand(rawCmd) {
        const cmd = rawCmd.toLowerCase().trim();
        
        // Print command prompt line
        appendLog(`mirtunjai_ops@hyd-infra:~$ ${rawCmd}`, 'user-entered-line');

        // Typing indicator simulator
        const typingId = appendLog('Executing process...', 'sys-info-line');

        setTimeout(() => {
            // Remove typing text
            typingId.remove();

            switch(cmd) {
                case 'help':
                    printHelp();
                    break;
                case 'skills':
                    printSkills();
                    break;
                case 'query_etl':
                    runQueryETL();
                    break;
                case 'run_agent':
                    triggerAIAgents();
                    break;
                case 'contact':
                    printContact();
                    break;
                case 'experience':
                case 'about':
                    printMilestones();
                    break;
                case 'clear':
                    log.innerHTML = '';
                    break;
                default:
                    appendLog(`bash: command not found: '${rawCmd}'. Type 'help' for core operations list.`, 'sys-error-line');
            }
            // Auto scroll console
            body.scrollTop = body.scrollHeight;
        }, 400);
    }

    // Utility to append console log
    function appendLog(text, className = '') {
        const p = document.createElement('p');
        p.className = className;
        p.innerHTML = text;
        log.appendChild(p);
        body.scrollTop = body.scrollHeight;
        return p;
    }

    /* Commands Content Generators */
    function printHelp() {
        appendLog(`Available Infrastructure Blueprints:`, 'sys-output-line');
        appendLog(`  [skills]      - Map key skills across BI, MLOps, Backend, and UI`, 'sys-info-line');
        appendLog(`  [query_etl]   - Simulate factual database ingestion ETL process`, 'sys-info-line');
        appendLog(`  [run_agent]   - Command n8n/CrewAI agent orchestrator pipeline`, 'sys-info-line');
        appendLog(`  [experience]  - Retrieve chronology career milestones`, 'sys-info-line');
        appendLog(`  [contact]     - Fetch SMTP contact configurations`, 'sys-info-line');
        appendLog(`  [clear]       - Flush console log buffers`, 'sys-info-line');
    }

    function printSkills() {
        appendLog(`==================== STACK CAPABILITY MATRIX ====================`, 'sys-output-line');
        appendLog(`[BI & ANALYTICS]: Power BI | Microsoft Fabric | OneLake | DAX | Tableau | Looker Studio`, 'sys-info-line');
        appendLog(`[DATA PIPES]: Python | SQL | Pandas | Azure Data Factory | Databricks | REST APIs`, 'sys-info-line');
        appendLog(`[AI & AUTOMATION]: n8n | CrewAI | LangChain | ChatGPT & Gemini Integration`, 'sys-info-line');
        appendLog(`[ML & MLOps]: YOLOv8 Detection | OpenCV | scikit-learn | Docker Containers`, 'sys-info-line');
        appendLog(`[DEVOPS & CLOUD]: AWS (EC2, S3, Lambda) | Azure DevOps | GitHub Actions`, 'sys-info-line');
        appendLog(`[FRONTEND]: JavaScript ES6+ | HTML5 | CSS3 | ReactJS | Bootstrap`, 'sys-info-line');
        appendLog(`=================================================================`, 'sys-output-line');
    }

    function runQueryETL() {
        appendLog(`INITIATING DATA PIPELINE INGESTION...`, 'sys-output-line');
        appendLog(`[INFO] Fetching records from landing_db.users_activity...`, 'sys-info-line');
        
        let progress = 0;
        const progressLine = appendLog(`[INGEST] Loading Fabric OneLake: [░░░░░░░░░░] 0%`, 'sys-info-line');

        const interval = setInterval(() => {
            progress += 25;
            let blocks = '█'.repeat(progress / 10) + '░'.repeat(10 - progress / 10);
            progressLine.innerHTML = `[INGEST] Loading Fabric OneLake: [${blocks}] ${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressLine.remove();
                    appendLog(`[SUCCESS] 4,120 rows extracted and verified.`, 'sys-output-line');
                    appendLog(`[STAGE] Executing Python ETL data cleaning...`, 'sys-info-line');
                    appendLog(`[DAX ENGINE] Recalculating Fabric semantic models: COMPLETE`, 'sys-info-line');
                    appendLog(`[DEPLOY] Power BI Dashboard synchronized successfully. SLA target met.`, 'sys-output-line');
                    body.scrollTop = body.scrollHeight;
                }, 200);
            }
        }, 250);
    }

    function triggerAIAgents() {
        appendLog(`BOOTING CREWAI ORCHESTRATION ENGINE...`, 'sys-output-line');
        appendLog(`[AGENT] Spawning 'Data Analyst' and 'n8n Workflow Auditor' agents...`, 'sys-info-line');
        
        setTimeout(() => {
            appendLog(`[Data Analyst]: "I am scanning system performance logs for operational delays."`, 'sys-info-line');
            body.scrollTop = body.scrollHeight;
        }, 400);

        setTimeout(() => {
            appendLog(`[Workflow Auditor]: "Found manual provisioning leak in LMS. Mapping LangChain trigger."`, 'sys-info-line');
            body.scrollTop = body.scrollHeight;
        }, 1000);

        setTimeout(() => {
            appendLog(`[n8n core]: Executing automated HTTP POST webhook sequence...`, 'sys-output-line');
            appendLog(`[SUCCESS] CrewAI optimization pipeline terminated successfully.`, 'sys-output-line');
            appendLog(`[IMPACT] Reduced manual provisioning timeline by 35%.`, 'sys-info-line');
            body.scrollTop = body.scrollHeight;
        }, 1800);
    }

    function printMilestones() {
        appendLog(`==================== CORE CHRONOLOGY ====================`, 'sys-output-line');
        appendLog(`2024 - Present: Senior IT Analyst @ Think Power Solutions (Hyderabad - Remote)`, 'sys-info-line');
        appendLog(`   - Fabric dashboards architecture, containerized YOLOv8 MLOps.`, 'sys-muted');
        appendLog(`2023 - 2024: Lead Tech Specialist & Engineer @ SIFF Ventures (Bangalore)`, 'sys-info-line');
        appendLog(`   - Managed 8 technical engineers, AWS infrastructure, BI automation.`, 'sys-muted');
        appendLog(`2019 - 2023: Senior Engineer / Tech Specialist @ SIFF Ventures (Bangalore)`, 'sys-info-line');
        appendLog(`   - Automated support desk routing, built Excel analytics trackers.`, 'sys-muted');
        appendLog(`==========================================================`, 'sys-output-line');
    }

    function printContact() {
        appendLog(`=================== SMTP CONFIGURATION ===================`, 'sys-output-line');
        appendLog(`HOST: mirtunjai91221@gmail.com`, 'sys-info-line');
        appendLog(`PORT: +91 9162926783`, 'sys-info-line');
        appendLog(`SSO: linkedin.com/in/mirtunjai-kumar-anupam`, 'sys-info-line');
        appendLog(`REPO: github.com/mirtunjai-ops`, 'sys-info-line');
        appendLog(`BASE: Hyderabad, India`, 'sys-info-line');
        appendLog(`==========================================================`, 'sys-output-line');
    }
}

/* ==========================================================================
   6. Projects & Simulators Core Features
   ========================================================================== */
function initProjectSimulators() {
    // A. IRIS AI Drone Simulator Object Detection Sweep
    const irisBox = document.getElementById('iris-scanner');
    const simAssets = document.querySelectorAll('.sim-asset');
    
    if (irisBox) {
        irisBox.addEventListener('mouseenter', () => {
            // Sequentially scan and detect assets
            simAssets.forEach((asset, idx) => {
                setTimeout(() => {
                    asset.classList.add('detected');
                }, idx * 600);
            });
        });

        irisBox.addEventListener('mouseleave', () => {
            simAssets.forEach(asset => {
                asset.classList.remove('detected');
            });
        });
    }

    // B. n8n/CrewAI Multi-Node Workflow Executor
    const runWfBtn = document.getElementById('run-wf-demo-btn');
    const nodes = document.querySelectorAll('.wf-node');
    const lines = document.querySelectorAll('.node-connection-line');
    const detailText = document.getElementById('node-details-text');

    if (runWfBtn) {
        runWfBtn.addEventListener('click', () => {
            runWfBtn.disabled = true;
            runWfBtn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Orchestrating...";

            // Reset nodes
            nodes.forEach(node => {
                node.className = 'wf-node';
            });
            lines.forEach(line => line.classList.remove('animating'));

            // Step 1: Trigger active
            nodes[0].classList.add('active');
            detailText.innerHTML = "<strong>Status [1/4]</strong>: Webhook scheduled trigger detected. Fetching data...";
            
            // Step 2: Travel signal 1 -> Agent
            setTimeout(() => {
                lines[0].classList.add('animating');
            }, 600);

            // Step 3: Agent active
            setTimeout(() => {
                nodes[1].classList.add('agent-active');
                detailText.innerHTML = "<strong>Status [2/4]</strong>: CrewAI Agents activated. Analyzing unstructured data models.";
            }, 1400);

            // Step 4: Travel signal 2 -> LLM
            setTimeout(() => {
                lines[1].classList.add('animating');
            }, 2000);

            // Step 5: LLM API active
            setTimeout(() => {
                nodes[2].classList.add('llm-active');
                detailText.innerHTML = "<strong>Status [3/4]</strong>: Gemini / ChatGPT API pipeline engaged. Auto-generating dashboard summaries.";
            }, 2800);

            // Step 6: Travel signal 3 -> Target
            setTimeout(() => {
                lines[2].classList.add('animating');
            }, 3400);

            // Step 7: Completed Target active
            setTimeout(() => {
                nodes[3].classList.add('success-active');
                detailText.innerHTML = "<strong>Status [4/4]</strong>: Fabric semantic models updated. Power BI dashboards refreshed. SLA Met.";
                
                runWfBtn.disabled = false;
                runWfBtn.innerHTML = "<i class='bx bx-play-circle'></i> Execute Agentic Pipeline";
            }, 4200);
        });
    }
}

/* ==========================================================================
   7. Scroll Observer & Sticky Active Navbar Highlighter
   ========================================================================== */
function initScrollReveal() {
    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Reveal Timeline items
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15
    });

    revealItems.forEach(item => {
        observer.observe(item);
    });

    // Highlighter logic for Navigation active states
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}
