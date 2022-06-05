var playerDeleted = false;
var shiftContent = false;
var videoInterval = null;
var oldHref = document.location.href;

// Deletes the video player nodes from the DOM
function deleteNodes() {
	var player = document.getElementsByClassName("persistent-player");
	var rootPlayer = document.getElementsByClassName("channel-root__player");
	
	player[0].parentElement.removeChild(player[0]);
	rootPlayer[0].parentElement.removeChild(rootPlayer[0]);
	playerDeleted = true;
}

// Waits until the video player is loaded to add an onTimeUpdate to delete the DOM node
// This delay is necessary because if the video player is not fully loaded when we
// remove the DOM Node the video will continue loading in the background for some reason
function checkVideo() {
	var player = document.getElementsByTagName("video")[0];
	if (player) {
		player.ontimeupdate = deleteNodes;
		clearInterval(videoInterval);
	}
}

// Handles tweaking the css for the page and adding/removing the interval to delete the video player DOM Node based on the url for the page
function removeVideoPlayer() {
	var match = document.location.href.match(new RegExp("twitch.tv/.*/(videos|about|schedule)"));
	
	var rootContent = document.getElementsByClassName("channel-root__info")[0];
	var content = document.getElementsByClassName("channel-info-content")[0];

	if (match == null) {
		if (playerDeleted) {
			//trigger page reload to restore video player
			location.reload();
		}
		else {
			shiftContent = false;
			rootContent.classList.remove("hideRootContent");
			content.classList.remove("hideContent");
			
			clearInterval(videoInterval);
			var player = document.getElementsByTagName("video")[0];
			if (player) {
				player.ontimeupdate = null;
			}
		}
	}
	else {
		shiftContent = true;
		rootContent.classList.add("hideRootContent");
		content.classList.add("hideContent");

		clearInterval(videoInterval);
		if (!playerDeleted) {
			videoInterval = setInterval(checkVideo, 1000);
		}
	}
}

// Checks for changes to the url
var urlObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (oldHref != document.location.href) {
			oldHref = document.location.href;
			removeVideoPlayer();
		}
		
		var rootContent = document.getElementsByClassName("channel-root__info")[0];
		var content = document.getElementsByClassName("channel-info-content")[0];
		if (shiftContent) {
			rootContent.classList.add("hideRootContent");
			content.classList.add("hideContent");
		}
		else {
			rootContent.classList.remove("hideRootContent");
			content.classList.remove("hideContent");
		}

	});
});

// Initial page load check and sets up observer for url changes
removeVideoPlayer();
urlObserver.observe(document, { childList: true, subtree: true });
