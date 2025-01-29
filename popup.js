(function() {
  const customAlert = document.getElementById('customAlert');
  const alertMessage = document.getElementById('alertMessage');
  const closeAlertBtn = document.getElementById('closeAlertBtn');
  
  function showCustomAlert(message, type = 'success') {
    alertMessage.textContent = message;
    
    customAlert.classList.remove('alert-success', 'alert-danger', 'alert-warning', 'alert-info');
    customAlert.classList.add(`alert-${type}`);
    customAlert.classList.add('show');
    customAlert.style.display = 'grid';

    setTimeout(() => {
      customAlert.classList.remove('show');
      customAlert.style.display = 'none';
    }, 1500);
  }

  closeAlertBtn.addEventListener('click', () => {
    customAlert.classList.remove('show');
    customAlert.style.display = 'none';
  });

  window.alert = function(message) {
    showCustomAlert(message, 'success');
  };

  window.successAlert = function(message) {
    showCustomAlert(message, 'success');
  };

  window.dangerAlert = function(message) {
    showCustomAlert(message, 'danger');
  };

  window.warningAlert = function(message) {
    showCustomAlert(message, 'warning');
  };

  window.infoAlert = function(message) {
    showCustomAlert(message, 'info');
  };
})();

function setCookie(name, value, days) {
let expires = "";
if (days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  expires = "; expires=" + date.toUTCString();
}
document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
const cookies = document.cookie.split('; ');
for (let i = 0; i < cookies.length; i++) {
  const [key, value] = cookies[i].split('=');
  if (key === name) return decodeURIComponent(value);
}
return null;
}

function deleteCookie(name) {
document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function saveMacrosToCookies(macrosName, macrosText) {
const macros = JSON.parse(getCookie("macros")) || {};
macros[macrosName] = macrosText;
setCookie("macros", JSON.stringify(macros), 30);
}

function loadMacrosFromCookies() {
const macros = JSON.parse(getCookie("macros")) || {};
for (const macrosName in macros) {
  if (Object.hasOwnProperty.call(macros, macrosName)) {
    createMacrosUI(macrosName, macros[macrosName]);
  }
}
}

function deleteMacrosFromCookies(macrosName) {
const macros = JSON.parse(getCookie("macros")) || {};
delete macros[macrosName];
setCookie("macros", JSON.stringify(macros), 30);
}

const mainMenu = document.getElementById("mainMenu");
const editMacros = document.getElementById("editMacros");
const changeMacrosBtn = document.getElementById("ChangeMacros");
const saveBtn = document.getElementById("saveBtn");
const editBtn = document.getElementById("editBtn");
const inputMacrosName = document.getElementById("inputMacrosName");
const inputMacros = document.getElementById("inputMacros");
const copyText = document.getElementById("copyText");

function deleteMacros(macrosName, btnContainer) {
deleteMacrosFromCookies(macrosName);
btnContainer.remove();
dangerAlert(`Макрос \"${macrosName}\" был удалён.`);
}

function createMacrosUI(macrosName, macrosText) {
const btnContainer = document.createElement("div");
btnContainer.id = "container-btn";
btnContainer.style.display = "inline-flex";
btnContainer.style.alignItems = "center";

const newButton = document.createElement("button");
newButton.textContent = macrosName;
newButton.className = `btn-copy ${macrosName}`;
newButton.addEventListener("click", () => {
  copyText.value = macrosText;
  copyText.select();
  document.execCommand("copy");
  infoAlert(`Текст макроса \"${macrosName}\" скопирован в буфер обмена!`);
});

const deleteButton = document.createElement("button");
deleteButton.textContent = "✖";
deleteButton.className = `btn-del ${macrosName}`;
deleteButton.style.backgroundColor = "red";
deleteButton.style.color = "white";
deleteButton.style.border = "none";
deleteButton.style.marginLeft = "5px";
deleteButton.style.cursor = "pointer";
deleteButton.addEventListener("click", () => {
  deleteMacros(macrosName, btnContainer);
});

btnContainer.appendChild(newButton);
btnContainer.appendChild(deleteButton);

mainMenu.querySelector(".btn").appendChild(btnContainer);

const macrosTextarea = document.createElement("textarea");
macrosTextarea.id = macrosName;
macrosTextarea.readOnly = true;
macrosTextarea.style.display = "none";
macrosTextarea.textContent = macrosText;
mainMenu.appendChild(macrosTextarea);
}

function toggleMenu(isEditing) {
if (isEditing) {
  mainMenu.style.display = "none";
  editMacros.style.display = "block";
} else {
  mainMenu.style.display = "block";
  editMacros.style.display = "none";
}
}

changeMacrosBtn.addEventListener("click", () => toggleMenu(true));
editBtn.addEventListener("click", () => toggleMenu(false));

saveBtn.addEventListener("click", () => {
const macrosName = inputMacrosName.value.trim();
const macrosText = inputMacros.value.trim();

if (!macrosName || !macrosText) {
  return;
}

saveMacrosToCookies(macrosName, macrosText);
createMacrosUI(macrosName, macrosText);
inputMacrosName.value = "";
inputMacros.value = "";
toggleMenu(false);
successAlert(`Макрос \"${macrosName}\" успешно сохранён!`);
});

window.addEventListener("DOMContentLoaded", loadMacrosFromCookies);