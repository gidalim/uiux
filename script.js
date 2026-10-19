console.log("JavaScript 연결확인");

const SERVICENAME = "Calendar Service";

const tagForm = document.querySelector("#tag_form");
const tagNameInput = document.querySelector("#tag_name");
const tagSubmitButton = document.querySelector("#tagSubmitButton");
const tagList = document.querySelector("#tagList");
const tagMessage = document.querySelector("#tagMessage");
const themeButton = document.querySelector("#themeButton");
const calendarTitle = document.querySelector("#calendarTitle");
const prevMonthButton = document.querySelector("#prevMonthButton");
const nextMonthButton = document.querySelector("#nextMonthButton");

let Tags = {
    "외부 일정": "pink", 
    "과제": "green", 
    "강의": "blue", 
};

let viewDate = new Date();
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

function renderCalendar(){
    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth() + 1;

    calendarTitle.textContent = `${currentYear}년 ${currentMonth}월`;
}

prevMonthButton.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    renderCalendar();
});

tagForm.addEventListener("submit", handleTagSubmit);

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    const isNightMode = document.body.classList.contains("night-mode");
    themeButton.textContent = isNightMode ? "🌙" : "☀️";
});

renderInitialTags();
renderCalendar();
// function isExpiredDate(date, currentDate) {}