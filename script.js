async function returnDataPromise() {
    return fetch("https://raw.githubusercontent.com/luisfelipesdn12/where-am-i-in-the-office/master/the_office_us_data.json")
        .then(response => response.json());
}

async function returnWatchPercentagePromise() {
    return await returnDataPromise()
        .then(data => {
            const maxValue = data.episodes.length;
            const actualValue = data.episodes.filter(episode => episode.watched == true).length;

            return (actualValue / maxValue) * 100;
        });
}

function addSeasonToList(seasonNumber, isComplete) {
    const newSeasonCard = document.createElement("div");
    newSeasonCard.className = "card";

    const headingOfCard = document.createElement("div");
    headingOfCard.className = "card-header";
    newSeasonCard.appendChild(headingOfCard);

    const h5OfButton = document.createElement("h5");
    h5OfButton.className = "mb-0";
    headingOfCard.appendChild(h5OfButton);

    const button = document.createElement("button");
    button.innerHTML = "Season " + seasonNumber;
    button.className = "text-info btn btn-link";
    button.setAttribute("onClick", "toggleCollapse('collapse-" + seasonNumber + "');");
    h5OfButton.appendChild(button);

    const collapsePart = document.createElement("div");
    collapsePart.className = "collapse";
    collapsePart.id = "collapse-" + seasonNumber;
    newSeasonCard.appendChild(collapsePart);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    collapsePart.appendChild(cardBody);

    unorderedList = document.createElement("ul");
    unorderedList.className = "list-group";
    unorderedList.id = "list-of-episodes-" + seasonNumber;
    cardBody.appendChild(unorderedList);

    if (isComplete) {
        const doneBadgeElement = document.createElement("span");
        doneBadgeElement.innerHTML = "done";
        doneBadgeElement.className = "badge badge-info badge-pill";

        h5OfButton.appendChild(doneBadgeElement);
    }

    document.getElementById("accordion").appendChild(newSeasonCard);
}

function addEpisodeToSeasonList(episodeObject) {
    const newListItem = document.createElement("li");
    newListItem.innerHTML = episodeObject.episode + ". " + episodeObject.name;
    newListItem.className = "list-group-item d-flex justify-content-between align-items-center";

    if (episodeObject.watched) {
        const doneBadgeElement = document.createElement("span");
        doneBadgeElement.innerHTML = "done";
        doneBadgeElement.className = "badge badge-info badge-pill";

        newListItem.appendChild(doneBadgeElement);
    }

    const lisID = "list-of-episodes-" + episodeObject.season;

    document.getElementById(lisID).append(newListItem);
}

function toggleCollapse(cardID) {
    const actualClass = document.getElementById(cardID).className;

    if (actualClass == "collapse") {
        document.getElementById(cardID).className = "collapse show";
    } else {
        document.getElementById(cardID).className = "collapse";
    }
}

function populatePercentageBar() {
    returnWatchPercentagePromise()
        .then(percentage => {
            document.getElementById("watched-percentage").innerHTML = percentage.toFixed(2) + "%";
            document.getElementById("watched-percentage-bar").style.width = percentage + "%";
        });
}

function populateSeasonCards() {
    returnDataPromise()
        .then(data => {
            let episodeSeasons = [];
            const seasonsAndEpisodesWatched = {};

            // For each episode
            for (let i = 0; i < data.episodes.length; i++) {
                // If the episode season is not already in the episodeSeasons
                if (episodeSeasons.indexOf(data.episodes[i].season) === -1) {
                    episodeSeasons.push(data.episodes[i].season);
                }

                // If the episode season is not already in the seasonsAndEpisodesWatched
                if (! seasonsAndEpisodesWatched.hasOwnProperty(data.episodes[i].season)) {
                    seasonsAndEpisodesWatched[data.episodes[i].season] = [];
                }

                seasonsAndEpisodesWatched[data.episodes[i].season].push(data.episodes[i].watched);
            }

            for (let i = 0; i < episodeSeasons.length; i++) {
                const unwatchedEpisodes = seasonsAndEpisodesWatched[episodeSeasons[i]].filter(i => !i);

                if (unwatchedEpisodes.length === 0) {
                    addSeasonToList(episodeSeasons[i], true);
                } else {
                    addSeasonToList(episodeSeasons[i], false);
                }
            }
        });
}

function populateEpisodesInSeasons() {
    returnDataPromise()
        .then(data => {
            // For each episode
            for (let i = 0; i < data.episodes.length; i++) {
                // Insert this episode to season
                addEpisodeToSeasonList(data.episodes[i]);
            }
        });
}

function populateBadgeInWatchedSeasons() {
    returnDataPromise()
        .then(data => {
            const seasonsAndEpisodesWatched = {};

            // For each episode
            for (let i = 0; i < data.episodes.length; i++) {
                // Insert this episode to season
                
            }
        });
}

window.onscroll = (ev) => {
    // If the user get to the bottom
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        if (document.getElementById("made-footer") != null) {
            document.getElementById("made-footer").id = "made-footer-showed";
        } 
    }
};
