// KHUSHI PORTFOLIO — vanilla JavaScript interactions
(() => {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("primaryNav");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const progressBar = document.getElementById("progressBar");
  const year = document.getElementById("year");
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalEyebrow = document.getElementById("modalEyebrow");
  const modalIntro = document.getElementById("modalIntro");
  const modalBody = document.getElementById("modalBody");
  const modalLink = document.getElementById("modalLink");
  let lastFocusedElement = null;

  year.textContent = new Date().getFullYear();

  // Mobile navigation
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    nav.classList.toggle("is-open", !isOpen);
  });

  navLinks.concat([...nav.querySelectorAll(".nav-cv")]).forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });

  // Scroll progress + active section state
  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  }

  const projectDetails = {
    mizaaj: {
      eyebrow: "PROJECT 01 · DIGITAL EXPERIENCE",
      title: "Mizaaj-o-Masti",
      intro: "An interactive Diwali personality quiz created for the Rotaract Club of Thane East.",
      body: `
        <h3>The idea</h3>
        <p>Build a festive online experience that lets people discover which Diwali personality feels most like them.</p>
        <h3>What went into it</h3>
        <ul>
          <li>Concept development and creative direction.</li>
          <li>A festive digital experience with six different Diwali personalities.</li>
          <li>Quiz scoring, animated personality reveals and personalised result cards.</li>
          <li>Downloadable/shareable cards, website development using GitHub, and social media launch and promotion.</li>
        </ul>
        <h3>What to add next</h3>
        <p>Replace the temporary artwork with screenshots, add the live project URL, and include a short process gallery.</p>`,
      link: "#work",
      linkLabel: "ADD LIVE PROJECT LINK"
    },
    rotaract: {
      eyebrow: "PROJECT 02 · SOCIAL MEDIA & PR",
      title: "Rotaract Social Media & PR",
      intro: "A selected-work gallery for social media content and communication created for Rotaract Club of Thane East.",
      body: `
        <h3>Work to feature</h3>
        <ul>
          <li>Instagram posts and carousel designs.</li>
          <li>Reels and short-form video content.</li>
          <li>Campaign creatives and social media initiatives.</li>
          <li>Creative planning and communication work.</li>
        </ul>
        <h3>Gallery space</h3>
        <p>Add your original exports to the <code>projects/</code> folder and build them into this case study. Keep each item labelled with its project or campaign name.</p>`,
      link: "#work",
      linkLabel: "GALLERY LINK TO BE ADDED"
    },
    writing: {
      eyebrow: "PROJECT 03 · WRITING",
      title: "Writing & Storytelling",
      intro: "A small editorial corner for words, scripts, captions and ideas in progress.",
      body: `
        <h3>Writing to feature</h3>
        <ul>
          <li>Blog writing and personal essays.</li>
          <li>Scripts and short-form storytelling.</li>
          <li>Social media captions and copy.</li>
          <li>Creative writing experiments.</li>
        </ul>
        <h3>Notebook space</h3>
        <p>Add real writing samples when you're ready. A short excerpt, a title, the format and a little context will make each piece easy to explore.</p>`,
      link: "#work",
      linkLabel: "WRITING SAMPLES TO BE ADDED"
    }
  };

  function openModal(projectKey, trigger) {
    const item = projectDetails[projectKey];
    if (!item) return;
    lastFocusedElement = trigger;
    modalEyebrow.textContent = item.eyebrow;
    modalTitle.textContent = item.title;
    modalIntro.textContent = item.intro;
    modalBody.innerHTML = item.body;
    modalLink.href = item.link;
    modalLink.innerHTML = `${item.linkLabel} <span aria-hidden="true">↗</span>`;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    if (!modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  document.querySelectorAll(".modal-trigger").forEach(button => {
    button.addEventListener("click", () => openModal(button.dataset.project, button));
  });
  modal.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
  modalLink.addEventListener("click", event => {
    if (modalLink.getAttribute("href") === "#work") closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
    if (event.key === "Tab" && modal.classList.contains("is-open")) {
      const focusable = [...modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.hasAttribute("disabled"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
})();
