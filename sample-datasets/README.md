# SynapseIQ — Enterprise Sample Dataset Library & Validation Suite

Welcome to the **SynapseIQ Dataset Library**. This collection contains realistic, domain-specific CSV datasets and edge-case stress-testing files designed for judges, recruiters, and developers to evaluate SynapseIQ across multiple industries.

---

## 📊 1. Industry Domain Datasets

| File | Industry Domain | Record Count | Core Metrics Analyzed | Primary AI Strategy Vector |
|---|---|---|---|---|
| **[`sales.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/sales.csv)** | Sales & Revenue Strategy | 300 rows | `Sales`, `Revenue`, `Profit`, `Quantity` | Revenue growth acceleration & territorial margin expansion |
| **[`hr.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/hr.csv)** | Human Resources & Workforce | 300 rows | `Salary`, `Experience`, `Performance`, `Attrition` | Retention risk mitigation & performance compensation alignment |
| **[`finance.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/finance.csv)** | Financial Optimization | 240 rows | `Revenue`, `Expenses`, `Net_Profit`, `Cash_Flow` | Operating cost reduction & free cash flow optimization |
| **[`healthcare.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/healthcare.csv)** | Healthcare Operations | 250 rows | `Patients`, `Recovery_Rate`, `Readmission_Rate` | Clinical throughput optimization & readmission SLA reduction |
| **[`manufacturing.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/manufacturing.csv)** | Manufacturing & Supply Chain | 300 rows | `Production`, `Downtime`, `Defect_Rate`, `Output` | Predictive maintenance & yield defect minimization |
| **[`retail.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/retail.csv)** | Retail & Inventory | 300 rows | `Inventory`, `Sales`, `Margin`, `Customer_Count` | Inventory turnover velocity & gross margin conservation |
| **[`education.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/education.csv)** | Educational Institutions | 250 rows | `Students`, `Attendance`, `Exam_Score`, `Graduation_Rate` | Student retention & academic outcome elevation |
| **[`logistics.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/logistics.csv)** | Freight & Logistics | 300 rows | `Delivery_Time`, `Fuel_Cost`, `Delayed`, `Distance` | Route fuel efficiency & on-time delivery SLA protection |
| **[`banking.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/banking.csv)** | Banking & Financial Services | 250 rows | `Deposits`, `Loans`, `Defaults`, `Revenue` | Credit risk mitigation & deposit-to-loan ratio optimization |
| **[`energy.csv`](file:///D:/Projects/SynapseIQ/sample-datasets/energy.csv)** | Energy & Sustainability | 250 rows | `Energy_Output`, `Downtime`, `Efficiency`, `Carbon_Emission` | Asset uptime maximization & carbon footprint reduction |

---

## 🛠️ 2. Detailed Dataset Profiles & Recommended Prompts

### 1. `sales.csv` (Sales Strategy)
* **Business Purpose**: Simulates multi-region enterprise SaaS and software license transactions.
* **Expected Executive Brief Focus**: Identifies high-margin territorial segments (e.g. EMEA vs. APAC) and seasonal revenue spikes.
* **Recommended Decision Copilot Questions**:
  - *"What is driving the revenue variance between North America and APAC?"*
  - *"Which product lines deliver the highest operating margin per unit sold?"*
* **Expected Forecast Behavior**: Simulates ARR impact when price is adjusted $\pm 10\%$.

### 2. `hr.csv` (Workforce Intelligence)
* **Business Purpose**: Analyzes employee compensation, experience, performance scores, and flight risks.
* **Expected Executive Brief Focus**: Flags attrition correlation among high-performing junior engineers.
* **Recommended Decision Copilot Questions**:
  - *"How does training hours impact employee performance across departments?"*
  - *"What are the primary indicators of attrition among staff with 1–3 years experience?"*

### 3. `finance.csv` (Corporate Finance)
* **Business Purpose**: Tracks monthly operating expenses, gross margins, cash flow, and net profit trends.
* **Expected Executive Brief Focus**: Detects margin compression during periods of rising operating costs.
* **Recommended Decision Copilot Questions**:
  - *"What is our current cash conversion efficiency relative to operating expenditure?"*
  - *"How can we optimize net profit without reducing growth capital allocation?"*

### 4. `manufacturing.csv` (Operational Yield)
* **Business Purpose**: Monitors plant production volumes, unplanned downtime hours, defect rates, and maintenance overhead.
* **Expected Executive Brief Focus**: Highlights downtime cost spikes at key assembly plants.
* **Recommended Decision Copilot Questions**:
  - *"What is the financial cost of unplanned downtime across our production plants?"*
  - *"How does maintenance spending correlate with defect rate reductions?"*

---

## ⚡ 3. Edge-Case Datasets for Robustness Testing

Located in **[`sample-datasets/edge-cases/`](file:///D:/Projects/SynapseIQ/sample-datasets/edge-cases/)**:

1. **`small_dataset.csv`** (12 rows): Validates statistical integrity on micro-datasets without crashing variance algorithms.
2. **`large_dataset.csv`** (3,000 rows): Stress tests fast Web Worker parsing and virtualized chart rendering under load.
3. **`missing_values.csv`**: Ensures missing cells are gracefully filtered during mean/variance computation.
4. **`duplicate_rows.csv`**: Tests deduplication and uniqueness preservation in data ingestion.
5. **`outliers.csv`**: Tests statistical Z-score outlier detection ($Z \ge 4.5$).
6. **`mixed_date_formats.csv`**: Tests multi-format ISO date parsing (YYYY-MM-DD, MM/DD/YYYY, DD-Mon-YYYY).
7. **`invalid_numeric_values.csv`**: Validates non-numeric sanitization ("N/A", "$1,200", "INVALID") without runtime `NaN` pollution.

---

## 🚀 4. How to Test in SynapseIQ

1. Open SynapseIQ in your browser.
2. Drag and drop any CSV file from `sample-datasets/` into the **Upload Zone** on the Landing Page.
3. Watch **AI Mission Control** automatically profile columns, detect the industry domain, compute correlation matrices, and generate tailored executive insights.
