//--------------------------------------------------- html elements -------------------------------------------------------------------------
var displayBox = document.createElement("div");
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

var topBar = document.createElement("div");
topBar.style.backgroundColor = "#c8be64";
topBar.style.padding = "12px";
topBar.style.borderRadius = "10px 10px 0 0";
topBar.style.position = "relative";

var decodeText = document.createElement("span");
decodeText.textContent = "decode v1.0.0";
decodeText.style.color = "gray";
decodeText.style.fontSize = "9px"; // Adjust the font size as needed
decodeText.style.position = "absolute";
decodeText.style.left = "50%";
decodeText.style.top = "5px";
decodeText.style.transform = "translateX(-50%)";

var closeButton = document.createElement("button");
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

var innerText = document.createElement("p");
innerText.style.overflow = "auto";
innerText.style.height = "87%";
innerText.style.bottom = "0";
innerText.style.margin = "5px 5px 0px 5px";
innerText.style.color = "black";
innerText.style.fontSize = "15px";

//---------------------------------------------------------------------------------------------------------------------------------------------

var isExtensionActivated = false;

// check if the extension is activated from Chrome storage during page initial load/refresh.
(function getExtensionActivatedFromBrowser() {
  chrome.storage.sync.get(["isExtensionActivated"], (res) => {
    let isExtensionActivatedFromBrowser = res.isExtensionActivated;
    isExtensionActivated = isExtensionActivatedFromBrowser
      ? isExtensionActivatedFromBrowser
      : false;
  });
})();

// update isExtensionActivated based on message from background script
// and if not activated, remove the display box that may exist
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  isExtensionActivated = message.isExtensionActivated;
  if (!isExtensionActivated) {
    document.getElementById("display-box")?.remove();
  }
});

window.addEventListener("mouseup", onCodeSelected);

async function onCodeSelected(e) {
  var clickedElement = e.target;
  var displayBoxInDOM = document.getElementById("display-box");
  var selectedCode = window.getSelection().toString().trim();

  // if the user clicks on the display box, let it stay in the DOM
  if (displayBoxInDOM && displayBoxInDOM.contains(clickedElement)) {
    return;
  }

  if (isExtensionActivated && selectedCode.length > 0) {
    innerText.textContent = "Loading...";
    if (!displayBoxInDOM) {
      displayBox.appendChild(innerText);
      document.body.appendChild(displayBox);
    }
    var codeExplanation = await decode(selectedCode);
    innerText.textContent = codeExplanation;
  }
}

async function decode(selectedCode) {
  try {
    var resp = await fetch(
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
    var json = await resp.json();
    return json.codeExplanation === "not code"
      ? "Please select a valid code snippet."
      : json.codeExplanation;
  } catch (e) {
    return e;
  }
}

