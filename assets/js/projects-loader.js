const itemsPerPage = 10;
let allProjects = [];
let currentPage = 1;

async function loadProjects() {
  try {
    const response = await fetch("../../projects.json");
    if (!response.ok) {
      console.error("response.statusText:", response.statusText);
      throw new Error("Failed to load projects.json");
    }

    allProjects = await response.json();
    renderPage(1);
    renderPagination();
  } catch (error) {
    console.error(error);
    const projectList = document.getElementById("projectList");
    if (projectList) {
      projectList.innerHTML = "<p>Failed to load project list.</p>";
    }
  }
}

function renderPage(page) {
  currentPage = page;

  const projectList = document.getElementById("projectList");
  if (!projectList) return;

  projectList.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = allProjects.slice(start, end);

  pageItems.forEach((project) => {
    const article = document.createElement("article");
    article.className = "project-item";

    article.innerHTML = `
      <h3>${escapeHtml(project.title)}</h3>
      <p class="project-meta">${escapeHtml(project.category || "")}</p>
      <p>${truncateText(project.summary || "", 25)}</p>
      <a href="${project.url}" class="card-link">Read More</a>
    `;

    projectList.appendChild(article);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  pagination.innerHTML = "";
  const totalPages = Math.ceil(allProjects.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.className = "page-button";
    button.textContent = i;

    if (i === currentPage) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      renderPage(i);
      renderPagination();

      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });

    pagination.appendChild(button);
  }
}

function truncateText(text, maxLength) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.slice(0, maxLength) + "...";
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", loadProjects);