function Remove(productId){
    fetch(`/remove/${productId}`,{
        method:"POST",
    })
    .then(response=>response.json())
    .then(data=>{
        location.reload();
        
    })
    
}

function Buynow(userId){
    fetch(`/buynow/${userId}`,{
        method:"POST",
    })
    const trackUrl=`/buynow/${userId}`;
    window.location.href=trackUrl;
}