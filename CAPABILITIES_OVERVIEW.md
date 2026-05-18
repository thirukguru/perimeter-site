# Perimeter — Capabilities Overview

Perimeter is a multi-tenant SaaS platform for continuous AWS security posture management. It runs **476 AWS scanner rules across 60+ services**, plus **130+ IaC / Dockerfile analysis rules** and **30 architecture diagram security rules**, delivering findings, compliance status, cost waste, real-time drift alerts, and on-demand PDF reports through a **Go REST API** and a **React web application**.

> **Rule count breakdown:** 476 AWS runtime scanner rules (R-001–R-476) + 10 Dockerfile security rules (DK001–DK010) + 70+ Terraform rules + 50+ CloudFormation rules + 30 architecture diagram rules

---

## The Problem

AWS-native startups and mid-market teams face a painful gap: **AWS Security Hub covers ~180 checks** and surfaces alerts without context. Open-source tools like Prowler require self-hosting, produce CSV dumps with no workflow, and have zero real-time capability. Enterprise CNAPPs (Wiz, Prisma, Orca) solve the problem — at **$500K–$2M/year**, far beyond the budget of a 10–200 person engineering team.

Today, these teams cobble together Security Hub + Config + manual audits + spreadsheets. The result: blind spots across 60+ AWS services, compliance prep that takes weeks, and misconfigurations that sit open for months because no one sees them until the next quarterly review.

> *"We were using Prowler CLI once a month and pasting results into a spreadsheet. Half our S3 buckets had public access and we didn't know. We needed something that watches continuously — but Wiz wanted $400K."*
> — Composite customer voice

---

## Why Teams Use Perimeter

- **2.6× the coverage of AWS Security Hub** — 476 rules vs. ~180, grounded in real attack campaigns (LLMjacking, EmeraldWhale, Sandworm), not just CIS generics
- **AI/ML attack detection before anyone else in SMB** — LLMjacking, GPU abuse, SageMaker exposure, Bedrock guardrail checks — grounded in February 2025 threat intelligence
- **Zero credential storage** — AWS access via STS AssumeRole with per-tenant external ID; no keys ever stored
- **Shift-left scanning** — IaC Review (Terraform, CloudFormation) and Dockerfile security analysis before anything is deployed
- **Real-time drift detection** — EventBridge API Destinations push CloudTrail events within 30–90 seconds; no polling, no Lambda needed
- **Live web dashboard** — React UI with finding drill-down, attack path visualization, SLA tracking, compliance, cost, and chat views
- **AI Security Chat** — Claude-powered assistant with full awareness of your actual findings, accounts, and compliance state — not generic advice

---

## Security Detection — 424 Unique Rules Across 60+ Services

### Network & Infrastructure

| Domain | Rules | Key Checks |
|---|---|---|
| **VPC & Network** | 10 | Open SSH/RDP/DB ports, public EC2 instances, NACL permissiveness, VPC flow logs, IMDSv1, management port exposure (Sandworm), plaintext protocols (Telnet/FTP/HTTP) |
| **VPC Advanced** | 6 | Endpoint policies, NAT Gateway HA, VPC peering risks, cross-account interface endpoints |
| **VPC Endpoints** | 3 | Missing interface endpoints for sensitive services, open endpoint policies |
| **Global Network** | 3 | Transit Gateway auto-accept, cross-region peering, default VPC usage |
| **Network Firewall** | 1 | Missing Network Firewall on non-default VPCs |
| **Auto Scaling** | 2 | Launch configs with IMDSv1, unencrypted EBS in launch templates |
| **AWS Shield** | 2 | Shield Advanced not enabled, subscription lapsed |
| **ELB / ALB** | 4 | Missing WAF, no HTTPS redirect, access logs disabled, weak TLS policy |

### Identity & Access

| Domain | Rules | Key Checks |
|---|---|---|
| **IAM Security** | 15 | 17-pattern privilege escalation (CreateAccessKey, PassRole, AttachUserPolicy…), MFA gaps, stale credentials (90+ days), cross-account trust, wildcard policies, permission boundaries |
| **IAM Advanced** | 10 | Credential report analysis, access analyzer findings, service last access, role trust anomalies |
| **Identity & Secrets Deep Dive** | 9 | Stale/hardcoded Secrets Manager versions, public secret exposure, PassRole to ML/compute, confused deputy (missing ExternalId), inactive keys/passwords, permissive KMS |
| **Organizations & SCP** | 6 | Missing SCPs at root, root-user restrictions, region guardrails, AI service controls, dangling delegated admins, root MFA |
| **STS & Cross-Account** | 5 | Role chaining depth ≥3, cross-account trust without ExternalId, confused deputy patterns |
| **Resource Policy** | 4 | Public resource policies across S3, SQS, SNS, KMS, ECR |
| **CIEM — Entitlement Analysis** | 8 | Unused permissions (90d), over-permissioned roles, permission boundary gaps, cross-account over-trust, service-linked role abuse, user direct policy, role chaining, stale access keys |
| **Access Analyzer** | 3 | IAM Access Analyzer not enabled, unresolved external access findings, unused access findings |

### Storage & Data

| Domain | Rules | Key Checks |
|---|---|---|
| **S3 Security** | 6 | Public bucket (ACL + policy), encryption audit, risky policies, sensitive file discovery, object content scanning, MFA Delete |
| **RDS Security** | 10 | Public access, encryption, backup retention < 7 days, deletion protection, IAM auth, Multi-AZ, auto-upgrade, Performance Insights, CloudWatch export, snapshot exposure |
| **Aurora Security** | 4 | Public cluster, no encryption, no backtrack, no deletion protection |
| **DynamoDB** | 2 | PITR disabled, no deletion protection |
| **Redshift Security** | 5 | Public exposure, encryption, weak password policy, audit logging, enhanced VPC routing |
| **OpenSearch Security** | 4 | Public domain (non-VPC), fine-grained access control, node-to-node encryption, audit logs |
| **ElastiCache / MemoryDB** | 5 | Encryption at rest/in-transit, public subnet, Redis auth, default port |
| **EFS Security** | 3 | Unencrypted file system, public access policy, no automatic backups |
| **Backup & DR** | 8 | Missing backup plans, unencrypted vaults, no cross-region copy, short retention, vault delete (ransomware risk), public EBS/RDS snapshots, S3 versioning/Object Lock |
| **DMS Security** | 3 | Replication instance public access, unencrypted storage, multi-AZ disabled |

### Containers & Serverless

| Domain | Rules | Key Checks |
|---|---|---|
| **ECS Security** | 10 | Privileged containers, root user, hardcoded secrets in env, public IP, host network, non-ECR images, writable root filesystem, dangerous capabilities, ECS Exec, Container Insights |
| **EKS Security** | 12 | Public API endpoint, private endpoint disabled, control plane logging, KMS secrets encryption, outdated K8s (< 1.28), OIDC/IRSA, legacy aws-auth, public subnet nodes, admin node IAM role |
| **ECR Security** | 8 | Mutable tags, scan-on-push disabled, public repository policy, no KMS, no lifecycle policy, cross-account pull exposure |
| **Lambda Security** | 8 | VPC egress, untrusted layers, reserved concurrency = 0, SnapStart with secrets, Function URL without auth, ephemeral storage, env-var secret scanning, ZIP secret scanning |

### Application & API

| Domain | Rules | Key Checks |
|---|---|---|
| **API Gateway Security** | 10 | Missing authorization, no WAF, no logging, permissive resource policy, CORS wildcard, no throttling, missing mTLS, X-Ray disabled |
| **CloudFront Security** | 6 | HTTP allowed, weak TLS (< 1.2), no WAF, logging disabled, insecure origin protocol, no geo-restriction |
| **AppSync Security** | 4 | API-key-only auth, logging disabled, permissive NONE resolvers, no WAF |
| **Route 53** | 3 | DNS query logging disabled, DNSSEC not enabled, zone transfer exposure |
| **Cognito Security** | 5 | Weak password/MFA policy, missing KMS, advanced security disabled, public client without secret, permissive CORS |
| **ACM / Certificates** | 3 | Expiring certificates (< 30 days), wildcard certificates, auto-renewal disabled |

### Messaging & Eventing

| Domain | Rules | Key Checks |
|---|---|---|
| **Messaging (SNS/SQS)** | 5 | Public topics/queues, unencrypted SNS, unencrypted SQS, missing DLQ |
| **EventBridge / Step Functions** | 4 | Open event bus, Step Functions logging disabled, public execution role, cross-account bus access |

### Analytics

| Domain | Rules | Key Checks |
|---|---|---|
| **Glue / Athena** | 3 | Data Catalog unencrypted, Athena results unencrypted, permissive catalog policy |

### CI/CD & Developer Tools

| Domain | Rules | Key Checks |
|---|---|---|
| **CodeBuild Security** | 4 | Privileged mode enabled, unencrypted build artifacts, no VPC, GitHub/Bitbucket tokens in env |
| **CI/CD Pipeline Security** | 4 | Unencrypted pipeline artifacts, cross-account pipeline access, no manual approval, CodePipeline logging disabled |
| **CloudFormation Security** | 4 | Drift detection disabled, stack termination protection off, plaintext SSM/Secrets in parameters, public S3 for templates |

### Governance & Compliance Services

| Domain | Rules | Key Checks |
|---|---|---|
| **AWS Config** | 3 | Config recorder disabled, delivery channel gaps, Config rules missing |
| **CloudWatch Alarms** | 4 | Missing root-login, unauthorized-API-call, console-sign-in, MFA alarms |
| **CloudTrail Security** | 5 | Trail coverage gaps, multi-region logging, log file integrity, CloudTrail-to-CloudWatch integration, S3 bucket public access |
| **Forensics Readiness** | 2 | Missing forensics/quarantine security group, CloudTrail validation disabled |
| **SSM Parameter Store** | 4 | Unencrypted parameters, public SSM documents, no resource policy, Session Manager without KMS |
| **Governance** | 5 | Tag policy enforcement, resource count anomalies, console access from non-corporate IPs |

### Security Services Audit

| Domain | Rules | Key Checks |
|---|---|---|
| **GuardDuty** | 3 | Not enabled, S3 protection disabled, active high-severity findings |
| **Security Hub** | 3 | Not enabled, CIS benchmark disabled, active critical findings |
| **Macie Security** | 4 | Not enabled, automated discovery off, sensitive data findings unresolved |
| **AWS Inspector** | 2 | Inspector v2 not enabled, EC2/ECR scanning disabled |
| **AWS Shield** | 2 | Shield Advanced not subscribed, route without DDoS protection |

### Multi-Account & Organization

| Domain | Rules | Key Checks |
|---|---|---|
| **Multi-Account** | 4 | Cross-account GuardDuty aggregation, no CloudTrail organization trail, Config aggregator missing, missing delegated security admin |

---

## Secrets Detection — 5 Sources

| Source | Scanned For |
|---|---|
| **Lambda environment variables** | All function configurations |
| **Lambda deployment packages** | ZIP archives, file-by-file |
| **EC2 user data** | Instance launch scripts |
| **Public S3 objects** | Object content in accessible buckets |
| **ECR image layers** | Docker image tar/gzip layers |

**Patterns detected:** AWS Access Keys, AWS Secret Access Keys, GitHub tokens (`ghp_…`), Slack tokens, Stripe keys (`sk_live_`), private keys (RSA/PKCS8), generic API keys and DB connection strings.

---

## AI/ML & LLMjacking Threat Detection — 15 Rules

### AI Attack Detection (10 rules)
Based on February 2025 threat intelligence — targeting GPU compute and generative AI abuse:
- GPU instance families (p2/p3/p4/p5, g3/g4/g5, inf1/inf2, trn1) with public IP or IMDSv1
- Bedrock: high provisioned throughput, custom model training, missing invocation logging
- Rapid EC2 API activity / throttle anomalies
- Lateral movement via role assumption chains (> 5 in 1 hour)
- Rapid admin IAM actions and CloudTrail gap events

### AI/ML Security (5 rules)
- SageMaker notebook public internet access
- SageMaker training/endpoint jobs outside VPC
- SageMaker model artifacts without KMS encryption
- Bedrock content filtering guardrails missing
- Running Bedrock model evaluation jobs

---

## Insider Threat Detection — 6 Behavioral Rules

CloudTrail-based analysis performed on each scan, looking back 24–72 hours:

| Rule | Risk Type | Trigger |
|---|---|---|
| **Bulk S3 exfiltration** | `S3DataExportAnomaly` | ≥30 `GetObject` calls **or** ≥500 MB downloaded in 24h from one principal |
| **After-hours admin activity** | `AfterHoursAdminActivity` | Privileged IAM actions (`CreateUser`, `CreateAccessKey`, `AttachUserPolicy`…) between 22:00–06:00 UTC |
| **Database snapshot export** | `DBSnapshotExport` | RDS/Aurora snapshot shared publicly or copied across accounts (72h lookback) |
| **Mass secrets access — burst** | `MassSecretReads` CRITICAL | ≥5 distinct secrets read within a single 5-minute window |
| **Mass secrets access — spread** | `MassSecretReads` HIGH | ≥10 unique secrets **or** ≥20 `GetSecretValue` calls in 24h |
| **Geo-location anomaly** | `GeoLocationAnomaly` | Same user logs in from ≥3 distinct source IPs in 24h |
| **Failed console logins** | `FailedConsoleLogins` | ≥5 failed console login attempts by one user in 24h |

---

## CIEM — Cloud Identity Entitlement Management (8 Rules)

Entitlement analysis using IAM Access Advisor, Credential Reports, and trust policy inspection:

| Rule | Detection |
|---|---|
| `IAMUnusedPermissions` | Role with >50% service permissions unused in 90 days |
| `IAMHighBlastRadius` | Role with 5+ FullAccess/Admin policies |
| `IAMServiceLinkedRoleAbuse` | Service-linked role with wildcard Principal trust |
| `IAMUserDirectPolicy` | Admin policy directly attached to user (not via group) |
| `IAMRoleChaining` | Role assumption chain of depth ≥3 (lateral movement risk) |
| `IAMStaleAccessKeys` | Active access key unused for 90+ days |
| `IAMCrossAccountOverTrust` | Cross-account role trusting all principals in external account |
| `IAMPermissionBoundaryGap` | High-privilege role without a permission boundary |

> **Note:** Entitlement data uses IAM Access Advisor, which provides **service-level** granularity (not action-level) — an AWS platform limitation documented transparently.

---

## Real-Time Drift Detection (EventBridge Webhooks)

Customer AWS accounts push CloudTrail events to Perimeter via **EventBridge API Destinations** — no Lambda, no polling. Events arrive within **30–90 seconds** of the API call.

**31 monitored CloudTrail actions:**

| Category | Actions |
|---|---|
| S3 drift | PutBucketPolicy, PutBucketAcl, PutPublicAccessBlock, DeletePublicAccessBlock |
| IAM policy changes | PutRolePolicy, AttachRolePolicy, DetachRolePolicy, PutUserPolicy, AttachUserPolicy |
| Lateral movement | AssumeRole, CreateRole, CreateUser, DeleteUser, CreateAccessKey, DeleteAccessKey |
| Account takeover signals | ConsoleLogin, DeactivateMFADevice, DeleteVirtualMFADevice, UpdateLoginProfile |
| Security group drift | AuthorizeSecurityGroupIngress/Egress, RevokeSecurityGroupIngress/Egress |
| CloudTrail tampering | DeleteTrail, StopLogging, UpdateTrail |
| RDS drift | ModifyDBInstance |
| KMS drift | ScheduleKeyDeletion, DisableKey |

**Drift Setup Download:** The Accounts page for connected accounts includes a one-click "Drift Setup" download — a pre-configured Terraform zip with `main.tf` (EventBridge rule + API Destination + IAM role + DLQ) and `terraform.tfvars` pre-filled with webhook token and API URL. Zero manual configuration.

---

## IaC Review — Infrastructure as Code Analysis

Upload Terraform HCL, CloudFormation YAML/JSON, Pulumi YAML, or Dockerfiles for static security analysis before deployment. Results stored per-tenant and shown in the IaC Review dashboard section.

### Terraform Rules (70+ rules across 6 categories)

| Category Code | Domain | Key Checks |
|---|---|---|
| TR — Resource Security | IAM, S3, RDS, KMS, EC2 | Encrypted EBS, S3 versioning, RDS backup, KMS config |
| TC — State Config | Terraform backends | Remote state with encryption, backend locking |
| TN — Network Access | Security groups, subnets | Open ingress rules, public subnet usage |
| TS — Secrets & Data | Resources, variables | Hardcoded secrets, plaintext variables |
| CO — Cost Optimization | Instances, storage | Instance rightsizing, unused resource patterns |
| OP — Operations | Tags, lifecycle | Tagging compliance, lifecycle policies |

### CloudFormation Rules (50+ rules)
IAM, S3, RDS, Lambda, EC2, KMS, VPC, SQS, SNS, ECS, CloudFront resource security analysis.

### Dockerfile Security Rules (10 rules)

| Rule | Severity | Detection |
|---|---|---|
| `DockerRunAsRoot` (DK001) | CRITICAL | No `USER` directive or `USER root` |
| `DockerHardcodedSecret` (DK003) | CRITICAL | Secrets in `ENV`/`ARG` instructions |
| `DockerCurlPipeShell` (DK006) | CRITICAL | `curl \| sh` supply chain risk |
| `DockerLatestTag` (DK002) | WARNING | Unpinned base image (`:latest` or no tag) |
| `DockerUnpinnedPackage` (DK007) | WARNING | apt/pip/npm/yum without version pin |
| `DockerPrivilegedPort` (DK008) | WARNING | Port < 1024 exposed |
| `DockerCopyAll` (DK009) | WARNING | `COPY . .` copies entire build context |
| `DockerNoHealthcheck` (DK004) | SUGGESTION | No `HEALTHCHECK` instruction |
| `DockerAddInsteadOfCopy` (DK005) | SUGGESTION | `ADD` used where `COPY` suffices |
| `DockerNoMultiStage` (DK010) | SUGGESTION | Single-stage build with build tools in final image |

**Auto-detection:** `POST /v1/iac/analyze` detects file type automatically by filename or content heuristics. ZIP uploads supported for multi-file project analysis.

---

## Architecture Diagram Scanner — 30 Security Rules

Upload AWS architecture diagrams (draw.io, Excalidraw, images) for automated security review. The scanner extracts services, connections, and boundaries, then applies 30 rules across network security, encryption, IAM, resilience, and compliance.

### Supported Formats

| Format | Parser | Analysis Method |
|---|---|---|
| **.drawio / .xml** | Local XML parser | Extracts mxGraph cells — services, connections, boundaries |
| **.excalidraw** | Local JSON parser | Parses Excalidraw elements and groups |
| **.png / .jpg / .svg / .webp** | AI Vision (Claude) | Anthropic Vision API extracts architecture from images |

### Rule Categories (30 rules)

| Category | Rules | Key Checks |
|---|---|---|
| **Network Security** | 8 | Public services without WAF/Shield, missing VPC boundaries, direct internet exposure, unrestricted ingress, missing NACLs |
| **Encryption** | 6 | Unencrypted data stores (S3, RDS, DynamoDB, EBS), missing TLS on connections, unencrypted data in transit |
| **IAM & Access** | 5 | Overly permissive roles, missing least-privilege, no MFA on console access, cross-account trust without ExternalId |
| **Resilience** | 6 | Single-AZ deployments, no auto-scaling, missing health checks, no backup/DR strategy, single points of failure |
| **Compliance** | 5 | Missing logging/monitoring, no CloudTrail, no VPC Flow Logs, missing compliance boundaries, data residency gaps |

### Endpoints

| Endpoint | Auth | Purpose |
|---|---|---|
| `POST /v1/arch/scan` | JWT (tenant-scoped) | Full scan with all findings, persisted per tenant |
| `POST /v1/public/arch/scan` | None (rate-limited: 5/10min/IP) | Marketing demo — first 3 findings shown, gated |

### Dashboard UI

- **Upload tab:** Drag-and-drop zone for diagram files
- **Findings tab:** Score rings (Overall, Security, Resilience), severity summary cards, search + severity/category filters, findings grid with compliance tags and affected services
- **CSV export:** Download filtered findings as CSV

---

## AI Security Chat

Claude-powered security assistant embedded in the dashboard:
- Answers questions about **your specific findings, accounts, and compliance state** — not generic cloud security advice
- Multi-turn conversation with context retention per session
- Conversation history stored per-tenant with full audit logging
- Rate-limited per tenant (Redis token bucket)
- All interactions included in the audit trail

---

## Compliance Mapping

Perimeter's 476 AWS scanner rules are mapped to **13 compliance frameworks** at scan time. The compliance docs are sourced from compliance FrameworksWebsites and cover:

| Framework | Scope |
|---|---|
| **CIS AWS Foundations Benchmark v1.4 – v5.0** | Infrastructure, identity, logging, storage |
| **CIS Docker Benchmark** | Container build-time security |
| **PCI-DSS v3.2.1 + v4.0** | Payment card data protection |
| **SOC 2 (CC series)** | Trust service criteria |
| **HIPAA** | Healthcare data protection |
| **ISO 27001:2013 + ISO 27001:2022** | Information security management |
| **NIST 800-53 rev 4 + rev 5** | Federal security controls |
| **NIST CSF 1.1 + 2.0** | Cybersecurity framework |
| **NIST 800-171 rev 2** | Controlled unclassified information |
| **CSA CCM 4.0** | Cloud-specific security controls |
| **MITRE ATT&CK for Cloud** | Threat technique mapping (30+ techniques) |
| **FedRAMP Low + Moderate** | US federal cloud authorization |
| **FFIEC** | Financial institution IT examination |
| **GDPR** | EU data protection |
| **NIS2** | EU network and information security |
| **BSI C5** | German Federal Office cloud compliance |
| **KISA ISMS-P 2023** | South Korean information security |
| **RBI Cyber Security Framework** | Reserve Bank of India |
| **CISA** | US Cybersecurity and Infrastructure Security Agency |

The **Compliance page** surfaces framework health — pass/fail per control with finding evidence and download options. A **"Run Compliance"** button re-tags all findings against the current mapping table without requiring a new scan.

### MITRE ATT&CK Coverage

Perimeter maps findings to **30+ MITRE ATT&CK for Cloud techniques** across all 14 tactics:

| Tactic | Example Techniques Covered |
|---|---|
| **Initial Access** | T1190 Exploit Public-Facing Application, T1199 Trusted Relationship, T1078 Valid Accounts |
| **Execution** | T1059 Scripting Interpreter, T1648 Serverless Execution, T1204 User Execution |
| **Persistence** | T1098 Account Manipulation, T1136 Create Account, T1546 Event Triggered Execution, T1525 Implant Internal Image |
| **Privilege Escalation** | T1546 Event Triggered Execution, T1651 Cloud Administration Command |
| **Defense Evasion** | T1562 Impair Defenses, T1578 Modify Cloud Compute Infra, T1535 Unused/Unsupported Regions |
| **Credential Access** | T1110 Brute Force, T1552 Unsecured Credentials, T1556 Modify Authentication Process |
| **Discovery** | T1526 Cloud Service Discovery, T1530 Data from Cloud Storage |
| **Lateral Movement** | T1550 Use Alternate Authentication Material |
| **Collection** | T1530 Data from Cloud Storage Object, T1213 Data from Information Repositories |
| **Exfiltration** | T1537 Transfer Data to Cloud Account, T1567 Exfiltration Over Web Service |
| **Impact** | T1485 Data Destruction, T1490 Inhibit System Recovery, T1496 Resource Hijacking |

---

## Cost Optimization

**Cost Explorer Spend Data** — month-to-date spend grouped by service, stored per scan for trend views.

**Active Waste Resource Scan:**

| Check | Resource | Impact |
|---|---|---|
| Unused Elastic IPs | EC2 | Hourly billing on unassociated EIPs |
| Unattached EBS Volumes | EBS | Charged in `available` state |
| Stopped EC2 Instances | EC2 | EBS and related costs continue |
| Stale S3 Buckets | S3 | Buckets > 1 year old flagged for review |

Waste classified as `SAFE_NOW` / `SECURITY_DEPENDENT` / `NEEDS_APPROVAL`.

---

## Risk Intelligence

- **Contextual severity scoring** — 0–100 risk score with public exposure, data sensitivity, and blast-radius multipliers
- **Attack path visualization** — graph of chained findings leading to account compromise
- **SLA tracking** — configurable SLA windows with breach alerting per finding severity
- **Score history** — security score trend over time per account
- **AI recommendations** — `GET /v1/intelligence/recommendations` aggregates cross-cutting improvement actions
- **Trending** — newly emerged, worsening, and resolved finding trends per scan cycle

---

## CVE Scanner — Nightly Vulnerability Correlation

Automated nightly scan correlating NVD vulnerability data with ECR container images and SSM-managed instance patches. Runs on a configurable cron schedule with MongoDB distributed lock for HA. Also supports manual "Run Now" from the Settings UI.

| Component | Function |
|---|---|
| **NVD Client** | Fetches recent CVEs from the National Vulnerability Database |
| **ECR Scanner** | Scans all ECR repos per account×region for image vulnerabilities |
| **SSM Scanner** | Lists managed instances (DescribeInstanceInformation), checks patch compliance |
| **Scheduler** | Cron-based, per-tenant settings, distributed lock |
| **Manual trigger** | "Run Now" button in Settings → CVE Scanner panel |

**Risk types produced:**
- `ECRImageCVE` — container image with known CVE (service: ECR)
- `SSMPatchCVE` — missing OS patch correlated with CVE (service: SSM)

**Compliance:** PCI-DSS 6.3, SOC2 CC7.3, NIST 800-53 SI-2, ISO 27001:2022 A.8.8, MITRE ATT&CK T1190

**CVE Dashboard:** Dedicated page with run logs (paginated, MANUAL/SCHEDULED badges), severity breakdown, NVD/ECR/SSM stats per run.

---

## Finding Management

- **Filter** by account, region, service, severity, risk type, status, date range
- **Suppress** findings with reason and expiry — suppressed findings excluded from scoring
- **Status tracking** — `OPEN`, `IN_PROGRESS`, `RESOLVED`, `SUPPRESSED`, `REOPENED`
- **Bulk operations** — multi-select status updates and suppression
- **Download** — findings export to CSV / JSON
- **Remediation guidance** — every finding links to a CLI fix template (476 remediation entries)
- **Evidence** — JSON evidence block per finding showing exactly what was detected

---

## Real-Time Spot Alerts

EventBridge (or Lambda forwarder) POSTs EC2 Spot lifecycle events to `/realtime/spot`. Perimeter normalises, enriches with account/instance metadata, and pushes to all browser sessions via **Server-Sent Events**.

| Event | Trigger |
|---|---|
| `spot.interruption` | 2-minute interruption warning |
| `spot.rebalance` | Rebalance recommendation |
| `spot.termination` | Instance terminated |

---

## PDF Reports

Four on-demand PDF templates, streamed directly to the browser:

| Template | Orientation | Content |
|---|---|---|
| **Executive Summary** | Portrait | Security score, severity counts, top 10 CRITICAL + 10 HIGH findings |
| **Technical Finding Deep-Dive** | Landscape | Full paginated findings table |
| **Compliance Audit Pack** | Landscape | Findings grouped by compliance framework |
| **Cost Optimization Report** | Landscape | Waste by service + detailed cost findings |

Header: `PERIMETER | <TEMPLATE> | <TENANT NAME>`
Footer: `Confidential | <Tenant> | Page N | Generated by Perimeter`

Every download is logged to the audit trail.

---

## Notifications & Integrations

- **Email alerts** — configurable notification policies for new findings, severity thresholds, SLA breaches
- **Custom webhooks** — POST finding payloads to external systems (Slack, PagerDuty, Jira)
- **Suppression policies** — rules-based finding suppression with time windows and reason tracking
- **SIEM Export** — structured finding export for ingestion into Splunk, Datadog, or similar
- **Scan policies** — configurable scan schedules, service exclusions, and region filters

---

## SaaS Platform

### Authentication & Multi-Tenancy
- JWT access/refresh token flow with rotation
- Strict tenant isolation at the DB query level — every query scoped by `tenant_id`
- Five RBAC roles: **OWNER**, **ADMIN**, **ANALYST**, **BILLING_ADMIN**, **READ_ONLY**
- Platform **SaaS Admin** role for internal tenant management
- Invite-based sub-user onboarding with role assignment email

### AWS Account Onboarding
1. Tenant registers account → Perimeter generates unique per-tenant external ID
2. **CloudFormation** launch URL returned (one-click, pre-filled parameters) **or** **Terraform module** (`perimeter-role.tf`) for IaC-first teams
3. Stack deploys a read-only IAM role in the customer's AWS account
4. Tenant provides Role ARN → API verifies via STS AssumeRole
5. Status transitions: `PENDING → CONNECTED` — scanning enabled
6. "Drift Setup" button downloads pre-configured Terraform zip for EventBridge drift detection

**No AWS credentials stored.** All scanning uses temporary STS session tokens.

### Onboarding Checks
Interactive checklist of security prerequisites verified on connection:
- CloudTrail enabled (multi-region)
- Config recorder active
- GuardDuty enabled
- VPC flow logs configured
- Root MFA enabled

Each check supports advisory / balanced / strict enforcement policy modes.

### Audit Trail
Every privileged action writes an `AuditEvent` to MongoDB — scan created, account verified, report downloaded, user role changed, compliance re-tagged, chat message sent. Viewable in Settings → Audit Logs.

### Scan Management
- On-demand and periodic scans per account
- Per-scan region filtering (only connected regions scanned)
- Scan history with timestamp, duration, and rule count
- Concurrent scanning with AWS rate-limit resilience (circuit breaker + retry guard)

---

## Security & Safety Model

- Scanning is **read-only** — no AWS resources are modified
- No automatic remediation unless explicitly triggered
- IAM least-privilege compatible — minimum required permissions documented
- All secrets handled with bcrypt (passwords) and short-lived JWT tokens
- Rate limiting on all public endpoints (Redis token bucket, per IP + per tenant)
- Redis caching for scan results and token validation (configurable TTL)
- Webhook tokens stored in config, never in the database
- Constant-time comparison for all token validation (prevents timing attacks)

---

## Competitive Context

Perimeter is purpose-built for **AWS-only teams at startups and mid-market companies** (10–500 engineers) who need enterprise-grade security posture without enterprise pricing.

### vs. Enterprise CNAPPs

| Capability | Perimeter | Wiz / Prisma | Orca |
|---|---|---|---|
| AWS rule depth | ✅ 476+ rules, rare services | ⚠️ Broader but shallower per-service | ⚠️ Broader but shallower |
| Multi-cloud | ❌ AWS only | ✅ Azure, GCP, AWS | ✅ Azure, GCP, AWS |
| IaC + Dockerfile scanning | ✅ Terraform + CFN + Dockerfile | ✅ | ✅ |
| Real-time drift detection | ✅ 30–90 sec via EventBridge | ⚠️ Polling-based | ⚠️ Polling-based |
| AI Security Chat (contextual) | ✅ Aware of your findings | ❌ Generic LLM bolt-on | ❌ Generic |
| CWPP / runtime workload | ⚠️ Via GuardDuty integration | ✅ Agent + agentless | ✅ Agentless snapshot |
| LLMjacking / AI attack detection | ✅ 15 rules | ⚠️ Limited | ⚠️ Limited |
| Price tier | 💰 From $499/mo | 💰💰💰 $500K+/yr | 💰💰💰 $300K+/yr |

> **Post-Wiz/Google acquisition dynamics (2024–25):** Wiz's Google acquisition creates uncertainty for multi-cloud customers. Orca has shifted focus upmarket. Neither is investing in SMB-accessible pricing. This leaves an expanding gap in the $5K–$50K/yr range.

### vs. Prowler (Open Source)

| Dimension | Perimeter | Prowler CLI |
|---|---|---|
| Rule count | 476 AWS + 130 IaC + 30 arch | ~300 AWS |
| Deployment | SaaS — zero self-hosting | Self-hosted CLI (Docker/pip) |
| Real-time drift | ✅ 30–90 sec EventBridge | ❌ Scheduled runs only |
| AI Security Chat | ✅ Context-aware | ❌ None |
| Compliance reporting | ✅ 19 frameworks, PDF packs | ⚠️ CIS/PCI basic CSV |
| Multi-tenant / team | ✅ RBAC, audit trail | ❌ Single-user CLI |
| Attack path visualization | ✅ Graph-based | ❌ None |
| IaC scanning | ✅ Terraform + CFN + Docker | ❌ Runtime only |
| Remediation templates | ✅ 476 Terraform/CLI fixes | ⚠️ CIS remediation links |
| Cost | $499–$2,999/mo | Free (but ~20 hrs/mo self-hosting cost) |

**Why teams switch from Prowler:** "Free" costs ~$15K–$25K/yr in engineering time (setup, hosting, scheduling, result parsing, alerting, dashboard building). Perimeter replaces that entire DIY stack with a managed service at comparable or lower total cost.

### vs. AWS Security Hub + Config

| Dimension | Perimeter | Security Hub + Config |
|---|---|---|
| Rule depth | 476 rules across 60+ services | ~180 checks (CIS + FSBP) |
| AI/ML threat detection | ✅ LLMjacking, GPU abuse | ❌ None |
| Insider threat | ✅ 6 behavioral rules | ❌ None |
| CIEM | ✅ 8 entitlement rules | ❌ None |
| IaC + Dockerfile | ✅ 130+ rules | ❌ Runtime only |
| Compliance breadth | 19 frameworks | CIS + FSBP only |
| Drift speed | 30–90 sec | 6–24 hour evaluation cycle |
| AI chat | ✅ | ❌ |
| Cross-account dashboard | ✅ Single pane | ⚠️ Requires aggregation setup |
| Cost | $499/mo flat | $0.001/evaluation (~$300–$2,000/mo at scale) |

**Why teams add Perimeter on top of Security Hub:** Security Hub is a good baseline — Perimeter extends it with 296 additional rules, real-time drift, IaC scanning, AI chat, and compliance evidence packs that Security Hub doesn't produce.

**Sweet spot:** AWS-native teams that need serious depth, shift-left IaC scanning, real-time drift detection, and AI-assisted analysis — without the complexity and cost of a full CNAPP platform.

---

## Who Uses Perimeter

| Persona | How |
|---|---|
| **Cloud security engineers** | Deep, service-level AWS visibility — full attack surface across 60+ services |
| **Platform / SRE teams** | Enforce secure defaults at scale; real-time drift detection before incidents |
| **Compliance teams** | Pre-built evidence for CIS, PCI-DSS, SOC 2, HIPAA, ISO 27001, NIST, MITRE ATT&CK — no manual mapping |
| **Engineering leadership** | Security score trends, cost waste, and executive PDF in one click |
| **DevOps / Platform engineers** | IaC review and Dockerfile analysis integrated into upload workflows |

---

## Tech Stack

| Layer | Technology |
|---|---|
| API language | Go 1.24 |
| HTTP router | Chi (go-chi/chi/v5) |
| Database | MongoDB |
| Cache & Rate Limiting | Redis |
| AWS integration | AWS SDK for Go v2 |
| Auth | JWT (golang-jwt/jwt/v5) + bcrypt |
| AI Chat | Anthropic Claude API |
| PDF generation | go-pdf/fpdf |
| Concurrency | errgroup (golang.org/x/sync) |
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Real-time | Server-Sent Events (SSE) |
| Infrastructure | Terraform + ECS Fargate |
| IaC Scanner | Custom HCL/CFN/Dockerfile parser (api/iac) |
| Arch Scanner | Custom draw.io/Excalidraw parser + Anthropic Vision API (api/archscan) |
| Drift Detection | EventBridge API Destinations + Go webhook handler |

---

## Market Opportunity

### TAM / SAM / SOM

| Metric | Size | Basis |
|---|---|---|
| **TAM** | $12.4B | Global CSPM market 2025 (Gartner) |
| **SAM** | $1.8B | AWS-only CSPM for companies with $50K–$50M AWS spend |
| **SOM** (Year 3) | $18M | 500 customers × $36K avg. ARR |

**ICP qualifier:** Companies with $50K–$5M annual AWS spend, 10–500 engineers, in AWS-first verticals.

### Target Verticals

| Vertical | Entry Compliance | Plan Fit | Willingness to Pay |
|---|---|---|---|
| **Fintech / Banking** | PCI-DSS, SOC 2, RBI | Assure | High — regulatory mandate |
| **Healthtech / Pharma** | HIPAA, SOC 2 | Assure | High — breach liability |
| **SaaS / B2B Software** | SOC 2, ISO 27001 | Growth → Assure | Medium — customer trust |
| **Government contractors** | FedRAMP, NIST 800-53 | Assure → Enterprise | High — compliance required |
| **E-commerce / Marketplace** | PCI-DSS | Growth | Medium — card data exposure |
| **AI / ML startups** | SOC 2 + AI governance | Growth | Medium — LLMjacking risk |
| **MSSP / Security consultancies** | Multi-tenant, white-label | Enterprise | High — margin business |

---

## Go-To-Market Strategy

### Distribution Channels

| Channel | Priority | Status |
|---|---|---|
| **AWS Marketplace** | 🔴 P0 | In progress — listing for Q2 2026 |
| **Product-Led Growth (PLG)** | 🔴 P0 | Public arch scanner demo → signup → free trial |
| **Content marketing** | 🟡 P1 | Blog, threat intel reports, compliance guides |
| **Partner channel (MSSPs)** | 🟡 P1 | Enterprise tier with multi-tenant management |
| **Outbound** | 🟢 P2 | Targeted outbound to fintech/healthtech CISOs |

### PLG Funnel

```
Public Arch Scan (free, rate-limited)     ← Top of funnel
    ↓ User sees 3 findings, gated CTA
Free Trial (14 days, 1 AWS account)       ← Conversion
    ↓ Full scan, immediate value
Essentials ($499/mo, 2 accounts)          ← Paid
    ↓ Team grows, adds accounts
Growth ($1,499/mo, 10 accounts)           ← Expansion
    ↓ Compliance audit requirement
Assure ($2,999/mo, 25 accounts)           ← Upsell
    ↓ Multi-org, MSSP, SSO needs
Enterprise (Custom)                       ← Strategic
```

### Trial Tier (Free Entry)

| Feature | Trial |
|---|---|
| Duration | 14 days |
| AWS accounts | 1 |
| Users | 2 |
| All Essentials features | ✅ |
| Compliance module | ✅ (preview, CIS only) |
| AI Chat | 5 queries/day |
| No credit card required | ✅ |

### AWS Marketplace Listing

- **Listing type:** SaaS with contract pricing
- **Billing:** Monthly subscription via AWS Marketplace billing (uses customer's existing AWS EDP commitment)
- **Dimensions:** Per-account and per-seat metering via AWS Marketplace Metering API
- **Legal:** Privacy policy and Terms of Service live at perimetercloud.io/privacy and perimetercloud.io/terms
- **Target launch:** Q2 2026

### MSSP Partner Program

| Term | Detail |
|---|---|
| Revenue share | 20% partner margin on managed accounts |
| Multi-tenancy | Enterprise plan includes multi-tenant management console |
| White-label | Custom branding available on Enterprise |
| Onboarding | Dedicated partner onboarding track |

### ROI Quantification

| Metric | Without Perimeter | With Perimeter | Savings |
|---|---|---|---|
| Compliance audit prep | 3–6 weeks manual | 1-click report generation | **80% time reduction** |
| Misconfiguration detection | Quarterly manual review | Real-time (30–90 sec drift) | **MTTR: months → hours** |
| Security tool cost (10 accounts) | Wiz $500K / Prowler ~$25K DIY | $6K–$18K/yr | **90–96% vs. enterprise** |
| Breach cost avoided | $4.88M avg. (IBM 2024) | Continuous posture monitoring | **Risk reduction** |
| Engineering time on security | ~20 hrs/mo (Prowler DIY) | ~2 hrs/mo (managed SaaS) | **$15K–$25K/yr saved** |

---

## Business KPIs — 12-Month Targets

| KPI | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| **Monthly Recurring Revenue** | $5K | $25K | $100K |
| **Annual Run Rate** | $60K | $300K | $1.2M |
| **Paying Customers** | 5 | 20 | 60 |
| **Trial → Paid Conversion** | 15% | 20% | 25% |
| **Time-to-First-Scan** | < 15 min | < 10 min | < 10 min |
| **Monthly Churn** | < 8% | < 5% | < 3% |
| **NPS** | 30+ | 40+ | 50+ |
| **False Positive Rate** | < 5% | < 3% | < 2% |
| **AWS Accounts Connected** | 20 | 150 | 600 |

---

## Data Residency & Privacy Architecture

| Component | Location | Encryption |
|---|---|---|
| **Application database** | MongoDB Atlas (AWS Mumbai, ap-south-1) | AES-256 at rest, TLS 1.2+ in transit |
| **Redis cache** | AWS ElastiCache (same region) | Encrypted at rest + in transit |
| **API servers** | ECS Fargate (same region) | TLS termination at ALB |
| **Scan result data** | Stored in MongoDB, tenant-isolated | Per-tenant query scoping |
| **AWS credentials** | Never stored | STS temporary tokens only |

**Multi-region roadmap:** For EU (GDPR) and US customers requiring data sovereignty, MongoDB Atlas supports region-specific clusters. Planned deployment model: customer selects data region at signup → tenant routed to region-specific cluster.

**GDPR Article 28 compliance:** Perimeter acts as a data processor. DPA (Data Processing Agreement) available for EU customers. Sub-processors: AWS (infrastructure), MongoDB Atlas (database), Anthropic (AI chat, opt-in only — no raw customer data sent).

**Data retention:** Active subscription — retained indefinitely. Post-cancellation — 30 days, then permanently deleted. Customers may request immediate deletion via support.

---

## Platform Security Model

How Perimeter secures itself:

| Layer | Control |
|---|---|
| **Network** | ALB + WAF with OWASP Core Rule Set; private subnets for all compute; no direct internet access from containers |
| **Authentication** | JWT access + refresh tokens with rotation; bcrypt password hashing; optional SSO/SAML (Enterprise) |
| **Authorization** | 5-role RBAC enforced server-side; tenant_id scoped on every DB query; SaaS admin override with audit |
| **API hardening** | Rate limiting (Redis token bucket per IP + per tenant); max body size limits; request timeout middleware; constant-time token comparison |
| **Data isolation** | Every MongoDB query scoped by tenant_id; no cross-tenant data access possible at query layer |
| **Secrets management** | JWT secret, DB credentials, API keys in environment variables / AWS Secrets Manager; never in codebase |
| **Audit trail** | Every privileged action logged to AuditEvent collection — immutable, queryable |
| **Dependency security** | Go module vendoring; Dependabot alerts; regular dependency updates |
| **Infrastructure** | ECS Fargate (no SSH, no persistent hosts); ECR private images; VPC endpoints for AWS services |
| **Incident response** | Structured logging; health + readiness probes; automated alerting on error rate spikes |

**Platform RTO / RPO:**

| Metric | Target |
|---|---|
| RTO (Recovery Time Objective) | < 1 hour |
| RPO (Recovery Point Objective) | < 15 minutes (MongoDB continuous backup) |
| Uptime SLA | 99.9% (excludes planned maintenance windows) |

---

## Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Enterprise CNAPP moves downmarket** — Wiz/Orca launches $500/mo SMB tier | Medium | High | Deepen AWS-specific differentiators (LLMjacking, EventBridge drift, 19 frameworks); maintain 5–10× price advantage; emphasize speed-to-value |
| 2 | **Open-source commoditization** — Prowler/ScoutSuite adds SaaS layer | Medium | Medium | Perimeter's moat is integrated platform (IaC + drift + AI + compliance + CIEM) — not any single feature |
| 3 | **AWS expands Security Hub** — native tooling reaches 400+ checks | Low | High | Stay 6–12 months ahead on coverage; focus on AI chat, attack paths, compliance packs — areas AWS won't build |
| 4 | **Single-cloud concentration** — 100% AWS dependency | Low | Medium | AWS market share is ~32% and growing; the AWS-only focus is the positioning, not a limitation |
| 5 | **NVD data quality** — backlog and delays in CVE data (documented 2024 issues) | Medium | Low | Add OSV (Google Open Source Vulnerabilities) and GitHub Security Advisories as fallback data sources |
| 6 | **Data breach of Perimeter platform** | Low | Critical | Defense-in-depth (WAF, VPC isolation, encrypted DB, no credential storage, audit logging); SOC 2 Type II certification planned Year 1 |
| 7 | **GDPR enforcement action** | Low | High | DPA for EU customers; data residency controls; Article 28 processor obligations documented; EU region planned |
| 8 | **Customer churn** — SMB customers budget-constrained | Medium | Medium | Time-to-value < 15 min; trial tier removes risk; annual commitment discount (15%); compliance lock-in |
