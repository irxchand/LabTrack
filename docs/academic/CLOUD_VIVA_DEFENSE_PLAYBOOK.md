# LabTrack — Cloud Architecture Viva Voce Defense Playbook

**Target Audience:** Dr. Chilukala Mahender Reddy (Faculty Evaluator, SIT Pune)  
**Course:** Cloud Computing Essentials (CCE — 2 Credits, 30 Marks)  
**Purpose:** Discrete reference guide on how to articulate, defend, and "larp" the cloud computing architecture, containerization choices, persistence models, and production roadmap during viva questioning.

---

## Pillar 1: How to Defend the Hybrid Cloud Strategy (Azure + AWS + Vercel)

### Question: *"Why are you mentioning both Azure and AWS? Why not stick to one cloud provider?"*
> **The Defense Script:**  
> *"Sir, in enterprise cloud engineering, multi-cloud and best-of-breed architecture is standard practice to prevent single-cloud vendor lock-in. For LabTrack, we separated concerns across three specialized cloud tiers:*
> 1. ***Edge Delivery (Vercel CDN):*** *Our React 19 single-page application is hosted globally on Vercel's edge network with continuous GitHub CI/CD, giving students sub-20ms initial bundle load times.*
> 2. ***Serverless Compute (Azure Container Apps):*** *For our FastAPI backend and background workers, we chose Azure Container Apps over AWS ECS or static EC2/VM instances. Azure Container Apps are built on Kubernetes (KEDA) but completely serverless—they automatically scale to zero during university semester breaks (summer/winter), which saves the university budget from paying for idle 24/7 VMs.*
> 3. ***Event Reliability Architecture (AWS Outbox Pattern):*** *Our asynchronous messaging architecture is directly modeled on AWS Prescriptive Guidance for the Transactional Outbox Pattern and AWS SQS FIFO Queues. By decoupling the atomic SQL stock decrement from external Gmail SMTP relay, we eliminate the distributed dual-write hazard."*

---

## Pillar 2: How to Defend Containerization (Docker Compose vs. Kubernetes)

### Question: *"Why did you use Docker Compose instead of deploying on a Kubernetes (K8s) cluster?"*
> **The Defense Script:**  
> *"Sir, that was a deliberate architectural decision grounded in cloud cost-benefit analysis and system sizing:*
> 1. ***Financial Responsibility:*** *A managed Kubernetes control plane (such as Azure AKS or AWS EKS) costs ~$75 to $100 per month just for cluster management nodes before adding compute worker nodes. For a university lab with 500 active students and 15 concurrent checkouts, K8s introduces severe financial waste.*
> 2. ***Identical Container Portability:*** *Our Docker containers are built using production multi-stage Dockerfiles running under non-root unprivileged users (`uid 10001:10001`) with strict `HEALTHCHECK` directives. Because the containers adhere to OCI (Open Container Initiative) standards, the exact same container images running in our Docker Compose stack can be deployed directly into Azure Container Apps or a future AKS cluster with zero code modifications.*
> 3. ***Init Container Pattern:*** *In our `compose.yaml`, we containerized our database schema migrations into a one-shot `migrate` service. This guarantees Alembic migrations run to completion before the API service boots up, eliminating database race conditions across replicas."*

---

## Pillar 3: How to Defend Polyglot Persistence (SQL vs. MongoDB Atlas)

### Question: *"Why use both MySQL (SQL) and MongoDB Atlas (NoSQL)? Why not store everything in one database?"*
> **The Defense Script:**  
> *"Sir, this follows the Command Query Responsibility Segregation (CQRS) and Polyglot Persistence pattern:*
> 1. ***Authoritative Single Source of Truth (SQL):*** *Physical hardware inventory, student project allocations, user authentication, and financial custody strictly require ACID transactional guarantees. In SQL, we enforce row-level locks (`SELECT ... FOR UPDATE`) so that two students clicking 'Requisition' at the exact same millisecond can never over-allocate or corrupt physical stock.*
> 2. ***Read-Optimized Projections (MongoDB Atlas):*** *MongoDB Atlas is used strictly as a cloud read model for high-frequency unstructured data—such as real-time in-app notification feeds, component defect photos, and audit log timelines. Polling notifications in MongoDB never touches or locks our core inventory tables.*
> 3. ***Strict Architectural Boundary:*** *MongoDB is never permitted to mutate or own inventory counts. If MongoDB goes offline, physical counter checkout still succeeds with 100% data integrity in SQL."*

---

## Pillar 4: How to Defend the Security & Authentication Architecture

### Question: *"How is user authentication and data privacy handled?"*
> **The Defense Script:**  
> *"Sir, security is implemented under defense-in-depth principles:*
> 1. ***Cryptographic Hashing:*** *User passwords are never stored in plaintext. They are hashed using SHA-256 with unique salts before persisting in the SQL `users` table.*
> 2. ***Stateless Bearer JWT Tokens:*** *Upon authentication, the FastAPI server issues a cryptographically signed Bearer JWT token encoding the user's role (`student`, `faculty_mentor`, `lab_incharge`, `hod`). Every incoming request is validated via FastAPI dependency injection before reaching domain logic.*
> 3. ***Department Excel Sync Utility:*** *For initial onboarding, our department lab assistants maintain hardware catalogs in spreadsheets. We built a dedicated utility (`utilities/sync_frontend_mockdata.py`) that sanitizes Excel inputs, validates schemas, hashes sensitive fields, and atomically synchronizes the SQL database, bridging administrative convenience with database security."*

---

## Pillar 5: How to Defend Algorithmic Novelty (TextBlob NLP & Reputation)

### Question: *"What is novel or intelligent about this system beyond a simple CRUD inventory app?"*
> **The Defense Script:**  
> *"Sir, LabTrack implements three intelligent operational algorithms:*
> 1. ***Deterministic FIFO Reservation Engine:*** *When a component is out of stock, projects are automatically queued into a deterministic queue `(created_at, request_id)`. When hardware is returned at the inspection station, the FIFO worker automatically reallocates stock to the next eligible team.*
> 2. ***TextBlob Semantic Tiering:*** *We use TextBlob NLP to evaluate student requisition justification text. Projects involving high-complexity milestones or safety-sensitive robotics are dynamically classified, elevating the request into a Priority Queue visible to the HoD.*
> 3. ***Dynamic Student Reputation Scoring:*** *The system tracks each student's return punctuality, damaged component frequency, and inspection condition. Students with high reputation scores receive expedited processing, while chronic defaulters require mandatory faculty co-sign."*

---

## Pillar 6: How to Defend Future Prospects (Azure VM Dry Run → SIT Bare Metal)

### Question: *"What is your realistic roadmap for deploying this at SIT Pune?"*
> **The Defense Script:**  
> *"Sir, we have a clear 3-phase production deployment pipeline:*
> 1. ***Phase 1 (Verified Local):*** *All 61 automated pytest suites pass locally under Docker Compose, validating business logic, concurrency locks, and outbox polling.*
> 2. ***Phase 2 (Cloud Dry Run on Azure):*** *Before moving to campus hardware, we dry-run the complete stack inside an Azure Virtual Machine staging environment, testing end-to-end DNS, SSL/TLS termination, and live SMTP dispatch over the public internet.*
> 3. ***Phase 3 (SIT Bare Metal Production):*** *SIT Pune already owns and operates enterprise bare metal server infrastructure on campus. Because our system is completely containerized with Docker, we can deploy the entire stack directly onto SIT's bare metal servers. This achieves two major goals: zero ongoing cloud hosting bills for the department, and complete physical data sovereignty within the university intranet.*
> 4. ***Physical IoT Integration:*** *The next hardware phase integrates ESP32-controlled smart locker relays, allowing 24/7 autonomous equipment pickup with student RFID cards."*
