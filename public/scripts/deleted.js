const { response } = require("express");

function deleteItem(productId){
    fetch(`/delete/${productId}`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body:JSON.stringify({productId}),
    })
    .then(response=>response.json())
    .then(data=>{
        alert(data.message);
        location.reload();
    })
    .catch(error=>console.error("Erroe",error))
}