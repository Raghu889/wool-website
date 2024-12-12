// JavaScript function to handle hovering over product images
function showOverlay() {
    var disImage = this.querySelector(".disImage");
    disImage.style.display = "block";
    document.body.classList.add("blur"); // Add blur effect to the body
}

// JavaScript function to hide the overlay
function hideOverlay() {
    var disImage = this.querySelector(".disImage");
    disImage.style.display = "none";
    document.body.classList.remove("blur"); // Remove blur effect from the body
}

// Add event listeners to product image containers
var orderContainers = document.querySelectorAll(".product-image");
orderContainers.forEach(function(container) {
    container.addEventListener("mouseover", showOverlay);
    container.addEventListener("mouseout", hideOverlay);
});


function addToCart(productId){
    

    fetch(`/cart/${productId}`,{
        method:'POST',
        
    })
    .then(response=>response.json())
    .then(data=>{
        alert(data.message);
        location.reload();
    })
}






