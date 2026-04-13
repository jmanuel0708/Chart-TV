const showsGrid = document.querySelector(".tvShowGrid");
const recommendedTvShows = [44458, 58323, 49, 80, 2993]

const handleGridGradients = () => {
    const grid = document.querySelector(".tvShowGrid");
    const wrapper = document.querySelector(".tvShowGrid__wrapper");

    const atStart = grid.scrollLeft === 0;
    const atEnd = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;

    wrapper.classList.toggle("hide-right", atEnd);
    wrapper.classList.toggle("show-left", !atStart);
}
const createShowCard = (show) => {
    
    const showName    = show.name;
    const showImg     = show.image?.medium;
    const genres      = show.genres;
    const showChannel = show.webChannel?.name ?? show.network?.name ?? "N/A";
    const showYear    = show.premiered?.split("-")[0];
    const showRating  = show.rating?.average ?? "N/A";
    const showSummary = show.summary?.replace(/<[^>]+>/g, ""); 
    
    const card = document.createElement("article");
    card.classList.add("tvShowCard")
    showsGrid.appendChild(card);

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("tvShowCard__header");
    card.appendChild(headerDiv);

    const cover = document.createElement("img");
    cover.classList.add("tvShowCard__header__img");
    cover.src = showImg
    cover.alt = showName
    headerDiv.appendChild(cover);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("tvShowCard__header__info");
    headerDiv.appendChild(infoDiv);

    const title = document.createElement("h2");
    title.classList.add("tvShowCard__header__info__name")
    title.textContent = showName;
    infoDiv.appendChild(title);

    const genresDiv = document.createElement("div");
    genresDiv.classList.add("tvShowCard__header__info__genres");
    infoDiv.appendChild(genresDiv);

    genres.forEach((genreInShow) => {
        const genre = document.createElement("p");
        genre.classList.add("tvShowCard__header__info__genres__genre");
        genre.textContent = genreInShow;
        genresDiv.appendChild(genre);
    })

    const subinfoDiv = document.createElement("div");
    subinfoDiv.classList.add("tvShowCard__header__info__subinfo");
    infoDiv.appendChild(subinfoDiv);

    const channel = document.createElement("p");
    channel.classList.add("tvShowCard__header__info__subinfo__channel");
    channel.textContent = showChannel;
    subinfoDiv.appendChild(channel);

    const year = document.createElement("p");
    year.classList.add("tvShowCard__header__info__subinfo__year");
    year.textContent = showYear;
    subinfoDiv.appendChild(year);

    const rating = document.createElement("p");
    rating.classList.add("tvShowCard__header__info__rating");
    rating.textContent = `⭐ ${showRating} / 10`;
    infoDiv.appendChild(rating);

    const summaryDiv = document.createElement("div");
    summaryDiv.classList.add("tvShowCard__description");
    card.appendChild(summaryDiv);

    const summary = document.createElement("p");
    summary.classList.add("tvShowCard__description__txt");
    summary.textContent = showSummary;
    summaryDiv.appendChild(summary);
}

const loadTvShows = async () => {
    for (const id of recommendedTvShows) {
        try {
            const response = await axios.get(`https://api.tvmaze.com/shows/${id}`);
            const show = response.data;

            createShowCard(show);

        } catch(error) {
            console.log(`Error al cargar el show ${id}:`, error.message)
        };
    };
};

const searchTvShows = async () => {
    const showName = document.getElementById("shows-search").value;
    const sectionTitle = document.querySelector(".sectionTitle");

    try {
        const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${showName}`);
        const shows = response.data;
        showsGrid.innerHTML = '';
        sectionTitle.textContent = "Results"

        shows.forEach((result) => {
            const show = result.show;

            createShowCard(show);
        })

    } catch(error) {
        console.log(`Error al buscar el show ${showName}:`, error.message);
    };
}

document.addEventListener("DOMContentLoaded",loadTvShows);
document.querySelector(".tvShowGrid").addEventListener("scroll", handleGridGradients);
document.querySelector(".header__searchbar__search").addEventListener("click", searchTvShows);
document.getElementById("shows-search").addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
        searchTvShows();
    }
});