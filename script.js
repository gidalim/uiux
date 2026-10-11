console.log("JavaScript 연결확인");

const SERVICENAME = "Calendar Service";

let Tags = {
    "외부 일정": "blue", 
    "과제": "green", 
    "강의": "purple", 
};

console.log(Tags);

function makeTagsMessage(tagName, tagColor, createdTag){
    if(createdTag == true){ 
        return `"${tagName}" 태그 생성 완료!. 색상은 "${tagColor}"입니다.`;

    }
    return `"${tagName}" 태그 생성 완료! 색상은 "${tagColor}"입니다.`;
}

console.log(makeTagsMessage("외부 일정", "blue", true));


// function isExpiredDate(date, currentDate) {}