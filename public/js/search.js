document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('input[type="search"]');
    const searchBtn = document.querySelector('.btn-search');

    const performSearch = (e) => {
        if(e) e.preventDefault();
        const query = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".listing-card");

        cards.forEach(card => {
            const title = card.querySelector(".card-title").innerText.toLowerCase();
            // Show card parent (the col div) if it matches, else hide
            if (title.includes(query)) {
                card.closest('.col').style.display = "block";
            } else {
                card.closest('.col').style.display = "none";
            }
        });
    };

    // Real-time search as you type
    searchInput.addEventListener("input", performSearch);
    
    // Search on button click
    searchBtn.addEventListener("click", performSearch);
});