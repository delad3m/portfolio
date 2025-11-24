document.addEventListener("DOMContentLoaded", () => {
  // --- Helpers ---
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const isSmallScreen = () =>
    window.matchMedia("(max-width: 800px)").matches;

  // Set current year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Smooth scroll for links with .js-scroll
  document.querySelectorAll(".js-scroll").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // -------------------------------
  // HOME PAGE: EXPLORE SECTION
  // -------------------------------

  const exploreItems = document.querySelectorAll(".explore-item");
  const explorePanels = document.querySelectorAll(".explore-panel");

  function activateExploreDesktop(item) {
    const target = item.getAttribute("data-target");
    if (!target) return;

    exploreItems.forEach((i) => i.classList.remove("is-active"));
    item.classList.add("is-active");

    explorePanels.forEach((panel) => {
      panel.classList.remove("is-visible");
      if (panel.id === `panel-${target}`) {
        panel.classList.add("is-visible");
      }
    });
  }

  function showExploreInlinePanel(item) {
    const target = item.getAttribute("data-target");
    if (!target) return;

    const panel = document.getElementById(`panel-${target}`);
    if (!panel) return;

    // Clear active state + inline panels for all items
    exploreItems.forEach((i) => i.classList.remove("is-active"));
    document
      .querySelectorAll(".explore-item .inline-panel")
      .forEach((el) => el.remove());

    // Mark this one active
    item.classList.add("is-active");

    // Create / insert inline panel under this item
    const inline = document.createElement("div");
    inline.className = "inline-panel";
    inline.innerHTML = panel.innerHTML;
    item.appendChild(inline);

    // Scroll that item into view nicely
    item.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (exploreItems.length && explorePanels.length) {
    exploreItems.forEach((item) => {
      const link = item.querySelector(".explore-link");

      // Desktop: hover updates the right-hand description panel
      item.addEventListener("mouseenter", () => {
        if (!isTouchDevice && !isSmallScreen()) {
          activateExploreDesktop(item);
        }
      });

      // Mobile/tablet touch: first tap shows inline panel under item,
      // second tap (within a short time) follows the link.
      if (link) {
        link.addEventListener("click", (e) => {
          if (!isTouchDevice || !isSmallScreen()) {
            // Normal navigation on non-touch / large screens
            return;
          }

          const armed = link.dataset.armed === "true";

          if (!armed) {
            // First tap: show inline description, don't navigate
            e.preventDefault();
            showExploreInlinePanel(item);
            link.dataset.armed = "true";

            // Reset "armed" after a short window
            setTimeout(() => {
              link.dataset.armed = "false";
            }, 1500);
          }
          // Second tap within the window: allow navigation
        });
      }
    });
  }

  // ---------------------------------------
  // GENERIC LIST + PANEL (PROJECTS / CS)
  // ---------------------------------------

  function initHoverPanels(listSelector, panelSelector, idPrefix) {
    const items = document.querySelectorAll(listSelector);
    const panels = document.querySelectorAll(panelSelector);
    if (!items.length || !panels.length) return;

    function activateDesktop(item) {
      const target = item.getAttribute("data-target");
      if (!target) return;

      items.forEach((i) => i.classList.remove("is-active"));
      item.classList.add("is-active");

      panels.forEach((panel) => {
        panel.classList.remove("is-visible");
        if (panel.id === `${idPrefix}${target}`) {
          panel.classList.add("is-visible");
        }
      });
    }

    function showInline(item) {
      const target = item.getAttribute("data-target");
      if (!target) return;

      const panel = document.getElementById(`${idPrefix}${target}`);
      if (!panel) return;

      // Clear active + inline panels in this list container
      const container = item.closest(".split-layout") || document;
      container.querySelectorAll(".item").forEach((i) => i.classList.remove("is-active"));
      container
        .querySelectorAll(".item .inline-panel")
        .forEach((el) => el.remove());

      // Mark this item active
      item.classList.add("is-active");

      // Create inline panel under the item with content
      const inline = document.createElement("div");
      inline.className = "inline-panel";
      inline.innerHTML = panel.innerHTML;
      item.appendChild(inline);

      item.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    items.forEach((item) => {
      // Desktop hover → right-hand panel
      item.addEventListener("mouseenter", () => {
        if (!isTouchDevice && !isSmallScreen()) {
          activateDesktop(item);
        }
      });

      // Click / tap → on mobile, show inline; on desktop, just change right panel
      item.addEventListener("click", (e) => {
        if (isTouchDevice && isSmallScreen()) {
          e.preventDefault();
          showInline(item);
        } else {
          activateDesktop(item);
        }
      });
    });
  }

  // Projects page
  initHoverPanels(
    ".projects-list .item",
    ".projects-panels .item-panel",
    "project-"
  );

  // Case studies overview page
  initHoverPanels(".cs-list .item", ".cs-panels .item-panel", "cs-");
});