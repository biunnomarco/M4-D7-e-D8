const detailsEndpoint = "https://striveschool-api.herokuapp.com/api/product/";
let apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdlNTJlOWI5YzBmNzAwMTQ0ODRlZjAiLCJpYXQiOjE2ODcyODE2OTYsImV4cCI6MTY4ODQ5MTI5Nn0.alu0t6KcY4ujMWacwQyz6488qSZmu8zN5JeLDO1xJpk";


//elementi del dom
let detailsImg = document.getElementById("detailsImg");
let detailsName = document.getElementById("detailsName");
let detailsDescription = document.getElementById("detailsDescription");
let detailsBrand = document.getElementById("detailsBrand");
let detailsImgUrl = document.getElementById("detailsImgUrl");
let detailsPrice = document.getElementById("detailsPrice");
let saveButton = document.getElementById("saveButton");
let deleteButton = document.getElementById("deleteButton");
let deleteAlert = document.getElementById("deleteAlert");
let editPage = document.getElementById("editPage");
let editedAlert = document.getElementById("editedAlert");
let dataOra = document.getElementById("dataOra");

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


function showDetails(card) {
    //assegna i valori gli input
    console.log(card.updatedAt)
    detailsName.value = card.name;
    detailsImg.src = card.imageUrl;
    detailsDescription.value = card.description;
    detailsBrand.value = card.brand;
    detailsImgUrl.value = card.imageUrl;
    detailsPrice.value = card.price;
    dataOra.innerHTML = "Ultima Modifica: " + new Date(card.updatedAt);
}

//!FUNZIONE EDIT POST - method PUT
saveButton.addEventListener("click", () => {
    editPost();
})
async function editPost() {
    if (detailsPrice.value && detailsImgUrl.value && detailsBrand.value && detailsDescription.value && detailsBrand.value && detailsName.value) {
        const newPayload = {
            "name": detailsName.value,
            "description": detailsDescription.value,
            "brand": detailsBrand.value,
            "imageUrl": detailsImgUrl.value,
            "price": detailsPrice.value,
            "time": new Date()
        };
        try {
            const editRes = await fetch(detailsEndpoint + query, {
                method: "PUT",
                body: JSON.stringify(newPayload),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": apiKey
                }
            })
            start();
            editedAlert.classList.remove("d-none")
            setTimeout(()=>{
                editedAlert.classList.add("d-none")
            }, 5000)
        } catch (error) {
            console.log(error);
        }

    }
}


//!FUNZIONE DELETE CARD - method DELETE
deleteButton.addEventListener("click", deletePost)
async function deletePost() {
    const delRes = await fetch(detailsEndpoint + query, {
        method: "DELETE",
        headers: {
            "Authorization": apiKey
        }
    })
    
    editPage.classList.add("d-none")
    deleteAlert.classList.remove("d-none");
}