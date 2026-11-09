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
const tabDay = document.querySelector("#tabDay");
const calendarWeekdays = document.querySelector(".calendar_weekdays");

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
const closeScheduleModalBtn = document.querySelector("#closeScheduleModalBtn");
const cancelScheduleBtn = document.querySelector("#cancelScheduleBtn");
const existingScheduleArea = document.querySelector("#existingScheduleArea");
const existingScheduleList = document.querySelector("#existingScheduleList");
const scheduleCharCount = document.querySelector("#scheduleCharCount");
const scheduleFeedbackMsg = document.querySelector("#scheduleFeedbackMsg");
const isRangeCheckbox = document.querySelector("#isRangeCheckbox");
const rangeDateArea = document.querySelector("#rangeDateArea");
const scheduleEndDate = document.querySelector("#scheduleEndDate");
const saveScheduleBtn = document.querySelector("#saveScheduleBtn");
const modalContentCard = document.querySelector(".modal_card");
const toastNotification = document.querySelector("#toastNotification");

let toastTimer = null;

let Tags = {
  "외부 일정": "pink",
  "과제": "green",
  "강의": "blue"
};

let selectedDateKey = null;
let viewDate = new Date();
let currentViewMode = window.innerWidth <= 768 ? "week" : "month";
let isSubmitTag = false;

const TAG_COLOR_KEYS = ["gray", "brown", "orange", "yellow", "green", "blue", "purple", "pink", "red"];

function formatDateKey(year, month, date) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(date).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

const _initToday = new Date();
const _todayKey = formatDateKey(_initToday.getFullYear(), _initToday.getMonth(), _initToday.getDate());

let Schedules = {
  [_todayKey]: [
    { id: 1, text: "UI/UX 과제 제출하기", tag: "과제", color: "green" },
    { id: 2, text: "웹 프로그래밍 강의 수강", tag: "강의", color: "blue" }
  ],
  "2026-10-25": [
    { id: 3, text: "UI/UX 중간 과제 제출", tag: "과제", color: "green" }
  ]
};

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

// 토스트 메시지 출력
function showToast(message, type = "success", duration = 2000) {
  clearTimeout(toastTimer);
  toastNotification.textContent = message;
  toastNotification.className = `toast_notification toast-${type} is-show`;
  toastNotification.hidden = false;

  toastTimer = setTimeout(() => {
    toastNotification.classList.remove("is-show");
    setTimeout(() => {
      toastNotification.hidden = true;
    }, 250);
  }, duration);
}

// 조건부 기간 체크박스 토글 (2일 강제 로직 제외, 순수 활성/비활성화)
isRangeCheckbox.addEventListener("change", (e) => {
  const isChecked = e.target.checked;
  if (isChecked) {
    rangeDateArea.hidden = false;
    scheduleEndDate.disabled = false;
    if (selectedDateKey) {
      scheduleEndDate.min = selectedDateKey;
      scheduleEndDate.value = selectedDateKey;
    }
  } else {
    rangeDateArea.hidden = true;
    scheduleEndDate.disabled = true;
    scheduleEndDate.value = "";
  }
});

// 실시간 글자 수 및 중복 검증
function validateScheduleInput() {
  const text = scheduleText.value.trim();
  const currentLength = scheduleText.value.length;
  scheduleCharCount.textContent = `${currentLength} / 20자`;

  // 1) 빈 값 검사 -> 버튼 즉시 잠금
  if (text === "") {
    scheduleFeedbackMsg.textContent = "일정 내용을 1자 이상 입력해 주세요.";
    scheduleFeedbackMsg.className = "feedback_msg is-error";
    scheduleFeedbackMsg.hidden = false;
    saveScheduleBtn.disabled = true;
    return false;
  }

  // 2) 중복 일정 검증 -> 버튼 즉시 잠금
  const currentList = Schedules[selectedDateKey] || [];
  const isDuplicate = currentList.some(item => item.text.toLowerCase() === text.toLowerCase());

  if (isDuplicate) {
    scheduleFeedbackMsg.textContent = "⚠️ 이미 같은 날짜에 동일한 일정이 존재해요!";
    scheduleFeedbackMsg.className = "feedback_msg is-error";
    scheduleFeedbackMsg.hidden = false;
    saveScheduleBtn.disabled = true; 
    return false;
  }

  // 3) 정상 통과 -> 버튼 활성화
  scheduleFeedbackMsg.textContent = "등록 가능한 일정입니다.";
  scheduleFeedbackMsg.className = "feedback_msg is-success";
  scheduleFeedbackMsg.hidden = false;
  saveScheduleBtn.disabled = false;
  return true;
}

scheduleText.addEventListener("input", validateScheduleInput);

// 모달 열기
function openScheduleModal(dateKey, displayDateStr) {
  selectedDateKey = dateKey;
  modalDateTitle.textContent = `${displayDateStr} 일정 관리`;

  scheduleText.value = "";
  scheduleCharCount.textContent = "0 / 20자";
  scheduleFeedbackMsg.hidden = true;

  modalContentCard.classList.remove("submitting");
  saveScheduleBtn.disabled = false;
  saveScheduleBtn.textContent = "일정 저장";

  isRangeCheckbox.checked = false;
  rangeDateArea.hidden = true;
  scheduleEndDate.disabled = true;
  scheduleEndDate.value = "";

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

// 모달 닫기
function closeScheduleModal() {
  scheduleModal.hidden = true;
  selectedDateKey = null;
  scheduleFeedbackMsg.hidden = true;

  modalContentCard.classList.remove("submitting");
  saveScheduleBtn.disabled = false;
  saveScheduleBtn.textContent = "일정 저장";
}

// 모달 내 기존 일정 렌더링 및 삭제
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

// 폼 제출 (안전한 기간 루프 및 블러/등록 완결)
scheduleForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = scheduleText.value.trim();

  if (text === "") {
    showToast("일정 내용을 입력해 주세요.", "error");
    scheduleFeedbackMsg.textContent = "일정 내용을 1자 이상 입력해 주세요.";
    scheduleFeedbackMsg.className = "feedback_msg is-error";
    scheduleFeedbackMsg.hidden = false;
    scheduleText.focus();
    return;
  }

  const currentList = Schedules[selectedDateKey] || [];
  const isDuplicate = currentList.some(item => item.text.toLowerCase() === text.toLowerCase());
  if (isDuplicate) {
    showToast("중복된 일정이 존재해요.", "error");
    scheduleFeedbackMsg.textContent = "⚠️ 이미 같은 날짜에 동일한 일정이 존재해요!";
    scheduleFeedbackMsg.className = "feedback_msg is-error";
    scheduleFeedbackMsg.hidden = false;
    scheduleText.focus();
    return;
  }

  // 기간 검증
  if (isRangeCheckbox.checked) {
    if (!scheduleEndDate.value) {
      showToast("종료 날짜를 선택해 주세요.", "error");
      scheduleEndDate.focus();
      return;
    }
    if (scheduleEndDate.value < selectedDateKey) {
      showToast("종료 날짜는 시작 날짜보다 빠를 수 없어요.", "error");
      scheduleEndDate.focus();
      return;
    }
  }

  // 1) 제출 진행 중 상태로 UI 잠금
  saveScheduleBtn.disabled = true;
  saveScheduleBtn.textContent = "등록 중...";
  showToast("일정을 등록 중이에요...", "success");
  modalContentCard.classList.add("submitting");

  const selectedTag = scheduleTagSelect.value;
  const tagColor = Tags[selectedTag] || "purple";

  // 2) 0.35초 후 안전하게 데이터 반영 및 모달 닫기
  setTimeout(() => {
    try {
      if (isRangeCheckbox.checked) {
        // YYYY-MM-DD 기반의 안전한 날짜 순회
        const startParts = selectedDateKey.split("-").map(Number);
        const endParts = scheduleEndDate.value.split("-").map(Number);

        const currentIter = new Date(startParts[0], startParts[1] - 1, startParts[2]);
        const endLimit = new Date(endParts[0], endParts[1] - 1, endParts[2]);

        while (currentIter <= endLimit) {
          const k = formatDateKey(currentIter.getFullYear(), currentIter.getMonth(), currentIter.getDate());
          if (!Schedules[k]) Schedules[k] = [];

          if (!Schedules[k].some(item => item.text === text)) {
            Schedules[k].push({
              id: Date.now() + Math.random(),
              text: text,
              tag: selectedTag,
              color: tagColor
            });
          }
          currentIter.setDate(currentIter.getDate() + 1);
        }
      } else {
        if (!Schedules[selectedDateKey]) Schedules[selectedDateKey] = [];
        Schedules[selectedDateKey].push({
          id: Date.now(),
          text: text,
          tag: selectedTag,
          color: tagColor
        });
      }
    } catch (err) {
      console.error("일정 등록 중 오류:", err);
      showToast("일정 저장 중 오류가 발생했습니다.", "error")
    } finally {
      // 3) 화면 갱신 및 모달 닫기 (오류가 나더라도 무조건 잠금 해제)
      renderCalendar();
      closeScheduleModal();
    }
  }, 350);
});

// 모달 닫기 버튼 이벤트
closeScheduleModalBtn.addEventListener("click", closeScheduleModal);
cancelScheduleBtn.addEventListener("click", closeScheduleModal);
scheduleModal.addEventListener("click", (e) => {
  if (e.target === scheduleModal) closeScheduleModal();
});

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

  li.addEventListener("click", () => {
    const displayStr = `${year}년 ${month + 1}월 ${date}일`;
    openScheduleModal(dateKey, displayStr);
  });

  return li;
}

function renderCalendar() {
  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();
  const currentDate = viewDate.getDate();

  calendarList.innerHTML = "";

  if (currentViewMode === "month") {
    calendarWeekdays.classList.remove("is-hidden");
    calendarList.classList.remove("week-mode", "day-mode");
    calendarTitle.textContent = `${currentYear}년 ${currentMonth + 1}월`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevLastDate = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      const li = document.createElement("li");
      li.className = "calendar_box prev-month";
      li.textContent = prevLastDate - i;
      calendarList.appendChild(li);
    }

    for (let date = 1; date <= lastDate; date++) {
      calendarList.appendChild(createCalendarCell(currentYear, currentMonth, date));
    }

    const totalCells = calendarList.children.length;
    const targetTotal = totalCells <= 35 ? 35 : 42;
    for (let date = 1; date <= targetTotal - totalCells; date++) {
      const li = document.createElement("li");
      li.className = "calendar_box other-month";
      li.textContent = date;
      calendarList.appendChild(li);
    }
  } else if (currentViewMode === "week") {
    calendarWeekdays.classList.remove("is-hidden");
    calendarList.classList.remove("day-mode");
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
  } else {
    calendarWeekdays.classList.add("is-hidden");
    calendarList.classList.remove("week-mode");
    calendarList.classList.add("day-mode");

    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const dayStr = dayNames[viewDate.getDay()];
    calendarTitle.textContent = `${currentYear}년 ${currentMonth + 1}월 ${currentDate}일 (${dayStr})`;

    const dateKey = formatDateKey(currentYear, currentMonth, currentDate);
    const daySchedules = Schedules[dateKey] || [];
    const displayDateStr = `${currentYear}년 ${currentMonth + 1}월 ${currentDate}일`;

    const container = document.createElement("li");
    container.className = "day_view_container";

    container.innerHTML = `
      <div class="day_view_header">
        <h4 class="day_info_title">오늘의 집중 일정 (<span id="dayScheduleCount">${daySchedules.length}</span>건)</h4>
        <button type="button" class="btn_add_day_schedule" id="btnDayAddSchedule">+ 새 일정 등록</button>
      </div>
      <ul class="day_schedule_card_list" id="dayScheduleCardList"></ul>
    `;

    const cardListEl = container.querySelector("#dayScheduleCardList");

    if (daySchedules.length === 0) {
      cardListEl.innerHTML = `<div class="day_schedule_empty">등록된 일정이 없습니다. 새 일정을 추가해 보세요!</div>`;
    } else {
      daySchedules.forEach(item => {
        const cardLi = document.createElement("li");
        cardLi.className = `day_schedule_card tag-${item.color}`;
        cardLi.style.cursor = "pointer";
        cardLi.innerHTML = `
          <span><span class="card_badge">${item.tag}</span>${item.text}</span>
          <span class="delete_hint" style="font-size:12px; color:var(--text-sub);">관리 / 삭제</span>
        `;
        cardLi.addEventListener("click", () => {
          openScheduleModal(dateKey, displayDateStr);
        });
        cardListEl.appendChild(cardLi);
      });
    }

    container.querySelector("#btnDayAddSchedule").addEventListener("click", () => {
      openScheduleModal(dateKey, displayDateStr);
    });

    calendarList.appendChild(container);
  }
}

function switchCalendarView(mode) {
  currentViewMode = mode;

  tabMonth.setAttribute("aria-selected", mode === "month" ? "true" : "false");
  tabMonth.setAttribute("tabindex", mode === "month" ? "0" : "-1");
  tabWeek.setAttribute("aria-selected", mode === "week" ? "true" : "false");
  tabWeek.setAttribute("tabindex", mode === "week" ? "-1" : "0");
  tabDay.setAttribute("aria-selected", mode === "day" ? "true" : "false");
  tabDay.setAttribute("tabindex", mode === "day" ? "-1" : "0");

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

tabMonth.addEventListener("click", () => switchCalendarView("month"));
tabWeek.addEventListener("click", () => switchCalendarView("week"));

prevMonthButton.addEventListener("click", () => {
  if (currentViewMode === "month") {
    viewDate.setMonth(viewDate.getMonth() - 1);
  } else if (currentViewMode === "week") {
    viewDate.setDate(viewDate.getDate() - 7);
  } else {
    viewDate.setDate(viewDate.getDate() - 1);
  }
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  if (currentViewMode === "month") {
    viewDate.setMonth(viewDate.getMonth() + 1);
  } else if (currentViewMode === "week") {
    viewDate.setDate(viewDate.getDate() + 7);
  } else {
    viewDate.setDate(viewDate.getDate() + 1);
  }
  renderCalendar();
});

tabDay.addEventListener("click", () => switchCalendarView("day"));

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

switchCalendarView(currentViewMode);
renderInitialTags();
renderCalendar();
checkOnboardingStatus();