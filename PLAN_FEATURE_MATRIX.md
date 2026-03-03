# Plan Feature Matrix

Canonical plan keys:
- `essentials`
- `growth`
- `assure`
- `enterprise`

Legacy input mapping:
- `free`, `bronze` → `essentials`
- `silver` → `growth`
- `gold` → `assure`

## Positioning

| Plan | Target Customer | Core Value |
|---|---|---|
| `essentials` | Small teams, startups | Core cloud security findings, fast time-to-value |
| `growth` | Scaling teams, mid-market | Operational security, asset intelligence, optimisation |
| `assure` | Compliance-driven orgs | Audit-ready posture, framework evidence packs |
| `enterprise` | Large orgs, MSSPs | Custom controls, integrations, delegated admin |

---

## Pricing (List)

All prices USD, billed monthly unless noted.

| Plan | Base Platform Fee | Included Seats | Included AWS Accounts | Overage |
|---|---:|---:|---:|---|
| `essentials` | `$499 / month` | `3` | `2` | `$75 / extra account`, `$19 / extra seat` |
| `growth` | `$1,499 / month` | `10` | `10` | `$99 / extra account`, `$29 / extra seat` |
| `assure` | `$2,999 / month` | `20` | `25` | `$129 / extra account`, `$39 / extra seat` |
| `enterprise` | `Custom` | `Custom` | `Custom` | Custom commercial terms |

**Annual commitment discount:** 15% on base platform fee (enterprise: proposal-driven).

---

## Feature Entitlements

### 🟢 Essentials

**Security Scanning**
- AWS findings: IAM, S3, EC2, RDS, VPC, CloudTrail, KMS, Secrets Manager, EKS, ECS, Lambda, ECR, ELB, Route 53, API Gateway, Inspector
- Rule engine: 424 unique security rules across 60+ AWS services
- Severity triage: CRITICAL / HIGH / MEDIUM / LOW with contextual scoring
- Remediation guidance: Terraform + CLI templates for all rules
- SLA breach tracking and alert thresholds

**Findings Workflow**
- Findings list, detail drawer, status management (Open → In Progress → Mitigated → Accepted Risk → Resolved)
- Snooze with expiry, assignee, notes
- Full-text search + severity, SLA breach, date range filters
- Compliance filter clear-all (atomic URL + state reset)

**IaC Security Scanner**
- Terraform (HCL), CloudFormation (YAML/JSON), Pulumi YAML scanning
- **Dockerfile scanning** (Dockerfile, Dockerfile.*, any variant)
  - DK001–DK010 (also R-469–R-478): root user, unpinned tags, hardcoded secrets, HEALTHCHECK, ADD, curl-pipe-shell, unpinned packages, privileged ports, COPY ., no multi-stage
- Auto-format detection; ZIP archive support
- Security / Reliability / Maintainability / Cost quality scores
- Scan history persisted per tenant

**Dashboard**
- Severity trend widgets
- Advanced Protection Modules widget (time-scoped, matches findings page)
- Account posture cards

**Platform**
- Multi-account, multi-region scanning
- Scheduled and manual scans
- Drift detection (EventBridge → S3 delivery)
- Basic exports (CSV)
- Email notifications

---

### 🔵 Growth

*All Essentials features, plus:*

**Asset Intelligence**
- Asset inventory with risk enrichment
- Cost-risk optimisation views
- Region heatmap

**Advanced Scanning Modules**
- **GuardDuty ingestion**: active threat findings mapped to compliance tags (MITRE ATT&CK, ISO 27001:2022, CIS, PCI-DSS, SOC2, NIST 800-53)
- **CVE Scanner**: nightly NVD + ECR image + SSM patch correlation — ECRImageCVE and SSMPatchCVE findings with manual trigger, cron schedule, dedicated dashboard
- **AI/ML security**: Bedrock model access, SageMaker endpoint exposure, LLMjacking detection (high-capacity anomalies)
- **Insider Threat**: geo-location anomaly, failed console login bursts, lateral movement
- **Global Network**: Transit Gateway, Direct Connect, VPN posture
- **Glue / Athena**: data catalog encryption and access
- **OpenSearch**: cluster security and access control
- **AppSync**: GraphQL API security

**Reporting**
- Advanced reporting with longer retention
- Incidents and attack path views

**Connectors**
- Email connector (SMTP / SES / SendGrid)
- Webhook connector (signed payloads, retry, delivery log)
- Sub-user invite emails

---

### 🟡 Assure

*All Growth features, plus:*

**Compliance Module**
- Framework tabs: CIS AWS v1.5, PCI-DSS, SOC 2, HIPAA, ISO 27001:2022, **MITRE ATT&CK**, NIST 800-53, GDPR
- ISO 27001:2022 Annex A controls (A.5.x → A.8.x) — both old `ISO/IEC 27001 A.x.x` and new `ISO 27001:2022 A.x.x` tag formats
- MITRE ATT&CK technique mapping (T1078, T1562.008, T1552, T1537, T1190, T1110, T1098, T1496, T1550, T1525 etc.)
- Failed controls view with affected findings count per control
- Evidence drawer: findings per control with remediation links
- Compliance findings filter (framework + control, with Clear All fix)
- "Run Compliance" backfill tagging

**Audit**
- Audit-oriented exports (evidence packs)
- Compliance posture widget on dashboard

---

### 🔴 Enterprise

*All Assure features, plus:*

**Identity & Access**
- SSO / SAML integration
- Advanced RBAC, delegated administration
- Custom role packs
- Sub-tenant / MSSP multi-tenant management

**Platform**
- Custom compliance frameworks and policy packs
- API/webhook integrations at scale
- Custom onboarding and professional services
- Premium SLAs and support channels

**AI & Intelligence**
- AI Chat Assistant (Claude-powered, 7 MCP tools: list/search findings, severity/service counts, account list, scan history, posture summary)
- Chat audit logging

---

## Role Bundles by Plan

| Plan | Roles Included |
|---|---|
| `essentials` | `OWNER`, `ADMIN`, `ANALYST`, `BILLING_ADMIN` (min 3 seats) |
| `growth` | Essentials + `READ_ONLY`, `LEAD`, `SALES` |
| `assure` | Growth + compliance/audit operators |
| `enterprise` | Custom role packs, delegated admin |

### Lead Intake Access Model
- `OWNER` and `ADMIN` have full lead management access.
- `LEAD` / `SALES` roles can access `/leads` and `/me` only (server-side enforced).
- Public lead ingestion endpoint: rate-limited, payload-validated, bot-abuse controlled.

---

## Backend Enforcement Strategy

- Entitlement checks are **server-side** (source of truth); UI hides locked features as UX convenience only.
- `features` and `limits` stored on tenant entitlement record for granular rollout.
- API contracts remain stable across plan changes.

---

## Implementation Status

| Module | Status | Notes |
|---|---|---|
| Core IAM/S3/EC2/RDS/VPC rules | ✅ Shipped | 424 unique rules (R-286–R-339 superseded by R-398–R-460) |
| CloudTrail / KMS / Secrets | ✅ Shipped | |
| EKS / ECS / Lambda / ECR | ✅ Shipped | |
| CIEM rules | ✅ Shipped | R-461 → R-476 |
| Docker IaC scanner | ✅ Shipped | DK001–DK010 (= R-469–R-478) |
| Terraform IaC scanner | ✅ Shipped | |
| CloudFormation IaC scanner | ✅ Shipped | |
| IaC Reviewer UI + upload | ✅ Shipped | Dockerfile.* fix included |
| GuardDuty threat ingestion | ✅ Shipped | 13 finding-type categories |
| AI/ML + LLMjacking detection | ✅ Shipped | |
| Insider threat detection | ✅ Shipped | Geo-anomaly, failed logins |
| CVE Scanner (NVD + ECR + SSM) | ✅ Shipped | Nightly cron + manual trigger, per-tenant settings |
| ISO 27001:2022 Annex A tags | ✅ Shipped | Old + new format matching |
| MITRE ATT&CK tags | ✅ Shipped | 25+ technique IDs across all categories |
| MITRE ATT&CK compliance tab | ✅ Shipped | ComplianceControlsPage |
| Compliance filter Clear All | ✅ Shipped | Atomic URL + state reset |
| Advanced Modules widget | ✅ Shipped | Time-scoped stats match findings page |
| Chat assistant (Claude) | ✅ Shipped | 7 MCP tools + audit logging |
| Email connector | ✅ Shipped | SMTP/SES/SendGrid |
| Webhook connector | ✅ Shipped | Signed, retry, delivery log |
| Redis rate limiting + cache | ✅ Shipped | |
| Drift detection | ✅ Shipped | EventBridge → S3 |
| Sub-user invite emails | ✅ Shipped | |
| Remediation templates | ✅ Shipped | 100+ Terraform + CLI templates |
| SLA breach tracking | ✅ Shipped | |
| Multi-account / multi-region | ✅ Shipped | |

