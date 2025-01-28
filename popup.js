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

// Получение элементов
const mainMenu = document.getElementById("mainMenu");
const editMacros = document.getElementById("editMacros");
const changeMacrosBtn = document.getElementById("ChangeMacros");
const saveBtn = document.getElementById("saveBtn");
const editBtn = document.getElementById("editBtn");
const inputMacrosName = document.getElementById("inputMacrosName");
const inputMacros = document.getElementById("inputMacros");
const copyText = document.getElementById("copyText");

// Функция для удаления макроса
function deleteMacros(macrosName, btnContainer) {
  // Удаление макроса из localStorage
  deleteMacrosFromLocalStorage(macrosName);
  btnContainer.remove();
  // Показываем кастомный алерт о удалении
  dangerAlert(`Макрос \"${macrosName}\" был удалён.`);
}

// Функция для сохранения данных в localStorage
function saveMacrosToLocalStorage(macrosName, macrosText) {
  const macros = JSON.parse(localStorage.getItem("macros")) || {};
  macros[macrosName] = macrosText;
  localStorage.setItem("macros", JSON.stringify(macros));
}

// Функция для загрузки данных из localStorage
function loadMacrosFromLocalStorage() {
  const macros = JSON.parse(localStorage.getItem("macros")) || {};
  for (const macrosName in macros) {
    if (Object.hasOwnProperty.call(macros, macrosName)) {
      createMacrosUI(macrosName, macros[macrosName]);
    }
  }
}

// Функция для удаления макроса из localStorage
function deleteMacrosFromLocalStorage(macrosName) {
  const macros = JSON.parse(localStorage.getItem("macros")) || {};
  delete macros[macrosName];
  localStorage.setItem("macros", JSON.stringify(macros));
}

// Функция для создания UI для макроса
function createMacrosUI(macrosName, macrosText) {
  // Создание контейнера для кнопок
  const btnContainer = document.createElement("div");
  btnContainer.id = "container-btn";
  btnContainer.style.display = "inline-flex";
  btnContainer.style.alignItems = "center";

  // Создание кнопки для нового макроса
  const newButton = document.createElement("button");
  newButton.textContent = macrosName;
  newButton.className = `btn-copy ${macrosName}`;
  newButton.addEventListener("click", () => {
    copyText.value = macrosText;
    copyText.select();
    document.execCommand("copy");
    // Показываем кастомный алерт
    infoAlert(`Текст макроса \"${macrosName}\" скопирован в буфер обмена!`);
  });

  // Создание кнопки для удаления макроса
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "✖";
  deleteButton.className = `btn-del ${macrosName}`;
  deleteButton.style.backgroundColor = "red";
  deleteButton.style.color = "white";
  deleteButton.style.border = "none";
  deleteButton.style.marginLeft = "5px";
  deleteButton.style.cursor = "pointer";
  deleteButton.addEventListener("click", () => {
    // Удаляем макрос
    deleteMacros(macrosName, btnContainer);
  });

  // Добавление кнопок в контейнер
  btnContainer.appendChild(newButton);
  btnContainer.appendChild(deleteButton);

  // Добавление контейнера в меню
  mainMenu.querySelector(".btn").appendChild(btnContainer);

  // Создание <textarea> для нового макроса
  const macrosTextarea = document.createElement("textarea");
  macrosTextarea.id = macrosName;
  macrosTextarea.readOnly = true;
  macrosTextarea.style.display = "none";
  macrosTextarea.textContent = macrosText;
  mainMenu.appendChild(macrosTextarea);
}

// Функция для переключения меню
function toggleMenu(isEditing) {
  if (isEditing) {
    mainMenu.style.display = "none";
    editMacros.style.display = "block";
  } else {
    mainMenu.style.display = "block";
    editMacros.style.display = "none";
  }
}

// Обработчик кнопки "Редактировать макрос"
changeMacrosBtn.addEventListener("click", () => toggleMenu(true));

// Обработчик кнопки "Назад"
editBtn.addEventListener("click", () => toggleMenu(false));

// Обработчик кнопки "Сохранить"
saveBtn.addEventListener("click", () => {
  const macrosName = inputMacrosName.value.trim();
  const macrosText = inputMacros.value.trim();

  if (!macrosName || !macrosText) {
    return; // Если название или текст пусты, ничего не делаем
  }

  // Сохранение макроса в localStorage
  saveMacrosToLocalStorage(macrosName, macrosText);

  // Создание UI для макроса
  createMacrosUI(macrosName, macrosText);

  // Очистка полей ввода и возвращение в главное меню
  inputMacrosName.value = "";
  inputMacros.value = "";
  toggleMenu(false);
  // Показываем кастомный алерт
  successAlert(`Макрос \"${macrosName}\" успешно сохранён!`);
});

// Загрузка макросов при загрузке страницы
window.addEventListener("DOMContentLoaded", loadMacrosFromLocalStorage);
