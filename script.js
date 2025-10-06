// --- Simple SPA Router ---
const contentContainer = document.getElementById('content-container');
const navLinks = document.querySelectorAll('.nav-link');

// Define routes to map paths to HTML files
const routes = {
    '/': 'pages/home.html',
    '/projects': 'pages/projects.html',
    '/certifications': 'pages/certifications.html'
};

const loadContent = async (path) => {
    // Determine the correct file path, defaulting to home
    const route = routes[path] || routes['/']; 
    try {
        const response = await fetch(route);
        if (!response.ok) throw new Error(`Page not found at ${route}`);
        
        const html = await response.text();
        contentContainer.innerHTML = html;

        // After loading new content, re-initialize the scroll animations
        initializeScrollAnimation();
        // Update the active state of navigation links
        updateActiveLink(path);

    } catch (error) {
        console.error('Error loading page:', error);
        contentContainer.innerHTML = '<p class="card">Error: Could not load page content. Please try again.</p>';
    }
};

// Function to update which nav link looks "active"
const updateActiveLink = (path) => {
    navLinks.forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// Handle clicks on navigation links
document.addEventListener('click', (e) => {
    if (e.target.matches('.nav-link')) {
        e.preventDefault(); // Prevent full page reload
        const path = e.target.getAttribute('href');
        history.pushState(null, '', path); // Update URL without reloading
        loadContent(path);
    }
});

// Handle browser's back and forward buttons
window.addEventListener('popstate', () => {
    loadContent(window.location.pathname);
});

// --- Initial Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Load content based on the initial URL when the page first loads
    loadContent(window.location.pathname);
});


// --- Scroll Animation Logic ---
// This function needs to be called every time new content is loaded
const initializeScrollAnimation = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 }); // Start animation when 10% of the element is visible

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
};


// --- Dark Mode Toggle Logic ---
const themeToggle = document.getElementById('theme-toggle');
const toggleIcon = themeToggle.querySelector('i');
const currentTheme = localStorage.getItem('theme');

// Apply saved theme on page load
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleIcon.classList.remove('fa-moon');
    toggleIcon.classList.add('fa-sun');
}

// Handle theme toggle button click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    let theme = 'light';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
    } else {
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
    }
    // Save the user's preference in localStorage
    localStorage.setItem('theme', theme);
});