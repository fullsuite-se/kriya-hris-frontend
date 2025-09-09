# HRIS Frontend

This project is the frontend for the new **Kriya HRIS**, built with **React + Vite**.  
It serves as the core interface for managing employees and controlling access to various microservices.

## 🚀 Overview

- **Employee Management** – manage personal details, job information, and organizational data.  
- **Access Control** – fine-grained access to different microservices (HRIS, ATS, Payroll, Suitelifer).  
- **Single Source of Truth** – other microservices fetch data from here, making HRIS the central hub.  

## 🛠️ Tech Stack

- **React + Vite** – fast development with hot module replacement (HMR).  
- **Tailwind CSS + ShadCN/UI** – modern UI components and styling.  
- **React Router** – for navigation and route protection.  
- **Zustand** – lightweight state management.  
- **ESLint** – linting and code quality rules.  

## 📂 Features Implemented

- Authentication and token-based authorization.  
- Role-based navigation and feature-based access control.  
- Reusable form components with validation.  
- API services for managing users, jobs, companies, and government remittances.  
- Utility functions for data formatting and transformations.  