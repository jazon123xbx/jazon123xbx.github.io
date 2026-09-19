// =========================================================
// LIN. PORTFOLIO — ACTIVITY 2
// Vanilla JavaScript Navbar Dropdown
// =========================================================


// ---------------------------------------------------------
// DOM ELEMENT SELECTION
// Required concept: document.querySelector()
// ---------------------------------------------------------

const dropdownButton = document.querySelector("#dropdownBtn");
const dropdownMenu = document.querySelector("#dropdownMenu");
const dropdownArrow = document.querySelector("#dropdownArrow");
const dropdown = document.querySelector(".dropdown");

const mobileMenuButton = document.querySelector("#mobileMenuBtn");
const navLinks = document.querySelector("#navLinks");


// ---------------------------------------------------------
// DROPDOWN CLICK EVENT
// Required concepts:
// addEventListener()
// classList.toggle()
// ---------------------------------------------------------

dropdownButton.addEventListener("click", function (event) {

    // Prevent the same click from immediately triggering
    // the document outside-click handler.
    event.stopPropagation();

    // REQUIRED BY THE ACTIVITY:
    // Toggle the CSS "show" class.
    dropdownMenu.classList.toggle("show");

    const isOpen = dropdownMenu.classList.contains("show");

    // Accessibility state
    dropdownButton.setAttribute("aria-expanded", isOpen);

    // Bonus challenge:
    // Change ▼ to ▲ while open.
    if (isOpen) {
        dropdownArrow.textContent = "▲";
    } else {
        dropdownArrow.textContent = "▼";
    }

});


// ---------------------------------------------------------
// BONUS 1 — CLOSE WHEN CLICKING OUTSIDE
// ---------------------------------------------------------

document.addEventListener("click", function (event) {

    if (!dropdown.contains(event.target)) {

        dropdownMenu.classList.remove("show");

        dropdownButton.setAttribute(
            "aria-expanded",
            "false"
        );

        dropdownArrow.textContent = "▼";
    }

});


// ---------------------------------------------------------
// BONUS — ESCAPE KEY CLOSES DROPDOWN
// ---------------------------------------------------------

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        const dropdownWasOpen =
            dropdownMenu.classList.contains("show");

        dropdownMenu.classList.remove("show");

        dropdownButton.setAttribute(
            "aria-expanded",
            "false"
        );

        dropdownArrow.textContent = "▼";

        // Return keyboard focus to the dropdown button
        if (dropdownWasOpen) {
            dropdownButton.focus();
        }


        // Also close the mobile navigation
        navLinks.classList.remove("show");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuButton.textContent = "☰";
    }

});


// ---------------------------------------------------------
// BONUS 4 — RESPONSIVE MOBILE NAVIGATION
// ---------------------------------------------------------

mobileMenuButton.addEventListener("click", function (event) {

    event.stopPropagation();

    navLinks.classList.toggle("show");

    const menuIsOpen =
        navLinks.classList.contains("show");

    mobileMenuButton.setAttribute(
        "aria-expanded",
        menuIsOpen
    );

    if (menuIsOpen) {
        mobileMenuButton.textContent = "✕";
        mobileMenuButton.setAttribute(
            "aria-label",
            "Close navigation menu"
        );
    } else {
        mobileMenuButton.textContent = "☰";
        mobileMenuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

});


// ---------------------------------------------------------
// CLOSE MOBILE NAV AFTER CLICKING A NORMAL NAV LINK
// ---------------------------------------------------------

const navigationLinks =
    document.querySelectorAll(
        "#navLinks a"
    );

navigationLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        // Close Projects dropdown
        dropdownMenu.classList.remove("show");

        dropdownButton.setAttribute(
            "aria-expanded",
            "false"
        );

        dropdownArrow.textContent = "▼";


        // Close mobile navbar
        navLinks.classList.remove("show");

        mobileMenuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileMenuButton.textContent = "☰";

        mobileMenuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

    });

});


// ---------------------------------------------------------
// OPTIONAL POLISH — ACTIVE NAV LINK WHILE SCROLLING
// ---------------------------------------------------------

const sections =
    document.querySelectorAll("main section");

const mainNavLinks =
    document.querySelectorAll(
        '.nav-links > li > a[href^="#"]'
    );

window.addEventListener("scroll", function () {

    let currentSection = "";

    sections.forEach(function (section) {

        const sectionTop =
            section.offsetTop - 140;

        if (window.scrollY >= sectionTop) {
            currentSection =
                section.getAttribute("id");
        }

    });


    mainNavLinks.forEach(function (link) {

        link.classList.remove("active");

        const href =
            link.getAttribute("href");

        if (href === "#" + currentSection) {
            link.classList.add("active");
        }

    });

});