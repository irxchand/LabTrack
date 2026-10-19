import hero from '../../../public/labtrack_microcontroller.jpg';
import sensor from '../../../public/images/hardware/hcsr04-ultrasonic.jpg';
import arm from '../../../public/images/hardware/robotic-arm.jpg';

const table = (headers, rows) => `<table><thead><tr>${headers.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const steps = rows => `<ol class="sequence">${rows.map(([title, body]) => `<li><strong>${title}</strong><span>${body}</span></li>`).join('')}</ol>`;

export const slides = [
  // SLIDE 1: Title
  {
    title: 'LabTrack',
    section: 'Cloud Computing Essentials',
    kind: 'cover',
    time: '0:30',
    html: `
      <div class="cover-copy">
        <p class="eyebrow">CCE IMPLEMENTATION DEMONSTRATION</p>
        <h1>Lab<span>Track</span></h1>
        <p class="subtitle">Laboratory Requisition, Hardware Lifecycle &amp;<br>Cloud Deployment Architecture</p>
        <p class="small">Symbiosis Institute of Technology, Pune • Dept. of AI &amp; ML<br>Course: CCE • 19 October 2026</p>
      </div>
      <img class="cover-image" src="${hero}" alt="Microcontroller hardware">
      <div class="cover-label">Verified Local Runtime (:5173, :8000) • Proposed Target: Azure Container Apps</div>
    `,
    notes: 'Opening Pitch: Good morning Dr. Mahender Reddy. LabTrack is a laboratory hardware availability, approval, custody, and return platform. Today we demonstrate our verified local application (React 19 on :5173, FastAPI on :8000 with 22 SQLite tables, MongoDB Atlas cloud projections, and tested Gmail SMTP), and walk through our target cloud architecture on Azure Container Apps, mapped directly to Units 1-4 of the CCE syllabus.'
  },

  // SLIDE 2: Problem
  {
    title: 'Laboratory Hardware Governance Challenges',
    section: '01 / Problem Context',
    time: '0:45',
    html: `
      <p class="lead">University engineering laboratories experience inventory corruption, unauthorized custody, and uninspected returns.</p>
      ${steps([
        ['Dual Inventory Paradigms', 'Consumables (sensors, jumpers) exist in aggregate counts per lab. Serialized assets (Jetson Nano, robotic arms) require 1-to-1 SIT barcode tracking.'],
        ['Academic Approval Authority', 'Consumable kits require Faculty Mentor + HoD approval. Expensive physical assets strictly require Mentor + Lab In-Charge + HoD sign-off.'],
        ['Defective Return Math', 'Physical returns must be reconciled at the station: Q_good + Q_defective = Q_issued, preventing silent stock degradation.']
      ])}
      <div class="takeaway"><strong>Core Question:</strong> Can an academic institution track, approve, dispatch, and inspect hardware without inventory corruption?</div>
    `,
    notes: 'Focus on physical reality: HC-SR04 ultrasonic sensors vs Jetson Nano. Explain why academic custody cannot be solved by generic enterprise asset managers without hierarchical role approvals.'
  },

  // SLIDE 3: Why Cloud is Relevant to LabTrack
  {
    title: 'Why Cloud Computing is Essential for LabTrack',
    section: '01 / Cloud Relevance',
    time: '0:45',
    html: table(
      ['Academic Lab Reality', 'Traditional On-Premises Limitation', 'Cloud Computing Architectural Solution'],
      [
        ['Semester Peak Surges', 'Campus servers crash during project submission weeks', 'Elastic horizontal scaling (PaaS / Container Apps autoscaling)'],
        ['Cross-Department Labs', 'Siloed paper ledgers across AI, Robotics & E&TC', 'Centralized VPC with managed relational storage & global RBAC'],
        ['Hardware Damage Evidence', 'Local disk exhaustion from high-res inspection images', 'Object storage (Azure Blob Storage) with lifecycle tiering'],
        ['System Availability', 'Single server failure halts lab issue counters', 'Managed Multi-AZ database failover & container health restart']
      ]
    ) + `<div class="takeaway">Cloud computing transitions LabTrack from an isolated lab PC script into a resilient, department-wide managed platform.</div>`,
    notes: 'Viva question: Why not host LabTrack on a physical server in the lab? Answer: Lab workloads are seasonal with extreme submission-week peaks. On-prem servers lack managed multi-AZ high availability, elastic container scaling, and durable off-site object storage.'
  },

  // SLIDE 4: Computing Evolution → Cloud
  {
    title: 'Evolution of Distributed Computing to Cloud',
    section: '02 / CCE Unit 1 Foundation',
    time: '0:45',
    html: `
      <div class="architecture">
        <div>
          <span>PHASE 1</span>
          <h3>Mainframe &amp; Grid</h3>
          <p>Centralized batch compute; monolithic execution; hardware underutilization.</p>
        </div>
        <div>
          <span>PHASE 2</span>
          <h3>Virtualization (IaaS)</h3>
          <p>Hypervisors abstract physical hardware; multi-tenant VMs on pooled servers.</p>
        </div>
        <div>
          <span>PHASE 3</span>
          <h3>PaaS &amp; Containers</h3>
          <p>Process isolation via cgroups/namespaces; managed runtimes; declarative orchestration.</p>
        </div>
        <div>
          <span>PHASE 4</span>
          <h3>Serverless &amp; Cloud-Native</h3>
          <p>Event-driven micro-billing; zero idle cost; scale-to-zero serverless compute.</p>
        </div>
      </div>
      <div class="takeaway"><strong>NIST Cloud Characteristics:</strong> On-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service.</div>
    `,
    notes: 'Reference NIST SP 800-145. LabTrack leverages container-native PaaS (Azure Container Apps) which represents the modern evolution beyond raw hypervisor-level IaaS VMs.'
  },

  // SLIDE 5: LabTrack as the Running Cloud Example
  {
    title: 'LabTrack as the Running CCE Pedagogical Example',
    section: '02 / CCE Integration',
    time: '0:40',
    html: table(
      ['CCE Syllabus Concept', 'Theoretical Definition', 'LabTrack System Mapping'],
      [
        ['Unit 1: Cloud Models', 'IaaS vs PaaS vs SaaS, Public vs Hybrid', 'PaaS target (Azure Container Apps + Managed MySQL)'],
        ['Unit 2: Virtualization & Containers', 'Hypervisors vs OS-level container isolation', 'Docker image layers, cgroups, Compose local orchestration'],
        ['Unit 3: Cloud Native & CI/CD', 'Automated build, test, and release promotion', 'GitHub Actions CI (actual) → ACR image push (target CD)'],
        ['Unit 4: Security & Governance', 'Shared responsibility, perimeter WAF, RBAC', 'Azure App Gateway WAF_v2, JWT Bearer RBAC, Key Vault']
      ]
    ) + `<div class="takeaway">Every theoretical topic in Cloud Computing Essentials is demonstrated through LabTrack\'s code, runtime, and architecture design.</div>`,
    notes: 'Show the examiner that LabTrack is not a generic project; it was designed as a living case study to prove mastery over the entire CCE syllabus.'
  },

  // SLIDE 6: Current Local Architecture (Verified Reality)
  {
    title: 'Current Local Architecture (Verified Implementation)',
    section: '03 / Verified State',
    time: '0:50',
    html: `
      <div class="architecture">
        <div>
          <span>VERIFIED FRONTEND</span>
          <h3>React 19 + Vite 8</h3>
          <p>Tailwind v4, Three.js 3D lab layout. Runs on <code>localhost:5173</code> with full student/faculty role views.</p>
        </div>
        <div>
          <span>VERIFIED BACKEND</span>
          <h3>FastAPI 0.115 + Python 3.12</h3>
          <p>Uvicorn ASGI on <code>127.0.0.1:8000</code>. Pydantic validation, Alembic, OpenAPI Swagger live.</p>
        </div>
        <div>
          <span>VERIFIED SQL RELATIONAL</span>
          <h3>SQLite (22 Tables)</h3>
          <p>Located at <code>.local/labtrack.db</code>. Holds users, projects, hardware catalog, requisitions, audit logs.</p>
        </div>
        <div>
          <span>ACTUAL CLOUD MONGO</span>
          <h3>MongoDB Atlas</h3>
          <p>Actual external cloud DB reachable. 7 verified collections for notification read models and event projections.</p>
        </div>
      </div>
      <div class="takeaway"><strong>Architectural Truth:</strong> Not microservices. Modular service architecture: React UI + FastAPI API + SQLite Relational + Cloud Mongo Atlas + Tested Gmail SMTP.</div>
    `,
    notes: 'Be 100% honest: SQLite holds 22 relational tables locally; MongoDB Atlas is an actual external cloud database (not Azure Cosmos DB); Gmail SMTP is an external managed email dependency.'
  },

  // SLIDE 7: Docker Architecture & Containerization
  {
    title: 'Containerization & Docker Architecture',
    section: '03 / Containerization',
    time: '0:45',
    html: `
      <p class="lead">Containerization packages application code and runtime dependencies into immutable, reproducible artifacts.</p>
      ${steps([
        ['Source Code to Dockerfile', 'Declarative definition of base OS, Python 3.12 dependencies, and non-root execution context.'],
        ['Multi-Stage Build Pattern', 'Stage 1 builds frontend static bundles; Stage 2 injects assets into lean Python runtime, slashing image size.'],
        ['Docker Compose Orchestration', 'Defines local multi-container network, persistent volume mounts, and service startup ordering.']
      ])}
      <div class="takeaway"><strong>Status Note:</strong> Containerization architecture implemented in repository (Dockerfile, compose.yaml); full runtime validation pending on local host.</div>
    `,
    notes: 'Explain multi-stage builds: separates build-time tools from runtime image, reducing attack surface and image size. Clearly state: containerization architecture is implemented in the repo, but full local Docker runtime validation is pending.'
  },

  // SLIDE 8: What Each Docker Service Does
  {
    title: 'Repository compose.yaml: Service Roles',
    section: '03 / Docker Stack',
    time: '0:50',
    html: table(
      ['Service', 'Role & Responsibility', 'Storage / Networking', 'Target Cloud Equivalent'],
      [
        ['mysql', 'Relational transactional database for inventory state', 'Named persistent volume; private port 3306', 'Azure Database for MySQL Flexible Server'],
        ['mongo', 'Document store for notifications & event projections', 'Persistent volume mount; port 27017', 'MongoDB Atlas / Azure Cosmos DB (Mongo API)'],
        ['migrate', 'Runs Alembic schema migrations; exits on success', 'Ephemeral container; depends_on mysql healthy', 'Release phase task / init job in CI/CD'],
        ['api', 'FastAPI application serving REST endpoints', 'Exposed port 8000; non-root user execution', 'Azure Container Apps (FastAPI container)'],
        ['worker', 'Asynchronous background processor (outbox dispatch)', 'Internal network; polls outbox tables', 'Azure Container Apps (Background worker replica)']
      ]
    ) + `<p class="footnote">Services communicate across an isolated internal Docker bridge network (labtrack-network).</p>`,
    notes: 'Explain startup order: mysql/mongo spin up -> healthchecks pass -> migrate runs Alembic up to head -> api and worker launch. None of these 5 services are independent microservices; they are modular components of one platform.'
  },

  // SLIDE 9: Containerization vs Virtualization
  {
    title: 'Containerization vs. Virtualization (CCE Unit 2)',
    section: '04 / CCE Unit 2 Deep Dive',
    time: '0:45',
    html: table(
      ['Dimension', 'Type-1 / Type-2 Hypervisor VMs (IaaS)', 'OS-Level Containerization (Docker)'],
      [
        ['Kernel & OS', 'Each VM runs a full guest operating system kernel', 'Containers share host Linux kernel; isolated via namespaces/cgroups'],
        ['Startup Latency', 'Minutes (full OS boot, init, service initialization)', 'Milliseconds (direct process fork inside cgroup namespace)'],
        ['Resource Overhead', 'Gigabytes per VM; high memory & CPU virtualization penalty', 'Megabytes per container; bare-metal near-native execution speed'],
        ['Portability', 'VM disk images (OVF/VHD) are large (10-50GB) and hypervisor-bound', 'Docker OCI image layers (100-300MB) run on any OCI runtime (ACR/ACA)'],
        ['Security Boundary', 'Strong hardware virtualization boundary (VT-x/AMD-V)', 'Process isolation; requires non-root user (uid 10001) & dropped caps']
      ]
    ) + `<div class="takeaway">LabTrack uses containers because rapid scaling, small image sizes, and consistent developer-to-cloud promotion outweigh VM isolation overhead.</div>`,
    notes: 'Viva question: How does Docker achieve process isolation? Answer: Linux kernel namespaces (PID, NET, IPC, MNT, UTS) provide isolated views; cgroups (control groups) limit and meter CPU, memory, and I/O.'
  },

  // SLIDE 10: IaaS vs PaaS vs SaaS — LabTrack Mapping
  {
    title: 'Service Models: IaaS vs. PaaS vs. SaaS (CCE Unit 1)',
    section: '04 / Cloud Service Models',
    time: '0:45',
    html: table(
      ['Model', 'Management Scope (You Manage vs Cloud Manages)', 'LabTrack Architectural Mapping'],
      [
        ['IaaS (Infrastructure as a Service)', 'Cloud manages hardware & hypervisor. You manage OS, patching, runtimes, scaling, and backups.', 'AWS EC2 or Azure VMs (Rejected: high OS patching and operational maintenance overhead).'],
        ['PaaS (Platform as a Service)', 'Cloud manages OS, runtime, autoscaling, patching, and HA. You manage application code and data.', 'SELECTED TARGET: Azure Container Apps + Azure DB for MySQL Flexible Server.'],
        ['SaaS (Software as a Service)', 'Cloud manages entire stack, infrastructure, application code, and delivery.', 'EXTERNAL SERVICES: Gmail SMTP for notification delivery; MongoDB Atlas cloud service.']
      ]
    ) + `<div class="takeaway">By targeting PaaS, LabTrack eliminates OS maintenance while retaining full container-level code control.</div>`,
    notes: 'Examiner favorite: Classify every piece of LabTrack into IaaS/PaaS/SaaS. Answer: Infrastructure is PaaS (Azure Container Apps, Azure DB for MySQL), third-party utilities are SaaS (Gmail, Atlas), raw IaaS VMs are avoided.'
  },

  // SLIDE 11: Why Azure as the Target Cloud Provider
  {
    title: 'Why Microsoft Azure as the Proposed Cloud Target?',
    section: '05 / Proposed Architecture',
    time: '0:40',
    html: `
      <div class="architecture">
        <div>
          <span>CONTAINER APPS</span>
          <h3>Serverless Containers</h3>
          <p>Micro-billing; scales to zero; built-in ingress; revision management without Kubernetes complexity.</p>
        </div>
        <div>
          <span>SECURITY PERIMETER</span>
          <h3>App Gateway WAF_v2</h3>
          <p>OWASP Core Rule Set 3.2; deep inspection of incoming HTTP payloads before reaching containers.</p>
        </div>
        <div>
          <span>ENTERPRISE IDENTITY</span>
          <h3>Microsoft Entra ID / RBAC</h3>
          <p>Native campus Active Directory federation for university students, faculty, and administrative staff.</p>
        </div>
        <div>
          <span>MANAGED DATA</span>
          <h3>Flexible Server MySQL</h3>
          <p>Automated backups, zone-redundant high availability, private VNet endpoints, and SSL enforcement.</p>
        </div>
      </div>
      <div class="takeaway"><strong>Design Rationale:</strong> Azure Container Apps provides container-native abstractions, canary revisions, and native WAF integration without raw K8s management fees.</div>
    `,
    notes: 'Explain why Azure Container Apps beats self-managed Kubernetes: K8s incurs ~$75/month control plane cost + etcd management overhead. ACA runs on managed serverless microVMs with zero control plane charge.'
  },

  // SLIDE 12: Proposed Azure Architecture (Target Design)
  {
    title: 'Proposed Azure Target Deployment Architecture',
    section: '05 / Target Cloud Architecture',
    time: '0:50',
    html: `
      <div class="split">
        <div>
          <p class="eyebrow">EDGE &amp; NETWORK INGRESS</p>
          <ul style="color:#eceae4;line-height:1.7;font-size:18px;">
            <li><strong>User Client:</strong> Browser reaches Vercel-hosted React frontend over HTTPS.</li>
            <li><strong>WAF Layer:</strong> Azure Application Gateway WAF_v2 inspects REST API calls.</li>
            <li><strong>Ingress:</strong> TLS termination; forwards clean traffic to internal VNet.</li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">COMPUTE &amp; PERSISTENCE TIER</p>
          <ul style="color:#eceae4;line-height:1.7;font-size:18px;">
            <li><strong>Container Host:</strong> Azure Container Apps runs FastAPI API &amp; background worker.</li>
            <li><strong>Relational DB:</strong> Azure Database for MySQL Flexible Server (Private Link).</li>
            <li><strong>Object Store:</strong> Azure Blob Storage for hardware inspection photo evidence.</li>
            <li><strong>Secrets:</strong> Azure Key Vault injects DB credentials and JWT signing keys.</li>
          </ul>
        </div>
      </div>
      <div class="takeaway"><strong>Transparent Notice:</strong> TARGET ARCHITECTURE ONLY. No Azure resources are currently provisioned (no Bicep/Terraform). Application is currently verified locally.</div>
    `,
    notes: 'Highlight VNet isolation: The MySQL database and Key Vault have no public IP addresses; they are accessible only via Azure Private Link from the Container Apps environment.'
  },

  // SLIDE 13: Azure Service-by-Service Breakdown
  {
    title: 'Target Cloud Services: Technical Specifications',
    section: '05 / Target Cloud Architecture',
    time: '0:50',
    html: table(
      ['Service Name', 'Category', 'LabTrack Hosted Component', 'Communication & Security'],
      [
        ['Vercel', 'Edge CDN / PaaS', 'React 19 Frontend static SPA build', 'HTTPS to browser; API calls routed to Azure App Gateway'],
        ['Azure App Gateway WAF_v2', 'Perimeter Security', 'HTTP payload inspection & reverse proxy', 'OWASP CRS 3.2 ruleset; TLS 1.3 termination'],
        ['Azure Container Apps (ACA)', 'Managed PaaS Compute', 'FastAPI REST API & Async Outbox Worker', 'Internal VNet ingress; revision-based deployment'],
        ['Azure Container Registry (ACR)', 'Private Artifact Store', 'Immutable Docker OCI container images', 'Vulnerability scanning; RBAC pull via Managed Identity'],
        ['Azure DB for MySQL Flex', 'Managed Relational DB', 'Authoritative business & transactional data', 'Private Endpoint; SSL/TLS enforced; automated backup'],
        ['Azure Blob Storage', 'Object Storage (IaaS/PaaS)', 'Inspection photos & physical return damage records', 'Shared Access Signatures (SAS); encrypted at rest']
      ]
    ) + `<p class="footnote">Azure Monitor &amp; Application Insights collect distributed traces; Azure Key Vault injects runtime secrets.</p>`,
    notes: 'Be prepared to explain why frontend is separated to Vercel while backend is on Azure: static SPA assets benefit from global Edge CDN points-of-presence, while Python backend requires private relational data proximity.'
  },

  // SLIDE 14: Data Architecture: Polyglot Persistence
  {
    title: 'Data Architecture: Relational Authority & Projections',
    section: '06 / Data Management',
    time: '0:45',
    html: `
      <div class="split">
        <div>
          <p class="eyebrow">RELATIONAL ACID STORE (SQL)</p>
          <p><strong>Authoritative Single Source of Truth</strong></p>
          <ul style="color:#eceae4;line-height:1.6;font-size:18px;">
            <li>22 tables (Users, Projects, Assets, Allocations, Outbox, Audit).</li>
            <li>Enforces foreign keys, row-level locks, and ACID transactions.</li>
            <li>Stock decrement and return reconciliation execute atomically.</li>
            <li><em>Local: SQLite • Target: Azure MySQL Flexible Server.</em></li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">DOCUMENT PROJECTION STORE (NOSQL)</p>
          <p><strong>CQRS Read-Optimized Views</strong></p>
          <ul style="color:#eceae4;line-height:1.6;font-size:18px;">
            <li>7 verified collections in reachable MongoDB Atlas cloud.</li>
            <li>Stores user notification feeds, audit timelines, and analytics.</li>
            <li>Asynchronous updates prevent slow queries on the transactional core.</li>
            <li><em>Never used as a secondary source of inventory truth.</em></li>
          </ul>
        </div>
      </div>
      <div class="takeaway"><strong>Architectural Rule:</strong> Inventory counts and approvals never mutate in MongoDB; transactional integrity is strictly owned by SQL.</div>
    `,
    notes: 'Viva question: Why use both SQL and MongoDB? Answer: Polyglot persistence. SQL provides ACID guarantees for zero-loss stock transactions; MongoDB provides schema-free, read-optimized document projections for notifications and audit timelines.'
  },

  // SLIDE 15: CI/CD Pipeline: Actual CI vs Proposed CD
  {
    title: 'CI/CD Pipeline: Automated Quality & Promotion',
    section: '07 / DevOps & Lifecycle',
    time: '0:45',
    html: `
      <div class="architecture">
        <div>
          <span>ACTUAL CI</span>
          <h3>GitHub Actions</h3>
          <p>Runs on push/PR to <code>main</code>. Lints code, executes 61 pytest suites, builds React production bundle.</p>
        </div>
        <div>
          <span>TARGET STEP 1</span>
          <h3>Docker OCI Build</h3>
          <p>Multi-stage build compiles lean backend image; tags with Git SHA and semver release.</p>
        </div>
        <div>
          <span>TARGET STEP 2</span>
          <h3>Push to ACR</h3>
          <p>Pushes verified container image to Azure Container Registry; vulnerability scanner runs.</p>
        </div>
        <div>
          <span>TARGET CD</span>
          <h3>Revision Deploy</h3>
          <p>Triggers Azure Container Apps new revision; conducts readiness probes before routing traffic.</p>
        </div>
      </div>
      <div class="takeaway"><strong>Truthful Distinction:</strong> CI is ACTUAL (GitHub Actions verifies code today). CD is PROPOSED (Automated cloud promotion is target design).</div>
    `,
    notes: 'Be exact: Our repository contains an active GitHub Actions workflow (validate.yml) that runs backend tests and frontend build. It does NOT deploy to Azure yet; CD is the planned future phase.'
  },

  // SLIDE 16: Deployment Lifecycle & Container Promotion
  {
    title: 'Container Lifecycle & Promotion Strategy',
    section: '07 / DevOps & Lifecycle',
    time: '0:40',
    html: `
      <p class="lead">From local developer workstation to resilient cloud production:</p>
      ${steps([
        ['Local Development', 'Developer iterates on code with local SQLite and Vite HMR; runs unit test suite locally.'],
        ['Immutable Artifact Build', 'CI runner builds Docker image containing exact Python runtime and pinned dependencies.'],
        ['Registry Staging (ACR)', 'Image signed and stored in private registry; versioned by immutable Git commit hash.'],
        ['Canary Traffic Routing', 'Azure Container Apps provisions Revision B alongside Revision A; runs health probes before shifting 100% traffic.']
      ])}
      <div class="takeaway"><strong>Immutability Guarantee:</strong> The exact container image verified in testing is what runs in deployment; zero configuration drift.</div>
    `,
    notes: 'Explain configuration drift: Without containers, server environments drift due to OS patches or package updates. Container images guarantee that what passed in CI runs identically in production.'
  },

  // SLIDE 17: Release Failure & Recovery Scenario
  {
    title: 'Release Failure & Recovery (Simulated Case Study)',
    section: '08 / Reliability Engineering',
    time: '0:50',
    html: `
      <div class="lifecycle">
        <p><b>01</b> Feature developed locally &amp; passes unit test suite.</p>
        <p><b>02</b> Docker image built and deployed as Azure Container Apps <strong>Revision 2</strong>.</p>
        <p><b>03</b> Startup probe passes, but readiness health check <strong>FAILS</strong> (missing DB secret in Key Vault).</p>
        <p><b>04</b> ACA traffic router detects failure: <strong>Zero traffic routed to Revision 2</strong>.</p>
        <p><b>05</b> 100% user traffic safely remains on <strong>Revision 1 (Stable)</strong>. Zero student downtime.</p>
        <p><b>06</b> Telemetry inspected in Azure Monitor; configuration fixed; Revision 3 successfully deployed.</p>
      </div>
      <div class="takeaway"><strong>Reliability Concept:</strong> Revision isolation, health probes, and automatic fallback prevent bad releases from causing production outages. (Simulated scenario for CCE study).</div>
    `,
    notes: 'Emphasize: This is a simulated architectural scenario explaining cloud resilience. It proves why Container Apps revision management is superior to in-place VM patching.'
  },

  // SLIDE 18: Security Architecture: WAF, IAM & Secrets
  {
    title: 'Cloud Security Architecture (CCE Unit 4)',
    section: '09 / Security & Governance',
    time: '0:45',
    html: table(
      ['Security Pillar', 'Target Cloud Control', 'Implementation Mechanism'],
      [
        ['Perimeter / WAF', 'Azure Application Gateway WAF_v2', 'Inspects HTTP traffic; blocks SQL injection, XSS, and malformed JSON before hitting containers.'],
        ['Identity & Access (IAM)', 'RBAC + OAuth2 / JWT Bearer', 'FastAPI dependencies verify role claims (Student, Faculty, Lab In-Charge, HoD). Least privilege enforced.'],
        ['Secret Management', 'Azure Key Vault', 'Zero hardcoded secrets. Database passwords and JWT keys injected at container runtime via Managed Identity.'],
        ['Data in Transit & Rest', 'TLS 1.3 + AES-256', 'Strict HTTPS externally; TLS to MySQL database; Transparent Data Encryption (TDE) at rest.'],
        ['Integrity Verification', 'NIST FIPS 180-4 SHA-256', 'One-way checksum digests for barcode verification and audit logs (NOT used for password encryption).']
      ]
    ) + `<div class="takeaway">Security in depth: Perimeter WAF → Container RBAC → Secret Vault → Encrypted Storage.</div>`,
    notes: 'Shared Responsibility Model (Unit 4): In PaaS, Microsoft secures physical servers, hypervisor, and network virtualization. LabTrack secures application logic, RBAC policies, and database records.'
  },

  // SLIDE 19: Monitoring & Observability
  {
    title: 'Cloud Monitoring & Observability (CCE Unit 4)',
    section: '09 / Security & Governance',
    time: '0:40',
    html: `
      <div class="architecture">
        <div>
          <span>METRICS</span>
          <h3>Azure Monitor</h3>
          <p>Tracks container CPU/memory utilization, request rates, HTTP 4xx/5xx error spikes, and active replica counts.</p>
        </div>
        <div>
          <span>LOGGING</span>
          <h3>Log Analytics</h3>
          <p>Centralized stdout/stderr container logs; searchable via Kusto Query Language (KQL) for audit analysis.</p>
        </div>
        <div>
          <span>TRACING</span>
          <h3>Application Insights</h3>
          <p>End-to-end distributed tracing across API calls, database queries, and background worker queue latency.</p>
        </div>
        <div>
          <span>ALERTING</span>
          <h3>Action Groups</h3>
          <p>Automated alerts trigger email notifications to lab administrators on error threshold breaches.</p>
        </div>
      </div>
      <div class="takeaway"><strong>Observability Rule:</strong> Telemetry is externalized to cloud monitors so container restarts never destroy diagnostic history.</div>
    `,
    notes: 'Explain why container logs must be externalized: Containers are ephemeral; when a container dies, its local filesystem is destroyed. Log Analytics persists logs indefinitely.'
  },

  // SLIDE 20: Cost & Scalability Considerations
  {
    title: 'Cost Optimization & Scalability Strategy (CCE Unit 3)',
    section: '10 / Cloud Economics',
    time: '0:45',
    html: table(
      ['Dimension', 'Traditional Always-On VMs (IaaS)', 'Target Azure Serverless Containers (PaaS)'],
      [
        ['Idle University Hours', 'Billed 24/7/365 at full rate even at 2 AM or semester breaks', 'Scale-to-zero when no lab requisitions occur; zero compute cost during vacation'],
        ['Semester Peak Weeks', 'VM CPU pegs at 100%; requires manual resizing and downtime', 'Autoscales horizontal container replicas based on concurrent HTTP request count'],
        ['Database Sizing', 'Fixed provisioned server requiring upfront capital expenditure', 'Azure MySQL Flexible Server: Burstable B-series for cost-efficient academic budgets'],
        ['Control Plane Cost', 'Managed Kubernetes (AKS) cluster overhead costs ~$75/month', 'Azure Container Apps charges zero cluster management fee; pay only for active vCPU/GiB-s']
      ]
    ) + `<div class="takeaway">PaaS serverless container architecture aligns cloud operational costs directly with the academic calendar.</div>`,
    notes: 'Discuss cloud cost governance (Unit 3): Tagging resources by department (AI/ML vs Robotics) and setting monthly spending budgets with Azure Cost Management alerts.'
  },

  // SLIDE 21: Literature Review & Industry Comparisons
  {
    title: 'Literature Review: Existing Systems & Patterns',
    section: '11 / Literature Review',
    time: '0:45',
    html: table(
      ['System / Standard', 'Core Mechanism Analyzed', 'LabTrack Distinct Academic Innovation'],
      [
        ['Snipe-IT', 'Enterprise IT asset check-in/out, consumable tracking, email alerts', 'Lacks academic multi-tier project-centric approval hierarchies (Mentor + Lab In-Charge + HoD).'],
        ['GLPI', 'ITIL service management, ticketing, time-slot reservations', 'Complex ticketing model; lacks lab-aware physical return inspection and reconciliation math.'],
        ['AWS Prescriptive Guidance', 'Transactional Outbox pattern to solve dual-write distributed database problems', 'Adopted by LabTrack: SQL commits business state first; worker processes outbox asynchronously.'],
        ['RFC 5321 (SMTP)', 'Defines mail transport as best-effort delivery, not a durable transactional log', 'Separates transactional inventory commits from external email dispatch via background worker.']
      ]
    ) + `<p class="footnote">Full literature review: presentations/cce-v3/LITERATURE.md.</p>`,
    notes: 'Emphasize: We do not claim LabTrack is the first inventory tool. We show that existing enterprise tools lack academic course-project approval matrices and physical return inspection reconciliation.'
  },

  // SLIDE 22: CCE Syllabus Comprehensive Mapping
  {
    title: 'CCE Syllabus Comprehensive Mapping',
    section: '12 / Academic Alignment',
    time: '0:45',
    html: table(
      ['Syllabus Unit', 'Prescribed Topics', 'LabTrack Implementation & Architectural Evidence'],
      [
        ['Unit 1: Cloud Architecture', 'Evolution, NIST definitions, IaaS/PaaS/SaaS, elasticity, resource pooling', 'Slides 4, 10; PaaS target on Azure Container Apps; elasticity via replica scaling.'],
        ['Unit 2: Virtualization & Containers', 'Hypervisors, VMs vs containers, cgroups, namespaces, storage/network virtualization', 'Slides 7, 8, 9; Multi-stage Dockerfile, compose.yaml bridge network, named volumes.'],
        ['Unit 3: Cloud Native & CI/CD', 'Compute, storage, managed DBs, CI/CD pipelines, resource allocation, cost optimization', 'Slides 12, 13, 15, 20; GitHub Actions CI, VNet routing, Flexible Server MySQL, cost modeling.'],
        ['Unit 4: Cloud Security & Governance', 'Shared responsibility, WAF, RBAC, least privilege, Key Vault, audit logs, monitoring', 'Slides 14, 18, 19; App Gateway WAF_v2, JWT Bearer RBAC, Azure Key Vault, Azure Monitor.']
      ]
    ) + `<div class="takeaway">LabTrack serves as a practical, working software artifact embodying every core module of the CCE syllabus.</div>`,
    notes: 'Walk Dr. Reddy directly through the four units. This proves the academic rigor of the project for 2-credit CCE evaluation.'
  },

  // SLIDE 23: Current Implementation Status (Truth Matrix)
  {
    title: 'Current Implementation Status (Truth Matrix)',
    section: '13 / Engineering Truthfulness',
    time: '0:50',
    html: table(
      ['Tier / Component', 'Classification Category', 'Empirical Verification Evidence'],
      [
        ['React 19 + Vite 8 UI', 'A. Implemented &amp; B. Running Locally', 'Running at localhost:5173 (Student, Faculty, Lab Assistant, HoD, 3D lab layout)'],
        ['FastAPI 0.115 Backend', 'A. Implemented &amp; B. Running Locally', 'Running at 127.0.0.1:8000; OpenAPI Swagger interactive docs; 61 test suites passing'],
        ['SQLite Relational Database', 'A. Implemented &amp; B. Running Locally', 'Located at .local/labtrack.db; 22 verified database tables populated with academic seed data'],
        ['MongoDB Atlas Document DB', 'A. Implemented &amp; B. External Cloud Live', 'Actual cloud database reachable; 7 collections verified for read-model projections'],
        ['Docker Containerization', 'C. Implemented in Repo (Pending Local Runtime)', 'Dockerfile &amp; compose.yaml exist; full Docker runtime verification pending host daemon setup'],
        ['Azure Cloud Deployment', 'D. Proposed Target Architecture', 'Comprehensive architectural design; zero cloud resources currently provisioned'],
        ['Release Rollback Scenario', 'E. Simulated Case Study', 'Reliability failure model based on Azure Container Apps revision isolation behavior']
      ]
    ) + `<div class="takeaway">Strict academic integrity: Running software is shown on localhost; cloud resources are presented as target engineering designs.</div>`,
    notes: 'This slide demonstrates total engineering maturity. Evaluators give high marks to students who clearly differentiate running software from proposed architecture.'
  },

  // SLIDE 24: Live Demonstration Flow (Localhost)
  {
    title: 'Live Demonstration Flow (Localhost Execution)',
    section: '14 / Running Example',
    kind: 'demo',
    time: '4:00',
    html: `
      <p class="lead">The live demonstration showcases verified local software across interface and server layers.</p>
      <div class="demo-layout">
        <div>
          ${steps([
            ['Step 1: Visual Operator Interface', 'Open localhost:5173: Explore department hardware catalog, 3D lab layout, and role dashboards.'],
            ['Step 2: Interactive API Documentation', 'Open 127.0.0.1:8000/docs: Inspect FastAPI OpenAPI Swagger with authenticated JWT Bearer session.'],
            ['Step 3: Submit & Approve Requisition', 'Authenticate as DEMO-STU-001; submit hardware requisition; approve via mentor route (DEMO-FAC-001).'],
            ['Step 4: Inspect Database & Outbox Audit', 'Inspect updated SQLite inventory counts and outbox event records created by the transaction.']
          ])}
        </div>
        <div class="demo-launch">
          <span class="demo-time">4 min</span>
          <a class="primary" data-demo="ui" target="_blank" rel="noopener">Open UI (:5173) ↗</a>
          <a data-demo="api" target="_blank" rel="noopener">Open Swagger (:8000) ↗</a>
          <p>Login: <code>DEMO-STU-001</code> / <code>DemoOnly2026!</code><br>FastAPI Docs: <code>127.0.0.1:8000/docs</code></p>
        </div>
      </div>
    `,
    notes: 'Launch the demo using the on-screen buttons. First show the polished UI on 5173, then switch to Swagger at 8000/docs to show the verified server transaction.'
  },

  // SLIDE 25: Limitations & Next Deployment Steps
  {
    title: 'Known Limitations & Cloud Implementation Roadmap',
    section: '15 / Forward Roadmap',
    time: '0:45',
    html: table(
      ['Phase', 'Engineering Milestone', 'Technical Scope & Objective'],
      [
        ['Phase 1 (Immediate)', 'Full UI-to-API Client Integration', 'Replace browser localStorage mock writes with direct FastAPI endpoints and Bearer JWT tokens.'],
        ['Phase 2 (Immediate)', 'Local Docker Runtime Validation', 'Configure local Docker daemon, finalize SQL environment variables, and verify 5-container compose stack.'],
        ['Phase 3 (Target Cloud)', 'Bicep / Terraform IaC Authoring', 'Codify Azure target architecture (VNet, App Gateway WAF_v2, ACA Environment, Key Vault, MySQL).'],
        ['Phase 4 (Target Cloud)', 'GitHub Actions CD Pipeline', 'Automate Docker build, image push to ACR, and zero-downtime revision deployment to Azure Container Apps.']
      ]
    ) + `<div class="takeaway">A credible engineering roadmap moving LabTrack systematically from local verification to automated cloud deployment.</div>`,
    notes: 'Highlight that having a realistic, prioritized technical backlog is standard professional engineering practice.'
  },

  // SLIDE 26: Conclusion & Viva Discussion
  {
    title: 'Conclusion & Viva Discussion',
    section: '16 / Viva Defense',
    kind: 'closing',
    time: '0:30',
    html: `
      <div class="big-statement">Tested Local Foundation.<br><em>Target Cloud Architecture.</em></div>
      <p class="lead">LabTrack demonstrates verified hardware requisition workflows, role authorization, and relational transaction integrity locally, with a fully articulated Azure Container Apps deployment architecture mapped to CCE Units 1–4.</p>
      <div class="discussion">
        <span>Why PaaS over IaaS / K8s?</span>
        <span>How does Outbox prevent dual writes?</span>
        <span>How does WAF protect the API?</span>
        <span>How do ACA revisions enable rollback?</span>
      </div>
    `,
    notes: 'Conclude and invite questions from Dr. Mahender Reddy and committee members. The four prompts on screen guide the faculty to ask questions you have thoroughly prepared for.'
  }
];
