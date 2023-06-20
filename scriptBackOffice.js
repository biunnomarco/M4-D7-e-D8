                //todo SCRIPT DEL BACK OFFICE


//!ENDPOINT e API KEY
let edpoint = "https://striveschool-api.herokuapp.com/api/product/";
let apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdlNTJlOWI5YzBmNzAwMTQ0ODRlZjAiLCJpYXQiOjE2ODcyODE2OTYsImV4cCI6MTY4ODQ5MTI5Nn0.alu0t6KcY4ujMWacwQyz6488qSZmu8zN5JeLDO1xJpk";

//* costanti
const cardContainer = document.getElementById("cardContainer");
const searchBar = document.getElementById("searchBar");
const postButton = document.getElementById("postButton");
const carrello = document.getElementById("carrello");
const emptyCart = document.getElementById("emptyCart");
let cartArray = JSON.parse(localStorage.getItem("carrello"));
const table = document.getElementById("table");
let selectMenu = document.getElementById("selectMenu");

//!FUNZIONE START
async function start() {
    try {
        const res = await fetch(edpoint, {
        headers: {
            "Authorization": apiKey
        }
    })
    const json = await res.json();
    table.innerHTML = "";
    /* createTable(json); */
    createPagination(json);
    createTable(json.slice(0, 10));
    //event listener della funzione cerca, cattura i value e spedisce il payload
    searchBar.addEventListener("input", () => {
        let keyword = searchBar.value;
        let menuChoice = selectMenu.value;
        searchCard(json, keyword, menuChoice);
    })
    } catch (error) {
        console.log(error);
    }
    
}
start();


function createPagination(json) {
    pages.innerHTML = "";
    let nPages = Math.ceil(json.length / 10);
    for (let i = 1; i <= nPages; i++) {
        let newPage = document.createElement("li");
        newPage.classList.add("page-item");
        newPage.innerHTML = `<button class="page-link">${i}</button>`;
        newPage.addEventListener("click", () => {
            onPageChanged(i, json)
        })
        pages.append(newPage);
    }
    if (nPages <2) pagination.classList.add("d-none");
    else pagination.classList.remove("d-none");

    return nPages;
}

function onPageChanged(selPage, json) {
    let end = selPage*10;
    let start = end - 10;
    console.log(start, end)
    
    if (json.length>end) {
        createTable(json.slice(start, end), start)
        console.log("IF")
    }
    else {
        createTable(json.slice(start), start)
        console.log("Else")
    }
}

//!FUNZIONE CERCA
function searchCard(json, keyword, menuChoice) {
    let researchArr = [];
    json.forEach(card => {
        if (card[menuChoice].toLowerCase().includes(keyword.toLowerCase())) {
            researchArr.push(card);
        }
    });
    table.innerHTML = "";
    createPagination(researchArr);
    createTable(researchArr.slice(0, 10));
}

//!FUNZIONE CREATE TABLE
function createTable(json, numero) {
    table.innerHTML = "";
    let counter = 0;
    if (numero)  counter = numero;

    json.forEach(element => {
        counter++;
        
        let tr = document.createElement("tr");
        let tdName = document.createElement("td");
        let aName = document.createElement("a");
        let tdDescription = document.createElement("td");
        let tdBrand = document.createElement("td");
        let tdPrice = document.createElement("td");
        let tdImage = document.createElement("td");
        let tdCounter = document.createElement("td");
        let removeBtn = document.createElement("button")
        //class
        
        
        tdName.classList.add("ellipsis");
        removeBtn.classList.add("btn", "btn-danger", "removeBtn", "ms-2");
        //innerText
        
        aName.innerHTML = `${element.name} <span class="material-symbols-outlined" style="color: red">edit_note</span>` ;
        aName.href = `edit.html?id=${element._id}`;
        aName.target = "_blank";
        tdDescription.innerText = element.description;
        tdBrand.innerText = element.brand;
        tdPrice.innerText = element.price;
        tdImage.innerText = element.imageUrl;
        removeBtn.innerText = "X";
        //append
        table.append(tr);
        tdName.append(aName);
        tdCounter.append(counter)
        tr.append(tdCounter, tdName, tdDescription, tdBrand, tdPrice, tdImage, removeBtn)
        //event listener
        removeBtn.addEventListener("click", ()=> {
            deletePost(element);
        })
    });
}


//!FUNZIONE POST
//event listener della funzione newPost, che permette di aggiungere una carta 
postButton.addEventListener("click", () => {
    newPost();
});
async function newPost() {
    let cardName = document.getElementById("cardName");
    let cardDescription = document.getElementById("cardDescription");
    let cardBrand = document.getElementById("cardBrand");
    let cardImageUrl = document.getElementById("cardImageUrl");
    let cardPrice = document.getElementById("cardPrice");
    let cardNameValue = cardName.value;
    let cardDescriptionValue = cardDescription.value;
    let cardBrandValue = cardBrand.value;
    let cardImageUrlValue = cardImageUrl.value;
    let cardPriceValue = cardPrice.value;
    if (cardNameValue && cardDescriptionValue && cardBrandValue && cardImageUrlValue && cardPriceValue) {
        const payload = {
            "name": cardNameValue,
            "description": cardDescriptionValue,
            "brand": cardBrandValue,
            "imageUrl": cardImageUrlValue,
            "price": cardPriceValue,
        }

        const postRes = await fetch(edpoint, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "Authorization": apiKey
            }
        })
        cardName.value = "";
        cardDescription.value = "";
        cardBrand.value = "";
        cardImageUrl.value = "";
        cardPrice.value = "";

        const successAlert = document.getElementById("successAlert");
        successAlert.classList.toggle("d-none");
        setTimeout(() => {
            successAlert.classList.toggle("d-none");
        }, 5000)

    } else {
        const emptyField = document.getElementById("emptyField");
        emptyField.classList.toggle("d-none");
        setTimeout(() => {
            emptyField.classList.toggle("d-none");
        }, 5000)
    }
    start();
}

//!FUNZIONE DELETE
async function deletePost(card) {
    const delRes = await fetch(edpoint+card._id, {
        method: "DELETE",
        headers: {
            "Authorization": apiKey
        }
    })
    table.innerHTML = "";
    start();
}
