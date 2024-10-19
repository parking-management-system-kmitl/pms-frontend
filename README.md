# Github 101
## Branch
- master: สำหรับ deploy (ทำ pipeline CI/CD)
- develop: สำหรับ dev และ test (รวม code ทุกคน)
- feaure/{name}: branch แยกสำหรับแต่ละคน
---

## Step by Step
1. checkout มา branch ตัวเองก่อน
```bash
git checkout feature/gift
```
2. เมื่อ dev เสร็จให้ commit โดยมี pattern ดังนี้ `{gitmoji} [{option}] {description}` 

    - [gitmoji](https://gitmoji.dev/): emoji ที่แสดงแต่ละความหมายของการ commit เช่น ✨ หมายถึง new feature
    - name: ชื่อเราพิมพ์ใหญ่ทั้งหมดเช่น **GIFT**, **FEB**
    - description: คำอธิบาย commit

ตัวอย่าง commit
```bash
git commit -m "✨ [GIFT] Update new table header"
```
3. commit เสร็จ push เข้า branch ตัวเองได้เลย
4. เมื่อจะรวม code ของเราเข้ากับคนอื่น เปิด Pull request โดยเข้าไปที่ repo ใน github กดแท็บ `Pull request` แล้วก็กดปุ่ม [New pull request](https://github.com/parking-management-system-kmitl/pms-frontend/compare) จากนั้นเลือก `compare` เป็น branch เราและ `base` เป็น `develop` จากนั้นกดปุ่ม `Create pull request` ถ้าไม่มี conflict หรือ error ก็ merge ได้เลย แต่ถ้ามี conflict!! ดูตามนี้ [conflict case](#conflict-case)
5. ถ้าทำ CI/CD ที่ branch master แล้วกดทำ pull request และ merge เข้าไปที่ branch master ได้เลย
---

## Conflict case
 กรณีถ้าเจอ conflict หรือกดเปิด pull request ไม่ได้ให้แก้ conflict ก่อนโดย 
 1. เช็คก่อนว่าอยู่ branch ที่ตัวเอง dev มั้ย ถ้าอยู่ก็ไปข้อต่อไป
 2. จากนั้น pull branch develop ตามนี้
 ```bash
 git pull origin develop
 ```
 โดยถ้าขึ้นแบบนี้
```log
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint: 
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint: 
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
```
แสดงว่าเรายังไม่ได้ตั้งค่า pull rebase ถ้าไม่มีข้ามไปข้อต่อไป ในที่นี้บังคับใช้เป็น pull.rebase false โดยใช้คำสั่งนี้
```bash
git config pull.rebase false
```
จากนั้นก็ 
```bash
git pull origin develop
```
3. จากนั้นจะมีให้แก้ conflict ใน code เช่น
```javascript
<<<<<<< HEAD
const greeting = "Hello from branch develop!";
=======
const greeting = "Hello from branch feature/gift!";
>>>>>>> feature/gift
```
จะเห็นว่า มี `HEAD` คืออันที่มีอยู่ ส่วน `feature/gift` ในตัวอย่างคือ branch เรา จุดนี้ต้องถามว่า dev คนอื่นๆในทีมว่าจะ merge ยังไง อันไหนใช้บ้าง บลาๆๆๆ
4. จากนนั้น commit ตาม push ตามปกติ

---