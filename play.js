(() => {
  const panel = document.getElementById("selection-panel");
  const avatarImages = document.getElementById("avatar-images");

  const calculateBtn = document.getElementById("calculate-btn");
  const resultModal = document.getElementById("result-modal");
  const resultCard = document.getElementById("result-card");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const resultBadge = document.getElementById("result-badge");
  const postActions = document.getElementById("post-actions");
  const resetBtn = document.getElementById("reset-btn");
  const infoLinkBtn = document.querySelector(".btn.info-link");
  const resultSpeakerAImage = document.querySelector(".result-speaker-a-image");
  const resultSpeakerBImage = document.querySelector(".result-speaker-b-image");

  const dialogueModal = document.getElementById("dialogue-modal");
  const dialogueBubble = document.getElementById("dialogue-bubble");
  const dialogueText = document.getElementById("dialogue-text");

  const tutorialModal = document.getElementById("tutorial-modal");
  const startGameBtn = document.getElementById("start-game-btn");

  const LIMIT = 60000;
  const currency = new Intl.NumberFormat("ko-KR");

  const labels = {
    tops: "TOPS",
    bottoms: "BOTTOMS",
    accessories: "ACCESSORIES",
  };

  const state = {
    tops: null,
    bottoms: null,
    accessories: null,
  };

  function getImageFileName(category, index) {
    const categoryPrefix = {
      tops: "top",
      bottoms: "bottom",
      accessories: "acc",
    };
    const prefix = categoryPrefix[category] || category;
    return `${prefix}_${index + 1}.png`;
  }

  function playHoverSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/select06.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function playCalculateSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/coin07.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function playPickupSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/pickup03.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function playButtonHoverSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/select05.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function playButtonClickSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/poka03.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function playDialogueSound(speaker) {
    let soundUrl;
    if (speaker && speaker.toLowerCase() === "b") {
      soundUrl = "https://taira-komori.net/sound_os2/daily01/polishing1.mp3";
    } else {
      soundUrl = "https://taira-komori.net/sound_os2/human01/man_gargle1.mp3";
    }
    
    const audio = new Audio(soundUrl);
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function buildButtons(category, items) {
    const section = document.createElement("section");
    const title = document.createElement("h2");
    title.textContent = labels[category];
    section.appendChild(title);

    const buttons = document.createElement("div");
    buttons.className = "item-buttons";

    items.forEach((item, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.category = category;
      btn.dataset.itemId = item.id;
      
      const img = document.createElement("img");
      img.src = getImageFileName(category, index);
      img.alt = item.label;
      img.className = "item-image";
      btn.appendChild(img);
      
      btn.addEventListener("click", () => selectItem(category, item, btn));
      btn.addEventListener("mouseenter", playHoverSound);
      buttons.appendChild(btn);
    });

    section.appendChild(buttons);
    panel.appendChild(section);
  }

  function getItemIndex(category, itemId) {
    if (!window.DRESS_UP_ITEMS || !window.DRESS_UP_ITEMS[category]) return -1;
    return window.DRESS_UP_ITEMS[category].findIndex((item) => item.id === itemId);
  }

  function updateAvatar() {
    if (!avatarImages) return;

    avatarImages.innerHTML = "";

    const displayOrder = ["accessories", "tops", "bottoms"];
    
    displayOrder.forEach((category) => {
      const item = state[category];
      if (item) {
        const index = getItemIndex(category, item.id);
        if (index >= 0) {
          const img = document.createElement("img");
          img.src = getImageFileName(category, index);
          img.alt = item.label;
          img.className = "avatar-display-image";
          img.dataset.category = category;
          avatarImages.appendChild(img);
        }
      }
    });
  }

  function selectItem(category, item, btn) {
    if (tutorialModal && !tutorialModal.classList.contains("hidden")) {
      return;
    }
    playPickupSound();
    state[category] = item;
    updateActiveButtons(category, btn);
    updateAvatar();
    updateCalculateState();
  }

  function updateActiveButtons(category, activeButton) {
    const buttons = panel.querySelectorAll(`button[data-category="${category}"]`);
    buttons.forEach((button) => {
      button.classList.toggle("active", button === activeButton);
    });
  }

  function updateCalculateState() {
    if (!calculateBtn) return;
    const ready = Object.values(state).every(Boolean);
    calculateBtn.disabled = !ready;
  }

  function handleCalculate() {
    if (!Object.values(state).every(Boolean)) return;

    playCalculateSound();

    const total =
      state.tops.price + state.bottoms.price + state.accessories.price;
    const success = total <= LIMIT;

    resultBadge.className = `badge ${success ? "success" : "fail"}`;
    resultBadge.textContent = success ? "성공" : "실패";
    resultTitle.textContent = `총 ${currency.format(total)}원`;
    resultMessage.textContent = success
      ? "6만원 이하로 코디에 성공했어요!"
      : "빈티지인 척 하는 새 옷이 섞여있었나봐요. 다시 골라볼까요?";

    if (resultSpeakerAImage && resultSpeakerBImage) {
      resultSpeakerAImage.style.display = "block";
      resultSpeakerAImage.style.opacity = "1";
      resultSpeakerBImage.style.display = "block";
      resultSpeakerBImage.style.opacity = "1";
    }

    calculateBtn.disabled = true;

    if (resultModal) {
      resultModal.classList.add("active");
      document.body.classList.add("modal-open");
    }
  }

  function resetGame() {
    playButtonClickSound();
    Object.keys(state).forEach((key) => {
      state[key] = null;
    });

    panel.querySelectorAll("button.active").forEach((btn) => {
      btn.classList.remove("active");
    });

    updateAvatar();

    calculateBtn.disabled = true;

    if (resultModal) {
      resultModal.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  }

  function closeTutorial() {
    if (!tutorialModal) return;
    playButtonClickSound();
    tutorialModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    panel.querySelectorAll("button").forEach((btn) => {
      btn.disabled = false;
      btn.style.pointerEvents = "";
      btn.style.opacity = "";
    });
  }

  function disableGameButtons() {
    panel.querySelectorAll("button").forEach((btn) => {
      btn.disabled = true;
      btn.style.pointerEvents = "none";
      btn.style.opacity = "0.5";
    });
  }

  const dialogues = [
    { speaker: "A", text: "우리 빈티지 옷 쇼핑하러 가자!" },
    { speaker: "B", text: "어? 나는 빈티지 좀 별로야… 그거 남이 입던 거잖아." },
    { speaker: "A", text: "아니야. 실제로 보면 헌 옷이랑 새 옷이랑 구분도 안 될 만큼 좋은 옷이 많아." },
    { speaker: "A", text: "환경도 지킬 수 있고, 가격도 저렴해." },
    { speaker: "B", text: "그래? 그럼 한 번 구경해볼까…" },
  ];

  let currentDialogueIndex = 0;

  function showDialogue() {
    if (!dialogueModal || !dialogueBubble || !dialogueText) return;
    
    currentDialogueIndex = 0;
    dialogueModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    disableGameButtons();
    displayCurrentDialogue();
  }

  function displayCurrentDialogue() {
    if (currentDialogueIndex >= dialogues.length) {
      closeDialogue();
      return;
    }

    const dialogue = dialogues[currentDialogueIndex];
    dialogueText.textContent = dialogue.text;
    
    dialogueBubble.classList.remove("speaker-a", "speaker-b");
    dialogueBubble.classList.add(`speaker-${dialogue.speaker.toLowerCase()}`);
    
    playDialogueSound(dialogue.speaker);
    
    const dialogueBox = document.getElementById("dialogue-box");
    const speakerAImage = dialogueBox?.querySelector(".speaker-a-image");
    const speakerBImage = dialogueBox?.querySelector(".speaker-b-image");
    
    if (speakerAImage && speakerBImage) {
      if (dialogue.speaker.toLowerCase() === "a") {
        speakerAImage.style.display = "block";
        speakerAImage.style.opacity = "1";
        speakerBImage.style.display = "none";
        speakerBImage.style.opacity = "0";
      } else if (dialogue.speaker.toLowerCase() === "b") {
        speakerBImage.style.display = "block";
        speakerBImage.style.opacity = "1";
        speakerAImage.style.display = "none";
        speakerAImage.style.opacity = "0";
      }
    }
  }

  function nextDialogue() {
    currentDialogueIndex++;
    displayCurrentDialogue();
  }

  function closeDialogue() {
    if (!dialogueModal) return;
    playButtonClickSound();
    dialogueModal.classList.add("hidden");
    showTutorial();
  }

  function showTutorial() {
    if (!tutorialModal) return;
    tutorialModal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    disableGameButtons();
  }

  function init() {
    if (!window.DRESS_UP_ITEMS) return;
    window.DRESS_UP_ORDER.forEach((category) => {
      buildButtons(category, window.DRESS_UP_ITEMS[category]);
    });

    calculateBtn?.addEventListener("click", handleCalculate);
    resetBtn?.addEventListener("click", resetGame);

    startGameBtn?.addEventListener("mouseenter", playButtonHoverSound);
    resetBtn?.addEventListener("mouseenter", playButtonHoverSound);
    infoLinkBtn?.addEventListener("mouseenter", playButtonHoverSound);

    infoLinkBtn?.addEventListener("click", playButtonClickSound);

    if (dialogueModal && dialogueBubble) {
      dialogueModal.addEventListener("click", nextDialogue);
      
      showDialogue();
    }

    if (tutorialModal) {
      startGameBtn?.addEventListener("click", closeTutorial);

      tutorialModal.addEventListener("click", (e) => {
        if (e.target === tutorialModal) {
          closeTutorial();
        }
      });
    }
  }

  init();
})();
