console.log("JavaScript 연결확인");

const SERVICENAME = "Calendar Service";

const tagForm = document.querySelector("#tag_form");
const tagNameInput = document.querySelector("#tag_name");
const tagSubmitButton = document.querySelector("#tagSubmitButton");
const tagList = document.querySelector("#tagList");
const tagMessage = document.querySelector("#tagMessage");

let Tags = {
    "외부 일정": "#FF5733", 
    "과제": "#28a745", 
    "강의": "#6f42c1", 
};

let isSubmitTag = false

// 태그에 삽입될 무작위 색상 생성 함수
function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function makeTagsMessage(tagName, createdTag){
    if(createdTag == true){ 
        return `"${tagName}" 태그 생성 완료!.`;
    }
    else if(createdTag == false){
        return `"${tagName}" 태그가 이미 존재합니다!`;
    }
}

function addCreateDOM(name, color){
    const newTags = document.createElement("li");
    newTags.textContent = name;
    newTags.style.color = color;
    tagList.appendChild(newTags);

    console.log(Tags);
}

function renderInitialTags(){
    for(const [tagName, tagColor] of Object.entries(Tags)){
        addCreateDOM(tagName, tagColor);
    }

    console.log("초기 태그 렌더링 완료");
}


function handleTagSubmit(event){
    event.preventDefault();
    const tagName = tagNameInput.value.trim();  

    if(tagName === ""){
        tagMessage.textContent = 
        "태그 입력란이 비어있어요!";
        tagNameInput.focus();
        return;
    }

    if (tagName in Tags) {
        tagMessage.textContent = makeTagsMessage(tagName, Tags[tagName], false);
        tagMessage.textContent = "이미 존재하는 태그예요";

        } else {
            const randomColor = getRandomColor();
            Tags[tagName] = randomColor;

            tagMessage.textContent = makeTagsMessage(tagName, randomColor, true);
            tagMessage.textContent = `${tagName} 태그 생성 완료!`;
            
            addCreateDOM(tagName, randomColor);
        }

        tagNameInput.value = "";
        tagNameInput.focus();

        console.log(Tags);
}

tagForm.addEventListener("submit", handleTagSubmit);
renderInitialTags();

// function isExpiredDate(date, currentDate) {}