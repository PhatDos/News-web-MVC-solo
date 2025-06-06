$(".owl-carousel")
  .not(".all_newsslide")
  .owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
      0: { items: 1 },
      600: { items: 3 },
      1000: { items: 5 }
    }
  });

$(".all_newsslide").owlCarousel({
  loop: true,
  margin: 0,
  nav: true,
  items: 1
});

$(".dropdown").click(function () {
  var $menu = $(this).children(".mega-menu");

  // Toggle the visibility of mega menu on click
  if ($menu.is(":visible")) {
    $menu.stop(true, true).slideUp(200); // Ẩn mega menu
  } else {
    $(".mega-menu").stop(true, true).slideUp(200); // Ẩn tất cả các mega menu
    $menu.stop(true, true).slideDown(200); // Hiển thị mega menu
  }
});

// Đảm bảo các mega menu bị ẩn khi click bên ngoài menu
$(document).click(function (event) {
  if (!$(event.target).closest(".dropdown").length) {
    $(".mega-menu").slideUp(200); // Ẩn tất cả các mega menu khi click bên ngoài
  }
});

function showEditModal(title) {
  document.getElementById("editModal").style.display = "block";
}

function showRejectModal(title) {
  document.getElementById("rejectModal").style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// ckeditor-init.js
CKEDITOR.replace("content");

//multiple tag select
function updateSelectedTags() {
  var select = document.getElementById("tags");
  var selectedTags = Array.from(select.selectedOptions); // Get the selected <option> elements
  var selectedTagsList = document.getElementById("selected-tags-list");

  // Get current tags already displayed in the list
  var displayedTags = Array.from(
    selectedTagsList.getElementsByClassName("tag")
  ).map((item) => item.textContent.trim());

  // Loop through selected tags and display their names (not IDs) if not already displayed
  selectedTags.forEach((option) => {
    var tagName = option.textContent; // Get the visible tag name
    var tagId = option.value; // Get the tag ID (if needed for backend or deletion)

    if (!displayedTags.includes(tagName)) {
      var tagItem = document.createElement("div");
      tagItem.classList.add("tag");
      tagItem.textContent = tagName; // Use the tag name for display

      // Add a delete button next to each tag
      var deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.onclick = function () {
        removeTag(tagId, tagItem); // Pass the tag ID for deselecting in <select>
      };

      tagItem.appendChild(deleteButton);
      selectedTagsList.appendChild(tagItem);
    }
  });
}

function removeTag(tag, tagItem) {
  var select = document.getElementById("tags");

  // Deselect the tag in the <select> element
  Array.from(select.options).forEach((option) => {
    if (option.value === tag) {
      option.selected = false;
    }
  });

  // Remove the tag from the displayed list
  tagItem.remove();
}
