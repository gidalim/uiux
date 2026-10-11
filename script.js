console.log("JavaScript 연결확인");

const SERVICENAME = "Calendar Service";

let Tags = {
    "외부 일정": "blue", 
    "과제": "green", 
    "강의": "purple", 
};

function makeTagsMessage(tagName, tagColor, createdTag){
    if(createdTag == true){ 
        return `"${tagName}" 태그 생성 완료!. 색상은 "${tagColor}"입니다.`;
    }
    else if(createdTag == false){
        return `"${tagName}" 태그가 이미 존재합니다! 색상은 "${tagColor}"입니다.`;
    }
}

const tagForm = document.querySelector("#tag_form");
const tagNameInput = document.querySelector("#tag_name");
const tagSubmitButton = document.querySelector("#tagSubmitButton");
const tagList = document.querySelector("#tagList");
const tagMessage = document.querySelector("#tagMessage");


console.log(tagForm)
console.log(tagNameInput)
console.log(tagSubmitButton)
console.log(tagList)
console.log(tagMessage) 

// function isExpiredDate(date, currentDate) {}