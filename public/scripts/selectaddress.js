function selectaddress(addressId){
    fetch(`/payment/${addressId}`,{
        method:'POST',
    })
    const trackUrl=`/payment/${addressId}`;
    window.location.href=trackUrl;
}