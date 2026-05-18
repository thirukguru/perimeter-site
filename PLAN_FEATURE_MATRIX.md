# Plan Feature Matrix

> **Canonical source of truth.** Backend entitlement checks, UI plan
> gating, sales collateral, and the marketing site (`PLAN_FEATURE_MATRIX.md`
> in `perimeter-site/`) all derive from this file. Update here first, then
> sync downstream.

## Canonical plan keys

```
community   ← new free tier
starter     ← new paid SMB tier (replaces "essentials")
growth
assure
enterprise
```

### Legacy alias mapping (do not remove — protects existing tenants)

| Legacy input | Maps to |
|---|---|
| `free`, `bronze`, `essentials` | `starter` |
| `silver` | `growth` |
| `gold` | `assure` |

> `essentials` is preserved as a backend alias so any existing tenant records
> continue to resolve correctly. New signups should write `starter`.

---

## Positioning

| Plan | Target customer | Core value | Decision-maker |
|---|---|---|---|
| `community` | Solo founders, hobbyists, evaluators | Free continuous AWS posture for one account — prove the product | Engineer / founder |
| `starter` | Funded seed startups, 10–30 engineers | Production-grade scanning at credit-card price; self-serve | CTO / Head of Eng |
| `growth` | Series A startups, 30–80 engineers | Full detection + AI Chat + asset intelligence + FORESIGHT add-on | CTO + Security Eng |
| `assure` | Compliance-driven mid-market (SOC 2, ISO, RBI, IRDAI) | Audit-ready evidence packs across 8+ frameworks | CISO + Compliance + CFO |
| `enterprise` | Large orgs, BFSI, MSSPs, MSP partners | SSO, MSSP multi-tenancy, custom rules, BYOK chat, premium SLA | CISO + CFO + Procurement |

---

## Market positioning context

- **Primary market:** India (Bengaluru, Hyderabad, Mumbai, Delhi NCR, Pune).
- **Currency:** INR is primary, USD is reference. All Indian invoices include
  GST (CGST+SGST or IGST). TDS deductions (2–10%) are accepted and tracked.
- **Competing against (low end):** Prowler, Steampipe, AWS Security Hub —
  effectively free. Our value-add is the managed platform, real-time drift,
  AI chat, FORESIGHT, and compliance evidence packs.
- **Competing against (mid):** Scrut Automation, Sprinto — ~₹60k–2L/mo.
- **Competing against (high end):** Wiz, Orca, Palo Alto Prisma Cloud — all
  start at ₹30 lakh/year minimum, mostly out of reach for Indian SMB.
- **Anchor positioning:** AWS-only specialist, INR-native, sovereign data,
  FORESIGHT prediction layer (unique).

---

## Pricing (List, monthly)

All prices **exclude 18% GST**. INR is the headline price; USD shown for
international reference and AWS Marketplace listings.

| Plan | INR / month | USD ref | Annual prepay (20% off) | Included AWS accounts | Included seats | Overage |
|---|---:|---:|---:|---:|---:|---|
| `community` | **Free** | $0 | — | 1 | 1 | Cannot exceed; must upgrade |
| `starter` | **₹4,999** | $60 | ₹47,990/yr | 2 | 3 | `₹2,500 / extra account`, `₹500 / extra seat` |
| `growth` | **₹39,999** | $480 | ₹3,83,990/yr | 5 | 8 | `₹5,000 / extra account`, `₹1,000 / extra seat` |
| `assure` | **₹1,19,999** | $1,440 | ₹11,51,990/yr | 15 | 15 | `₹8,000 / extra account`, `₹1,500 / extra seat` |
| `enterprise` | **Custom** (floor ₹3,00,000/mo) | Custom | Custom | Custom | Custom | Negotiated commercial terms |

### FORESIGHT (predictive intelligence)

FORESIGHT is **bundled in Growth and above** at no extra charge. Customers
can toggle it off in `Settings → Features → FORESIGHT` (no price change —
they can re-enable any time). This is implemented via
`Tenant.FeatureOverrides["foresight"] = false`.

| Plan | FORESIGHT | Notes |
|---|---|---|
| `community` | Not available | — |
| `starter` | Not available | — |
| `growth` | **Bundled** (default ON, toggle in Settings) | Included in ₹39,999/mo |
| `assure` | **Bundled** (default ON, toggle in Settings) | Included in ₹1,19,999/mo |
| `enterprise` | **Bundled** (default ON, toggle in Settings) | Included in custom contract |

> FORESIGHT requires drift event stream (EventBridge → SQS → Foresight
> consumer). At least one AWS account must be onboarded via the EventBridge
> rules pack for predictions to populate.

### Billing terms

- **Default:** monthly, advance billing, INR via Razorpay (UPI / NEFT / card).
- **Annual:** 20% discount on base platform fee. `enterprise` annual is
  proposal-driven (typical 25–30% on multi-year).
- **GST:** 18% added at checkout; auto-generated GST invoice with HSN code
  `998314` (IT software services).
- **TDS:** customer-deducted TDS (2% u/s 194J) accepted; TDS certificate
  workflow available in `Settings → Billing → TDS Certificates`.
- **Currency:** USD billing available for international customers on request
  (enterprise only, wire transfer).

---

## Feature Entitlements

### ⚪ Community (Free)

> Goal: let any AWS user prove the product works against their environment
> within 5 minutes, with no credit card. Conversion driver.

**Security Scanning**
- AWS findings — IAM, S3, EC2, VPC, Security Groups only (~150 of 476 rules)
- Severity triage: CRITICAL / HIGH / MEDIUM / LOW
- **Manual / on-demand scans only** (no scheduling)
- 14-day finding history

**Findings Workflow**
- Findings list, detail drawer, status workflow (Open → Resolved)
- Basic filters (severity, service)

**Architecture Diagram Scanner**
- Public rate-limited endpoint (5 uploads / hour / account)
- All 30 architecture rules
- Findings displayed; no persistent scan history

**Platform**
- 1 AWS account, 1 user (OWNER role)
- Community Discord / GitHub Discussions support only
- No SLA, no email support, no integrations, no chat

**NOT included** (locked + upsell UI hint):
- IaC scanner, Dockerfile scanning
- Compliance frameworks
- Scheduled scans, drift detection
- AI Chat assistant
- Email / webhook connectors
- FORESIGHT
- Evidence packs / CSV / PDF export

---

### 🟢 Starter (₹4,999 / mo)

> *All Community features unlocked, plus:*

**Security Scanning — Full Catalog**
- All 476 unique security rules across 60+ AWS services
- IAM, S3, EC2, RDS, VPC, CloudTrail, KMS, Secrets Manager, EKS, ECS,
  Lambda, ECR, ELB, Route 53, API Gateway, Inspector
- Contextual scoring + SLA breach tracking + alert thresholds
- Remediation guidance: Terraform + CLI templates for all rules

**Findings Workflow (full)**
- Status workflow: Open → In Progress → Mitigated → Accepted Risk → Resolved
- Snooze with expiry, assignee, notes
- Full-text search + all filters (severity, SLA breach, date range)
- Compliance filter clear-all (atomic URL + state reset)

**IaC Security Scanner**
- Terraform (HCL), CloudFormation (YAML/JSON), Pulumi YAML
- **Dockerfile scanning** — DK001–DK010 (R-469–R-478): root user, unpinned
  tags, hardcoded secrets, HEALTHCHECK, ADD, curl-pipe-shell, unpinned
  packages, privileged ports, COPY ., no multi-stage
- Auto-format detection; ZIP archive support
- Security / Reliability / Maintainability / Cost quality scores
- Scan history persisted per tenant

**Architecture Diagram Scanner (unlocked)**
- Persistent scan history + CSV export
- 50 uploads / day / tenant
- API access (rate-limited)

**Dashboard**
- Severity trend widgets
- Account posture cards

**Platform**
- 2 AWS accounts, 3 seats
- Multi-region scanning
- **Scheduled scans (daily)** + manual scans
- **Real-time drift detection** (EventBridge → S3 delivery)
- Basic exports (CSV)
- Email notifications (transactional only — no integrations)
- **Email support** (best-effort, 24-business-hour response)

---

### 🔵 Growth (₹39,999 / mo) — POPULAR

> *All Starter features, plus:*

**Asset Intelligence**
- Asset inventory with risk enrichment
- Cost-risk optimisation views
- Region heatmap

**Advanced Scanning Modules**
- **GuardDuty ingestion** — active threat findings mapped to compliance tags
  (MITRE ATT&CK, ISO 27001:2022, CIS, PCI-DSS, SOC2, NIST 800-53)
- **CVE Scanner** — nightly NVD + ECR image + SSM patch correlation;
  ECRImageCVE and SSMPatchCVE findings; manual trigger, cron schedule,
  dedicated dashboard
- **AI/ML security** — Bedrock model access, SageMaker endpoint exposure,
  LLMjacking detection (high-capacity anomalies)
- **Insider Threat** — geo-location anomaly, failed console login bursts,
  lateral movement
- **Global Network** — Transit Gateway, Direct Connect, VPN posture
- **Glue / Athena** — data catalog encryption and access
- **OpenSearch** — cluster security and access control
- **AppSync** — GraphQL API security

**AI & Intelligence**
- **AI Chat Assistant** (Claude-powered, 7 MCP tools — list/search findings,
  severity/service counts, account list, scan history, posture summary)
- Rate limits: **10 queries/user/hr, 30/tenant/hr**
- Chat audit logging

**Reporting**
- Advanced reporting with 90-day retention
- Incidents and attack-path views

**Connectors**
- Email connector (SMTP / SES / SendGrid)
- Webhook connector (signed payloads, retry, delivery log)
- Sub-user invite emails

**FORESIGHT (Bundled — toggleable in Settings → Features)**
- Predictive engine: drift forecasting, finding escalation prediction
- Causal sequence reasoning narrated by Claude Haiku
- Realtime trigger (30s) + batch prediction cycle (30m)
- 80–150 token causal narratives (capped at 500 calls/day/tenant)

**Platform**
- 5 AWS accounts, 8 seats
- Hourly scheduled scans option
- All Starter features

---

### 🟡 Assure (₹1,19,999 / mo)

> *All Growth features, plus FORESIGHT bundled:*

**Compliance Module**
- Framework tabs: **CIS AWS v1.5, PCI-DSS, SOC 2, HIPAA,
  ISO 27001:2022, MITRE ATT&CK, NIST 800-53, GDPR**
- ISO 27001:2022 Annex A controls (A.5.x → A.8.x) — both old
  `ISO/IEC 27001 A.x.x` and new `ISO 27001:2022 A.x.x` tag formats
- MITRE ATT&CK technique mapping (T1078, T1562.008, T1552, T1537, T1190,
  T1110, T1098, T1496, T1550, T1525 etc.)
- Failed-controls view with affected findings count per control
- Evidence drawer: findings per control with remediation links
- Compliance findings filter (framework + control, with Clear All fix)
- "Run Compliance" backfill tagging
- Compliance posture widget on dashboard

**Audit**
- PDF evidence packs per framework
- Audit-oriented CSV exports (control × finding × remediation × asset)
- 1-year retention on compliance scans

**AI & Intelligence**
- AI Chat (Claude) — **25 queries/user/hr, 75/tenant/hr**
- Compliance-specific chat shortcuts (e.g. "show me failed CIS controls")
- Chat audit logging with 1-year retention

**FORESIGHT (Included)**
- Bundled — no separate add-on charge
- Same caps as Growth (500 narratives/day/tenant)
- Compliance-aware predictions (warns of imminent ISO/SOC drift)

**Platform**
- 15 AWS accounts, 15 seats
- Priority email + Slack-shared-channel support (4-hour business response)

---

### 🔴 Enterprise (Custom — floor ₹5,00,000 / mo)

> *All Assure features, plus:*

**Identity & Access**
- SSO / SAML 2.0 integration (Okta, Azure AD, Google Workspace, Ping)
- Advanced RBAC, delegated administration
- Custom role packs per business unit
- **Sub-tenant / MSSP multi-tenant management** — manage 10–500 child tenants
  from a single parent console

**Platform**
- Unlimited AWS accounts, seats
- Custom compliance frameworks (regulator-specific: RBI, IRDAI, MeitY)
- Custom policy packs and rules (engineer-supported authoring)
- API / webhook integrations at scale (rate limits negotiated)
- Custom onboarding (1-day onsite Bengaluru/Hyderabad/Mumbai option)
- Premium SLAs (99.9% uptime, 1-hour critical response)
- 24×7 phone + WhatsApp + Slack support

**AI & Intelligence**
- **AI Chat Assistant — UNLIMITED, BYOK** (bring your own Anthropic API key)
  - Customer's tokens, customer's billing relationship with Anthropic
  - No platform-side quota
- Chat audit logging with 7-year retention (DPDP-compliant)

**Data Sovereignty**
- Dedicated infra option (separate Atlas Project, RDS instance, Qdrant cluster)
- Customer-managed KMS keys for all data at rest
- Optional on-premise / VPC-deployed FORESIGHT for air-gapped environments

**Commercial**
- Multi-year contracts with locked pricing
- Procurement onboarding (MSA, DPA, DPDP addendum)
- TDS certificate auto-generation
- Quarterly business reviews with dedicated CSM

---

## Role Bundles by Plan

| Plan | Roles included | Max seats |
|---|---|---:|
| `community` | `OWNER` | 1 |
| `starter` | `OWNER`, `ADMIN`, `ANALYST`, `BILLING_ADMIN` | 3 |
| `growth` | Starter + `READ_ONLY`, `LEAD`, `SALES` | 8 |
| `assure` | Growth + compliance/audit operator roles | 15 |
| `enterprise` | Custom role packs, delegated admin, MSSP roles | Unlimited |

### Lead Intake Access Model
- `OWNER` and `ADMIN` have full lead management access.
- `LEAD` / `SALES` roles can access `/leads` and `/me` only
  (server-side enforced).
- Public lead ingestion endpoint: rate-limited, payload-validated,
  bot-abuse controlled.

---

## Feature Comparison Matrix (compact)

| Feature | Community | Starter | Growth | Assure | Enterprise |
|---|:---:|:---:|:---:|:---:|:---:|
| AWS accounts | 1 | 2 | 5 | 15 | Unlimited |
| Seats | 1 | 3 | 8 | 15 | Unlimited |
| Security rules | ~150 | **476** | 476 | 476 | 476 + custom |
| Scheduled scans | ❌ | Daily | Hourly | Hourly | Configurable |
| Real-time drift | ❌ | ✅ | ✅ | ✅ | ✅ |
| IaC scanner (TF/CFN/Pulumi/Docker) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Architecture Diagram Scanner | Limited | ✅ | ✅ | ✅ | ✅ |
| GuardDuty / CVE / Insider Threat | ❌ | ❌ | ✅ | ✅ | ✅ |
| AI/ML security (Bedrock, SageMaker) | ❌ | ❌ | ✅ | ✅ | ✅ |
| Asset Intelligence | ❌ | ❌ | ✅ | ✅ | ✅ |
| Compliance frameworks | ❌ | ❌ | ❌ | **8** | 8 + custom |
| Evidence packs (PDF) | ❌ | ❌ | ❌ | ✅ | ✅ |
| AI Chat (Claude + MCP) | ❌ | ❌ | 10/u/hr | 25/u/hr | **Unlimited BYOK** |
| FORESIGHT (predictive) | ❌ | ❌ | **Bundled** (toggle in Settings) | **Bundled** | Bundled |
| Email / Webhook connectors | ❌ | Email only | ✅ | ✅ | ✅ |
| SSO / SAML | ❌ | ❌ | ❌ | ❌ | ✅ |
| MSSP multi-tenant | ❌ | ❌ | ❌ | ❌ | ✅ |
| Custom rules / frameworks | ❌ | ❌ | ❌ | ❌ | ✅ |
| Support | Community | Email (24h) | Email (24h) | Priority + Slack (4h) | 24×7 phone/WhatsApp (1h) |

---

## Backend Enforcement Strategy

- Entitlement checks are **server-side** (source of truth);
  UI hides locked features as UX convenience only.
- `features` and `limits` stored on tenant entitlement record for
  granular rollout and per-tenant overrides.
- FORESIGHT is gated by a separate `features.foresight: true|false` flag
  so it can be enabled independently of plan (e.g. trial extension,
  custom commercial agreement).
- API contracts remain stable across plan changes — locked features
  return `403 plan_locked` with the upgrade target in the response body.

### Entitlement schema (per tenant record)

```json
{
  "plan": "growth",
  "billing_status": "active",
  "features": {
    "foresight": true,
    "ai_chat": true,
    "compliance_frameworks": false,
    "sso": false,
    "mssp": false,
    "custom_rules": false
  },
  "limits": {
    "max_aws_accounts": 5,
    "max_seats": 8,
    "chat_per_user_per_hr": 10,
    "chat_per_tenant_per_hr": 30,
    "scan_history_days": 90,
    "compliance_history_days": 0
  }
}
```

---

## Implementation Status

| Module | Status | Notes |
|---|---|---|
| Core IAM/S3/EC2/RDS/VPC rules | ✅ Shipped | 476 unique rules |
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
| Architecture Diagram Scanner | ✅ Shipped | 30 rules, draw.io/Excalidraw/AI Vision, public demo endpoint |
| Arch Scanner UI | ✅ Shipped | Upload + findings grid + CSV export |
| FORESIGHT predictive engine | ✅ Shipped | Foresight service, separate deploy |
| Razorpay subscription billing | ⏳ Pending | Required for Starter/Growth self-serve |
| GST invoice auto-generation | ⏳ Pending | HSN 998314, CGST/SGST/IGST logic |
| TDS certificate workflow | ⏳ Pending | Customer upload + reconciliation |
| Community-tier rate limiting | ⏳ Pending | New tier, needs entitlement enforcement |
| FORESIGHT add-on toggle | ⏳ Pending | Separate `features.foresight` flag wiring |

---

## Change log

| Date | Change | Rationale |
|---|---|---|
| 2026-05-17 | Restructured to 5 tiers (added Community + Starter, dropped Essentials as primary key); switched to INR primary pricing; added GST/TDS notes; Enterprise floor ₹3L/mo; Community finding history 14 days | India-focused pricing strategy targeting startup + mid-market segments; opens SMB market that prior $499 Essentials priced out |
| 2026-05-17 (rev 2) | FORESIGHT changed from optional add-on (₹20k) to **bundled in Growth+ with feature toggle**; no separate SKU. Customers can disable in Settings; no price discount for opting out. Add `PlanLimits`, `Tenant.FeatureOverrides`, `HasFeatureForTenant`. Add `IsBillable` / `TrialDays` / `RazorpayPlanID` to `PlanDefinition` schema | Simpler SKU surface; matches buyer feedback ("don't make me pick add-ons during signup, just give it to me") |
| 2026-05-17 (rev 3 — Phase 1 ship) | Added `FeatureForesight`, `FeatureFullRuleCatalog`, `FeatureScheduledScans`, `FeatureDriftDetection`, `FeatureIaCScanner` constants; new feature_gate response distinguishes `feature_required` (upgrade plan) from `feature_disabled_by_tenant` (re-enable in settings); `/v1/auth/me` now emits per-tenant features + limits + trial state | Phase 1 backend implementation per `docs/PLAN_FEATURE_MATRIX.md` |
