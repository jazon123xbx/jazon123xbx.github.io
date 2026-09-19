(function () {
  const dropdownButton = document.querySelector("#dropdownBtn");
  const dropdownMenu = document.querySelector("#dropdownMenu");
  const dropdownArrow = document.querySelector("#dropdownArrow");

  if (!dropdownButton || !dropdownMenu) return;

  function closeDropdown() {
    dropdownMenu.classList.remove("show");
    dropdownButton.setAttribute("aria-expanded", "false");
    if (dropdownArrow) {
      dropdownArrow.textContent = "\u25BC";
    }
  }

  function openDropdown() {
    dropdownMenu.classList.add("show");
    dropdownButton.setAttribute("aria-expanded", "true");
    if (dropdownArrow) {
      dropdownArrow.textContent = "\u25B2";
    }
  }

  dropdownButton.addEventListener("click", function (event) {
    event.stopPropagation();
    dropdownMenu.classList.toggle("show");
    var isOpen = dropdownMenu.classList.contains("show");
    dropdownButton.setAttribute("aria-expanded", String(isOpen));
    if (dropdownArrow) {
      dropdownArrow.textContent = isOpen ? "\u25B2" : "\u25BC";
    }
  });

  document.addEventListener("click", function (event) {
    if (
      !dropdownMenu.contains(event.target) &&
      !dropdownButton.contains(event.target)
    ) {
      closeDropdown();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeDropdown();
    }
  });

  var links = dropdownMenu.querySelectorAll("a");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function () {
      closeDropdown();
    });
  }
})();
