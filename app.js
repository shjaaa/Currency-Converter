const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const exchangeIcon = document.querySelector(".exchange");

// Populate dropdowns
for (let select of dropdowns) {

    for (let currCode in countryList) {

        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected";
        }

        else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();
    });

}


// Update flags
const updateFlag = (element) => {

    let currCode = element.value;
    let countryCode = countryList[currCode];

    let img = element.parentElement.querySelector("img");

    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};


// Fetch exchange rate
const updateExchangeRate = async () => {

    let amount = document.querySelector(".amount input");

    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {

        amtVal = 1;
        amount.value = 1;
    }

    msg.innerText = "Fetching exchange rate...";

    try {

        const URL =
            `https://open.er-api.com/v6/latest/${fromCurr.value}`;

        let response = await fetch(URL);

        let data = await response.json();

        let rate = data.rates[toCurr.value];

        let finalAmount = amtVal * rate;

        msg.innerText =
            `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

    }

    catch (error) {

        msg.innerText = "Failed to fetch exchange rate.";

        console.log(error);
    }
};


// Swap currencies
exchangeIcon.addEventListener("click", () => {

    let temp = fromCurr.value;

    fromCurr.value = toCurr.value;

    toCurr.value = temp;

    updateFlag(fromCurr);

    updateFlag(toCurr);

    updateExchangeRate();

});


// Auto convert while typing
document.querySelector(".amount input")
.addEventListener("input", updateExchangeRate);


// Button click
btn.addEventListener("click", (evt) => {

    evt.preventDefault();

    updateExchangeRate();

});


// On load
window.addEventListener("load", () => {

    updateExchangeRate();

});