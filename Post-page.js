<script>
  // Matrix Rain Effect in white on black background
  (() => {
    const canvas = document.getElementById("matrixCanvas");
    const ctx = canvas.getContext("2d");
    let width, height;
    let columns;
    let drops = [];
    const fontSize = 18;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()-_=+[]{}|;:,.<>?/~`".split("");
    
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(devicePixelRatio, devicePixelRatio);
      columns = Math.floor(width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * height / fontSize);
      }
    }

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      ctx.font = fontSize + "px JetBrains Mono, monospace";
      ctx.textBaseline = "top";
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    function loop() {
      draw();
      requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    resize();
    loop();
  })();

  // Copy and Raw buttons functionality
  (() => {
    const copyBtn = document.getElementById("copyBtn");
    const rawBtn = document.getElementById("rawBtn");
    const codeBlock = document.getElementById("codeBlock");

    copyBtn.addEventListener("click", () => {
      const codeText = codeBlock.textContent.trim();
      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          copyBtn.textContent = "Copied!";
          copyBtn.disabled = true;
          setTimeout(() => {
            copyBtn.textContent = "Copy";
            copyBtn.disabled = false;
          }, 1800);
        })
        .catch(() => {
          copyBtn.textContent = "Failed";
          setTimeout(() => {
            copyBtn.textContent = "Copy";
          }, 1800);
        });
    });

    rawBtn.addEventListener("click", () => {
      const rawWindow = window.open("", "_blank", "noopener,noreferrer");
      rawWindow.document.write(
        `<pre style="background:#000;color:#fff;padding:1.5rem;font-family:'JetBrains Mono', monospace;white-space: pre-wrap; font-size: 1rem;">${escapeHtml(codeBlock.textContent.trim())}</pre>`
      );
      rawWindow.document.title = "Raw Code - pastecig";
      rawWindow.document.close();
    });

    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  })();

  // Hamburger menu toggle
  (() => {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const menuPanel = document.getElementById("menuPanel");
    const menuCloseBtn = document.getElementById("menuCloseBtn");
    const menuOverlay = document.getElementById("menuOverlay");

    function openMenu() {
      menuPanel.classList.add("open");
      menuOverlay.classList.add("active");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      menuPanel.focus();
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      menuPanel.classList.remove("open");
      menuOverlay.classList.remove("active");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.focus();
      document.body.style.overflow = "";
    }

    hamburgerBtn.addEventListener("click", openMenu);
    menuCloseBtn.addEventListener("click", closeMenu);
    menuOverlay.addEventListener("click", closeMenu);

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menuPanel.classList.contains("open")) {
        closeMenu();
      }
    });

    // Trap focus inside menu when open
    menuPanel.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        const focusableElements = menuPanel.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  })();

  // Like/Unlike button toggle logic with counters
  (() => {
    const likeBtn = document.getElementById("likeBtn");
    const unlikeBtn = document.getElementById("unlikeBtn");
    const likeCountSpan = document.getElementById("likeCount");
    const unlikeCountSpan = document.getElementById("unlikeCount");
    let likeCount = 0;
    let unlikeCount = 0;

    likeBtn.addEventListener("click", () => {
      const liked = likeBtn.classList.contains("liked");
      if (liked) {
        likeBtn.classList.remove("liked");
        likeBtn.setAttribute("aria-pressed", "false");
        likeCount = Math.max(0, likeCount - 1);
      } else {
        likeBtn.classList.add("liked");
        likeBtn.setAttribute("aria-pressed", "true");
        likeCount++;
        if (unlikeBtn.classList.contains("unliked")) {
          unlikeBtn.classList.remove("unliked");
          unlikeBtn.setAttribute("aria-pressed", "false");
          unlikeCount = Math.max(0, unlikeCount - 1);
        }
      }
      updateCounts();
    });

    unlikeBtn.addEventListener("click", () => {
      const unliked = unlikeBtn.classList.contains("unliked");
      if (unliked) {
        unlikeBtn.classList.remove("unliked");
        unlikeBtn.setAttribute("aria-pressed", "false");
        unlikeCount = Math.max(0, unlikeCount - 1);
      } else {
        unlikeBtn.classList.add("unliked");
        unlikeBtn.setAttribute("aria-pressed", "true");
        unlikeCount++;
        if (likeBtn.classList.contains("liked")) {
          likeBtn.classList.remove("liked");
          likeBtn.setAttribute("aria-pressed", "false");
          likeCount = Math.max(0, likeCount - 1);
        }
      }
      updateCounts();
    });

    function updateCounts() {
      likeCountSpan.textContent = likeCount;
      unlikeCountSpan.textContent = unlikeCount;
    }
  })();
</script>
