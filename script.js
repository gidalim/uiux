console.log("JavaScript 연결확인");

const SERVICENAME = "Calendar Service";

const tagForm = document.querySelector("#tag_form");
const tagNameInput = document.querySelector("#tag_name");
const tagSubmitButton = document.querySelector("#tagSubmitButton");
const tagList = document.querySelector("#tagList");
const tagMessage = document.querySelector("#tagMessage");
const themeButton = document.querySelector("#themeButton");
const calendarTitle = document.querySelector("#calendarTitle");
const calendarList = document.querySelector("#calendarList");
const prevMonthButton = document.querySelector("#prevMonthButton");
const nextMonthButton = document.querySelector("#nextMonthButton");
const tabMonth = document.querySelector("#tabMonth");
const tabWeek = document.querySelector("#tabWeek");

let Tags = {
    "외부 일정": "pink", 
    "과제": "green", 
    "강의": "blue", 
};

let viewDate = new Date();
let currentViewMode = window.innerWidth <= 768 ? "week" : "month"; 

let isSubmitTag = false

const COLOR_LIST = {
  gray:   { name: "회색",   bg: "#E3E2E0", text: "#201F1D", darkBg: "#2F2F2F", darkText: "#9B9A97" },
  brown:  { name: "갈색",   bg: "#EBDAD4", text: "#4E3227", darkBg: "#432E27", darkText: "#BA856F" },
  orange: { name: "주황색", bg: "#F8D8C8", text: "#7D421B", darkBg: "#492F24", darkText: "#C77D48" },
  yellow: { name: "노란색", bg: "#F7E5A9", text: "#6B4A18", darkBg: "#40361F", darkText: "#CA984D" },
  green:  { name: "초록색", bg: "#D4E8D4", text: "#1E4630", darkBg: "#27382B", darkText: "#529E72" },
  blue:   { name: "파란색", bg: "#CCE5F3", text: "#1C3658", darkBg: "#1F3849", darkText: "#5E87C9" },
  purple: { name: "보라색", bg: "#E7DAF2", text: "#4C2668", darkBg: "#3B2D4A", darkText: "#9D68D3" },
  pink:   { name: "분홍색", bg: "#F5D5E6", text: "#68264C", darkBg: "#4E2C3F", darkText: "#C15C93" },
  red:    { name: "빨간색", bg: "#FBCFD1", text: "#752522", darkBg: "#522E2A", darkText: "#EB5757" }
};


function getRandomColor(){
    const keys = Object.keys(COLOR_LIST);
    return keys[Math.floor(Math.random() * keys.length)];
}

function makeTagsMessage(tagName, createdTag){
    if(createdTag == true){ 
        return `${tagName} 태그 생성 완료!`;
    }
    else if(createdTag == false){
        return `${tagName} 태그가 이미 존재합니다!`;
    }
}

function addCreateDOM(name, color){
    const newTags = document.createElement("li");
    newTags.textContent = name;
    newTags.classList.add(`tag-${color}`);
    tagList.appendChild(newTags);

    console.log("태그가 생성되었어요!", Tags);
}

function renderInitialTags(){
    for(const [tagName, tagColor] of Object.entries(Tags)){
        addCreateDOM(tagName, tagColor);
    }

    console.log("초기 태그 렌더링 완료!");
}


function lockSubmitButton() {
    isSubmitTag = true;
    tagSubmitButton.disabled = true;
    tagSubmitButton.classList.add("is-success", "disabled");

    setTimeout(() => {
        isSubmitTag = false;
        tagSubmitButton.disabled = false;
        tagSubmitButton.classList.remove("is-success", "disabled");
        tagNameInput.focus();
    }, 500);
}

function handleTagSubmit(event){
    event.preventDefault();

    if (isSubmitTag) return;

    const tagName = tagNameInput.value.trim();  

    if(tagName === ""){
        tagMessage.textContent = 
        "태그 입력란이 비어있어요!";
        return;
    }

    if (tagName in Tags) {
        tagMessage.textContent = makeTagsMessage(tagName, false);

        } else {
            const randomColor = getRandomColor();
            Tags[tagName] = randomColor;

            tagMessage.textContent = makeTagsMessage(tagName, true);
            
            addCreateDOM(tagName, randomColor);
            lockSubmitButton(); 
        }
        
        tagNameInput.value = "";
        tagNameInput.focus();

}


function getWeekNumber(date) {
    const currentDate = date.getDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    
    return Math.ceil((currentDate + firstDay) / 7);

}

function renderCalendar(){
    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const today = new Date();

    calendarList.innerHTML = "";
    

    // 월간모드
    if(currentViewMode === "month"){

        calendarList.classList.remove("week-mode");
        calendarTitle.textContent = `${currentYear}년 ${currentMonth + 1}월`;
    
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
        const prevLastDate = new Date(currentYear, currentMonth, 0).getDate();
    

        for (let i = firstDay - 1; i >= 0; i--) {
            const li =document.createElement("li");
            li.className = "calendar_box prev-month";
            li.textContent = prevLastDate - i;
            calendarList.appendChild(li);
        }

        for (let date = 1; date <= lastDate; date++) {
            const li = document.createElement("li");
            li.className = "calendar_box";
            li.textContent = date;

            if(
                currentYear === today.getFullYear() &&
                currentMonth === today.getMonth() &&
                date === today.getDate()
            ) {
                li.classList.add("is-today");
            }
            calendarList.appendChild(li);
        }

        const totalCells = calendarList.children.length;
        const targetTotal = totalCells <= 35 ? 35 : 42;
        for (let date = 1; date <= targetTotal - totalCells; date++) {
            const li = document.createElement("li");
            li.className = "calendar_box other-month";
            li.textContent = date;
            calendarList.appendChild(li);
        }
    } else {
    
    // 주간모드
        calendarList.classList.add("week-mode");

        const weekNum = getWeekNumber(viewDate);
        calendarTitle.textContent = `${currentYear}년 ${currentMonth + 1}월 ${weekNum}주차`;

        const currentDay = viewDate.getDay();
        const startOfWeek = new Date(viewDate);
        startOfWeek.setDate(viewDate.getDate() - currentDay);

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + i);

            const li = document.createElement("li");
            li.className = "calendar_box"
            li.textContent = dayDate.getDate();

            if (dayDate.getMonth() !== currentMonth) {
                li.classList.add("other-month");
            }

            if (
                dayDate.getFullYear() === today.getFullYear() &&
                dayDate.getMonth() === today.getMonth() &&
                dayDate.getDate() === today.getDate()
             ) {
                li.classList.add("is-today");
            }

            calendarList.appendChild(li);         
        }
    } 
}

function switchCalendarView(mode){
    currentViewMode = mode;

    if (mode === "month"){
        tabMonth.setAttribute("aria-selected", "true");
        tabMonth.setAttribute("tabindex", "0");
        tabWeek.setAttribute("aria-selected", "false");
        tabWeek.setAttribute("tabindex", "-1");
      } else {
        tabWeek.setAttribute("aria-selected", "true");
        tabWeek.setAttribute("tabindex", "0");
        tabMonth.setAttribute("aria-selected", "false");
        tabMonth.setAttribute("tabindex", "-1");
    }

    renderCalendar();
}

tabMonth.addEventListener("click", () => switchCalendarView("month"));
tabWeek.addEventListener("click", () => switchCalendarView("week"));


prevMonthButton.addEventListener("click", () => {
if (currentViewMode === "month") {
      viewDate.setMonth(viewDate.getMonth() - 1);
    } else {
      viewDate.setDate(viewDate.getDate() - 7); // 1주일 전으로 이동
    }
    renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
if (currentViewMode === "month") {
      viewDate.setMonth(viewDate.getMonth() + 1);
    } else {
      viewDate.setDate(viewDate.getDate() + 7); // 1주일 뒤로 이동
    }
    renderCalendar();
});

tagForm.addEventListener("submit", handleTagSubmit);

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    const isNightMode = document.body.classList.contains("night-mode");
    themeButton.textContent = isNightMode ? "🌙" : "☀️";
});

switchCalendarView(currentViewMode);
renderInitialTags();
renderCalendar();
// function isExpiredDate(date, currentDate) {}