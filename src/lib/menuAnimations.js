
const DEFAULT_SELECTORS = [
  '[class*="menu_menu_"]',
  '[class*="menu_submenu_"]',
  '[class*="settings-menu_menu_"]',
  '[class*="settings-menu_submenu_"]',
  '[class*="settings-menu_dropdown_"]',
  '[class*="settings-menu_options_"]',
];

export function initMenuAnimations({
  selectors = DEFAULT_SELECTORS,
  duration = 180,
  easing = "cubic-bezier(.16, 1, .3, 1)",
  root = document,
} = {}) {
  if (typeof document === "undefined" || !root) {
    return () => {};
  }

  const selector = selectors.join(",");
  const previousVisibility = new WeakMap();
  const animations = new WeakMap();

  const reducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function isHidden(element) {
    const style = getComputedStyle(element);

    return (
      style.display === "none" ||
      style.visibility === "hidden" ||
      element.hidden ||
      element.getAttribute("aria-hidden") === "true"
    );
  }

  function animateOpen(element) {
    if (reducedMotion) return;

    // Cancel an unfinished animation if the menu opens again.
    animations.get(element)?.cancel();

    const animation = element.animate(
      [
        {
          clipPath: "inset(0 0 100% 0)",
          opacity: 0,
        },
        {
          clipPath: "inset(0 0 0 0)",
          opacity: 1,
        },
      ],
      {
        duration,
        easing,
        fill: "both",
      }
    );

    animations.set(element, animation);

    animation.onfinish = () => {
      if (animations.get(element) === animation) {
        animations.delete(element);
        animation.cancel();
      }
    };
  }

  let initialized = false;

  function scan() {
    root.querySelectorAll(selector).forEach((element) => {
      const hidden = isHidden(element);
      const previous = previousVisibility.get(element);

      // Animate when an existing menu becomes visible.
      // Also animate newly added menus after initialization.
      if (!hidden && (previous === true || (previous === undefined && initialized))) {
        animateOpen(element);
      }

      previousVisibility.set(element, hidden);
    });

    initialized = true;
  }

  // Record the initial state without animating everything on page load.
  scan();

  const observer = new MutationObserver(scan);

  observer.observe(root === document ? document.documentElement : root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [
      "class",
      "style",
      "hidden",
      "aria-hidden",
    ],
  });

  // Return cleanup function for React.
  return function cleanupMenuAnimations() {
    observer.disconnect();

    root.querySelectorAll(selector).forEach((element) => {
      animations.get(element)?.cancel();
      animations.delete(element);
    });
  };
}
