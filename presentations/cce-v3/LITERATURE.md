# Literature review: LabTrack implementation choices

Reviewed 19 October 2026 for the Cloud Computing Essentials presentation. This review separates established guidance from claims about the current LabTrack implementation.

## 1. SMTP notifications and the notification registry

RFC 5321 defines SMTP as an Internet mail-transfer protocol built on a reliable, ordered data stream. That makes SMTP a suitable **delivery channel** for approval, issue and return messages. It is not a durable business-event registry: a successful SMTP exchange only describes a server response for that attempt; it does not by itself give LabTrack a queryable record of why an event occurred, whether the message should be retried, or whether a user acted on it.

FastAPI documents background tasks for slow work such as email after a response has been returned. For LabTrack, the stronger design is to write an outbox/notification record in the same SQL transaction as the workflow event, then have a worker attempt SMTP delivery and update a delivery record. This preserves the inventory decision if the provider is slow or unavailable and creates a registry for in-app notifications, audit and retry.

**Project implication:** SMTP is appropriate for the external delivery adapter. The SQL outbox plus notification/delivery records are the system of record. The current code has this separation conceptually, but the review identified that the SMTP path still needs durable-send hardening and authorization checks before it is presented as production-ready.

Sources:

1. J. Klensin, [RFC 5321: Simple Mail Transfer Protocol](https://www.rfc-editor.org/rfc/rfc5321.html), IETF, 2008.
2. FastAPI, [Background Tasks](https://fastapi.tiangolo.com/tutorial/background-tasks/), accessed 19 October 2026.
3. AWS Architecture Blog, [Implementing the transactional outbox pattern](https://aws.amazon.com/blogs/architecture/implementing-the-transactional-outbox-pattern/), accessed 19 October 2026.

## 2. FastAPI as the API layer

FastAPI provides automatic interactive API documentation, Pydantic-based request validation, dependency injection and security building blocks. Its OAuth2/JWT tutorial also stresses that a token is signed rather than encrypted and that passwords should be stored as password hashes, not plaintext. These features fit a laboratory workflow API because each actor and each request can be validated at a route boundary.

**Project implication:** LabTrack uses FastAPI for server-side route validation, role checks and lifecycle transitions. The current server is the authoritative backend workflow. The root React client has not yet been fully connected to those route contracts, so the user interface must not be represented as consuming the same authoritative state.

Sources:

1. FastAPI, [Features](https://fastapi.tiangolo.com/), accessed 19 October 2026.
2. FastAPI, [OAuth2 with Password, Bearer with JWT tokens](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/), accessed 19 October 2026.

## 3. Reservation systems and FIFO fairness

FIFO means first-in, first-out: requests are considered in the order they enter a queue. Amazon SQS FIFO documentation shows why ordered delivery and deduplication help when order matters. But a FIFO queue alone does not reserve physical stock. A reservation system must make the queue position, inventory check and status transition atomic against concurrent requests. Database transaction isolation is therefore essential; PostgreSQL documentation explains that isolation controls which committed data a transaction can observe while other transactions run.

**Project implication:** LabTrack can define a fair policy such as `created_at` order for requests in the same lab and priority class. The server must still recheck stock inside the issue transaction and either issue the entire request or reject it. This prevents two users from receiving the same remaining unit. FIFO is a policy layer; transactional inventory is the correctness layer.

Sources:

1. AWS, [Amazon SQS FIFO queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html), accessed 19 October 2026.
2. PostgreSQL Global Development Group, [Transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html), accessed 19 October 2026.

## 4. Cloud VMs and managed databases

Cloud VMs provide scalable compute for the API and worker. Managed relational databases reduce operational responsibility for backups, patching, monitoring and provisioning. AWS documentation recommends placing an application server and managed database in a VPC with narrowly scoped security-group access, and its RDS guidance compares the additional database-management burden of a self-managed EC2 database with managed RDS.

**Project implication:** a deployable LabTrack target is an API/worker runtime on VMs or a container platform, with a managed MySQL/PostgreSQL-compatible relational database in a private network. This is a target architecture, not a claim about the current local runtime, which uses SQLite in the active API profile.

Sources:

1. AWS, [What is Amazon RDS?](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html), accessed 19 October 2026.
2. AWS, [Connect an EC2 instance to an RDS database](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/tutorial-connect-ec2-instance-to-rds-database.html), accessed 19 October 2026.

## 5. Docker and reproducible deployment

Docker describes a container as an isolated process with the files it needs to run. It contrasts containers with VMs: containers share the host kernel, while a VM includes an operating system and has greater overhead. Docker can package a frontend, API, worker and database-facing configuration so the same images are run in development, test and deployment environments.

**Project implication:** Docker Compose is appropriate for a reproducible LabTrack stack with separate frontend, FastAPI API, worker and database services. It does not replace VM/network security, backups or secrets management; it packages the application components. Containerization is planned work unless a checked-in Compose file and successful run are demonstrated.

Sources:

1. Docker, [What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/), accessed 19 October 2026.
2. Docker, [What is Docker?](https://docs.docker.com/get-started/docker-overview), accessed 19 October 2026.

## 6. Phase 1 encryption standards and SHA-256

The requested term is **SHA-256**, not “SHAW 256.” NIST FIPS 180-4 specifies SHA-256 as a secure hash algorithm that produces a message digest used to detect changes. It is **not encryption**: hashing is one-way and supplies integrity evidence, whereas encryption protects confidentiality and requires key management. Password storage should use a password-hashing scheme with salt and an appropriate work factor (FastAPI's guidance uses Argon2); SHA-256 alone is not an appropriate password-storage mechanism.

**Project implication:** Phase 1 should require TLS for data in transit; server-side password hashing (Argon2/bcrypt); secrets stored outside the repository; role checks; audit records; and SHA-256 only where an integrity digest is useful, such as an export, attachment or immutable audit payload. The current project must verify its actual password and transport configuration before claiming this security baseline is fully implemented.

Sources:

1. NIST, [FIPS 180-4: Secure Hash Standard](https://csrc.nist.gov/pubs/fips/180-4/upd1/final), 2015.
2. FastAPI, [OAuth2 with Password, Bearer with JWT tokens](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/), accessed 19 October 2026.

## Synthesis

The literature supports a layered LabTrack design: FastAPI handles validated server operations; SQL transactions protect inventory correctness; an outbox records events before asynchronous SMTP notification; FIFO is a fair ordering policy rather than a stock guarantee; Docker packages components for repeatable deployment; VMs and managed databases provide a cloud target; and SHA-256 is an integrity primitive within a wider Phase 1 security baseline.
