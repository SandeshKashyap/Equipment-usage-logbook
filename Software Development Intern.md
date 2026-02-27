# **Software Development Intern** 

## **⏱ Time Limit:** 4 hours

You may use AI tools. We care about correctness, structure, clarity, and compliance with instructions.

---

# **📌 Technical Prerequisites**

Before starting this assignment, you should be comfortable with:

* Github ID  
* React (functional components, state management, forms)  
* Tailwind CSS  
* Spring Boot (Controllers, Services, Repositories)  
* REST API development  
* PostgreSQL  
* Basic SQL concepts (relationships, foreign keys)

If you use additional libraries (e.g., UI helpers, form libraries, ORM tools), clearly mention them in your README along with installation steps.

---

# **🛠 Build an Equipment Management System**

Create a web application to manage equipment and their maintenance lifecycle.

---

# **✅ Core Features**

Users should be able to:

1. View a list of equipment (table format)  
2. Add new equipment  
3. Edit existing equipment  
4. Delete equipment

Each equipment record must contain:

* **Name** (text)  
* **Type** (dropdown – dynamic from database)  
* **Status** (Active, Inactive, Under Maintenance)  
* **Last Cleaned Date** (date)

---

# **🔄 Additional Workflow 1 – Maintenance Logging**

Add the ability to log maintenance events for equipment.

Each maintenance record must contain:

* Equipment (reference)  
* Maintenance Date  
* Notes (text)  
* Performed By (text)

### **Business Rules:**

* When a maintenance record is added:  
  * Equipment status must automatically change to **Active**  
  * Last Cleaned Date must update to the Maintenance Date  
* Maintenance history must be viewable for each equipment item.

This logic must be implemented in the backend.

---

# **🔐 Additional Workflow 2 – Status Constraint**

Add the following rule:

Equipment cannot be marked as “Active” if the Last Cleaned Date is older than 30 days.

If violated:

* The backend must reject the request  
* A meaningful error message must be shown in the UI

This rule must be enforced in the backend.

---

# **🧱 Technical Requirements**

## **Frontend**

* Use **React**  
* Use **shadcn/ui components \+ Tailwind only**  
* ❌ No inline styles (`style={{}}`)  
* ❌ No raw HTML form elements (`<input>`, `<select>`, `<button>`)  
* Add and Edit must reuse the same form component  
* Add basic validation  
* Display equipment in a table  
* Display maintenance history (modal or expandable section)

---

## **Backend**

* Use **Spring Boot with Java**  
* Use layered architecture:  
  * Controller  
  * Service  
  * Repository  
* Create the following REST endpoints:

### **Equipment**

* `GET /api/equipment`  
* `POST /api/equipment`  
* `PUT /api/equipment/{id}`  
* `DELETE /api/equipment/{id}`

### **Maintenance**

* `POST /api/maintenance`  
* `GET /api/equipment/{id}/maintenance`  
* Use safe, parameterized queries (no string concatenation)  
* Implement proper exception handling  
* Return appropriate HTTP status codes

---

## **Database**

* Use **PostgreSQL**  
* Properly model relationships between:  
  * Equipment  
  * Equipment Types  
  * Maintenance Logs

---

## **Important Requirement**

Equipment types must be modifiable in the future without requiring code changes.

Design your database schema accordingly.

You are not required to build a UI to manage equipment types, but the schema must support this requirement.

---

# **📋 Compliance File (Required)**

Include a file named `COMPLIANCE.md` that confirms:

* No inline styles were used  
* No raw HTML form elements were used  
* Add and Edit reuse the same form component  
* Equipment types are not hardcoded in the database schema  
* Business rules are enforced in the backend

Submissions that violate UI compliance rules may be rejected.

---

# **📦 Submission Instructions (Very Important)**

1. Push your project to a **public GitHub repository**.  
2. The repository must be publicly accessible.

⚠️ Private repositories, broken links, or access issues will lead to disqualification.

Your repository must include:

* `README.md` with:  
  * Setup instructions  
  * How to run frontend and backend  
  * Database setup steps  
  * Any additional libraries used and how to install them  
  * Any assumptions made  
* `COMPLIANCE.md`

---

# **📚 If Additional Libraries Are Used**

If your solution requires installing any additional libraries:

* Clearly mention all dependencies in `README.md`  
* Include exact installation commands (e.g., `npm install`, `mvn install`)  
* Ensure the project runs without manual debugging

Submissions that cannot be run using the provided instructions may not be evaluated.

---

# **🎁 Bonus (Optional)**

* Filtering by status  
* Pagination  
* Search  
* Server-side sorting  
* Docker setup

---

# **🧪 What We Evaluate**

* Correctness and completeness  
* Compliance with instructions  
* Backend structure and business rule enforcement  
* Database schema design  
* Code clarity and organization  
* UI compliance (shadcn \+ Tailwind only)

---

Good luck — we look forward to reviewing your submission.

