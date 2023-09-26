//--------------------------------------------------- html elements -------------------------------------------------------------------------
const displayBox = document.createElement("div");
displayBox.id = "display-box";
displayBox.style.backgroundColor = "#FBEE7D";
displayBox.style.width = "390px";
displayBox.style.height = "250px";
displayBox.style.position = "fixed";
displayBox.style.bottom = "10px";
displayBox.style.right = "10px";
displayBox.style.border = "2px solid #000";
displayBox.style.zIndex = "9999";
displayBox.style.borderRadius = "10px";
displayBox.style.overflow = "hidden";

const topBar = document.createElement("div");
topBar.style.backgroundColor = "#c8be64";
topBar.style.padding = "12px";
topBar.style.borderRadius = "10px 10px 0 0";
topBar.style.position = "relative";

const decodeText = document.createElement("span");
decodeText.textContent = "decode v1.0.0";
decodeText.style.color = "gray";
decodeText.style.fontSize = "9px"; // Adjust the font size as needed
decodeText.style.position = "absolute";
decodeText.style.left = "50%";
decodeText.style.top = "5px";
decodeText.style.transform = "translateX(-50%)";

const closeButton = document.createElement("button");
closeButton.innerHTML = "x";
closeButton.style.backgroundColor = "transparent";
closeButton.style.color = "black";
closeButton.style.border = "none";
closeButton.style.cursor = "pointer";
closeButton.style.float = "right";
closeButton.style.position = "absolute";
closeButton.style.top = "1px";
closeButton.style.right = "6px";
closeButton.addEventListener("click", function () {
  document.getElementById("display-box").remove();
});

topBar.appendChild(decodeText);
topBar.appendChild(closeButton);
displayBox.appendChild(topBar);

const innerText = document.createElement("p");
innerText.style.overflow = "auto";
innerText.style.height = "87%";
innerText.style.bottom = "0";
innerText.style.margin = "5px 5px 0px 5px";
innerText.style.color = "black";
innerText.style.fontSize = "15px";

//---------------------------------------------------------------------------------------------------------------------------------------------

let isExtensionActivated = false;

// update isExtensionActivated and remove the display box if deactivated 
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  isExtensionActivated = message.isExtensionActivated;
  if (!isExtensionActivated) {
    document.getElementById("display-box")?.remove();
  }
});

window.addEventListener("mouseup", onCodeSelected);

async function onCodeSelected(e) {
  const displayBoxInDOM = document.getElementById("display-box");
  const selectedCode = window.getSelection().toString().trim();

  // ignore user interactions inside the display box 
  if (displayBoxInDOM && displayBoxInDOM.contains(e.target)) {
    return;
  }

  if (isExtensionActivated && selectedCode.length > 0) {
    innerText.textContent = "Loading...";
    // add the display box to DOM if it is not there already
    if (!displayBoxInDOM) {
      displayBox.appendChild(innerText);
      document.body.appendChild(displayBox);
    }
    const codeExplanation = await decode(selectedCode);
    innerText.textContent = codeExplanation;
  }
}

async function decode(selectedCode) {
  try {
    const resp = await fetch(
      "https://decode-backend-1c4e70864ff0.herokuapp.com/api/decode",
      {
        method: "POST",
        body: JSON.stringify({ selectedCode }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    const json = await resp.json();
    return json.codeExplanation === "not code"
      ? "Please select a valid code snippet."
      : json.codeExplanation;
  } catch (e) {
    return e;
  }
}
