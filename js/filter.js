(function() {
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sections = document.querySelectorAll('.category-section');
  const cards = document.querySelectorAll('.game-card');

  let activeCategory = 'all';
  let searchQuery = '';

  function getCardSearchText(card) {
    const text = card.textContent || '';
    return text.toLowerCase().trim();
  }

  function applyFilters() {
    const query = searchQuery.toLowerCase().trim();

    sections.forEach(function(section) {
      const cat = section.getAttribute('data-category');
      const sectionCards = section.querySelectorAll('.game-card');
      let hasVisible = false;

      sectionCards.forEach(function(card) {
        const cardCat = card.getAttribute('data-category');
        const matchesCategory = activeCategory === 'all' || cardCat === activeCategory;
        const matchesSearch = !query || getCardSearchText(card).includes(query);

        if (matchesCategory && matchesSearch) {
          card.classList.remove('hidden');
          hasVisible = true;
        } else {
          card.classList.add('hidden');
        }
      });

      if (hasVisible) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchQuery = this.value;
      applyFilters();
    });
  }

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      activeCategory = this.getAttribute('data-filter');
      applyFilters();
    });
  });
})();
