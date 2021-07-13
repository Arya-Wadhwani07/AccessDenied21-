chrome.storage.local.set({ quotes: undefined });

const renderQuote = (author, quote) => {
    console.log("rendering quote", author, quote);
    const quoteContainer = document.querySelector(".quote-container");
    const writeToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.log(`Unable to write ${text}`, error);
        }
    };

    const quoteElement = document.createElement("div");
    quoteElement.className = "quote";
    quoteElement.dataset.quoteContent = quote + "- " + author;

    const quoteTextElement = document.createElement("div");
    quoteTextElement.className = "quote-text";
    quoteTextElement.innerText = quote;
    quoteElement.appendChild(quoteTextElement);

    const seperator = document.createElement("div");
    seperator.className = "seperator";

    const copyButton = document.createElement("input");
    copyButton.type = "image";
    copyButton.src = "assets/copy.svg";
    copyButton.addEventListener("click", () => {
        const content =
            copyButton.parentElement.parentElement.dataset.quoteContent;
        writeToClipboard(content);
        const x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(() => {
            x.className = x.className.replace("show", "");
        }, 3000);
    });
    copyButton.className = "copy-button";
    seperator.appendChild(copyButton);

    const authorElement = document.createElement("span");
    authorElement.className = "quote-author";
    authorElement.innerText = "- " + author;
    seperator.appendChild(authorElement);

    quoteElement.appendChild(seperator);
    quoteContainer.appendChild(quoteElement);
};
const renderQuotes = (quotes) => {
    console.log("rendering quotes => ", quotes);
    const loadingElement = document.querySelector(".loading");
    loadingElement.classList.remove("remove");
    const quoteContainer = document.querySelector(".quote-container");
    quoteContainer.classList.add("remove");
    quoteContainer.innerHTML = "";
    if (quotes !== undefined) {
        const loadingElement = document.querySelector(".loading");
        loadingElement.classList.add("remove");
        const quoteContainer = document.querySelector(".quote-container");
        quoteContainer.classList.remove("remove");
        for (let author in quotes) {
            const quote = quotes[author];
            renderQuote(author, quote);
        }
    }
};
// const checkData = () => {
//     chrome.storage.local.get(["quotes"], (result) => {
//         console.log("Value is currently: " + result.quotes, result);
//         renderQuotes(result.quotes);
//     });
// };
// console.log(chrome);
// checkData();
console.log("adding listener");
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log("in storage.onChanged");
    // let foundQuotes = false;
    // for (let key in changes) {
    //     if (key === "quotes") {
    //         foundQuotes = true;
    //         let storageChange = changes[key];
    //         console.log(storageChange.newValue);
    //         renderQuotes(storageChange.newValue);
    //     }
    // }
    // if (!foundQuotes) {
    //     renderQuotes();
    // }
    console.log("new quotes => ", changes["quotes"]);
    renderQuotes(changes["quotes"]?.newValue);
});
// for (let i = 0; i < 5; i++) {
//     renderQuote(
//         "- Lorem, ipsum dolor.",
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia esse corporis ullam, quam cupiditate suscipit!"
//     );
// }
// chrome.runtime.onMessage.addEventListener((request, sender, sendResponse) => {
//     console.log(request);
//     if (request.message === "loading") {
//         console.log("loading");
//         const loadingElement = document.querySelector(".loading");
//         const quoteContainer = document.querySelector(".quote-container");
//         loadingElement.classList.add("remove");
//         quoteContainer.classList.remove("remove");
//     } else if (request.message === "completed") {
//         console.log("completed");
//         const loadingElement = document.querySelector(".loading");
//         const quoteContainer = document.querySelector(".quote-container");
//         loadingElement.classList.remove("remove");
//         quoteContainer.classList.add("remove");
//     }
//     if (request.data !== undefined) {
//         console.log(request.data);
//         for (author of data) {
//             const quote = request.data[author];
//             renderQuote(author, quote);
//         }
//     }
// });
