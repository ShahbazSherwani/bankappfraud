const customerID = document.getElementById("customer-id").value;
const tokenID = document.getElementById("token-id").value;
const validationStatus = document.getElementById("validation-status");

let counter = 0;
let validationInterval = setInterval(fetchTokenStatus, 3000);

async function fetchTokenStatus() {
  let is_validated;
  try {
    const response = await fetch(
      `http://localhost:3000/customer/${customerID}/validationresponse/${tokenID}`
    );

    const data = await response.json();
    console.log(data);
    is_validated = data["is_validated"];

    validationStatus.innerHTML =
      is_validated === 0
        ? "Token NOT validated, bear with us..."
        : "Token VALIDATED by agent, you can continue the call...";
  } catch (error) {
    console.log("ERROR", error);
  }
  counter++;
  if (counter > 50 || is_validated === 1) {
    clearInterval(validationInterval);
    console.log("interval func deleted");
  }
}
