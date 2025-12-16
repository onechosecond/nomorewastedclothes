(() => {
  const container = document.getElementById("archive-content");
  const detailContainer = document.getElementById("archive-detail");
  const labels = {
    tops: "TOPS",
    bottoms: "BOTTOMS",
    accessories: "ACCESSORIES",
  };

  function getImageFileName(category, itemId) {
    const prefixes = {
      tops: "top",
      bottoms: "bottom",
      accessories: "acc"
    };
    const number = itemId.match(/\d+/);
    const num = number ? number[0] : "1";
    return `${prefixes[category]}_${num}.png`;
  }

  function playHoverSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/select05.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function playClickSound() {
    const audio = new Audio("https://taira-komori.net/sound_os2/game01/poka03.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => {
      console.log("Audio play failed:", err);
    });
  }

  function showItemDetail(item, category) {
    const imgSrc = getImageFileName(category, item.id);
    const price = new Intl.NumberFormat('ko-KR').format(item.price);
    
    detailContainer.innerHTML = `
      <img class="archive-detail-image" src="${imgSrc}" alt="${item.label}" />
      <h3 class="archive-detail-name">${item.label}</h3>
      <p class="archive-detail-price">${price}원</p>
      <p class="archive-detail-description">${item.description}</p>
    `;
  }

  function renderCategory(category, items) {
    const wrapper = document.createElement("div");
    wrapper.className = "archive-category";

    const title = document.createElement("h2");
    title.textContent = labels[category];
    wrapper.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "card-grid";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";

      const randomX = (Math.random() - 0.5) * 400; // -200px ~ 200px
      const randomY = (Math.random() - 0.5) * 400; // -200px ~ 200px
      const randomRotate = (Math.random() - 0.5) * 180; // -90deg ~ 90deg
      
      card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
      
      card.dataset.originalX = randomX;
      card.dataset.originalY = randomY;
      card.dataset.originalRotate = randomRotate;

      const imgContainer = document.createElement("div");
      imgContainer.style.width = "100%";
      imgContainer.style.height = "110px";
      imgContainer.style.marginBottom = "1rem";
      imgContainer.style.display = "flex";
      imgContainer.style.alignItems = "center";
      imgContainer.style.justifyContent = "center";
      imgContainer.style.overflow = "hidden";
      imgContainer.style.borderRadius = "18px";
      imgContainer.style.background = "greenyellow";

      const img = document.createElement("img");
      img.src = getImageFileName(category, item.id);
      img.alt = item.label;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "100%";
      img.style.objectFit = "contain";
      imgContainer.appendChild(img);

      const name = document.createElement("h3");
      name.textContent = item.label;

      const price = document.createElement("p");
      price.textContent = `${new Intl.NumberFormat('ko-KR').format(item.price)}원`;
      price.style.fontWeight = "500";
      price.style.color = "var(--text)";
      price.style.marginBottom = "0.5rem";

      card.appendChild(imgContainer);
      card.appendChild(name);
      card.appendChild(price);
      
      card.addEventListener("mouseenter", () => {
        playHoverSound();
        card.classList.add('returned');
      });
      
      card.addEventListener("click", () => {
        playClickSound();
        showItemDetail(item, category);
        
        document.querySelectorAll('.archive-right-panel .card').forEach(c => {
          c.classList.remove('blurred');
        });
        
        card.classList.add('blurred');
        card.classList.add('returned');
      });
      
      grid.appendChild(card);
    });

    wrapper.appendChild(grid);
    container.appendChild(wrapper);
  }

  function init() {
    if (!window.DRESS_UP_ITEMS) return;
    
    const excludedIds = [
      "top_1", "top_2", "top_4", "top_5", "top_8", "top_9", "top_15", "top_16",
      "bottom_1", "bottom_2", "bottom_5", "bottom_8", "bottom_9",
      "acc_1", "acc_2"
    ];
    
    window.DRESS_UP_ORDER.forEach((category) => {
      const filteredItems = window.DRESS_UP_ITEMS[category].filter(
        item => !excludedIds.includes(item.id)
      );
      renderCategory(category, filteredItems);
    });
  }

  init();
})();
