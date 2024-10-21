const apiUrl = 'http://localhost:3000/api/courses'; // Змініть URL на ваш

// Функція для отримання курсів
async function getCourses() {
    const response = await fetch(apiUrl);
    const courses = await response.json();
    const coursesDiv = document.getElementById('courses');
    coursesDiv.innerHTML = ''; // Очищуємо попередній контент

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card'); // Додаємо клас картки
        courseCard.innerHTML = `
            <h3 class="course-title">${course.title}</h3>
            <p class="course-description">${course.description}</p>
            <p>Тривалість: ${course.duration} годин</p>
            <a href="#" class="course-button">Деталі</a>
        `;
        coursesDiv.appendChild(courseCard); // Додаємо картку безпосередньо до основного div
    });
}



// Функція для додавання курсу
document.getElementById('addCourseForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const duration = document.getElementById('duration').value;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, duration })
    });

    if (response.ok) {
        getCourses(); // Оновити список курсів
        document.getElementById('addCourseForm').reset(); // Скинути форму
    } else {
        alert('Виникла помилка при додаванні курсу');
    }
});

// Отримати курси при завантаженні сторінки
getCourses();
