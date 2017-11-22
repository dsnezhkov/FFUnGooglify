// match pattern for the URLs to process
var patterns = ["*://*.google.com/*"]
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webRequest/ResourceType
var rtypes = [
	"beacon",
	"csp_report",
	"font",
	"image",
	"imageset",
	"main_frame",
	"media",
	"object",
	"object_subrequest",
	"ping",
	"script",
	"stylesheet",
	"sub_frame",
	"web_manifest",
	"websocket",
	"xbl",
	"xml_dtd",
	"xmlhttprequest",
	"xslt",
	"other"
];

browser.storage.local.set({
  activeGBlock: false
});

browser.browserAction.onClicked.addListener(unGooglify);

function blockURL(requestDetails) {
	 console.log("[Ungooglify]: canceling " + requestDetails.url);
	 return { cancel: true };
}

function unGooglify(){

		let unGflags = browser.storage.local.get("activeGBlock");
		unGflags.then(onGot, onError);
}

function onGot(flag) {
  console.log(flag);
  if ( flag.activeGBlock === true ) {
		browser.notifications.create({
		  "type": "basic",
		  "iconUrl": browser.extension.getURL("icons/ung-32.png"),
		  "title": "Ungooglify",
		  "message": "Disabling Google Traffic Block. You may now use Google sites. Yay!" 
		});
	   console.log("Disabling GBlock");
		browser.webRequest.onBeforeRequest.removeListener( blockURL );
		browser.storage.local.set({
		  activeGBlock: false
		});
  }else{

		browser.notifications.create({
		  "type": "basic",
		  "iconUrl": browser.extension.getURL("icons/ung-32.png"),
		  "title": "Ungooglify",
		  "message": "Enabling Google Traffic Block. No more google.com cruft! Click again to lift the ban."
		});

	   console.log("Enabling GBlock");
		browser.webRequest.onBeforeRequest.addListener( 
		  blockURL,
		  {
				urls: patterns,
				types: rtypes
		  }, 
		  ["blocking"]
		);
		browser.storage.local.set({
		  activeGBlock: true
		});
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}


