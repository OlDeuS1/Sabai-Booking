# 🏨 Sabai Booking
<img width="989" alt="App Preview" src="https://github.com/user-attachments/assets/847b81fc-967d-4e93-95be-5039f0049dc2" />

> **Web Application สำหรับค้นหาและจองห้องพักโรงแรมแบบครบวงจร**
>
> *โปรเจกต์นี้ถูกพัฒนาขึ้นเพื่อศึกษาการทำงานของระบบจองที่พัก (SPA) และการวางโครงสร้าง Infrastructure บน Cloud (AWS)*

![Vue.js](https://img.shields.io/badge/vuejs-%2335495E.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

![Amazon EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![Amazon RDS](https://img.shields.io/badge/Amazon%20RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)

---

## ✨ Features (คุณสมบัติเด่น)

ระบบแบ่งผู้ใช้งานออกเป็น 3 ระดับ เพื่อการจัดการที่มีประสิทธิภาพ:

### 👤 1. ผู้ใช้งานทั่วไป (Guest/User)
* **Authentication:** สมัครสมาชิกและเข้าสู่ระบบ
* **Search Engine:** ค้นหาโรงแรมตามวันที่, จำนวนคน และสถานที่
* **Booking:** ดูรายละเอียด, ราคา, สิ่งอำนวยความสะดวก และทำการจองห้องพัก
* **Management:** ตรวจสอบประวัติการจอง, สถานะการชำระเงิน และรีวิว (Rating) โรงแรม

### 🏨 2. ผู้ดูแลโรงแรม (Hotel Admin)
* **Hotel Management:** จัดการข้อมูลโรงแรม (เพิ่ม/ลบ/แก้ไข ห้องพักและรายละเอียด)
* **Reservation:** ตรวจสอบรายการจองเข้าพัก และอัปเดตสถานะการจอง

### 🛠️ 3. ผู้ดูแลระบบแพลตฟอร์ม (Platform Admin)
* **System Oversight:** ตรวจสอบและอนุมัติโรงแรมใหม่ที่มาลงทะเบียน
* **User Management:** จัดการบัญชีผู้ใช้และโรงแรมในระบบ

---

## ☁️ Cloud Architecture (AWS)
โปรเจกต์นี้จำลองการใช้งานจริงบน **Amazon Web Services (AWS)** โดยมีการออกแบบโครงสร้างดังนี้:

<img width="1130" alt="AWS Architecture" src="https://github.com/user-attachments/assets/47b3d393-9721-4f2a-abad-23a4970cedc3" />

* **EC2 (Compute):** ใช้ Deploy Application Server โดยมีการ Config Nginx เป็น Reverse Proxy และใช้ PM2 ในการจัดการ Process เพื่อให้ Server ทำงานได้ตลอดเวลา
* **S3 (Storage):** เก็บรูปภาพห้องพักแบบ Object Storage โดยมีการตั้งค่า Bucket Policy ให้เข้าถึงได้เฉพาะ Public Read เพื่อลดภาระของ Web Server
* **RDS (Database):** ใช้ PostgreSQL บน Cloud ที่แยกออกจาก EC2 เพื่อความเสถียร (Reliability) และรองรับการทำ Automatic Backup
* **VPC & Security Group:** มีการจัด Network Security โดยเปิด Port เฉพาะที่จำเป็น (80, 443) และจำกัดการเข้าถึง Database เฉพาะ IP ของ EC2 เท่านั้น

> *Note: ปัจจุบัน Deployment บน AWS ได้หมดอายุลงแล้ว แต่ Code ยังสามารถรันบน Local Environment ได้ตามปกติ*

---

## 🗺️ Database Design (ER Diagram)
โครงสร้างฐานข้อมูลออกแบบด้วย **PostgreSQL** โดยเน้นความถูกต้องของข้อมูล (Data Integrity) และความสัมพันธ์แบบ Relational Database:

<img width="1930" height="1175" alt="image" src="https://github.com/user-attachments/assets/af667c9c-3e1e-4e31-9e5b-f98974669027" />

---

## 🛠️ Installation & Setup

หากต้องการรันโปรเจกต์นี้ในเครื่องของคุณ (Local Environment)

**Prerequisites:**
* Node.js (v16+)
* PostgreSQL
* Git

### ขั้นตอนการติดตั้ง

1. **Clone the repository**
   
   ```bash
   git clone https://github.com/OlDeuS1/Sabai-Booking.git
   ```
   
2. **Install dependencies**
   
   ```bash
   npm install
   ```

3. **Create Database ⚠️ สร้าง Database ใน PostgreSQL ของคุณให้เรียบร้อยก่อนเริ่มใช้งาน (ชื่อต้องตรงกับในไฟล์ .env)**

   ```bash
   -- ตัวอย่างคำสั่ง SQL (หรือสร้างผ่าน pgAdmin)
   CREATE DATABASE sabai_db;
   ```
  
4. **Database Configuration สร้างไฟล์ .env ที่ root directory และกำหนดค่าเชื่อมต่อฐานข้อมูล:**
   
   ```bash
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sabai_db
   DB_USER=postgres
   DB_PASSWORD=your_db_password
    
   # Server Configuration
   PORT=3000
   ```
   
5. **Run the Application เนื่องจากระบบแยกส่วน Frontend และ Backend จำเป็นต้องรันทั้ง 2 ส่วน:**
   
   **Terminal 1: Start Backend Server**
   
   ```bash
   cd src/server
   nodemon server.js
   # หรือ node server.js
   ```
   
   **Terminal 2: Start Frontend (Vue.js)**
   
   ```bash
   # กลับมาที่ root directory
   npm run dev
   ```

## 🏬 Project Structure
โครงสร้างไฟล์ถูกออกแบบโดยเน้นความ Modular (MVC Pattern) เพื่อให้ง่ายต่อการดูแลรักษา
```bash
src/
├── controllers/      # Logic การทำงานหลักของ API
├── middleware/       # ตัวกลางจัดการ Request (Auth, Validations)
├── models/           # Database Models
├── server/           # Server Entry Point & DB Connection
│   └── db/
└── views/            # Frontend (Vue.js)
    ├── assets/       # Static files (Icons, Images)
    ├── components/   # Reusable Vue Components
    ├── composables/  # Vue Composables logic
    ├── router/       # Vue Router Setup
    └── views/        # หน้าเว็บหลัก (Pages)
 ```

## 📚 Technical Highlights (สิ่งที่ได้เรียนรู้)
โปรเจกต์นี้เป็นการผสมผสานระหว่าง Full-Stack Development และ Cloud Engineering:

- **Full-Stack Integration:** การเชื่อมต่อ Vue.js เข้ากับ Node.js API และ Database อย่างสมบูรณ์
- **SPA Development:** การพัฒนา Web Application แบบ Single Page Application ที่ลื่นไหล ไม่ต้องโหลดหน้าใหม่
- **AWS Services:**
  - เรียนรู้การ Deploy และ Config EC2 ตั้งแต่เริ่มต้น
  - การจัดการ Object Storage ผ่าน S3 Bucket
  - การเชื่อมต่อ Database บน Cloud ด้วย RDS
  - การทำ Load Balancing เพื่อจัดการ Traffic
- **Security Implementation:** การทำ Authentication, Authorization และ Role-based management

## 🚀 Roadmap
- [ ] พัฒนาระบบอัปเดตข้อมูลแบบ Real-time ด้วย Socket.io
- [ ] เชื่อมต่อระบบชำระเงินจริง (Payment Gateway) รองรับ Omise/Stripe
- [ ] เพิ่มระบบตรวจสอบสถานะ Server (Monitoring) ด้วย AWS CloudWatch
- [ ] ติดตั้งระบบ Auto Scaling Group เพื่อรองรับปริมาณ Traffic จำนวนมาก

## 👥 Contributors (ทีมผู้พัฒนา)
- **Nuttawat (Frontend Dev):** พัฒนาส่วนหน้าตาเว็บไซต์ (UI/UX) และการเชื่อมต่อ API ทั้งหมด
- **Serista3 (Cloud & Frontend):** พัฒนา Frontend, ดูแล Infrastructure บน AWS ทั้งหมด (EC2, S3, RDS, ELB), Deploy ระบบ และช่วยงาน Backend
- **OlDeuS1 (Backend Dev):** ออกแบบ Database Schema, พัฒนา API, ระบบหลังบ้าน และเชื่อมต่อ Database

## 🧑‍💼 Contact
หากมีข้อเสนอแนะหรือพบปัญหาในการใช้งาน สามารถติดต่อพวกเราได้ที่: 📧 Email: stacla5282@gmail.com
