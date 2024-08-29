document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");
  const container = document.querySelector(".container");
  const icon = toggleBtn.querySelector("i");

  toggleBtn.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    this.classList.toggle("active");

    if (sidebar.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-xmark");
      if (container) {
        container.classList.add("shrink");
      }
    } else {
      icon.classList.remove("fa-xmark");
      icon.classList.add("fa-bars");
      if (container) {
        container.classList.remove("shrink");
      }
      resetSidebar();
    }
  });

  function resetSidebar() {
    document.querySelectorAll(".dropdown-menu").forEach(function (menu) {
      menu.classList.remove("show");
    });

    document.querySelectorAll(".dropdown-toggle").forEach(function (toggle) {
      toggle.classList.remove("active");
      const caretIcon = toggle.querySelector(".fa-caret-right, .fa-caret-down");
      caretIcon.classList.remove("fa-caret-down");
      caretIcon.classList.add("fa-caret-right");
    });
  }

  // sidebar.classList.remove('expanded');       // Enable when corresponding CSS style is enabled

  // Dropdown toggle
  document.querySelectorAll(".dropdown-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      const dropdownMenu = this.nextElementSibling;
      const caretIcon = this.querySelector(".fa-caret-right, .fa-caret-down");

      dropdownMenu.classList.toggle("show");
      this.classList.toggle("active");

      if (dropdownMenu.classList.contains("show")) {
        caretIcon.classList.remove("fa-caret-right");
        caretIcon.classList.add("fa-caret-down");
        sidebar.classList.add("expanded");
      } else {
        caretIcon.classList.remove("fa-caret-down");
        caretIcon.classList.add("fa-caret-right");
        sidebar.classList.remove("expanded");
      }
    });
  });
});
