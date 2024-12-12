document.addEventListener('DOMContentLoaded', function() {
  const mainImage = document.querySelector('.main-image');
  const thumbnails = document.querySelectorAll('.thumbnail-image');
  
  thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
          mainImage.src = thumbnail.src;
      });
  });
});