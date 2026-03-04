/* -----------------------------------------------------------
 * Project: Vendora - E-commerce Website
 * File: script.css
 * Description: This file handles interactivity, events, and dynamic functionality.
 * Author: BytePulseX Solutions
 * Created: 17/12/2025
------------------------------------------------------------ */
    
/* ====== ACTIVE NAVIGATION LINK HANDLER ====== */
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-link, .dropdown-item");

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");

            // Activate parent dropdown link if applicable
            const dropdown = link.closest(".dropdown");
            if (dropdown) {
                dropdown.querySelector(".nav-link").classList.add("active");
            }
        }
    });
});

/* ====== SECTION DIVIDER: DYNAMIC INSERTION LOGIC ====== */
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");

    sections.forEach((section, index) => {

        // Skip last section
        if (index === sections.length - 1) return;

        // Skip hero or manually excluded sections
        if (
            section.classList.contains("hero") || section.classList.contains("tab-pane") ||
            section.classList.contains("no-divider")
        ) return;

        const divider = document.createElement("div");
        divider.className = "section-divider";

        section.after(divider);
    });
});

/* ====== HERO SECTION DYNAMIC TOP OFFSET ====== */
document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".header");
    const hero = document.querySelector(".hero");
    const headerHeight = header.offsetHeight;

    hero.style.marginTop = headerHeight + "px";
});

/* ====== ADJUST PSEUDO ELEMENTS FOR WRAPPED H2 ====== */
document.addEventListener("DOMContentLoaded", () => {
    const headings = document.querySelectorAll("h2");

    headings.forEach(h2 => {
        const range = document.createRange();
        range.selectNodeContents(h2);
        const rects = range.getClientRects(); // gives rect for each line

        // Only adjust if text is wrapped onto multiple lines
        if (rects.length > 1) {
            h2.classList.add("multi-line-pseudo");
        } else {
            h2.classList.remove("multi-line-pseudo");
        }
    });
});

/* ====== FLASH DEAL COUNTDOWN TIMER ====== */
document.addEventListener("DOMContentLoaded", function () {
    const DEAL_DURATION_HOURS = 6;
    const dealEndTime = Date.now() + DEAL_DURATION_HOURS * 60 * 60 * 1000;

    const hoursEl = document.getElementById("flash-hours");
    const minutesEl = document.getElementById("flash-minutes");
    const secondsEl = document.getElementById("flash-seconds");

    if (!hoursEl || !minutesEl || !secondsEl) return;

    const timerInterval = setInterval(() => {
        const now = Date.now();
        const remainingTime = dealEndTime - now;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            hoursEl.innerText = "00";
            minutesEl.innerText = "00";
            secondsEl.innerText = "00";
            return;
        }

        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        hoursEl.innerText = String(hours).padStart(2, "0");
        minutesEl.innerText = String(minutes).padStart(2, "0");
        secondsEl.innerText = String(seconds).padStart(2, "0");
    },
        1000);
});

/* ====== RESPONSIVE MULTI-LINE TYPING ANIMATION ====== */
document.addEventListener('DOMContentLoaded', () => {

    const strong = document.querySelector('.typing strong');
    const originalText = strong.textContent.trim();

    const TYPING_SPEED = 45;
    const LINE_DELAY = 300;
    const RESTART_DELAY = 1200;

    let typingTimeout;

    /* -------------------------
       BUILD LINES RESPONSIVELY
       ------------------------- */
    function buildLines() {
        strong.style.height = 'auto';
        strong.innerHTML = originalText;

        const range = document.createRange();
        const lines = [];
        let lastTop = null;
        let currentLine = '';

        [...originalText].forEach((char, i) => {
            range.setStart(strong.firstChild, i);
            range.setEnd(strong.firstChild, i + 1);

            const rect = range.getClientRects()[0];
            if (!rect) return;

            if (lastTop === null) lastTop = rect.top;

            if (rect.top !== lastTop) {
                lines.push(currentLine);
                currentLine = char;
                lastTop = rect.top;
            } else {
                currentLine += char;
            }
        });

        lines.push(currentLine);

        // Replace content with spans
        strong.innerHTML = '';
        lines.forEach(line => {
            const span = document.createElement('span');
            span.className = 'typing-line';
            span.dataset.text = line;
            span.textContent = '';
            strong.appendChild(span);
        });

        // Lock height AFTER wrapping
        strong.style.height = strong.offsetHeight + 'px';

        return strong.querySelectorAll('.typing-line');
    }

    /* -------------------------
       TYPING LOOP
       ------------------------- */
    function startTyping() {
        clearTimeout(typingTimeout);

        const spans = buildLines();
        let lineIndex = 0;

        function typeLine() {
            if (lineIndex >= spans.length) {
                spans[spans.length - 1].classList.add('typing-cursor');
                typingTimeout = setTimeout(startTyping, RESTART_DELAY);
                return;
            }

            const span = spans[lineIndex];
            const text = span.dataset.text;
            span.classList.add('typing-cursor');

            // Ensure cursor has width to sit on
            span.textContent = '\u00A0';

            let i = 0;
            const interval = setInterval(() => {
                if (i === 0) {
                    span.textContent = '';
                }

                span.textContent += text[i];
                i++;

                if (i >= text.length) {
                    clearInterval(interval);
                    span.classList.remove('typing-cursor');
                    lineIndex++;
                    setTimeout(typeLine, LINE_DELAY);
                }
            },
                TYPING_SPEED);
        }

        typeLine();
    }

    /* -------------------------
       INIT + RESIZE HANDLING
       ------------------------- */
    startTyping();

    window.addEventListener('resize',
        () => {
            clearTimeout(typingTimeout);
            startTyping();
        });

});

/* ====== STATS COUNTER ANIMATION (ON SCROLL) ====== */
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("stats-counter");
    if (!container) return;

    const counters = container.querySelectorAll(".counter");
    if (!counters.length) return;

    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;
        hasAnimated = true;

        counters.forEach(counter => {
            const targetValue = Number(counter.dataset.target);
            if (isNaN(targetValue)) return;

            const isDecimal = targetValue % 1 !== 0;
            const animationDuration = 120; // total animation frames
            let currentValue = 0;

            function updateCounter() {
                const increment = targetValue / animationDuration;
                currentValue += increment;

                if (currentValue < targetValue) {
                    counter.innerText = isDecimal
                    ? currentValue.toFixed(1): Math.ceil(currentValue);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = targetValue;
                }
            }

            updateCounter();
        });
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        },
        {
            threshold: 0.4
        }
    );

    observer.observe(container);
});

/* ====== PRICE RANGE SLIDER WITH DYNAMIC TOOLTIP ====== */
document.addEventListener("DOMContentLoaded", function () {
    const rangeWrappers = document.querySelectorAll(".range-wrap");
    if (!rangeWrappers.length) return;

    /**
    * Formats numeric values into user-friendly price labels
    * Examples: 1200 → $1k, 1500000 → $1.5M
    */
    function formatPrice(value) {
        const amount = Number(value) || 0;

        if (amount >= 1_000_000) {
            return `$${(amount / 1_000_000).toFixed(1)}M`;
        }
        if (amount >= 1_000) {
            return `$${Math.round(amount / 1_000)}k`;
        }
        return `$${amount}`;
    }

    /**
    * Updates tooltip content and horizontal position
    */
    function updateTooltip(range, tooltip) {
        const min = Number(range.min) || 0;
        const max = Number(range.max) || 100;
        const value = Number(range.value) || 0;

        const percent = ((value - min) / (max - min)) * 100;

        tooltip.textContent = formatPrice(value);
        tooltip.style.left = `${percent}%`;
    }

    rangeWrappers.forEach(wrapper => {
        const rangeInput = wrapper.querySelector('input[type="range"]');
        const tooltip = wrapper.querySelector(".range-tooltip");

        if (!rangeInput || !tooltip) return;

        function activate() {
            wrapper.classList.add("active");
            updateTooltip(rangeInput, tooltip);
        }

        function deactivate() {
            wrapper.classList.remove("active");
        }

        rangeInput.addEventListener("input", activate);
        rangeInput.addEventListener("focus", activate);
        rangeInput.addEventListener("blur", deactivate);

        document.addEventListener("pointerup", deactivate);

        document.addEventListener("click", e => {
            if (!wrapper.contains(e.target)) {
                deactivate();
            }
        });
    });
});

/* ====== GLOBAL FORM VALIDATION USING FORM ACTION ====== */
document.addEventListener("DOMContentLoaded", function () {

    const forms = document.querySelectorAll("form");
    if (!forms.length) return;

    /**
     * Handles form submission.
     * Validates required fields before allowing navigation
     * to the form's action URL.
     */
    function handleFormSubmit(event) {
        const form = event.currentTarget;

        event.preventDefault();

        if (form.checkValidity()) {
            form.submit(); // Navigates to form.action
        } else {
            form.reportValidity(); // Shows native validation UI
        }
    }

    /**
     * Attach submit handler to all forms
     */
    forms.forEach(form => {
        form.addEventListener("submit", handleFormSubmit);
    });

});

/* ====== CONTACT FORM SUCCESS MODAL HANDLER ====== */
document.addEventListener("DOMContentLoaded", function () {
    // Get the Bootstrap modal instance for the Vendora theme
    const successModalEl = document.getElementById("successModal");
    const successModal = new bootstrap.Modal(successModalEl);

    // Select all contact forms (use a specific class to avoid affecting other forms)
    const forms = document.querySelectorAll(".contact-form");

    forms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();          // Prevent default submission
            e.stopPropagation();         // Stop event from bubbling

            /**
             * Checks if all required form fields are filled
             * If valid, shows the success modal and resets the form
             * If invalid, browser highlights missing fields
             */
            if (form.checkValidity()) {
                successModal.show();     // Show success modal
                form.reset();            // Clear form fields after success
            } else {
                form.reportValidity();   // Highlight invalid/missing fields
            }
        }, { capture: true }); // Use capture to ensure early interception
    });
});

/* ====== ORDER STATUS TRACKING CONTROLLER ====== */
document.addEventListener("DOMContentLoaded", function () {

    /**
    * Updates visual order tracking steps based on current status index
    * @param {number} stepIndex - Zero-based index of the active order step
    */
    function updateOrderStatus(stepIndex) {
        const steps = document.querySelectorAll(".tracking-step");
        if (!steps.length) return;

        steps.forEach((step, index) => {
            step.classList.remove("completed", "active");

            if (index < stepIndex) {
                step.classList.add("completed");
            } else if (index === stepIndex) {
                step.classList.add("active");
            }
        });
    }

    /*
     Order Status Reference:
     0 → Order Placed
     1 → Processing
     2 → Shipped
     3 → Delivered
    */
    updateOrderStatus(2);

});

/* ====== AUTOMATIC COPYRIGHT YEAR ====== */
document.addEventListener("DOMContentLoaded", function () {
    const yearElement = document.getElementById("year");
    if (!yearElement) return;

    yearElement.textContent = new Date().getFullYear();
});
