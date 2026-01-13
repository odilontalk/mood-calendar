const MAX_MOOD_TYPE = 4;
const STORAGE_KEY = 'mood-data';

function getMoodData(year) {
    return Array.from({ length: 12 }, (_, monthIndex) => {
        const date = new Date(year, monthIndex, 1);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        return {
            year,
            month: date.toLocaleString('default', { month: 'short' }),
            days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            moods: Array(daysInMonth).fill(0)
        };
    });
}

function drawCalendar(container, moodData) {
    const table = document.createElement('table');

    moodData.forEach((monthData, monthIndex) => {
        const row = document.createElement('tr');

        const header = document.createElement('th');
        header.textContent = monthData.month;
        row.appendChild(header);

        monthData.days.forEach((dayNumber, dayIndex) => {
            const dayCell = document.createElement('td');

            const getCurrentMood = () => moodData[monthIndex].moods[dayIndex];
            const getNextMood = (current) => (current + 1) % MAX_MOOD_TYPE;

            dayCell.textContent = dayNumber;
            dayCell.className = `mood-${getCurrentMood()}`;

            dayCell.addEventListener('click', () => {
                const nextMood = getNextMood(getCurrentMood());
                
                moodData[monthIndex].moods[dayIndex] = nextMood;
                dayCell.className = `mood-${nextMood}`;

                localStorage.setItem(STORAGE_KEY, JSON.stringify(moodData));
            });

            row.appendChild(dayCell);
        });

        table.appendChild(row);
    });

    container.appendChild(table);
}

const year = new Date().getFullYear();

let moodData = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? getMoodData(year);
localStorage.setItem(STORAGE_KEY, JSON.stringify(moodData));

const formatedTitle = `${year} Mood Calendar`;
const title = document.querySelector('#title')

title.textContent = formatedTitle;

const app = document.querySelector('#app');
drawCalendar(app, moodData);