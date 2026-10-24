console.log("JavaScript 연결확인");

const SERVICENAME = "Calendar Service";

// DOM 선택자 모음
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
const tagDropdown = document.querySelector("#tagDropdown");
const accessCheckbox = document.querySelector("#accessCheckbox");
const accessButton = document.querySelector("#accessButton");
const devAccessForm = document.querySelector("#devAccessForm");
const devLoading = document.querySelector("#devLoading");
const githubLinkCard = document.querySelector("#githubLinkCard");

// 온보딩 및 튜토리얼 DOM 요소
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

// 일정 모달 DOM 요소
const scheduleModal = document.querySelector("#scheduleModal");
const modalDateTitle = document.querySelector("#modalDateTitle");
const scheduleForm = document.querySelector("#scheduleForm");
const scheduleText = document.querySelector("#scheduleText");
const scheduleTagSelect = document.querySelector("#scheduleTagSelect");
const scheduleErrorMsg = document.querySelector("#scheduleErrorMsg");
const closeScheduleModalBtn = document.querySelector("#closeScheduleModalBtn");
const cancelScheduleBtn = document.querySelector("#cancelScheduleBtn");
const existingScheduleArea = document.querySelector("#existingScheduleArea");
const existingScheduleList = document.querySelector("#existingScheduleList");


let Tags = {
  "외부 일정": "pink",
  "과제": "green",
  "강의": "blue"
};

let Schedules = {
  "2026-10-25": [
    { id: 1, text: "UI/UX 중간 과제 제출", tag: "과제", color: "green" }
  ]
};

let selectedDateKey = null;
let viewDate = new Date();
let currentViewMode = window.innerWidth <= 768 ? "week" : "month";
let isSubmitTag = false;

// 지원 태그 컬러 키 목록
const TAG_COLOR_KEYS = ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"];

function getRandomColor() {
  return TAG_COLOR_KEYS[Math.floor(Math.random() * TAG_COLOR_KEYS.length)];
}

function makeTagsMessage(tagName, createdTag) {
  return createdTag ? `${tagName} 태그 생성 완료!` : `${tagName} 태그가 이미 존재합니다!`;
}

function addCreateDOM(name, color) {
  const newTags = document.createElement("li");
  newTags.textContent = name;
  newTags.classList.add(`tag-${color}`);
  tagList.appendChild(newTags);
}

function renderInitialTags() {
  for (const [tagName, tagColor] of Object.entries(Tags)) {
    addCreateDOM(tagName, tagColor);
  }
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

function handleTagSubmit(event) {
  event.preventDefault();
  if (isSubmitTag) return;

  const tagName = tagNameInput.value.trim();

  if (tagName === "") {
    tagMessage.textContent = "태그 입력란이 비어있어요!";
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

function formatDateKey(year, month, date) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(date).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

// 캘린더 날짜 셀 공통 생성 헬퍼 함수
function createCalendarCell(year, month, date, isOtherMonth = false) {
  const li = document.createElement("li");
  li.className = "calendar_box";
  if (isOtherMonth) li.classList.add("other-month");

  const today = new Date();
  const dateKey = formatDateKey(year, month, date);

  const numSpan = document.createElement("span");
  numSpan.className = "date_num";
  numSpan.textContent = date;
  li.appendChild(numSpan);

  if (
    year === today.getFullYear() &&
    month === today.getMonth() &&
    date === today.getDate()
  ) {
    li.classList.add("is-today");
  }

  // 일정 뱃지 목록
  const badgeUl = document.createElement("ul");
  badgeUl.className = "schedule_badge_list";

  if (Schedules[dateKey]) {
    Schedules[dateKey].forEach(item => {
      const badgeLi = document.createElement("li");
      badgeLi.className = `schedule_badge tag-${item.color}`;
      badgeLi.textContent = item.text;
      badgeUl.appendChild(badgeLi);
    });
  }
  li.appendChild(badgeUl);

  // 날짜 클릭 시 일정 모달 오픈
  li.addEventListener("click", () => {
    const displayStr = `${year}년 ${month + 1}월 ${date}일`;
    openScheduleModal(dateKey, displayStr);
  });

  return li;
}

function renderCalendar() {
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  calendarList.innerHTML = "";

  if (currentViewMode === "month") {
    calendarList.classList.remove("week-mode");
    calendarTitle.textContent = `${currentYear}년 ${currentMonth + 1}월`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevLastDate = new Date(currentYear, currentMonth, 0).getDate();

    // 이전 달 잔여 일자
    for (let i = firstDay - 1; i >= 0; i--) {
      const li = document.createElement("li");
      li.className = "calendar_box prev-month";
      li.textContent = prevLastDate - i;
      calendarList.appendChild(li);
    }

    // 이번 달 일자
    for (let date = 1; date <= lastDate; date++) {
      calendarList.appendChild(createCalendarCell(currentYear, currentMonth, date));
    }

    // 다음 달 잔여 일자 (총 35 또는 42칸 유지)
    const totalCells = calendarList.children.length;
    const targetTotal = totalCells <= 35 ? 35 : 42;
    for (let date = 1; date <= targetTotal - totalCells; date++) {
      const li = document.createElement("li");
      li.className = "calendar_box other-month";
      li.textContent = date;
      calendarList.appendChild(li);
    }
  } else {
    // 주간 모드
    calendarList.classList.add("week-mode");
    const weekNum = getWeekNumber(viewDate);
    calendarTitle.textContent = `${currentYear}년 ${currentMonth + 1}월 ${weekNum}주차`;

    const currentDay = viewDate.getDay();
    const startOfWeek = new Date(viewDate);
    startOfWeek.setDate(viewDate.getDate() - currentDay);

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);

      const isOther = dayDate.getMonth() !== currentMonth;
      calendarList.appendChild(
        createCalendarCell(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), isOther)
      );
    }
  }
}

function switchCalendarView(mode) {
  currentViewMode = mode;
  const isMonth = mode === "month";

  tabMonth.setAttribute("aria-selected", isMonth ? "true" : "false");
  tabMonth.setAttribute("tabindex", isMonth ? "0" : "-1");
  tabWeek.setAttribute("aria-selected", isMonth ? "false" : "true");
  tabWeek.setAttribute("tabindex", isMonth ? "-1" : "0");

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

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
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
  } else {
    tutorialTooltip.style.top = "";
    tutorialTooltip.style.left = "";
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
    scrollTimeout = setTimeout(onScrollFinished, 60);
  }

  if (Math.abs(window.scrollY - targetScrollTop) < 5) {
    updateSpotlightPosition(targetEl, step);
  } else {
    window.addEventListener("scroll", handleScroll, { passive: true });
    scrollTimeout = setTimeout(onScrollFinished, 200);

    window.scrollTo({
      top: targetScrollTop,
      behavior: "smooth"
    });
  }
}

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

function openScheduleModal(dateKey, displayDateStr) {
  selectedDateKey = dateKey;
  modalDateTitle.textContent = `${displayDateStr} 일정 관리`;
  scheduleText.value = "";
  scheduleErrorMsg.hidden = true;

  scheduleTagSelect.innerHTML = "";
  Object.keys(Tags).forEach(tagName => {
    const opt = document.createElement("option");
    opt.value = tagName;
    opt.textContent = tagName;
    scheduleTagSelect.appendChild(opt);
  });

  renderExistingSchedules(dateKey);
  scheduleModal.hidden = false;
  scheduleText.focus();
}

function closeScheduleModal() {
  scheduleModal.hidden = true;
  selectedDateKey = null;
  scheduleErrorMsg.hidden = true;
}

function renderExistingSchedules(dateKey) {
  const list = Schedules[dateKey] || [];
  existingScheduleList.innerHTML = "";

  if (list.length === 0) {
    existingScheduleArea.hidden = true;
    return;
  }

  existingScheduleArea.hidden = false;
  list.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = `existing_schedule_item tag-${item.color}`;
    li.innerHTML = `
      <span>[${item.tag}] ${item.text}</span>
      <span class="delete_hint">삭제</span>
    `;

    li.addEventListener("click", () => {
      if (confirm(`'${item.text}' 일정을 삭제하시겠어요?`)) {
        Schedules[dateKey].splice(index, 1);
        if (Schedules[dateKey].length === 0) {
          delete Schedules[dateKey];
        }
        renderCalendar();
        renderExistingSchedules(dateKey);
      }
    });

    existingScheduleList.appendChild(li);
  });
}

tabMonth.addEventListener("click", () => switchCalendarView("month"));
tabWeek.addEventListener("click", () => switchCalendarView("week"));

prevMonthButton.addEventListener("click", () => {
  if (currentViewMode === "month") {
    viewDate.setMonth(viewDate.getMonth() - 1);
  } else {
    viewDate.setDate(viewDate.getDate() - 7);
  }
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  if (currentViewMode === "month") {
    viewDate.setMonth(viewDate.getMonth() + 1);
  } else {
    viewDate.setDate(viewDate.getDate() + 7);
  }
  renderCalendar();
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  const isNightMode = document.body.classList.contains("night-mode");
  themeButton.textContent = isNightMode ? "🌙" : "☀️";
});

tagForm.addEventListener("submit", handleTagSubmit);
tagNameInput.addEventListener("focus", () => renderTagDropdown(tagNameInput.value));
tagNameInput.addEventListener("input", (e) => renderTagDropdown(e.target.value));

document.addEventListener("click", (e) => {
  if (!e.target.closest(".tag_input_wrapper")) {
    tagDropdown.hidden = true;
  }
});

accessCheckbox.addEventListener("change", (e) => {
  accessButton.disabled = !e.target.checked;
});

devAccessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!accessCheckbox.checked) return;

  devAccessForm.hidden = true;
  devLoading.hidden = false;

  setTimeout(() => {
    devLoading.hidden = true;
    githubLinkCard.hidden = false;
  }, 1200);
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
  window.scrollTo({ top: 0, behavior: "instant" });
  openTutorial();
});

window.addEventListener("resize", () => {
  if (!tutorialOverlay.hidden) {
    renderTutorialStep(currentTutorialStep);
  }
});

scheduleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = scheduleText.value.trim();

  if (text === "") {
    scheduleErrorMsg.textContent = "일정 내용을 입력해주세요!";
    scheduleErrorMsg.hidden = false;
    scheduleText.focus();
    return;
  }

  const selectedTag = scheduleTagSelect.value;
  const tagColor = Tags[selectedTag] || "purple";

  if (!Schedules[selectedDateKey]) {
    Schedules[selectedDateKey] = [];
  }

  Schedules[selectedDateKey].push({
    id: Date.now(),
    text: text,
    tag: selectedTag,
    color: tagColor
  });

  renderCalendar();
  closeScheduleModal();
});

closeScheduleModalBtn.addEventListener("click", closeScheduleModal);
cancelScheduleBtn.addEventListener("click", closeScheduleModal);
scheduleModal.addEventListener("click", (e) => {
  if (e.target === scheduleModal) closeScheduleModal();
});

switchCalendarView(currentViewMode);
renderInitialTags();
renderCalendar();
checkOnboardingStatus();