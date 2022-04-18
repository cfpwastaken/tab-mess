function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

let keep = [];
let tabs = [];
let remove = [];
let removed = 0;
let removedTotal = 0;

removedTotal = localStorage.getItem("removedTotal") || 0;
$("#removed-total").innerText = removedTotal;

function $(el) {
  return document.querySelector(el);
}

function nextTab() {
  if(tabs.length == 0) {
    $("#status").innerText = "Thats it! All done!";
    $("#yes").style.display = "none";
    $("#no").style.display = "none";
    $("#tab-name").style.display = "none";
    return;
  }
  // cut off title at 20 chars
  let title = tabs[0].title;
  if(title.length > 40) {
    title = title.substring(0, 40) + "...";
  }
  $("#tab-name").innerText = title;
  $("#tab-name").title = tabs[0].title;
}

$("#yes").addEventListener("click", () => {
  keep.push(tabs[0]);
  tabs.shift();
  nextTab();
})

$("#no").addEventListener("click", () => {
  // browser.tabs.remove(tabs[0].id);
  remove.push(tabs[0]);
  tabs.shift();
  removed++;
  removedTotal++;
  if(remove.length == 3) {
    browser.tabs.remove(remove[0].id);
    remove.shift();
  }
  $("#removed-total").innerText = removedTotal;
  localStorage.setItem("removedTotal", removedTotal);
  $("#removed-count").innerText = removed;
  nextTab();
})

$("#go-back").addEventListener("click", () => {
  if(remove.length > 0) {
    removed--;
    removedTotal--;
    $("#removed-total").innerText = removedTotal;
    localStorage.setItem("removedTotal", removedTotal);
    $("#removed-count").innerText = removed;
    remove.pop();
  }
})

$("#close").addEventListener("click", () => {
  for(let tab of remove) {
    browser.tabs.remove(tab.id);
  }
  remove = [];
});

getCurrentWindowTabs().then((t) => {
  tabs = t;
  nextTab();
})