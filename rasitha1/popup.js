const productiveSites = ["github.com", "stackoverflow.com", "leetcode.com"];
const unproductiveSites = ["facebook.com", "instagram.com", "youtube.com"];

chrome.storage.local.get("siteData", data => {
  let statsDiv = document.getElementById("stats");
  let siteData = data.siteData || {};

  let totalTime = 0;
  let productiveTime = 0;
  let unproductiveTime = 0;

  let html = "<ul>";

  for (let site in siteData) {
    let timeMin = Math.round(siteData[site] / 60000); // ms → minutes
    totalTime += siteData[site];

    if (productiveSites.includes(site)) productiveTime += siteData[site];
    if (unproductiveSites.includes(site)) unproductiveTime += siteData[site];

    html += `<li><b>${site}</b>: ${timeMin} mins</li>`;
  }

  html += "</ul>";

  let score = ((productiveTime / totalTime) * 100).toFixed(1);

  statsDiv.innerHTML = `
    <p><b>Total Time:</b> ${(totalTime / 60000).toFixed(1)} mins</p>
    <p><b>Productive Time:</b> ${(productiveTime / 60000).toFixed(1)} mins</p>
    <p><b>Unproductive Time:</b> ${(unproductiveTime / 60000).toFixed(1)} mins</p>
    <p><b>Productivity Score:</b> ${score}%</p>
    <h3>Details:</h3>
    ${html}
  `;
});
