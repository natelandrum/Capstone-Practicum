// Wait for the DOM to fully load
window.addEventListener('DOMContentLoaded', () => {
    
    // Scroll to sections smoothly
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const targetId = event.currentTarget.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Highlight active navigation link while scrolling
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav ul li a');

    const setActiveLink = () => {
        let index = sections.length;

        while (--index && window.scrollY + 50 < sections[index].offsetTop) {}

        navItems.forEach(link => link.classList.remove('active'));
        if (navItems[index]) {
            navItems[index].classList.add('active');
        }
    };

    window.addEventListener('scroll', setActiveLink);

    // Back-to-top button functionality
    const backToTopButton = document.createElement('button');
    backToTopButton.textContent = '⬆️';
    backToTopButton.classList.add('back-to-top');
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });

    // Animate topic cards on scroll
    const topicCards = document.querySelectorAll('.topic');

    const animateCards = () => {
        topicCards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (cardPosition < windowHeight - 100) {
                card.classList.add('visible');
            } else {
                card.classList.remove('visible');
            }
        });
    };

    window.addEventListener('scroll', animateCards);

    // Trigger animations on load
    animateCards();

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul.mobile');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close nav menu when a link is clicked (for mobile)
    const mobileLinks = document.querySelectorAll('nav ul.mobile li a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});

// Get the topic name from the URL
const params = new URLSearchParams(window.location.search);
const topicName = params.get('topic');

if (topicName) {
    // Fetch the data from the JSON file
    fetch('topics.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data[topicName]) {
                const topicData = data[topicName];

                // Set the page title
                document.title = topicData.title;

                // Update the topic title
                const topicTitle = document.getElementById('topic-title');
                if (topicTitle) {
                    topicTitle.textContent = topicData.title;
                }

                // Populate the quote cards
                const quotesContainer = document.getElementById('quotes-container');
                if (quotesContainer) {
                    topicData.quotes.forEach(quote => {
                        const quoteCard = document.createElement('div');
                        quoteCard.classList.add('quote-card');
                        quoteCard.innerHTML = `
                            <p class="quote-text">"${quote.text}"</p>
                            <p class="quote-info">— ${quote.source}</p>
                        `;
                        quotesContainer.appendChild(quoteCard);
                    });
                }

                // Update the personal summary
                const summaryText = document.getElementById('summary-text');
                if (summaryText) {
                    summaryText.textContent = topicData.summary;
                }
            } else {
                const topicTitle = document.getElementById('topic-title');
                if (topicTitle) {
                    topicTitle.textContent = 'Topic Not Found';
                }
            }
        })
        .catch(error => {
            console.error('Error loading topic data:', error);
        });
} else {
    const topicTitle = document.getElementById('topic-title');
    if (topicTitle) {
        topicTitle.textContent = 'No Topic Selected';
    }
}
