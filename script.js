//!ENDPOINT e API KEY
let edpoint = "https://striveschool-api.herokuapp.com/api/product/";
let apiKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDdlNTJlOWI5YzBmNzAwMTQ0ODRlZjAiLCJpYXQiOjE2ODcyODE2OTYsImV4cCI6MTY4ODQ5MTI5Nn0.alu0t6KcY4ujMWacwQyz6488qSZmu8zN5JeLDO1xJpk";

//* costanti
const cardContainer = document.getElementById("cardContainer");
const searchBar = document.getElementById("searchBar");
const postButton = document.getElementById("postButton");
const carrello = document.getElementById("carrello");
const emptyCart = document.getElementById("emptyCart");
let cartArray = (JSON.parse(localStorage.getItem("carrello"))) ? JSON.parse(localStorage.getItem("carrello")) :  [];
const pages = document.getElementById("pages");
const pagination = document.getElementById("pagination");
let selectMenu = document.getElementById("selectMenu");

//! Funzione start, esegue chiamata, crea le carte partendo dal json ed il carrello dal local storage
async function start() {
    try {
        const res = await fetch(edpoint, {
            headers: {
                "Authorization": apiKey
            }
        })
        const json = await res.json();

        let storageCart = localStorage.getItem("carrello");
        pushCart(JSON.parse(storageCart));
        createPagination(json);
        createCards(json.slice(0, 10));
        //event listener della funzione cerca, cattura i value e spedisce il payload
        searchBar.addEventListener("input", () => {
            let keyword = searchBar.value;
            let menuChoice = selectMenu.value;
            searchCard(json, keyword, menuChoice);
        })
        //event listener che svuota il carrello
        emptyCart.addEventListener("click", () => {
            cartArray = [];
            localStorage.setItem("carrello", JSON.stringify(cartArray));
            pushCart(cartArray);
            let allCards = document.getElementsByClassName("carta");
            for (let i = 0; i < allCards.length; i++) {
                allCards[i].children[2].classList.remove("greenButton");
                allCards[i].children[2].classList.add("redButton")
            }
        })
    }
    catch (error) {
        console.log(error)
    }
}

start();

//!FUNZIONE CERCA
function searchCard(json, keyword, menuChoice) {
    let researchArr = [];
    let alert = document.getElementById("noResult");
    json.forEach(card => {
        if (card[menuChoice].toLowerCase().includes(keyword.toLowerCase())) {
            researchArr.push(card);
        }
    });
    if (researchArr.length === 0) alert.classList.remove("d-none");
    else alert.classList.add("d-none");
    createPagination(researchArr);
    createCards(researchArr.slice(0, 10));
    
}
//!event listener dei numeri delle pagine
function onPageChanged(selPage, json) {
    let end = selPage*10;
    let start = end - 10;
    console.log(start, end)
    
    if (json.length>end) {
        createCards(json.slice(start, end))
        console.log("IF")
    }
    else {
        createCards(json.slice(start))
        console.log("Else")
    }
}

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

//!FUNZIONE CREATE CARDS - generica crea una carta per ogni elemento dell'array
function createCards(cardsArray) {

    cardContainer.innerHTML = "";
    cardsArray.forEach(card => {
        // crea la card con un overlay e 3 bottoni
        let carta = document.createElement("div");
        let imgCard = document.createElement("img");
        let overlay = document.createElement("div");
        let cartButton = document.createElement("button");
        let detailsButton = document.createElement("a");
        let priceSpan = document.createElement("span");
        //class e id
        imgCard.classList.add("cardImg");
        carta.classList.add("carta");
        cartButton.classList.add("cartButton", "btn", "btn-danger", "redButton", "text-light");
        detailsButton.classList.add("detailsButton", "btn", "btn-danger", "redButton");
        overlay.classList.add("overlay");
        priceSpan.classList.add("priceSpan", "redButton", "btn-danger", "text-light");
        //.innerText e HTML
        for (let i = 0; i < cartArray.length; i++) {
            if (card._id === cartArray[i].id) {
                cartButton.classList.add("greenButton");
            }
        }
        cartButton.innerHTML = `<span class="material-symbols-outlined pt-1">shopping_cart</span>`;
        detailsButton.innerHTML = `<span class="material-symbols-outlined pt-1">zoom_in</span>`;
        detailsButton.href = `details.html?id=${card._id}`;
        detailsButton.target = "_blank"
        imgCard.src = card.imageUrl;
        priceSpan.innerText = card.price + " €";
        carta.id = card._id
        //append
        cardContainer.append(carta);
        carta.append(imgCard, overlay, cartButton, detailsButton, priceSpan)
        //add event listener per aggiungere al carrello
        cartButton.addEventListener("click", () => {
            addToCart(card);
            cartButton.classList.add("greenButton");
            cartButton.classList.remove("btn-danger");
        });
    });
}


//! FUNZIONE ADD TO CART


function addToCart(card) {
    console.log(cartArray);
    cartArray.push(card);

    pushCart(cartArray);

    return cartArray;
}

function pushCart(/* cartArray */) {
    localStorage.setItem("carrello", JSON.stringify(cartArray));

    carrello.innerHTML = "";
    let badge = document.getElementById("badge");
    let totalPrice = document.getElementById("totalPrice");
    let total = 0;
    let counter = cartArray.length;
    if (counter === 0) {
        badge.innerText = counter;
        totalPrice.innerHTML = ``;
    }
    cartArray.forEach(element => {
        total += element.price;
        //elementi del dom
        let cartItem = document.createElement("div");
        let cartItemImg = document.createElement("img");
        let cartItemDetails = document.createElement("div");
        let cartItemName = document.createElement("p");
        let cartItemPrice = document.createElement("p");
        let cartItemRemove = document.createElement("button");
        let cartItemId = document.createElement("p");
        //classi
        cartItem.classList.add("d-flex");
        cartItemImg.classList.add("cartItemImg");
        cartItem.classList.add("cartItem");
        cartItemDetails.classList.add("cartItemDetails");
        cartItemRemove.classList.add("btn", "btn-danger", "removeButton", "p-0")
        //inner.html
        cartItemImg.src = element.imageUrl;
        cartItemName.innerText = element.name;
        cartItemPrice.innerText = element.price + " €";
        badge.innerText = counter;
        cartItemRemove.innerText = "Remove"
        element.id = element._id;
        //append
        cartItemDetails.append(cartItemName, cartItemPrice, cartItemRemove);
        cartItem.append(cartItemImg, cartItemDetails);
        carrello.append(cartItem);
        totalPrice.innerHTML = `Total: ${total} € -  ${counter} item/s`
        //*EVENT LISTENER per rimuovere singolo elemento
        cartItemRemove.addEventListener("click", () => {
            removeElement(/* cartArray, */ element);
        })
    });

    //* visibilità del badge del carrello
    if (counter > 0) badge.classList.remove("d-none");
    if (counter === 0) badge.classList.add("d-none");
}


//! FUNZIONE REMOVE ELEMENT rimuove un elemento specifico del carrello dopo aver cliccato sul bottone
function removeElement(/* cartArray,  */element) {
    /* console.log(cartArray); */
    for (let i = 0; i < cartArray.length; i++) {
        if (cartArray[i]._id === element._id) {
            let sameCards = cartArray.filter((item) => item._id === element._id);
            cartArray.splice(i, 1);
            localStorage.setItem("carrello", JSON.stringify(cartArray));
            let allCards = document.getElementsByClassName("carta");
            /* console.log(allCards); */
            if (sameCards.length === 1) {
                for (let i = 0; i < allCards.length; i++) {
                    if (element._id === allCards[i].id) {
                        allCards[i].children[2].classList.remove("greenButton");
                        allCards[i].children[2].classList.add("btn-danger");
                    }
                }
            }
            break;
        }
    }
    pushCart();
    return cartArray;
}


//! FORM DI AUTENTICAZIONE
let logInInput = document.getElementById("logInInput");
let logInButton = document.getElementById("logInButton");

logInButton.addEventListener("click", () => {
    if (logInInput.value === "backoffice") {
        let backOfficeButton = document.getElementById("backOfficeButton");
        backOfficeButton.classList.remove("d-none");
    } else {
        let wrongPassword = document.getElementById("wrongPassword");
        wrongPassword.classList.remove("d-none");
        setTimeout(() => {
            wrongPassword.classList.add("d-none");
        }, 5000)
    }
})