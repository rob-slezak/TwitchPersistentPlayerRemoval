var playerDeleted = false;
var shiftContent = false;
var deletePlayer = false;
var oldHref = '';
var videoInterval = null;

function automaticVodBtns() {
	clearInterval(videoInterval);
	var player = document.getElementsByTagName("video")[0];
	if (player) {
		player.ontimeupdate = null;
	}

	// Automatically collapses chat
	var collapseBtn = document.querySelectorAll('[aria-label="Collapse Chat"]');
	if (collapseBtn.length > 0) {
		collapseBtn[0].click();
	}

	// Automatically enters theatre mode
	var theatreBtn = document.querySelectorAll('[aria-label="Theatre Mode (alt+t)"]');
	if (theatreBtn.length > 0) {
		theatreBtn[0].click();
	}
}

function checkVideoPlayer() {
	var player = document.getElementsByTagName("video")[0];
	if (player) {
		player.ontimeupdate = automaticVodBtns;
	}
}

// Deletes the video player nodes from the DOM
function deleteNodes() {
	var player = document.getElementsByClassName("persistent-player");
	var rootPlayer = document.getElementsByClassName("channel-root__player");
	
	player[0].parentElement.removeChild(player[0]);
	rootPlayer[0].parentElement.removeChild(rootPlayer[0]);
	playerDeleted = true;
}

function checkUrl() {
	var match = document.location.href.match(new RegExp("twitch.tv/.*/(videos|about|schedule)"));
	
	if (match == null) {
		if (playerDeleted) {
			//trigger page reload to restore video player
			location.reload();
		}
		else {
			shiftContent = false;
			deletePlayer = false;
		}
	}
	else {
		shiftContent = true;
		deletePlayer = true;
	}

	var vodUrl = document.location.href.match(new RegExp("twitch.tv/videos/.*"));
	if (vodUrl != null) {
		videoInterval = setInterval(checkVideoPlayer, 1000);
	}
}

function applyContentShift() {
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
}

function removeVideoPlayer() {
	var players = document.getElementsByTagName("video");
	
	if (players.length > 0) {
		for (let player of players) {
			if (deletePlayer) {
				player.ontimeupdate = deleteNodes;
			}
			else {
				player.ontimeupdate = null;
			}
		}	
	}
}

// Checks for changes to the page
var urlObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (oldHref != document.location.href) {
			oldHref = document.location.href;
			checkUrl();
		}

		applyContentShift();

		removeVideoPlayer();
	});
});

// Initial page load sets up observer for url changes
urlObserver.observe(document, { childList: true, subtree: true });
