if (window.location.pathname === '/homepage') {
    // Clear the session history
    window.history.replaceState(null, document.title, window.location.href);
}

// Listen for the beforeunload event to clear session history when leaving the page
window.addEventListener('beforeunload', function () {
    sessionStorage.clear();
});
        var slideIndex = 0;
        showSlides();

        function showSlides() {
            var i;
            var slides = document.getElementsByClassName("slider-div")[0].getElementsByTagName("img");

            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }

            slideIndex++;

            if (slideIndex > slides.length) {
                slideIndex = 1;
            }

            slides[slideIndex - 1].style.display = "block";
            setTimeout(showSlides, 3000);
        }


        
       
    