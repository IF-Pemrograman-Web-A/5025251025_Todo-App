# E01a - The Style Warrior

## Identitas

**Nama:** Elba Galuh Hardiyanti  
**NRP:** 5025251025  

---

## Deskripsi

Website ini merupakan implementasi tugas **E01a - The Style Warrior** berupa halaman **Todo List** menggunakan **HTML dan CSS**.

Website dibuat dengan beberapa bagian utama, yaitu:

- Header
- Todo List
- Todo Detail
- Form untuk membuat Todo baru
- Footer

Website juga dibuat **responsive** sehingga tampilan dapat menyesuaikan ukuran layar desktop maupun mobile.

---

# 1. Struktur HTML

HTML digunakan untuk membuat struktur dan isi dari halaman Todo List. File yang digunakan adalah `index.html`.

## 1.1 Head

Bagian `<head>` digunakan untuk menentukan informasi dasar halaman seperti encoding, viewport, judul halaman, dan menghubungkan file CSS eksternal.

### HTML

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>My To do List</title>

    <link rel="stylesheet" href="style.css">
</head>
````

### Penjelasan

* `<meta charset="UTF-8">` digunakan agar halaman dapat menampilkan berbagai karakter dengan benar.
* `<meta name="viewport">` digunakan agar ukuran halaman dapat menyesuaikan dengan ukuran layar perangkat.
* `<title>` menentukan judul halaman yang ditampilkan pada tab browser.
* `<link rel="stylesheet" href="style.css">` digunakan untuk menghubungkan file HTML dengan CSS eksternal.

---

# 2. Header

Header merupakan bagian paling atas halaman yang berisi judul website dan deskripsi singkat.

### HTML

```html
<header class="header">
    <div class="header-content">
        <h1>My To do List</h1>
        <p>Stay organized and complete your tasks.</p>
    </div>
</header>
```

### CSS

```css
.header {
    background-color: #C65C69;
    color: #fADAD9;
    padding: 30px 7%;
}

.header-content {
    max-width: 1200px;
    margin: auto;
}

.header h1 {
    font-size: 30px;
    margin-bottom: 5px;
}

.header p {
    color: #E0959C;
    font-size: 14px;
}
```

### Penjelasan

Elemen `<header>` digunakan sebagai bagian kepala halaman.

Pada CSS:

* `.header` memberikan warna latar belakang, warna teks, dan jarak dalam header.
* `.header-content` membatasi lebar isi header agar tidak terlalu lebar pada layar besar.
* `.header h1` mengatur ukuran judul.
* `.header p` mengatur warna dan ukuran teks deskripsi.

---

# 3. Main Container

Bagian `<main>` digunakan untuk menampung dua panel utama, yaitu panel Todo List dan panel Todo Detail.

### HTML

```html
<main class="container">

    <section class="todo-panel">
        ...
    </section>

    <aside class="detail-panel">
        ...
    </aside>

</main>
```

### CSS

```css
.container {
    width: 86%;
    max-width: 1200px;

    margin: 35px auto;

    display: flex;
    flex-direction: row;

    gap: 25px;

    align-items: flex-start;
}
```

### Penjelasan

Elemen `<main>` digunakan sebagai konten utama halaman.

Layout dibuat menggunakan **Flexbox** dengan:

```css
display: flex;
flex-direction: row;
```

Dengan pengaturan tersebut, kedua panel ditampilkan secara berdampingan.

* Panel Todo berada di sebelah kiri.
* Panel Detail berada di sebelah kanan.
* `gap: 25px` memberikan jarak antara kedua panel.

---

# 4. Todo List Panel

Panel sebelah kiri digunakan untuk menampilkan daftar tugas.

### HTML

```html
<section class="todo-panel">

    <div class="panel-header">
        <div>
            <h2>My Todos</h2>
            <p>3 tasks remaining</p>
        </div>

        <span class="todo-count">3</span>
    </div>

    <div class="todo-list">
        ...
    </div>

</section>
```

### CSS

```css
.todo-panel {
    width: 60%;

    background-color: #fADAD9;

    padding: 25px;

    border-radius: 12px;

    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
```

### Penjelasan

Panel ini menggunakan `<section>` karena berisi satu bagian utama dari halaman, yaitu daftar Todo.

Panel diberikan:

* Lebar sebesar 60%.
* Warna latar belakang pink muda.
* Padding agar isi tidak menempel pada tepi.
* Border radius agar sudut panel membulat.
* Box shadow agar panel terlihat lebih menonjol.

---

# 5. Daftar Todo

Daftar Todo berisi tiga tugas kuliah sebagai dummy data.

### HTML

```html
<div class="todo-list">

    <article class="todo-item active">

        <div class="checkbox"></div>

        <div class="todo-content">
            <h3>Tugas Pemrograman Web</h3>

            <p>
                Deadline: 14 September 2026
            </p>

            <span class="tag">Kuliah</span>
        </div>

        <span class="priority high">
            High
        </span>

    </article>

    <article class="todo-item">

        <div class="checkbox"></div>

        <div class="todo-content">
            <h3>
                Tugas Konsep Kecerdasan Artificial
            </h3>

            <p>
                Deadline: 15 September 2026
            </p>

            <span class="tag">Kuliah</span>
        </div>

        <span class="priority high">
            High
        </span>

    </article>

    <article class="todo-item">

        <div class="checkbox"></div>

        <div class="todo-content">
            <h3>Tugas Matematika Diskrit</h3>

            <p>
                Deadline: 16 September 2026
            </p>

            <span class="tag">Kuliah</span>
        </div>

        <span class="priority high">
            High
        </span>

    </article>

</div>
```

### CSS

```css
.todo-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.todo-item {
    display: flex;

    align-items: flex-start;

    gap: 12px;

    padding: 17px;

    border: 1px solid #f3C3c5;

    border-radius: 9px;

    background-color: #fADAD9;
}
```

### Penjelasan

Setiap Todo dibuat menggunakan elemen `<article>` karena setiap tugas merupakan satu bagian yang berdiri sendiri.

Terdapat tiga dummy Todo:

1. **Tugas Pemrograman Web**

   * Deadline: 14 September 2026
   * Priority: High

2. **Tugas Konsep Kecerdasan Artificial**

   * Deadline: 15 September 2026
   * Priority: High

3. **Tugas Matematika Diskrit**

   * Deadline: 16 September 2026
   * Priority: High

CSS `display: flex` pada `.todo-item` digunakan agar checkbox, informasi tugas, dan priority dapat tersusun dalam satu baris.

---

# 6. Checkbox dan Informasi Todo

### HTML

```html
<div class="checkbox"></div>

<div class="todo-content">
    <h3>Tugas Pemrograman Web</h3>

    <p>
        Deadline: 14 September 2026
    </p>

    <span class="tag">Kuliah</span>
</div>
```

### CSS

```css
.checkbox {
    width: 20px;
    height: 20px;

    border: 2px solid #CE6F79;

    border-radius: 5px;

    flex-shrink: 0;
}

.todo-content {
    flex: 1;
}

.todo-content h3 {
    font-size: 15px;
    margin-bottom: 4px;
}

.todo-content p {
    color: #E0959C;
    font-size: 13px;
    margin-bottom: 8px;
}
```

### Penjelasan

`.checkbox` digunakan untuk membuat tampilan kotak checklist.

`.todo-content` digunakan untuk mengatur informasi tugas seperti nama tugas, deadline, dan kategori.

Properti:

```css
flex: 1;
```

membuat bagian informasi Todo menggunakan ruang yang tersedia di antara checkbox dan priority.

---

# 7. Priority

Setiap Todo memiliki tingkat prioritas.

### HTML

```html
<span class="priority high">
    High
</span>
```

### CSS

```css
.priority {
    font-size: 11px;

    padding: 4px 8px;

    border-radius: 15px;

    font-weight: bold;
}

.priority.high {
    background-color: #ffe1e1;
    color: #c33;
}

.priority.medium {
    background-color: #fff0c9;
    color: #a36b00;
}

.priority.low {
    background-color: #ddf5e5;
    color: #287443;
}
```

### Penjelasan

Class `.priority` digunakan sebagai style dasar untuk label priority.

Terdapat tiga kemungkinan priority:

* High
* Medium
* Low

Pada dummy data yang digunakan, semua tugas memiliki priority **High**.

---

# 8. Todo Detail Panel

Panel sebelah kanan digunakan untuk menampilkan informasi lebih detail mengenai Todo yang dipilih.

### HTML

```html
<aside class="detail-panel">

    <div class="detail-header">

        <span class="label">
            TO DO DETAILS
        </span>

        <h2>
            Tugas Pemrograman Web
        </h2>

        <p>
            Deadline: 14 September 2026
        </p>

    </div>

</aside>
```

### CSS

```css
.detail-panel {
    width: 40%;

    background-color: #C65C69;

    color: #fADAD9;

    padding: 28px;

    border-radius: 12px;

    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}
```

### Penjelasan

Elemen `<aside>` digunakan untuk membuat panel informasi tambahan yang berhubungan dengan Todo utama.

Panel ini dibuat dengan warna pink yang lebih gelap untuk memberikan perbedaan visual dengan panel Todo List.

Lebarnya adalah 40%, sehingga jika digabungkan dengan panel kiri 60%, kedua panel memenuhi area utama halaman.

---

# 9. Detail Informasi Todo

### HTML

```html
<div class="detail-info">

    <div class="info-item">
        <span class="info-label">
            Status
        </span>

        <strong>
            Not Started
        </strong>
    </div>

    <div class="info-item">
        <span class="info-label">
            Priority
        </span>

        <strong class="text-high">
            High
        </strong>
    </div>

    <div class="info-item">
        <span class="info-label">
            Due Date
        </span>

        <strong>
            14 September 2026
        </strong>
    </div>

    <div class="info-item">
        <span class="info-label">
            Category
        </span>

        <strong>
            Kuliah
        </strong>
    </div>

</div>
```

### CSS

```css
.detail-info {
    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 20px;

    margin: 28px 0;
}

.info-item {
    border-top: 1px solid #CE6F79;

    padding-top: 12px;
}
```

### Penjelasan

Bagian detail menggunakan **CSS Grid** untuk mengatur informasi menjadi dua kolom.

Informasi yang ditampilkan adalah:

* Status
* Priority
* Due Date
* Category

Penggunaan:

```css
grid-template-columns: 1fr 1fr;
```

membuat informasi terbagi menjadi dua kolom dengan ukuran yang sama.

---

# 10. Description

### HTML

```html
<div class="description">

    <h3>
        Description
    </h3>

    <p>
        Tugas E01a & E01b deadline jam 20.00 WIB.
    </p>

</div>
```

### CSS

```css
.description {
    border-top: 1px solid #CE6F79;

    padding-top: 20px;
}

.description h3 {
    font-size: 15px;

    margin-bottom: 8px;
}

.description p {
    color: #F3C3c5;

    font-size: 13px;
}
```

### Penjelasan

Bagian description memberikan informasi tambahan mengenai tugas yang sedang ditampilkan.

---

# 11. Action Button

### HTML

```html
<div class="actions">

    <button class="btn complete-btn">
        Mark as Complete
    </button>

    <button class="btn delete-btn">
        Delete Todo
    </button>

</div>
```

### CSS

```css
.actions {
    display: flex;

    gap: 10px;

    margin-top: 25px;
}

.btn {
    flex: 1;

    padding: 11px;

    border-radius: 7px;

    cursor: pointer;

    font-weight: bold;
}

.complete-btn {
    border: none;

    background-color: #fADAD9;

    color: #C65C69;
}

.delete-btn {
    background-color: transparent;

    color: #4A202A;

    border: 1px solid #4A202A;
}
```

### Penjelasan

Terdapat dua tombol:

* `Mark as Complete` untuk menandai Todo sebagai selesai.
* `Delete Todo` untuk menghapus Todo.

Karena tugas menggunakan HTML dan CSS saja, tombol tersebut hanya merupakan tampilan antarmuka dan belum memiliki fungsi JavaScript.

---

# 12. Form Create New Todo

Bagian ini digunakan untuk membuat tampilan form untuk menambahkan Todo baru.

### HTML

```html
<section class="new-todo-section">

    <form class="todo-form">

        <div class="form-heading">

            <span class="label">
                NEW TASK
            </span>

            <h2>
                Create a New To do
            </h2>

        </div>

        <div class="form-group">

            <label for="title">
                To do Title
            </label>

            <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter your task..."
            >

        </div>

        <div class="form-group">

            <label for="description">
                Description
            </label>

            <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Describe your task..."
            ></textarea>

        </div>

        <div class="form-row">

            <div class="form-group">

                <label for="priority">
                    Priority
                </label>

                <select
                    id="priority"
                    name="priority"
                >
                    <option value="high">
                        High
                    </option>

                    <option value="medium">
                        Medium
                    </option>

                    <option value="low">
                        Low
                    </option>

                </select>

            </div>

            <div class="form-group">

                <label for="date">
                    Due Date
                </label>

                <input
                    type="date"
                    id="date"
                    name="date"
                >

            </div>

        </div>

        <button
            type="submit"
            class="add-btn"
        >
            + Add Todo
        </button>

    </form>

</section>
```

### CSS

```css
.new-todo-section {
    width: 86%;
    max-width: 1200px;
    margin: 0 auto 40px;
}

.todo-form {
    background-color: #fADAD9;

    padding: 28px;

    border-radius: 12px;

    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.form-group {
    margin-bottom: 17px;
}

.form-group label {
    display: block;

    font-size: 13px;

    font-weight: bold;

    margin-bottom: 6px;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;

    padding: 11px;

    border: 1px solid #dddddd;

    border-radius: 7px;

    font-size: 14px;

    background-color: #fADAD9;
}

.form-row {
    display: flex;

    gap: 15px;
}

.form-row .form-group {
    flex: 1;
}

.add-btn {
    width: 100%;

    padding: 12px;

    border: none;

    border-radius: 7px;

    background-color: #c65c69;

    color: #fADAD9;

    font-weight: bold;

    cursor: pointer;
}
```

### Penjelasan

Form terdiri dari beberapa input:

* Todo Title
* Description
* Priority
* Due Date

Bagian Priority dan Due Date dibuat berdampingan menggunakan Flexbox.

Tombol `Add Todo` berada di bagian bawah form.

---

# 13. Footer

Footer merupakan bagian paling bawah halaman.

### HTML

```html
<footer class="footer">

    <p>
        © 2026 My To do List
    </p>

</footer>
```

### CSS

```css
.footer {
    text-align: center;

    padding: 25px;

    color: #c65c69;

    font-size: 13px;
}
```

### Penjelasan

Elemen `<footer>` digunakan untuk memberikan informasi penutup pada halaman.

---

# 14. Responsive Design

Website dibuat responsive agar dapat digunakan pada berbagai ukuran layar.

### CSS

```css
@media (max-width: 850px) {

    .container {
        flex-direction: column;
    }

    .todo-panel,
    .detail-panel {
        width: 100%;
    }

}
```

### Penjelasan

Ketika lebar layar kurang dari atau sama dengan 850px, kedua panel tidak lagi berada berdampingan.

Panel akan berubah menjadi:

```text
Todo List
    ↓
Todo Detail
```

Hal ini membuat website lebih mudah digunakan pada tablet dan layar yang lebih kecil.

---

# 15. Responsive Design untuk Mobile

### CSS

```css
@media (max-width: 600px) {

    .header {
        padding: 25px 5%;
    }

    .header h1 {
        font-size: 25px;
    }

    .container {
        width: 90%;
        margin: 25px auto;
    }

    .todo-panel,
    .detail-panel {
        padding: 20px;
    }

    .todo-item {
        flex-wrap: wrap;
    }

    .priority {
        margin-left: 32px;
    }

    .detail-info {
        grid-template-columns: 1fr;
    }

    .actions {
        flex-direction: column;
    }

    .form-row {
        flex-direction: column;
        gap: 0;
    }

    .new-todo-section {
        width: 90%;
    }

    .todo-form {
        padding: 20px;
    }

}
```

### Penjelasan

Media query dengan batas `600px` digunakan untuk perangkat mobile.

Beberapa perubahan yang dilakukan:

* Ukuran header diperkecil.
* Lebar container disesuaikan menjadi 90%.
* Detail informasi berubah menjadi satu kolom.
* Tombol action disusun vertikal.
* Input Priority dan Due Date disusun vertikal.
* Padding form diperkecil.

Dengan demikian, tampilan tetap nyaman digunakan pada layar HP.

---

# 16. Tampilan Website

## Tampilan Desktop

<img width="1917" height="925" alt="Screenshot 2026-09-14 172734" src="https://github.com/user-attachments/assets/d18b7ca0-f967-4dc8-b1cc-5c87bef36259" />

<img width="1917" height="907" alt="Screenshot 2026-09-14 172751" src="https://github.com/user-attachments/assets/6c1084b5-d1e9-42ee-a59e-a5220f3c11cd" />


## Tampilan Mobile

<img width="369.5" height="800" alt="image" src="https://github.com/user-attachments/assets/c6230a7f-aa4b-4ab5-a92f-ee5b9a3a8f43" />

<img width="369.5" height="800" alt="image" src="https://github.com/user-attachments/assets/1208765b-472f-49dd-9d7d-474c4d37cecf" />

<img width="369.5" height="800" alt="image" src="https://github.com/user-attachments/assets/4168d2c7-49da-41ae-9cf2-4ff75b23fc73" />


---
