const sendMessage = document.querySelector('.send-message');
const geoLocation = document.querySelector('.geo-check');
const wsUrl = "wss://echo.websocket.org/";
const output = document.querySelector('.message-wrapper');

// функция открытия соединения
function wsConnect() {
  websocket = new WebSocket(wsUrl);
  websocket.onopen = function (event) {
    writeMessage('Connected')
  }
  websocket.onerror = function (event) {
    writeMessage('<span style="color: red;">ERROR:</span> ' + event.data)
  }
  
  // если от сервера пришли координаты то ничего не выводим
  websocket.onmessage = function(event) {
    if (coords) {
      writeMessage ('');
    }
    // если пришли другие данные то выводим
    else {
      writeMessage ('<span style="color: blue;">Сервер: ' + event.data+'</span>');
    }
  }
}

// открываем соединение
wsConnect();

// создаем узел в которые будем записывать результат
function writeMessage(message) {
  let p = document.createElement("p");
  p.innerHTML = message;
  output.appendChild(p);
}

// при клике пишем наше сообщение + отправляем его на сервер
sendMessage.addEventListener('click', () => {
  const message = document.querySelector('.inp-message').value;
  writeMessage("Я: " + message);
  websocket.send(message);
});

function geoError() {
  writeMessage('Не возможно получить ваше местоположение.');
}

let coords = '';

// записываем результат координаты в переменную, выводим пользователю и отправляем на сервер
function geoSuccess(position) {
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  coords = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}">Ссылка на карту</a>`
  websocket.send(coords)
  writeMessage(coords);
}

// при клике создаем обьект геолокации
geoLocation.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  }
})