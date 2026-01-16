🛒 E-Commerce Search & Filtering Platform

A scalable, search-driven e-commerce platform built with a modern backend and frontend stack, focusing on efficient product search, filtering, pagination, and category hierarchy handling.
Designed to handle large product datasets (1000+ products) with optimized backend logic and clean frontend rendering.

🚀 Project Overview

This project implements a real-world e-commerce product listing system similar to Amazon/Flipkart search pages.
It supports:

High-volume product data

Advanced filtering & subcategory selection

Backend-driven pagination

Proper product image rendering

Clean separation of frontend & backend

The main goal is to efficiently fetch, filter, and display large product catalogs without performance bottlenecks.

🧩 Key Features
🔍 Product Search

Keyword-based product search

Partial and flexible matching

Search combined with filters (not isolated)

🧠 Advanced Filtering

Category & sub-category filtering

Backend-driven filter logic (single source of truth)

Filtered results retain correct pagination & images

📄 Pagination (Optimized)

Backend handles pagination logic

Supports fetching entire dataset (e.g., 1200 products) correctly

Prevents frontend-side slicing bugs

Custom page and limit handling

🖼️ Product Image Rendering

Proper handling of image URLs

Graceful fallback for missing images

Ensures images align with filtered products

🗂️ Category & Breadcrumb Logic

Hierarchical category paths

Dynamic breadcrumb computation from backend

Consistent category data across search & filter APIs

🏗️ Tech Stack
Backend

Java

Spring Boot

Spring Data MongoDB

MongoDB

RESTful API architecture

Frontend

React

TypeScript

Vite

Tailwind CSS

Axios for API communication

📦 Project Structure
ecommerce/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   └── config/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── public/
│
└── README.md

🔄 API Flow (High Level)

Frontend sends search & filter parameters

Backend:

Applies filters

Computes breadcrumbs

Handles pagination

Returns products + metadata

Frontend:

Renders products

Displays images correctly

Updates UI dynamically without refetch issues

📊 Example API Request
{
  "query": "laptop",
  "page": 0,
  "limit": 20
}

📤 Example API Response
{
  "products": [...],
  "totalElements": 1200,
  "totalPages": 60,
  "currentPage": 0,
  "filters": [...],
  "breadcrumbs": [...]
}

🧠 Learning Outcomes

Designing scalable search APIs

Handling large datasets efficiently

Backend-first pagination strategy

Clean frontend-backend separation

Real-world MongoDB query optimization

🔮 Future Enhancements

Sorting (price, popularity, rating)

ElasticSearch integration

Caching with Redis

User authentication

Wishlist & cart system

👨‍💻 Author

Akshat Pal
Full-Stack Developer | Backend-Focused
📌 Built as a production-grade learning project