const removeUselessLayers = () => {
    let uselessLayers = document.querySelectorAll("._9AhH0"); // Class ._9AhH0 is an element on top of the image that messes with the right click context.
    for (const uselessLayer of uselessLayers) {
        uselessLayer.remove();
    }
};
const equivalentURLS = (urlA, urlB) => {
    const filenamePattern = /\/[^\/]*\.jpg/;
    const filenameA = urlA.match(filenamePattern)[0];
    const filenameB = urlB.match(filenamePattern)[0];
    return filenameA === filenameB;
};
window.onload = () => {
    removeUselessLayers();
    chrome.runtime.sendMessage({ type: "clear" });
};
window.onscroll = () => {
    removeUselessLayers();
};
window.onclick = () => {
    removeUselessLayers();
};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.getAltTextFromElementWithSrcURL !== undefined) {
        let images = document.querySelectorAll(".FFVAD"); // Class .FFVAD is attached to all post images
        for (image of images) {
            if (
                equivalentURLS(
                    image.getAttribute("src"),
                    request.getAltTextFromElementWithSrcURL
                )
            ) {
                console.log(image.alt);
                sendResponse(image.alt);
                return true;
            }
        }
    }
});
