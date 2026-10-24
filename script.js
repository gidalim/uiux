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
const tagDropDown = document.querySelector("#tagDropdown");
const accessCheckbox = document.querySelector("#accessCheckbox");
const accessButton = document.querySelector("#accessButton");
const devAccessForm = document.querySelector("#devAccessForm");
const devLoading = document.querySelector("#devLoading");
const githubLinkCard = document.querySelector("#githubLinkCard");
const onboardingIntro = document.querySelector("#onboardingIntro");
const startTutorialBtn = document.querySelector("#startTutorialBtn");
const skipIntroBtn = document.querySelector("#skipIntroBtn");
const restartTutorialBtn = document.querySelector("#restartTutorialBtn");
const spotlightBox = document.querySelector("#spotlightBox");
const tutorialTooltip = document.querySelector("#tutorialTooltip");
const tutorialStepBadge = document.querySelector("#tutorialStepBadge");
const closeTutorialBtn = document.querySelector("#closeTutorialBtn");
const tutorialTitle = document.querySelector("#tutorialTitle");
const tutorialDesc = document.querySelector("#tutorialDesc");
const prevStepBtn = document.querySelector("#prevStepBtn");
const nextStepBtn = document.querySelector("#nextStepBtn");
const skipTutorialBtn = document.querySelector("#skipTutorialBtn");


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

function renderTagDropdown(filterKeyword = "") {
  tagDropdown.innerHTML = "";
  const keyword = filterKeyword.toLowerCase().trim();

  const matchedTags = Object.entries(Tags).filter(([tagName]) => 
    tagName.toLowerCase().includes(keyword)
  );

  if (matchedTags.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.textContent = `"${filterKeyword}" 새 태그로 만들기`;
    emptyLi.style.color = "var(--text-sub)";
    emptyLi.style.cursor = "default";
    tagDropdown.appendChild(emptyLi);
  } else {
    matchedTags.forEach(([tagName, colorKey]) => {
      const li = document.createElement("li");
      li.textContent = tagName;
      li.classList.add(`tag-${colorKey}`); 

      li.addEventListener("mousedown", (e) => {
        e.preventDefault(); 
        tagNameInput.value = tagName;
        tagDropdown.hidden = true;
        tagNameInput.focus();
      });

      tagDropdown.appendChild(li);
    });
  }

  tagDropdown.hidden = false;
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

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    const isNightMode = document.body.classList.contains("night-mode");
    themeButton.textContent = isNightMode ? "🌙" : "☀️";
});

tagForm.addEventListener("submit", handleTagSubmit);

tagNameInput.addEventListener("focus", () => {
  renderTagDropdown(tagNameInput.value);
});

tagNameInput.addEventListener("input", (event) => {
  renderTagDropdown(event.target.value);
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".tag_input_wrapper")) {
    tagDropdown.hidden = true;
  }
});

accessCheckbox.addEventListener("change", (event) => {
  accessButton.disabled = !event.target.checked;
});

devAccessForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!accessCheckbox.checked) return;

  // 폼 숨기고 로딩 스피너 표시
  devAccessForm.hidden = true;
  devLoading.hidden = false;

  // 1.2초 뒤 링크 카드 출력
  setTimeout(() => {
    devLoading.hidden = true;
    githubLinkCard.hidden = false;
  }, 1200);
});

const TUTORIAL_STEPS = [
  {
    targetSelector: "#calendar",
    title: "캘린더 뷰 모드 전환",
    desc: "월간 뷰와 주간 뷰를 전환해 보세요. 모바일 접속 시 주간 뷰가 기본 적용돼요.",
    position: "bottom"
  },
  {
    targetSelector: "#tag",
    title: "태그 자동완성 및 생성",
    desc: "입력창을 클릭하면 기존 태그 목록이 펼쳐지며, 검색 및 새 태그 등록이 가능해요.",
    position: "bottom"
  },
  {
    targetSelector: "#detail",
    title: "개발자 페이지 체크박스 연동",
    desc: "하단의 체크박스를 통해 깃허브 소스코드를 확인할 수 있어요.",
    position: "top"
  }
];

let currentTutorialStep = 0;

function openTutorial() {
  onboardingIntro.hidden = true;
  tutorialOverlay.hidden = false;
  document.body.classList.add("scroll-lock");
  currentTutorialStep = 0;
  renderTutorialStep(0);
}

function completeOnboarding() {
  sessionStorage.setItem("calendar_service_visited", "true");
  onboardingIntro.hidden = true;
  tutorialOverlay.hidden = true;
  document.body.classList.remove("scroll-lock");
}

function checkOnboardingStatus() {
  const hasVisited = sessionStorage.getItem("calendar_service_visited");
  if (!hasVisited) {
    onboardingIntro.hidden = false;
  }
}

function updateSpotlightPosition(targetEl, step) {
  const rect = targetEl.getBoundingClientRect();
  const padding = 10;

  spotlightBox.style.top = `${rect.top - padding}px`;
  spotlightBox.style.left = `${rect.left - padding}px`;
  spotlightBox.style.width = `${rect.width + padding * 2}px`;
  spotlightBox.style.height = `${rect.height + padding * 2}px`;

  if (window.innerWidth > 768) {
    if (step.position === "bottom") {
      const topPos = Math.min(window.innerHeight - 220, rect.bottom + 16);
      tutorialTooltip.style.top = `${topPos}px`;
      tutorialTooltip.style.left = `${Math.max(20, rect.left)}px`;
    } else {
      const tooltipHeight = tutorialTooltip.offsetHeight || 190;
      const topPos = Math.max(20, rect.top - tooltipHeight - 16);
      tutorialTooltip.style.top = `${topPos}px`;
      tutorialTooltip.style.left = `${Math.max(20, rect.left)}px`;
    }
  }
}

function renderTutorialStep(stepIndex) {
  const step = TUTORIAL_STEPS[stepIndex];
  const targetEl = document.querySelector(step.targetSelector);
  if (!targetEl) return;

  tutorialStepBadge.textContent = `Step ${stepIndex + 1}/${TUTORIAL_STEPS.length}`;
  tutorialTitle.textContent = step.title;
  tutorialDesc.textContent = step.desc;

  prevStepBtn.disabled = stepIndex === 0;
  nextStepBtn.textContent = stepIndex === TUTORIAL_STEPS.length - 1 ? "완료" : "다음";

  const targetRect = targetEl.getBoundingClientRect();
  const absoluteTargetTop = window.scrollY + targetRect.top;
  const middleScroll = absoluteTargetTop - (window.innerHeight / 2) + (targetRect.height / 2);
  const targetScrollTop = Math.max(0, middleScroll);

  let scrollTimeout = null;

  function onScrollFinished() {
    window.removeEventListener("scroll", handleScroll);
    updateSpotlightPosition(targetEl, step);
  }

  function handleScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(onScrollFinished, 100); 
  }

  if (Math.abs(window.scrollY - targetScrollTop) < 5) {
    updateSpotlightPosition(targetEl, step);
  } else {
    window.addEventListener("scroll", handleScroll, { passive: true });
    scrollTimeout = setTimeout(onScrollFinished, 400);

    window.scrollTo({
      top: targetScrollTop,
      behavior: "smooth"
    });
  }
}

restartTutorialBtn.addEventListener("click", () => {
  sessionStorage.removeItem("calendar_service_visited");
  window.scrollTo({ top: 0, behavior: "instant" });
  openTutorial();
});

function goToNextStep() {
  if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
    currentTutorialStep++;
    renderTutorialStep(currentTutorialStep);
  } else {
    completeOnboarding();
  }
}

function goToPrevStep() {
  if (currentTutorialStep > 0) {
    currentTutorialStep--;
    renderTutorialStep(currentTutorialStep);
  }
}

startTutorialBtn.addEventListener("click", () => {
  onboardingIntro.hidden = true;
  tutorialOverlay.hidden = false;
  currentTutorialStep = 0;
  renderTutorialStep(0);
});

startTutorialBtn.addEventListener("click", openTutorial);
skipIntroBtn.addEventListener("click", completeOnboarding);
nextStepBtn.addEventListener("click", goToNextStep);
prevStepBtn.addEventListener("click", goToPrevStep);
skipTutorialBtn.addEventListener("click", completeOnboarding);
closeTutorialBtn.addEventListener("click", completeOnboarding);

spotlightBox.addEventListener("click", goToNextStep);

restartTutorialBtn.addEventListener("click", () => {
  sessionStorage.removeItem("calendar_service_visited");
  openTutorial();
});

window.addEventListener("resize", () => {
  if (!tutorialOverlay.hidden) {
    renderTutorialStep(currentTutorialStep);
  }
});


switchCalendarView(currentViewMode);
renderInitialTags();
renderCalendar();
checkOnboardingStatus();