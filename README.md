# NOVA CART — Local Commerce Intelligence

> **Business Rescue & Hyperlocal Operational Intelligence Platform**  
> Diagnosing physical shelf stock degradation, fulfillment failure, and customer churn across 620 independent stores in Bengaluru.
>
> 🌐 **Live Production Deployment**: [https://nova-cart1.vercel.app](https://nova-cart1.vercel.app)  
> 📦 **GitHub Repository**: [bk-2007/NOVA_CART1](https://github.com/bk-2007/NOVA_CART1)  
> 🏆 **Engineered for Prompt Wars Business Rescue Challenge**

---

## 1. Executive Summary & Problem Diagnosis

**NOVA CART** is a quick-commerce and local shopping platform connecting customers with 620 independent partner kiranas and neighborhood stores across Bengaluru. Over the last six months, top-line vanity metrics expanded while unit economics collapsed:

```
Growth is up.
Growth quality is down.
```

### The Six-Month Divergence:
* **Registered Users**: 82,000 → **1,20,000** (+46.3%)
* **Monthly Active Users (MAU)**: 39,000 → **46,000** (+17.9%)
* **Monthly Orders**: 31,200 → **38,500** (+23.4%)
* **Average Order Value (AOV)**: ₹452 → **₹486** (+7.5%)
* **Repeat Purchase Rate**: 41% → **27%** (**-34.1% Collapse**)
* **Order Cancellation Rate**: 6% → **11%** (**+83.3% Surge**)
* **Average Delivery SLA**: 29 min → **37 min** (+27.6%)
* **Monthly Support Inquiries**: 3,100 → **5,900** (+90.3%)
* **Promotional Spend**: ₹9.5L → **₹17.0L/month** (+78.9%)
* **Net Monthly Revenue**: ₹21.8L → **₹26.1L/month**

---

## 2. Root Cause: The Hyperlocal Breakdown Chain

Rather than treating every customer complaint as an isolated defect, Nova Cart Local Commerce Intelligence models the root breakdown as a deterministic causal chain:

```
STALE / UNRELIABLE INVENTORY (39% stores report shelf sync too hard; audits aged >24h)
        ↓
PRODUCT UNAVAILABILITY (35% of all cancellations caused by out-of-stock on arrival)
        ↓
FAILED / CANCELLED ORDERS (11% cancellation rate; 13% delivered >15m late)
        ↓
DELIVERY / REFUND / SUPPORT FRICTION (5,900 tickets/mo; 16% refund dispute rate)
        ↓
CUSTOMER FRUSTRATION & CHURN (App perception drops; defection to local walking)
        ↓
SECOND-ORDER FAILURE (Only 31% place 2nd order within 30 days)
        ↓
RETENTION COLLAPSE (Repeat drops to 27%; ₹17L promo burn masks cohort decay)
```

Nova Cart resolves this breakdown within the **₹25 Lakhs / 6-Month implementation budget ceiling** by deploying real-time inventory confidence scoring, automatic pre-checkout local substitutions, operational risk dispatch queues, and precision targeted incentives.

---

## 3. System Architecture & Tech Stack

```
nova-cart-intelligence/
├── src/
│   ├── app/                         # Next.js 14 App Router
│   │   ├── api/                     # Type-safe API endpoints
│   │   │   ├── overview/            # Platform KPIs & causal shifts
│   │   │   ├── shop/search/         # Live search & alternative ranker
│   │   │   ├── orders/              # Order placement with risk engine
│   │   │   ├── inventory/           # Health audits & instant recalculation
│   │   │   ├── stores/              # Merchant fulfillment tracking
│   │   │   ├── operations/          # Priority queue & order resolution
│   │   │   ├── customers/           # Behavioral cohort analysis
│   │   │   ├── retention/           # Lifecycle funnel & second-order hurdle
│   │   │   ├── promotions/          # Promo burn & targeted approvals
│   │   │   └── impact/              # Scenario simulation engine
│   │   ├── shop/                    # Customer shopping & substitution UI
│   │   ├── inventory/               # Stale shelf audits & quick verification
│   │   ├── stores/                  # Store manager health intelligence
│   │   ├── operations/              # Operations Control Center (#NC1042)
│   │   ├── customers/               # Customer intelligence directory
│   │   ├── retention/               # 4-stage lifecycle funnel
│   │   ├── promotions/              # Incentive governance & coupon issuance
│   │   ├── impact/                  # Interactive scenario sliders & ROI
│   │   ├── layout.tsx               # Root layout with Cartography tokens
│   │   └── page.tsx                 # Executive diagnosis & The Signal
│   ├── components/                  # Reusable presentation components
│   │   ├── CartographyHeader.tsx    # GPS grid coordinates & Persona Switcher
│   │   ├── Navigation.tsx           # Editorial sidebar with section numbering
│   │   ├── MetricCard.tsx           # Fraunces KPI cards with trajectory badges
│   │   ├── CausalSignalDiagram.tsx  # Interactive causal chain breakdown
│   │   ├── ConfidenceBadge.tsx      # Availability score with reason tooltip
│   │   └── CartDrawer.tsx           # Basket drawer with live order placement
│   ├── lib/
│   │   ├── db.ts                    # Prisma singleton
│   │   ├── security.ts              # Rate limiting, sanitization, role guards
│   │   └── services/                # Pure business logic engines
│   │       ├── inventoryConfidenceService.ts
│   │       ├── recommendationService.ts
│   │       ├── retentionService.ts
│   │       ├── promotionService.ts
│   │       ├── riskEngine.ts
│   │       └── impactCalculator.ts
│   ├── types/                       # Domain models & engine contracts
│   └── tests/                       # Vitest unit & integration test suites
│       ├── engines.test.ts
│       └── integration.test.ts
├── prisma/
│   ├── schema.prisma                # Relational SQLite schema with indexes & FKs
│   └── seed.ts                      # 117 products, 12 stores, 25 users, 51 orders
└── vitest.config.ts
```

### Core Technologies:
* **Framework**: Next.js 14 (App Router, Server & Client Components)
* **Language**: TypeScript 5 (Strict Mode, 0 compile errors)
* **Styling**: Vanilla Tailwind CSS with custom editorial design tokens
* **Database & ORM**: SQLite + Prisma ORM (Foreign keys, indexes, transactions)
* **Validation**: Zod (Schema validation for all payloads and API queries)
* **Icons**: Lucide React
* **Testing**: Vitest (Unit and integration test suites)

---

## 4. Design Direction: Vintage Cartography + Modern Business Intelligence

The application intentionally avoids generic bright neon SaaS dashboards in favor of an **editorial, vintage cartography, and high-density intelligence aesthetic**:

### Color Palette Tokens:
* `--paper`: `#EBEEE7` (Pale sage background)
* `--paper-deep`: `#E1E6DE` (Deep parchment for card accents)
* `--ink`: `#2B3A30` (Deep forest green typographic base)
* `--ink-soft`: `#3D4A41` (Secondary legible slate green)
* `--muted`: `#6B746C` (Muted coordinate and annotation text)
* `--line`: `#C9D0C8` (Hairline editorial borders)
* `--white`: `#F7F8F4` (Warm off-white surface)
* `--danger`: `#8B5148` (Terracotta danger badge)
* `--warning`: `#8A7045` (Amber cautionary alert)
* `--success`: `#4F6B56` (Muted evergreen verified badge)

### Typography:
* **Fraunces**: Variable serif for hero titles, numbers, brand mark, and high-impact metrics.
* **Inter**: Clean modern sans-serif for tables, forms, labels, and analytical cards.
* **JetBrains Mono**: Monospaced coordinate strings, timestamps, order SKUs, and confidence scores.

---

## 5. The Six Domain Intelligence Engines

### 1. `inventoryConfidenceService`
Deterministic rule-based scoring computing on-shelf availability probability:
* **Inputs**: Stock level, safety stock buffer, hours since last verified audit, store fulfillment rate, store rejection velocity, and local grid demand.
* **Outputs**: `confidence` (5% - 99%), `riskLevel` (`LOW` | `MEDIUM` | `HIGH`), `isStale`, and explicit reasons (e.g. `"Inventory verified fresh (25m ago)"`, `"Historical fulfillment rate: 97%"`).

### 2. `recommendationService`
Triggers when a requested product's availability confidence drops below 70%:
* Evaluates nearby partner store inventories within the same delivery grid.
* Multi-criteria composite ranking:
  $$\text{Score} = (\text{Confidence} \times 0.50) + (\text{PriceMatch} \times 0.20) + (\text{StoreReliability} \times 0.15) + (\text{Speed} \times 0.15)$$
* Drops in a direct, in-stock alternative (e.g. recommending *Mother Dairy Milk 1L ₹65, 94% confidence* when *Amul Milk* drops to 42%).

### 3. `retentionService`
Cohort intelligence identifying behavioral lifecycle milestones:
* Segments: `NEW`, `FIRST_ORDER`, `SECOND_ORDER_RISK`, `REPEAT`, `HIGH_VALUE`, `AT_RISK`, `DORMANT`.
* Detects the **Second-Order Friction Window**: customers whose 1st order completed but second order has not occurred within 30 days.

### 4. `promotionService`
Disciplined margin protection replacing blunt blanket coupons:
* Eliminates the 44% unredeemed coupon leakage.
* Recommends surgical, margin-positive incentives (e.g. ₹40 incentive on ₹299 basket specifically for `SECOND_ORDER_RISK`).
* Preserves margins for `HIGH_VALUE` customers with VIP queue access rather than cash cuts.

### 5. `riskEngine`
Real-time operational order risk assessment:
* Scores orders on item availability, merchant rejection history, runner transit delay, and customer churn vulnerability.
* Feeds into the Operations Control Center priority queue (`HIGH`, `MEDIUM`, `LOW`).

### 6. `impactCalculator`
Empirical scenario turnaround model:
* Calculates recovered orders: $\text{Monthly Orders} \times (\text{Current Canc} - \text{Target Canc})$
* Calculates recovered GMV: $\text{Recovered Orders} \times \text{AOV}$
* Dynamically models support ticket savings (@ ₹180/ticket) and promo burn savings.
* Demonstrates a **4.6x ROI multiple** against the ₹25 Lakhs / 6-Month implementation budget.

---

## 6. Verification & Test Suite

The test suite covers all 6 domain engines, validation schemas, and database transactions:

```bash
npm test
```

### Test Coverage Highlights:
* `✓ 1. Inventory Availability Confidence Engine`: Verified high-confidence fresh audits and low-confidence stale audits (>24h).
* `✓ 2. Product Alternative Recommendation Engine`: Verified multi-criteria substitute ranking.
* `✓ 3. Customer Retention & Cohort Intelligence Engine`: Verified 30-day second-order dropoff and 72% 3-order habit milestone.
* `✓ 4. Targeted Promotion Governance Engine`: Verified margin-positive cohort incentives.
* `✓ 5. Operations Risk Engine`: Verified high-risk queue prioritization for Order #NC1042.
* `✓ 6. Business Impact & Scenario Calculator`: Verified formula accuracy and sensitivity.
* `✓ 7. Integration & System Validation Flow`: Verified end-to-end database updates, stock audit recalculation, and order resolution.

---

## 7. Setup & Execution Instructions

### Prerequisites:
* Node.js v18+ or v20+
* npm v9+

### Quick Start:
```bash
# 1. Install dependencies
npm install

# 2. Sync database schema
npx prisma db push

# 3. Seed realistic Bangalore dataset (117 SKUs, 12 stores, 25 customers, 51 orders)
npx tsx prisma/seed.ts

# 4. Run tests
npm test

# 5. Type-check codebase
npm run type-check

# 6. Build production bundle
npm run build

# 7. Start local server
npm start
```
The application will be live at `http://localhost:3000`.

---

## 8. Guided Live Demonstration Walkthrough

Follow this step-by-step path to demonstrate the entire operational loop:

1. **Overview (`/`)**:
   * Inspect the Hero statement: *"Growth is up. Growth quality is down."*
   * Review the 5 benchmark KPI cards (46K MAU, 38.5K orders, 27% repeat, 11% cancellation, 37 min delivery).
   * Click through **Stage 01 to 04** in **THE SIGNAL** interactive diagram to inspect the failure cascade.

2. **Customer Shopping (`/shop`)**:
   * Search box is prefilled with `"Milk"`.
   * Observe **Amul Taaza Milk 1L**: ₹68 with **42% availability confidence** (Stale audit >24h, 2 units remaining).
   * Observe the **RECOMMENDED LOCAL ALTERNATIVE** banner: **Mother Dairy Cow Fresh Milk 1L**: ₹65 (₹3 cheaper), **94% confidence** at nearby Anand Supermart.
   * Click **"Choose Alternative & Add to Basket"**.
   * Open the basket drawer and click **"Place Hyperlocal Order"**.
   * An order number is created with live risk scoring.

3. **Operations Control Center (`/operations`)**:
   * Locate **Order #NC1042** in the **Priority Queue** (`HIGH` risk, 84/100, pending).
   * Inspect the identified vulnerabilities: item availability risk + store rejection velocity.
   * Click the **"Resolve Order Risk"** button.
   * Watch the order state update live to `ACCEPTED`, risk drops to `LOW` (20/100), and resolution action is recorded.

4. **Inventory Health (`/inventory`)**:
   * Filter by **"Stale Audits (>24h)"**.
   * Locate an item with low confidence.
   * Click **"Verify (20 Units)"**.
   * The audit clock resets and confidence immediately increases live.

5. **Retention & Promotions (`/retention` & `/promotions`)**:
   * On `/retention`, view the 4-stage lifecycle funnel highlighting the 31% second-order bottleneck.
   * On `/promotions`, inspect the ₹17L monthly burn and 44% unused coupon wastage.
   * Locate **Rahul Sharma** (`SECOND_ORDER_RISK`).
   * Click **"Approve Incentive"**. Status flips to **"Approved"** with an issued coupon code.

6. **Impact Simulator (`/impact`)**:
   * Slide **Cancellation Rate** from 11% → 8%.
   * Slide **Repeat Rate** from 27% → 32%.
   * Slide **Support Inquiries** from 5,900 → 4,800.
   * Observe the live financial turnaround: **1,155 recovered monthly orders**, **₹5,61,330 recovered GMV/mo**, and **4.6x ROI** against the ₹25L implementation budget.

---

## 9. Security & Production Engineering Decisions

* **Input Validation**: All API routes validate incoming parameters with strict Zod schemas; negative numbers, empty strings, and malformed enums are rejected.
* **Input Sanitization**: User search inputs and text fields are sanitized to prevent script injection.
* **Rate Limiting**: Built-in token-bucket rate limiting safeguards sensitive mutation routes.
* **Secure Error Handling**: Internal database exceptions and stack traces are suppressed in production responses, presenting clean, user-friendly error messages.
* **Role-Based Simulation**: The header persona switcher allows testing the platform from the perspective of Customers, Store Managers, Operations Leads, and Executives.
* **Zero Placeholder Compromises**: Every button, slider, and state transition performs a real backend transaction or client-side calculation.

---

## 10. Engineering Checklist Audit

- [x] **Strict TypeScript**: 0 errors on `tsc --noEmit`.
- [x] **Relational Database**: Fully modeled Prisma SQLite database with foreign keys, indexes, and constraints.
- [x] **Separation of Concerns**: Database logic in `lib/db`, business logic in `lib/services/`, routing in `app/api/`, presentation in `components/`.
- [x] **Automated Testing**: 17 unit and integration tests passing in Vitest.
- [x] **Production Compilation**: `npm run build` generates optimized static and dynamic routes.
- [x] **Accessibility & Responsiveness**: Semantic HTML, visible focus states, responsive layouts across mobile, tablet, and desktop screens.
