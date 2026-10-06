const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const header = document.querySelector(".site-header");
const backToTop = document.querySelector(".back-to-top");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const contactEmail = "YOUR_EMAIL";

function closeNavigation() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuButton.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      if (link.getAttribute("href") === `#${entry.target.id}`) {
        link.classList.add("active");
        link.setAttribute("aria-current", "location");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  });
}, { rootMargin: "-24% 0px -66% 0px", threshold: 0 });

sections.forEach((section) => activeSectionObserver.observe(section));

let scrollFrame = 0;
function updateScrollState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  backToTop.classList.toggle("is-visible", window.scrollY > 650);
  scrollFrame = 0;
}

window.addEventListener("scroll", () => {
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollState);
}, { passive: true });
updateScrollState();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
});

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const light = document.querySelector(".ambient-light");
  let pointerFrame = 0;
  window.addEventListener("pointermove", (event) => {
    if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
    pointerFrame = window.requestAnimationFrame(() => {
      light.style.left = `${event.clientX}px`;
      light.style.top = `${event.clientY}px`;
    });
  }, { passive: true });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (contactEmail === "YOUR_EMAIL" || !contactEmail.includes("@")) {
    formStatus.textContent = "Message not sent: replace YOUR_EMAIL in script.js with a real email address first.";
    return;
  }

  const data = new FormData(form);
  const subject = `Portfolio message from ${data.get("name")}`;
  const body = `${data.get("message")}\n\nFrom: ${data.get("name")}\nReply to: ${data.get("email")}`;
  window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formStatus.textContent = "Your email app should open with the message ready to send.";
});
