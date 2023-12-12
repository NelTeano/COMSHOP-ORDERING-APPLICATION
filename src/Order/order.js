function showContent(contentId) {
    // Get all content divs
    var allContentDivs = document.querySelectorAll('.content > div');
  
    // Hide all content divs
    allContentDivs.forEach(function (div) {
      div.style.display = 'none';
    });
  
    // Show the selected content
    var selectedContent = document.getElementById(contentId);
    if (selectedContent) {
      selectedContent.style.display = 'block';
    }
  }
  