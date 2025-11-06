# GearUP — Vehicle Rental App  

## 👥 Team Members & Folder Structure  

This repository is organized so each team member has their own dedicated folder for development.  
This structure avoids merge conflicts and keeps everyone’s work organized before integration.  

GearUP-Vehicle-Rental-App/
│
├── avi/ → Avi’s components and UI pages (e.g., Search Page, Firebase setup)
│
├── anku/ → Anku’s components (e.g., Register Page, styling updates)
│
├── tanveer/ → Tanveer’s components (e.g., Login Page, authentication logic)
│
├── shared/ → Common files used by the entire team (e.g., Firebase config, assets, utils)
│
└── README.md → Project overview, setup guide, and team documentation


### 🧭 Collaboration Rules
- Each member works **only in their folder** to avoid merge conflicts.  
- Shared files (like configs or constants) go into the `shared/` folder.  
- Before editing anything in `shared/`, inform the group in Teams.  
- Regularly run `git pull` to stay updated with other members’ changes.  

---

## 🚗 Project Overview  

**GearUP** is a **web-based vehicle rental application** that allows users to search, book, and manage rental vehicles in a simple and intuitive interface.  
It aims to streamline the vehicle rental process for both customers and rental agencies through automation and accessibility.  

### 🎯 Project Goals
- Build a responsive and user-friendly interface for renters.  
- Enable secure user authentication and data handling.  
- Integrate a Firebase backend for real-time data management.  
- Display available vehicles with filters (location, transmission, price).  
- Provide clear booking flow and confirmation system.  

---

## 🧩 Technologies Used
- **React.js** — Frontend framework for building the UI  
- **Firebase** — Authentication and database  
- **HTML5 / CSS3 / JavaScript (ES6)** — Core technologies for layout and interactivity  
- **GitHub** — Version control and collaboration  
- **VS Code** — Main development environment  

---

## 🏗️ Current Progress (as of Week 3)
- ✅ Initial meeting with client Tariq Khan completed  
- ✅ Wireframes and UI designs created  
- ✅ Project repository and folder structure set up  
- ✅ Sprint 1 user stories completed (basic UI and navigation)  
- 🔄 Sprint 2 in progress — Firebase setup and integration  

---

## 🌱 Sustainability & SDG Alignment
- **Environmental:** Encourages shared mobility to reduce individual vehicle ownership and emissions.  
- **Social:** Promotes accessibility and inclusion by connecting renters and vehicle owners easily.  
- **Economic:** Helps small rental providers grow by giving them digital visibility.  
- **SDG Goals:**  
  - SDG 11: Sustainable Cities and Communities  
  - SDG 13: Climate Action  
  - SDG 8: Decent Work and Economic Growth  

---

## ⚙️ How to Run Locally

### 1️⃣ Clone this repository  
```bash
git clone https://github.com/Aviyash1/GearUP-Vehicle-Rental-App.git

2️⃣ Open the project in VS Code
cd GearUP-Vehicle-Rental-App

3️⃣ Install dependencies

(once Firebase and React setup are merged)

npm install

4️⃣ Start the application
npm start

🧑‍💻 Contribution Guidelines

Each member works in their folder (avi, anku, tanveer).

Commit regularly with meaningful messages (e.g., Added search page UI, Updated Register component).

Use pull requests for major shared updates.

Don’t edit other members’ folders unless agreed upon in the group.

📅 Project Details

Client: Tariq Khan

Project Manager: Waruni Hewage

Team Members:

Aviyash Shohil Kumar

Anku Ankush

Tanveer Singh

Institution: Otago Polytechnic (Future Skills, Auckland)

Course: Introductory Application Development (Studio 3 Integration)

📌 Future Improvements

Vehicle owner dashboard for listing management

Payment gateway integration

Push notifications for booking updates

Admin analytics panel