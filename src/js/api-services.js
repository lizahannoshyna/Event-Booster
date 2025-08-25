import refs from "./refs";
import { updatePagination } from "./posters";

class ApiServices {
  constructor() {
    this._apiKey = "RO7qWdCAE673OL1GG2So7c2DTSgA49pc";
    this._baseUrl = "https://app.ticketmaster.com/discovery/v2/events.json";

    this._countryCode = "";
    this._search = "";
    this._size = 20;
    this._page = 1;
    this._totalPages = 1;
  }

  get apiKey() { return this._apiKey; }
  get baseUrl() { return this._baseUrl; }
  get countryCode() { return this._countryCode; }
  get search() { return this._search; }
  get size() { return this._size; }
  get page() { return this._page; }
  get totalPages() { return this._totalPages; }

  set countryCode(v) { this._countryCode = v; }
  set search(v) { this._search = v; }
  set size(v) { this._size = v; }
  set page(v) { this._page = v; }

  async fetchEvent(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      if (!data?._embedded) {
        refs.posters.innerHTML = "<p class='text-center text-2xl mb-12'>Нема подій.</p>";
        updatePagination();
        return;
      }

      this._totalPages = data.page.totalPages || 1;
      return data;
    } catch (error) {
      console.error("fetchEvent error:", error);
    }
  }

  getData() {
    return this.fetchEvent(
      `${this._baseUrl}?size=${this._size}&page=${this._page}&apikey=${this._apiKey}`
    );
  }

  getDataByCountry(country) {
    return this.fetchEvent(
      `${this._baseUrl}?countryCode=${country}&size=${this._size}&page=${this._page}&apikey=${this._apiKey}`
    );
  }

  getDataByEventName(name) {
    return this.fetchEvent(
      `${this._baseUrl}?keyword=${name}&size=${this._size}&page=${this._page}&apikey=${this._apiKey}`
    );
  }

  getDataByAuthor(author) {
    return this.fetchEvent(
      `${this._baseUrl}?attractionName=${author}&size=${this._size}&page=${this._page}&apikey=${this._apiKey}`
    );
  }

  renderData(data) {
    if(!data) return;
    const markUp = data._embedded.events.map(event => `
      <div class="relative h-auto w-full md:w-[196px] text-center justify-items-center cursor-pointer hover:scale-103 transition-transform duration-100 ease-in-out">
        <div class="relative inline-block">
          <img class="mt-[13px] mb-[5px] rounded-tl-[50px] rounded-br-[50px] object-cover md:h-[227px]" src="${event.images[5].url}" alt="">
          <div class="absolute z-10 border border-[#DC56C54D] w-[153px] h-[143px] rounded-tl-[50px] rounded-br-[50px] top-0 -right-[12px]"></div>
        </div>
        <h2 class="text-pink-500 font-bold text-[14px] md:text-base">${event.name}</h2>
        <p class="text-white font-normal text-[14px] md:text-base">${event.dates.start.localDate}</p>
        <div class="flex items-center gap-[3px]">
          <img class="w-[7px] h-[10px]" src="../public/icon-marker.svg" alt="">
          <p class="text-white font-semibold text-[12px] md:text-[14px]">${event._embedded.venues[0].name}</p>
        </div>
      </div>
    `).join("");

    refs.posters.innerHTML = markUp;
  }
}

export default ApiServices;
