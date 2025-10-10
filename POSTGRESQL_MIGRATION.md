# การเปลี่ยนจาก SQLite ไปใช้ PostgreSQL

## ขั้นตอนการติดตั้งและตั้งค่า PostgreSQL

### 1. ติดตั้ง PostgreSQL
- ดาวน์โหลดและติดตั้ง PostgreSQL จาก https://www.postgresql.org/download/
- หรือใช้ Docker: `docker run --name postgres-sabai -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

### 2. สร้างฐานข้อมูล
```sql
-- เชื่อมต่อกับ PostgreSQL ในฐานะ superuser
CREATE DATABASE sabai_booking;
CREATE USER sabai_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sabai_booking TO sabai_user;
```

### 3. รันไฟล์ schema
```bash
psql -h localhost -U postgres -d sabai_booking -f database/schema.sql
```

### 4. Import ข้อมูลตัวอย่าง (ถ้าต้องการ)
```bash
psql -h localhost -U postgres -d sabai_booking -f database/migrate_data.sql
```

### 5. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ในโฟลเดอร์ root ของโปรเจค:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sabai_booking
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
```

### 6. ติดตั้ง Dependencies
```bash
npm install
```

### 7. รันโปรเจค
```bash
npm run dev
```

## การเปลี่ยนแปลงหลัก

### 1. ฐานข้อมูล
- เปลี่ยนจาก SQLite เป็น PostgreSQL
- ใช้ `SERIAL` แทน `INTEGER AUTOINCREMENT`
- ใช้ `DECIMAL` แทน `REAL` สำหรับตัวเลขทศนิยม
- ใช้ `VARCHAR` แทน `TEXT` สำหรับข้อความที่มีความยาวจำกัด
- ใช้ `TIMESTAMP` แทน `TEXT` สำหรับวันที่และเวลา

### 2. Connection Pool
- ใช้ `pg` package แทน `sqlite3`
- ใช้ Connection Pool เพื่อประสิทธิภาพที่ดีกว่า
- สร้าง DatabaseAdapter class เพื่อให้ API เหมือนเดิม

### 3. SQL Queries
- แปลง parameter placeholders จาก `?` เป็น `$1, $2, ...`
- ใช้ `RETURNING` clause แทนการใช้ `lastID`
- ปรับปรุง data types ให้เหมาะกับ PostgreSQL

### 4. Error Handling
- ปรับปรุง error handling เพื่อรองรับ PostgreSQL errors
- เพิ่ม connection timeout และ idle timeout

## ข้อดีของการใช้ PostgreSQL

1. **ประสิทธิภาพ**: รองรับ concurrent connections และ complex queries ได้ดีกว่า
2. **Scalability**: สามารถขยายขนาดได้ง่ายกว่า
3. **ACID Compliance**: รองรับ transactions อย่างสมบูรณ์
4. **Advanced Features**: รองรับ JSON, Full-text search, และ advanced indexing
5. **Production Ready**: เหมาะสำหรับใช้งานจริงในระดับ enterprise

## การ Backup และ Restore

### Backup
```bash
pg_dump -h localhost -U postgres sabai_booking > backup.sql
```

### Restore
```bash
psql -h localhost -U postgres -d sabai_booking < backup.sql
```

## การ Monitor และ Performance Tuning

### ดูการใช้งาน Connection Pool
```javascript
console.log('Total connections:', pool.totalCount);
console.log('Idle connections:', pool.idleCount);
console.log('Waiting requests:', pool.waitingCount);
```

### ปรับแต่ง Connection Pool
```javascript
const pool = new Pool({
  max: 20,                // จำนวน connection สูงสุด
  idleTimeoutMillis: 30000, // เวลาที่ connection ว่างก่อนปิด
  connectionTimeoutMillis: 2000, // เวลารอ connection ใหม่
});
```