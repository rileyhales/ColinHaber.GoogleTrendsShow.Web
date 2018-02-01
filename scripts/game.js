let startingTerms = [
	["adam", "bruce", "elyse", "james", "lawrence"],
	["blue", "red"],
	["cow chop", "funhaus", "kinda funny", "screwattack", "sugar pine 7"],
	["demo disk", "dude soup", "filmhaus", "open haus", "twits and crits"],
	["google", "trends", "show"],
];
function renderExploreWidgetTo(container, ...terms) {
	container.childNodes.forEach(child => child.remove());
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
}
function updateActionState() {
	const keyword = document.querySelector(".control-keyword").value;
	const answers = [...document.querySelectorAll(".team-answer")].map(element => element.value);
	const teamNames = [...document.querySelectorAll(".team-name")].map(element => element.value);
	const scores = [...document.querySelectorAll(".team-score")].map(element => element.value);
	const actions = [...document.querySelectorAll(".control [data-action]")].reduce((map, element) => (map[element.dataset.action] = element, map), {});
	actions.submit.disabled = !keyword || !answers.every(answer => answer && answer.toLowerCase().includes(keyword.toLowerCase()));
	actions.clear.disabled = !keyword && !answers.find(answer => answer);
	actions.reset.disabled = !keyword && !answers.find(answer => answer) && !teamNames.find(name => name) && !scores.find(score => score != 0);
}
function closeCustomModal() {
	document.getElementById("custom").remove();
	document.body.classList.remove("_modal");
}
document.addEventListener("DOMContentLoaded", function (DOMContentLoaded) {
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
	});
	document.querySelector(".control [data-action=reset]").addEventListener("click", function (click) {
		document.querySelector(".control-keyword").value = "";
		document.querySelectorAll(".team-name").forEach(element => element.value = "");
		document.querySelectorAll(".team-score").forEach(element => element.value = "0");
		document.querySelectorAll(".team-answer").forEach(element => element.value = "");
		updateActionState();
	});
});
window.addEventListener("load", function (load) {
	renderExploreWidgetTo(document.querySelector(".graph"), ...startingTerms[Math.floor(Math.random() * startingTerms.length)]);
});
