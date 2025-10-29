// Fade configuration – adaptive for small screens
function getFadeConfig() {
  const isSmallScreen =
    (window.matchMedia && window.matchMedia('(max-width: 720px)').matches) ||
    Math.min(window.innerWidth, window.innerHeight) <= 720;
  // Use same settings for both mobile and desktop
  return isSmallScreen
    ? { START: 0.40, END: 0.65, EASE: 2.5, EPS: 0.01 }
    : { START: 0.40, END: 0.65, EASE: 2.5, EPS: 0.01 };
}

(function () {
  const container = document.getElementById('sections');
  if (!container) return;

  const sections = Array.isArray(window.TERMSTATION_SECTIONS)
    ? window.TERMSTATION_SECTIONS
    : [];
  const anchors = Array.isArray(window.TERMSTATION_ANCHORS)
    ? window.TERMSTATION_ANCHORS
    : [];
  const anchorByIndex = new Map(
    anchors
      .filter((a) => a && Number.isInteger(a.index) && typeof a.id === 'string')
      .map((a) => [a.index, a.id])
  );

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
            threshold: 0.35,
          },
        )
      : null;

  sections.forEach((section, index) => {
    // Insert hidden anchor before this section if configured
    if (anchorByIndex.has(index)) {
      const anchor = document.createElement('div');
      anchor.id = anchorByIndex.get(index);
      anchor.className = 'section-anchor';
      anchor.setAttribute('aria-hidden', 'true');
      container.appendChild(anchor);
    }

    const sectionEl = createSection(section, index);
    container.appendChild(sectionEl);

    if (observer) {
      observer.observe(sectionEl);
    } else {
      sectionEl.classList.add('is-visible');
    }
  });

  // Initialize fade effect
  updateCardFade();
  const onResize = () => {
    // Debounce via rAF to avoid thrashing on resize
    if (onResize._tick) cancelAnimationFrame(onResize._tick);
    onResize._tick = requestAnimationFrame(updateCardFade);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  window.addEventListener('load', updateCardFade);

  const onScroll = () => {
    if (onScroll._tick) cancelAnimationFrame(onScroll._tick);
    onScroll._tick = requestAnimationFrame(updateCardFade);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  // Video autoplay on scroll into view
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Autoplay failed, likely due to browser policies
          });
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.5, // Play when 50% of video is visible
    }
  );

  // Observe all videos
  document.querySelectorAll('video').forEach((video) => {
    videoObserver.observe(video);
  });
})();

function createSection(data, index) {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'section';
  sectionEl.id = data.id || `section-${index + 1}`;

  const card = document.createElement('article');
  card.className = 'section-card';
  // Initialize per-card fade state
  try {
    card.dataset.lastOpacity = '1';
    card.dataset.lockHidden = '';
    card.dataset.seenHigh = '';
  } catch (_) {}

  const content = document.createElement('div');
  content.className = 'section__content';

  if (data.eyebrow) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'section__eyebrow';
    eyebrow.textContent = data.eyebrow;
    content.appendChild(eyebrow);
  }

  if (data.title) {
    const title = document.createElement('h2');
    title.className = 'section__title';
    title.textContent = data.title;
    content.appendChild(title);
  }

  if (data.description) {
    const description = document.createElement('p');
    description.className = 'section__description';
    description.textContent = data.description;
    content.appendChild(description);
  }

  if (Array.isArray(data.actions) && data.actions.length > 0) {
    const actions = document.createElement('div');
    actions.className = 'section__actions';

    data.actions.forEach((action) => {
      if (!action || !action.label || !action.href) return;
      const link = document.createElement('a');
      link.className = `button${
        action.variant === 'ghost' ? ' button--ghost' : ''
      }`;
      link.href = action.href;
      link.textContent = action.label;
      actions.appendChild(link);
    });

    content.appendChild(actions);
  }

  card.appendChild(content);
  sectionEl.appendChild(card);

  // Handle both single media object and array of media objects
  const mediaItems = Array.isArray(data.media) ? data.media : (data.media ? [data.media] : []);
  mediaItems.forEach((mediaData) => {
    const media = createSectionMedia(mediaData);
    if (media) {
      sectionEl.appendChild(media);
    }
  });

  return sectionEl;
}

function createSectionMedia(media) {
  const wrapper = document.createElement('div');
  wrapper.className = 'section__media';

  const frame = document.createElement('div');
  frame.className = 'section__media-frame';

  if (!media) {
    const placeholder = document.createElement('div');
    placeholder.className = 'section__media-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    frame.appendChild(placeholder);
    wrapper.appendChild(frame);
    return wrapper;
  }

  if (media.type === 'video') {
    const video = document.createElement('video');
    video.src = media.src;
    video.muted = media.muted !== false;
    video.loop = media.loop !== false;
    video.autoplay = media.autoplay !== false;
    video.playsInline = true;
    video.setAttribute('aria-label', media.alt || '');

    if (media.poster) {
      video.poster = media.poster;
    }

    if (media.controls) {
      video.controls = true;
    }

    frame.appendChild(video);
    wrapper.appendChild(frame);
    return wrapper;
  }

  const image = document.createElement('img');
  image.src = media.src;
  image.alt = media.alt || '';
  frame.appendChild(image);
  wrapper.appendChild(frame);

  return wrapper;
}

// No dynamic media offset; overlap is intentional for the dissolve effect

function updateCardFade() {
  // Fade based on how much of the image is visible in the viewport.
  // As the image fills the viewport, opacity goes to 0.
  // Prevent fade-in while scrolling down: once opacity reaches a low,
  // it does not increase until the user scrolls back up.
  // Use visual viewport when available to reduce iOS bar-resize jumps
  const vh = Math.max((window.visualViewport && window.visualViewport.height) || window.innerHeight, 1);

  document.querySelectorAll('.section').forEach((section) => {
    const card = section.querySelector('.section-card');
    const media = section.querySelector('.section__media');
    if (!card || !media) return;

    const cardRect = card.getBoundingClientRect();
    const frame = section.querySelector('.section__media-frame');
    const mediaRect = (frame || media).getBoundingClientRect();

    // Calculate how close the media top is to the viewport top
    // When media.top = vh (off bottom of screen), coverage = 0
    // When media.top = 0 (at top of viewport), coverage = 1.0
    // Use vh as the reference range for the scroll
    const distanceFromTop = Math.max(0, mediaRect.top);
    const coverage = distanceFromTop < vh ? 1 - (distanceFromTop / vh) : 0;
    const prevCoverage = parseFloat(card.dataset.prevCoverage || String(coverage));

    // Detect scroll direction from coverage change (works in iframes where window.scrollY is always 0)
    // Coverage increases when scrolling up (media moving toward top)
    // Coverage decreases when scrolling down (media moving away from top)
    const dirDown = coverage >= prevCoverage; // true when scrolling down or unchanged

    // Only start applying the fade once the card is in its sticky position near the top.
    const rootStyle = getComputedStyle(document.documentElement);
    const stickyTopRaw = rootStyle.getPropertyValue('--card-sticky-top') || '88px';
    const stickyTop = parseInt(String(stickyTopRaw).trim(), 10) || 88;
    const isSticky = cardRect.top <= stickyTop + 1;

    // Start fading when a portion of the image is visible and
    // finish only when it's essentially fully in view.
    const CFG = getFadeConfig();

    let t = (coverage - CFG.START) / (CFG.END - CFG.START);
    t = Math.max(0, Math.min(1, t));
    // Ease-in so opacity stays higher longer at the start
    t = Math.pow(t, CFG.EASE);
    const computedOpacity = 1 - t;

    const prevOpacity = parseFloat(card.dataset.lastOpacity || '1');
    let locked = card.dataset.lockHidden === '1';
    let seenHigh = card.dataset.seenHigh === '1';
    let next = computedOpacity;

    // Update lock/unlock state robustly using coverage deltas to avoid
    // missing thresholds on fast scroll.
    if (dirDown) {
      // Downward: latch hidden ONLY after the card has faded out while STICKY
      const candidate = Math.min(prevOpacity, computedOpacity);
      if (isSticky && candidate <= 0.001) {
        locked = true;
        card.dataset.lockHidden = '1';
      }
    } else {
      // Upward: record that we've been above the high threshold at least once
      if (!seenHigh && (coverage >= CFG.END - CFG.EPS || prevCoverage >= CFG.END - CFG.EPS)) {
        seenHigh = true;
        card.dataset.seenHigh = '1';
      }
      // Unlock only after crossing back below the same threshold
      const crossedBelow = prevCoverage > (CFG.END - CFG.EPS) && coverage <= (CFG.END - CFG.EPS);
      if (locked && seenHigh && crossedBelow) {
        locked = false;
        card.dataset.lockHidden = '';
        card.dataset.seenHigh = '';
      }
    }

    // Persist coverage for next tick comparisons
    card.dataset.prevCoverage = String(coverage);

    // Determine next opacity based on sticky state and direction
    if (!isSticky) {
      // Before sticky: keep card fully visible until it becomes sticky
      if (locked || coverage >= CFG.END) {
        next = 0;
      } else {
        // Keep at full opacity before reaching sticky position
        next = 1;
      }
    } else if (dirDown) {
      // Downward: non-increasing
      next = Math.min(prevOpacity, computedOpacity);
    } else {
      // Upward: if locked remain 0, otherwise non-decreasing
      next = locked ? 0 : Math.max(prevOpacity, computedOpacity);
    }

    // Apply opacity regardless of is-visible class to fix initial load visibility
    card.style.opacity = String(next);
    card.dataset.lastOpacity = String(next);

    // Disable button interactions when card opacity is low
    const actions = card.querySelector('.section__actions');
    if (actions) {
      if (next < 0.5) {
        actions.style.pointerEvents = 'none';
      } else {
        actions.style.pointerEvents = 'auto';
      }
    }
  });
}

// No dynamic sticky-top adjustments in this simpler version
