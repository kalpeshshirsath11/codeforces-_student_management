                                               Student Progress Management System
Assignment Summary
Tech Stack: MERN (MongoDB, Express, React, Node.js)

Additional Tools: TypeScript, Node Cron, Nodemailer, Codeforces API

Submission Includes: GitHub code, demo video, and this documentation

Project Overview
The Student Progress Management System is a web application that tracks the competitive programming performance of students by leveraging their Codeforces activity. The system allows admins to manage student data and visualize their progress using interactive charts and tables.

Features
Student Table View
View student records with:

Name, Email, Phone Number

Codeforces Handle, Current Rating, Max Rating

Add, Edit, and Delete student entries

Download full dataset as CSV

Click on a row to view detailed profile

Student Profile View
Contest History

Filter options: Last 30, 90, or 365 days

Displays:

Rating graph

Contest list with:

Name

Rating change

Rank

Count of unsolved problems

Problem Solving Data

Filter options: Last 7, 30, or 90 days

Displays:

Most difficult problem solved (by rating)

Total problems solved

Average rating of solved problems

Average problems per day

Bar chart by rating buckets

Submission heatmap

Codeforces Data Sync
Library Used: node-cron

Runs daily at 2:00 AM

Syncs:

Contest history

Submission history

Rating updates

Realtime fetch on Codeforces handle update

Admin configurable sync time and frequency

Inactivity Detection and Email Alerts
Library Used: nodemailer

After each sync:

Detects inactive students (no submissions in last 7 days)

Sends automated email reminders

Tracks number of reminders sent

Option to disable reminders per student

Interface and UX
Responsive design: mobile, tablet, desktop

Light and dark theme toggle

Modular, clean, and well-documented codebase

REST API Summary
Endpoint	Description
GET /students	Fetch all students
GET /students/:id	Fetch a student by ID
POST /students	Add a new student
PUT /students/:id	Update a student
DELETE /students/:id	Delete a student
GET /students/:id/contests	Get contest history
GET /students/:id/problems	Get problem-solving stats
PUT /students/:id/notifications	Enable or disable email alerts

Submission Links
GitHub Repository: [GitHub Link Here]

Demo Video: [Video Link Here]

Developed With
Frontend: React + TypeScript, TailwindCSS

Backend: Express.js + Node.js

Database: MongoDB (Mongoose)

External APIs: Codeforces API

Email Service: Nodemailer (SMTP with Gmail)

Scheduler: node-cron

Acknowledgements
Codeforces Public API

Node Cron

Nodemailer

