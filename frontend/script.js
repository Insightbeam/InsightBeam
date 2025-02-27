async function fetchData(endpoint) {
    const response = await fetch(`/api/${endpoint}`);
    return response.json();
}

async function loadDashboard() {
    const grades = await fetchData('grades');
    renderGradeChart(grades);
    renderInsights(grades);
    renderMissingAssignments(grades);
    renderUpcomingEvents(grades);
}

function renderGradeChart(grades) {
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: grades.map(grade => grade.course),
            datasets: [{
                label: 'Grades',
                data: grades.map(grade => grade.score),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function renderInsights(grades) {
    const averageGrade = (grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length);
    document.getElementById('insightsText').innerText = `Average Grade: ${averageGrade.toFixed(2)}`;
}

function renderMissingAssignments(grades) {
    const assignmentsList = document.getElementById('assignmentsList');
    grades.forEach(grade => {
        if (grade.missing) {
            const li = document.createElement('li');
            li.innerText = `${grade.course}: ${grade.assignment}`;
            assignmentsList.appendChild(li);
        }
    });
}

function renderUpcomingEvents(grades) {
    const eventsList = document.getElementById('eventsList');
    grades.forEach(grade => {
        if (grade.due_date) {
            const li = document.createElement('li');
            li.innerText = `${grade.course}: ${grade.assignment} (Due: ${grade.due_date})`;
            eventsList.appendChild(li);
        }
    });
}

loadDashboard();
