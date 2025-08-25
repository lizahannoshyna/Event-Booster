import refs from "./refs";
import ApiServices from "./api-services";

const api = new ApiServices();

const MAX_VISIBLE = 5;
const RESIZE_DEBOUNCE = 250;

/* ---------- UI Helpers ---------- */
function createPageButton(page, isActive = false) {
  const btn = document.createElement("div");
  btn.className = "px-3 py-1 cursor-pointer";
  if (isActive) btn.classList.add("active-page");
  btn.innerHTML = `<p class="text-[14px] font-normal">${page}</p>`;

  btn.addEventListener("click", () => {
    if (api.page === page) return;
    api.page = page;
    loadData();
  });

  return btn;
}

function createEllipsis() {
  const el = document.createElement("div");
  el.className = "px-3 py-1";
  el.innerHTML = `<p class="text-[14px] font-normal">...</p>`;
  return el;
}

function getPageSize() {
  const w = window.innerWidth;
  api.size = (w > 768 && w < 1280) ? 21 : 20;
}

/* ---------- Pagination ---------- */
export function updatePagination() {
  const total = Math.max(1, api.totalPages);
  const current = Math.min(Math.max(1, api.page), total);

  const container = refs.pagination;
  container.innerHTML = "";
  const frag = document.createDocumentFragment();

  if (total <= MAX_VISIBLE + 2) {
    for (let i = 1; i <= total; i++) {
      frag.appendChild(createPageButton(i, i === current));
    }
    return container.appendChild(frag);
  }

  let start = Math.max(2, current - Math.floor(MAX_VISIBLE / 2));
  let end = Math.min(total - 1, start + MAX_VISIBLE - 1);

  if (end - start + 1 < MAX_VISIBLE) {
    start = Math.max(2, end - MAX_VISIBLE + 1);
  }

  frag.appendChild(createPageButton(1, current === 1));
  if (start > 2) frag.appendChild(createEllipsis());

  for (let i = start; i <= end; i++) {
    frag.appendChild(createPageButton(i, i === current));
  }

  if (end < total - 1) frag.appendChild(createEllipsis());
  frag.appendChild(createPageButton(total, current === total));

  container.appendChild(frag);
}

/* ---------- Data Loader ---------- */
async function loadData() {
  getPageSize();
  try {
    const query = refs.searchInput.value.trim();

    const data = query
      ? await api.getDataByEventName(query)
      : await api.getData();

    api.renderData(data);
    updatePagination();
  } catch (err) {
    console.error("loadData error:", err);
  }
}

/* ---------- Utils ---------- */
function debounce(fn, delay = 200) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ---------- Init ---------- */
loadData();

/* ---------- Listeners ---------- */
refs.searchInput.addEventListener('input', debounce(() => {
    api.page = 1;
    loadData()
}), 1000)