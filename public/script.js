document.addEventListener("DOMContentLoaded", function () {
  const dropdownLinks = document.querySelectorAll(".dropdown-toggle");

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // Get the target dropdown id
      const targetId = this.getAttribute("data-bs-target");
      const targetDropdown = document.querySelector(targetId);

      // Check if any dropdown is already expanded
      dropdownLinks.forEach((otherLink) => {
        if (otherLink !== this) {
          const otherTargetId = otherLink.getAttribute("data-bs-target");
          const otherDropdown = document.querySelector(otherTargetId);

          if (otherDropdown && otherDropdown.classList.contains("show")) {
            // Collapse the other dropdown
            new bootstrap.Collapse(otherDropdown, {
              toggle: false,
            }).hide();
          }
        }
      });

      // Toggle the current dropdown
      const currentCollapse = new bootstrap.Collapse(targetDropdown, {
        toggle: true,
      });
    });
  });
});
