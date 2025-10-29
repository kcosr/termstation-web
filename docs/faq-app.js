/**
 * FAQ page renderer
 * Renders FAQ items from the TERMSTATION_FAQ data with anchors for deep linking
 */

(function () {
  const container = document.getElementById('faq-list');
  if (!container) return;

  const faqData = Array.isArray(window.TERMSTATION_FAQ)
    ? window.TERMSTATION_FAQ
    : [];

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intersection observer for fade-in animations
  const observer =
    !prefersReducedMotion && 'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.1,
          },
        )
      : null;

  // Render each FAQ item
  faqData.forEach((faq, index) => {
    const faqItem = createFaqItem(faq, index);
    container.appendChild(faqItem);

    if (observer) {
      observer.observe(faqItem);
    } else {
      faqItem.classList.add('is-visible');
    }
  });

  // Set footer year
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  // Handle smooth scrolling to anchors
  handleAnchorClicks();
})();

/**
 * Creates a FAQ item element with anchor
 */
function createFaqItem(faq, index) {
  const item = document.createElement('div');
  item.className = 'faq-item';
  item.id = faq.id || `faq-${index + 1}`;

  // Create question element
  const question = document.createElement('h2');
  question.className = 'faq-question';
  question.textContent = faq.question;

  // Create answer element
  const answer = document.createElement('div');
  answer.className = 'faq-answer';
  answer.innerHTML = faq.answer; // Allow HTML in answers for formatting

  // Assemble the item
  item.appendChild(question);
  item.appendChild(answer);

  return item;
}

/**
 * Handle smooth scrolling and highlight for anchor links
 */
function handleAnchorClicks() {
  // Handle hash changes (including page load with hash)
  function handleHash() {
    if (!window.location.hash) return;

    const targetId = window.location.hash.slice(1);
    const target = document.getElementById(targetId);

    if (target && target.classList.contains('faq-item')) {
      // Remove previous highlights
      document.querySelectorAll('.faq-item.highlighted').forEach((el) => {
        el.classList.remove('highlighted');
      });

      // Add highlight to target
      target.classList.add('highlighted');

      // Scroll to target with offset for header
      setTimeout(() => {
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 60;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 100);

      // Remove highlight after animation
      setTimeout(() => {
        target.classList.remove('highlighted');
      }, 2000);
    }
  }

  // Handle initial hash on page load
  if (window.location.hash) {
    // Delay to ensure DOM is ready
    setTimeout(handleHash, 100);
  }

  // Handle hash changes
  window.addEventListener('hashchange', handleHash);
}
