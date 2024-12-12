

function CancelOrder(productId){
    fetch(`/cancel/${productId}`,{
        method:'POST',
    })
   
    const trackUrl=`/cancel/${productId}`;
    
    window.location.href=trackUrl;
    

}
function Track(productId){
    fetch(`/track/${productId}`,{
        method:"GET",
    })
    const trackUrl=`/track/${productId}`;
    window.location.href=trackUrl;
}