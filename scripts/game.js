let startingTerms = [
	["adam", "bruce", "elyse", "james", "lawrence"],
	["benson", "elysе", "jаmes"],
	["blue", "red"],
	["boontybox", "origin", "steam", "uplay"],
	["cow chop", "funhaus", "kinda funny", "screwattack", "sugar pine 7"],
	["demo disk", "dude soup", "filmhaus", "open haus", "twits and crits"],
];
function renderExploreWidgetTo(container, ...terms) {
	const config = {
		comparisonItem: []
	};
	terms.forEach(term => {
		config.comparisonItem.push({
			keyword: term,
			time: "today 1-m"
		});
	});
	trends.embed.renderExploreWidgetTo(container, "TIMESERIES", config);
	container.lastElementChild.addEventListener("load", function (load) {
		window.setTimeout(function () {
			container.lastElementChild.scrollIntoView({
				behavior: "smooth"
			});
		}, 1000);
	});
}
function updateActionState() {
	const keyword = document.querySelector(".control-keyword").value;
	const answers = [...document.querySelectorAll(".team-answer")].map(element => element.value);
	const teamNames = [...document.querySelectorAll(".team-name")].map(element => element.value);
	const scores = [...document.querySelectorAll(".team-score")].map(element => element.value);
	const actions = [...document.querySelectorAll(".control [data-action]")].reduce((map, element) => (map[element.dataset.action] = element, map), {});
	actions.submit.disabled = !keyword || !answers.every(answer => answer && answer.toLowerCase().includes(keyword.toLowerCase()));
	actions.clear.disabled = !keyword && !answers.find(answer => answer);
}
function saveGameState() {
	window.localStorage.setItem("blue.name", document.querySelector(".team._blue .team-name").value);
	window.localStorage.setItem("blue.score", document.querySelector(".team._blue .team-score").value);
	window.localStorage.setItem("blue.answer", document.querySelector(".team._blue .team-answer").value);
	window.localStorage.setItem("red.name", document.querySelector(".team._red .team-name").value);
	window.localStorage.setItem("red.score", document.querySelector(".team._red .team-score").value);
	window.localStorage.setItem("red.answer", document.querySelector(".team._red .team-answer").value);
	window.localStorage.setItem("keyword", document.querySelector(".control-keyword").value);
}
function loadGameState() {
	document.querySelector(".team._blue .team-name").value = window.localStorage.getItem("blue.name");
	document.querySelector(".team._blue .team-score").value = window.localStorage.getItem("blue.score");
	document.querySelector(".team._blue .team-answer").value = window.localStorage.getItem("blue.answer");
	document.querySelector(".team._red .team-name").value = window.localStorage.getItem("red.name");
	document.querySelector(".team._red .team-score").value = window.localStorage.getItem("red.score");
	document.querySelector(".team._red .team-answer").value = window.localStorage.getItem("red.answer");
	document.querySelector(".control-keyword").value = window.localStorage.getItem("keyword");
}
function closeCustomModal() {
	document.getElementById("custom").remove();
	document.body.classList.remove("_modal");
}
document.addEventListener("DOMContentLoaded", function (DOMContentLoaded) {
	if (window.localStorage.getItem("keyword")) {
		loadGameState();
		updateActionState();
	}
	document.querySelector(".game-header ._help").addEventListener("click", function (click) {
		document.body.classList.add("_modal");
		const help = document.importNode(document.querySelector("#template-help").content, true);
		help.querySelector("[data-action=close]").addEventListener("click", function (click) {
			document.getElementById("help").remove();
			document.body.classList.remove("_modal");
		});
		document.body.appendChild(help);
	});
	document.querySelector(".game-header ._fullscreen").addEventListener("click", function (click) {
		if (document.body.requestFullscreen) document.body.requestFullscreen();
		else if (document.body.mozRequestFullScreen) document.body.mozRequestFullScreen();
		else if (document.body.msRequestFullscreen) document.body.msRequestFullscreen();
		else if (document.body.webkitRequestFullscreen) document.body.webkitRequestFullscreen();
	});
	document.querySelectorAll(".control input").forEach(element => element.addEventListener("change", saveGameState));
	document.querySelectorAll(".control input").forEach(element => element.addEventListener("input", updateActionState));
	document.querySelector(".control [data-action=submit]").addEventListener("click", function (click) {
		renderExploreWidgetTo(document.querySelector(".graph"), ...[...document.querySelectorAll(".team-answer")].map(element => element.value.toLowerCase()));
		updateActionState();
	});
	document.querySelector(".control [data-action=custom]").addEventListener("click", function (click) {
		document.body.classList.add("_modal");
		const custom = document.importNode(document.querySelector("#template-custom").content, true);
		[...custom.querySelectorAll(".custom-term")].forEach(element => element.addEventListener("input", function (input) {
			document.querySelector(".custom [data-action=submit]").disabled = [...document.querySelectorAll(".custom-term")].map(element => element.value).filter(answer => answer).length < 2;
		}));
		custom.querySelector("[data-action=submit]").addEventListener("click", function (click) {
			renderExploreWidgetTo(document.querySelector(".graph"), ...[...document.querySelectorAll(".custom-term")].filter(element => element.value).map(element => element.value.toLowerCase()));
			closeCustomModal();
		});
		custom.querySelector("[data-action=cancel]").addEventListener("click", closeCustomModal);
		document.body.appendChild(custom);
	});
	document.querySelector(".control [data-action=clear]").addEventListener("click", function (click) {
		document.querySelector(".control-keyword").value = "";
		document.querySelectorAll(".team-answer").forEach(element => element.value = "");
		updateActionState();
		saveGameState();
	});
	document.querySelector(".control [data-action=reset]").addEventListener("click", function (click) {
		document.querySelector(".control-keyword").value = "";
		document.querySelectorAll(".team-name").forEach(element => element.value = "");
		document.querySelectorAll(".team-score").forEach(element => element.value = "0");
		document.querySelectorAll(".team-answer").forEach(element => element.value = "");
		updateActionState();
		saveGameState();
		[...document.querySelector(".graph").children].forEach(el => el.remove());
		renderExploreWidgetTo(document.querySelector(".graph"), ...startingTerms[Math.floor(Math.random() * startingTerms.length)]);
	});
});
window.addEventListener("load", function (load) {
	renderExploreWidgetTo(document.querySelector(".graph"), ...startingTerms[Math.floor(Math.random() * startingTerms.length)]);
});
