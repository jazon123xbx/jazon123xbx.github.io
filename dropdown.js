(function () {
  var projectsBtn = document.querySelector("#dropdownBtn");
  var projectsMenu = document.querySelector("#dropdownMenu");
  var projectsArrow = document.querySelector("#dropdownArrow");

  var capsBtn = document.querySelector("#capabilitiesDropdownBtn");
  var capsMenu = document.querySelector("#capabilitiesDropdownMenu");
  var capsArrow = document.querySelector("#capabilitiesDropdownArrow");

  function closeAll() {
    if (projectsMenu) {
      projectsMenu.classList.remove("show");
    }
    if (projectsBtn) {
      projectsBtn.setAttribute("aria-expanded", "false");
    }
    if (projectsArrow) {
      projectsArrow.textContent = "\u25BC";
    }
    if (capsMenu) {
      capsMenu.classList.remove("show");
    }
    if (capsBtn) {
      capsBtn.setAttribute("aria-expanded", "false");
    }
    if (capsArrow) {
      capsArrow.textContent = "\u25BC";
    }
  }

  function toggleDropdown(btn, menu, arrow, otherBtn, otherMenu, otherArrow) {
    if (!btn || !menu) return;

    btn.addEventListener("click", function (event) {
      event.stopPropagation();

      // Close the other dropdown first
      if (otherMenu && otherMenu.classList.contains("show")) {
        otherMenu.classList.remove("show");
        if (otherBtn) {
          otherBtn.setAttribute("aria-expanded", "false");
        }
        if (otherArrow) {
          otherArrow.textContent = "\u25BC";
        }
      }

      menu.classList.toggle("show");
      var nowOpen = menu.classList.contains("show");
      btn.setAttribute("aria-expanded", String(nowOpen));
      if (arrow) {
        arrow.textContent = nowOpen ? "\u25B2" : "\u25BC";
      }
    });
  }

  toggleDropdown(projectsBtn, projectsMenu, projectsArrow, capsBtn, capsMenu, capsArrow);
  toggleDropdown(capsBtn, capsMenu, capsArrow, projectsBtn, projectsMenu, projectsArrow);

  document.addEventListener("click", function (event) {
    var projectsBtnHit = projectsBtn && projectsBtn.contains(event.target);
    var projectsMenuHit = projectsMenu && projectsMenu.contains(event.target);
    var capsBtnHit = capsBtn && capsBtn.contains(event.target);
    var capsMenuHit = capsMenu && capsMenu.contains(event.target);

    if (!projectsBtnHit && !projectsMenuHit && !capsBtnHit && !capsMenuHit) {
      closeAll();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAll();
    }
  });

  function bindMenuLinks(menu) {
    if (!menu) return;
    var links = menu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        closeAll();
      });
    }
  }

  bindMenuLinks(projectsMenu);
  bindMenuLinks(capsMenu);

  /* ── Capability Spotlight ────────────────────────────────────── */

  var overlay = document.getElementById("spotlightOverlay");
  var panel = document.getElementById("spotlightPanel");
  var contentTarget = document.getElementById("spotlightContent");
  var closeBtn = document.getElementById("spotlightClose");
  var savedOpener = null;
  var previousOverflow = "";

  function isOpen() {
    return overlay && overlay.classList.contains("open");
  }

  function openSpotlight(modId) {
    if (!overlay || !panel || !contentTarget || !modId) return;

    // Close any open dropdowns
    closeAll();

    // Find the matching skill-module card by data-spotlight-mod
    var card = document.querySelector(
      '.skill-module[data-spotlight-mod="' + modId + '"]'
    );
    if (!card) return;

    // Clone the card and strip all IDs to avoid runtime duplicates
    contentTarget.innerHTML = "";
    var clone = card.cloneNode(true);
    clone.removeAttribute("data-spotlight-mod");
    clone.removeAttribute("role");
    clone.removeAttribute("tabindex");
    clone.removeAttribute("id");
    var idEls = clone.querySelectorAll("[id]");
    for (var k = 0; k < idEls.length; k++) {
      idEls[k].removeAttribute("id");
    }
    clone.classList.add("spotlight-clone");
    contentTarget.appendChild(clone);

    // Save the element that triggered the open for focus restoration
    savedOpener = document.activeElement;

    // Lock body scroll, saving exact prior state
    previousOverflow = document.body.style.overflow || "";
    document.body.style.overflow = "hidden";

    // Show overlay
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");

    // Focus close button (prevent scroll jump)
    if (closeBtn) {
      closeBtn.focus({ preventScroll: true });
    }
  }

  function closeSpotlight() {
    if (!overlay) return;

    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    contentTarget.innerHTML = "";

    // Restore body scroll to exact prior value
    document.body.style.overflow = previousOverflow;
    previousOverflow = "";

    // Restore focus to opener when practical
    if (savedOpener && typeof savedOpener.focus === "function") {
      try {
        savedOpener.focus({ preventScroll: true });
      } catch {
        /* noop */
      }
    }
    savedOpener = null;
  }

  // Card triggers — click
  var skillCards = document.querySelectorAll(".skill-module[data-spotlight-mod]");
  for (var i = 0; i < skillCards.length; i++) {
    skillCards[i].addEventListener("click", function (event) {
      event.preventDefault();
      openSpotlight(this.getAttribute("data-spotlight-mod"));
    });

    // Card triggers — Enter/Space keyboard
    skillCards[i].addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSpotlight(this.getAttribute("data-spotlight-mod"));
      }
    });
  }

  // Dropdown shortcut triggers — click
  var shortcutLinks = capsMenu
    ? capsMenu.querySelectorAll("a[data-spotlight-mod]")
    : [];
  for (var j = 0; j < shortcutLinks.length; j++) {
    shortcutLinks[j].addEventListener("click", function () {
      // React onClick already called preventDefault and closed mobile nav.
      // Vanilla JS closes dropdowns via closeAll() at top of openSpotlight.
      // Scroll the capabilities section into view so the section position is
      // settled before openSpotlight applies the body scroll lock.
      var capabilitiesSection = document.getElementById("capabilities");
      if (capabilitiesSection) {
        capabilitiesSection.scrollIntoView({ behavior: "instant", block: "start" });
      }
      openSpotlight(this.getAttribute("data-spotlight-mod"));
    });
  }

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      closeSpotlight();
    });
  }

  // Overlay click — only when clicking the overlay backdrop itself
  if (overlay) {
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeSpotlight();
      }
    });
  }

  // Escape — close spotlight (also handled for dropdowns above; both
  // functions are harmless if the other target is already closed)
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      event.stopPropagation();
      closeSpotlight();
    }
  });
})();
