
## ขั้นตอนการติดตั้ง

### 1. การติดตั้ง Package
เลือกใช้คำสั่งใดคำสั่งหนึ่งต่อไปนี้:

```bash
# yarn
yarn install
# หรือแบบย่อ
yarn
```

```bash
# npm
npm install
```

### 2. การตั้งค่าฐานข้อมูล
ทำการสร้างฐานข้อมูลโดยใช้คำสั่งใดคำสั่งหนึ่งต่อไปนี้:

```bash
# yarn
yarn migration:run
```

```bash
# npm
npm run migration:run
```

### 3. การรัน API
```bash
# yarn
yarn dev หรือ yarn start
```
```bash
# npm
npm run dev หรือ npm run start
```

## การ Run Unit Test

```bash
# yarn
yarn test
```

```bash
# npm
npm run test
```

## การ Run Unit Test เพื่อดู Coverage

```bash
# yarn
yarn test:cov
```

```bash
# npm
npm run test:cov
```

folder coverage ที่ชั้นนอกสุดของ project จะถูกสร้างขึ้นมา

หากต้องการดูผลการทดสอบทั้งหมดสามารถเข้าดูได้ที่ `coverage/lcov-report/index.html`


## โครงสร้างของ project จะอยู่ที่ `src`,`test` และ `modules`

- `src` จะเป็นที่อยู่ของการสร้างฟังก์ชันหลักของ project
- `test` จะอยู่ภายใต้ folder module ต่างๆ
- `modules` ทั้งหมดจะอยู่ภายใต้ `src/ชื่อ Module` เช่น `src/auth` และประกอบไปด้วย folder และ file ต่างๆดังนี้
    - `filename.module.ts` เป็นไฟล์สำหรับจัดการ Module ทั้งการ Import หรือ Export ของ Module นั้นๆ
    - `filename.controller.ts` เป็นไฟล์สำหรับการสร้าง Route และ Validate Route เป็นทางเข้าของ API
    - `filename.service.ts` เป็นไฟล์สำหรับการสร้าง Business Logic สำหรับการทำงานของ API
    - `filename.helper.ts` เป็นไฟล์สำหรับแยก Business Logic บางส่วนที่มีการใช้งานมากกว่า 1 ที่ออกมา
    - `/dto` เป็นที่อยู่สำหรับการเก็บไฟล์ DTO ในการทำ Validation ของ API หากอยู่ที่ Controller 
    จะทำหน้าที่เป็น Validation ของ API แต่หากเรียกใช้ใน service จะเป็นลักษณะของการ declare type
    - `/entities` เป็นที่อยู่สำหรับการสร้าง Entity หรือ Schema Table ของ Module นั้นๆ
    - `/test` เป็นที่อยู่สำหรับเก็บ Unit Test 
- `src/utils` เป็นที่เก็บสำหรับ Common Function ที่จะใช้หลายๆที่โดยจะแยกเป็นเรื่องต่างๆ เช่น interface, type, function ต่างๆ
- `src/config` เป็นที่เก็บ Config สำหรับเชื่อมต่อกับ Database และเป็นที่เก็บ file migrations　ทั้งหมด

## Package ที่เพิ่มเติมนอกเหนือจาก NestJS
- `class-transformer` สำหรับทำ transform ในส่วนของ DTO
- `class-validator` สำหรับทำ validation ในส่วนของ DTO
- `cookie-parser` สำหรับใช้ในการตรวจสอบ Cookie ของ API
- `device-detector-js` สำหรับใช้ในการตรวจสอบอุปกรณ์ที่ใช้ในการเข้าถึง API
- `passport` เป็น Package สำหรับการสร้าง Authentication ของ NestJS
- `passport-jwt` เป็น Package สำหรับการสร้าง JWT ของ NestJS
- `pg` เป็น Package สำหรับการเชื่อมต่อกับ Database PostgreSQL
