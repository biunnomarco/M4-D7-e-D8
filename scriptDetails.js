const detailsEndpoint = "https://striveschool-api.herokuapp.com/api/product/";;
let apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdlNTJlOWI5YzBmNzAwMTQ0ODRlZjAiLCJpYXQiOjE2ODcyODE2OTYsImV4cCI6MTY4ODQ5MTI5Nn0.alu0t6KcY4ujMWacwQyz6488qSZmu8zN5JeLDO1xJpk";

if (window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("id");
    //*CHIAMATA AJAX verso detailsEndpoint + query
    async function start() {
        try {
            const res = await fetch(detailsEndpoint + query, {
            headers: {
                "Authorization": apiKey
            }
        })
        const json = await res.json();
        showDetails(json);
        } catch (error) {
           console.log(error) 
        }
        
    }
    start();
}

function showDetails(json) {
    let cardImg = document.getElementById("cardImg");
    let cardName =  document.getElementById("cardName");
    let cardType = document.getElementById("cardType");
    let cardPrice = document.getElementById("cardPrice");
    //innerText
    cardImg.src = json.imageUrl;
    cardName.innerText = json.name;
    cardType.innerText = json.description;
    cardPrice.innerText = `${json.price} €`;
}