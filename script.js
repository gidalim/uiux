console.log("JavaScript 연결확인");

const SERVICENAME = "Calendar Service";

const tagForm = document.querySelector("#tag_form");
const tagNameInput = document.querySelector("#tag_name");
const tagSubmitButton = document.querySelector("#tagSubmitButton");
const tagList = document.querySelector("#tagList");
const tagMessage = document.querySelector("#tagMessage");
const themeButton = document.querySelector("#themeButton");

let Tags = {
    "외부 일정": "pink", 
    "과제": "green", 
    "강의": "blue", 
};

let isSubmitTag = false

const COLOR_LIST = {
  gray:   { name: "회색",   bg: "#F1F1EF", text: "#37352F", darkBg: "#2F2F2F", darkText: "#9B9A97" },
  brown:  { name: "갈색",   bg: "#F4EEEE", text: "#64473A", darkBg: "#432E27", darkText: "#BA856F" },
  orange: { name: "주황색", bg: "#FAECE4", text: "#9A5B2F", darkBg: "#492F24", darkText: "#C77D48" },
  yellow: { name: "노란색", bg: "#FBEECA", text: "#89632A", darkBg: "#40361F", darkText: "#CA984D" },
  green:  { name: "초록색", bg: "#EEF3ED", text: "#2B593F", darkBg: "#27382B", darkText: "#529E72" },
  blue:   { name: "파란색", bg: "#E7F3F8", text: "#28456C", darkBg: "#1F3849", darkText: "#5E87C9" },
  purple: { name: "보라색", bg: "#F4EFF8", text: "#5F397B", darkBg: "#3B2D4A", darkText: "#9D68D3" },
  pink:   { name: "분홍색", bg: "#F9F0F5", text: "#7C385E", darkBg: "#4E2C3F", darkText: "#C15C93" },
  red:    { name: "빨간색", bg: "#FDEBEC", text: "#8E3532", darkBg: "#522E2A", darkText: "#EB5757" }
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


tagForm.addEventListener("submit", handleTagSubmit);
renderInitialTags();

// function isExpiredDate(date, currentDate) {}