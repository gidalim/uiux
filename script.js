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

        } else {
            const randomColor = getRandomColor();
            Tags[tagName] = randomColor;
            tagMessage.textContent = makeTagsMessage(tagName, randomColor, true);

            const newTags = document.createElement("li");
            newTags.textContent = tagName;
            newTags.style.color = randomColor;
            tagList.appendChild(newTags);
        }

        tagNameInput.value = "";
        tagNameInput.focus();

        console.log(Tags);
}

tagForm.addEventListener("submit", handleTagSubmit);

// function isExpiredDate(date, currentDate) {}