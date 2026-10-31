export function removeScratch() {
  const clean = () => {
    document.querySelectorAll('*').forEach((el) => {
      if (!el.isConnected) return;

      const classes = [...el.classList];

      const shouldRemove = classes.some((className) =>
        className.startsWith('project-input_input_') ||
        className.startsWith('studioview') ||
        className.startsWith('featured-projects_')
      );

      if (shouldRemove) {
        const hasExploreLink =
          el.matches('a[href="https://cattymod.app/explore"]') ||
          el.querySelector('a[href="https://cattymod.app/explore"]');

        if (!hasExploreLink) {
          el.remove();
        }
      }
    });

    document.querySelectorAll(
      'a[target="_blank"][rel="noopener noreferrer"][href="https://scratch.mit.edu/studios/51500179/"]'
    ).forEach((el) => el.remove());
  };

  // Clean existing elements
  clean();

  // Keep removing dynamically added or modified elements
  const observer = new MutationObserver(clean);

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'href', 'target', 'rel'],
  });

  // Return a function to stop removal
  return () => observer.disconnect();
}
