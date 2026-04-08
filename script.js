const testButton = document.getElementById("testButton");
const message = document.getElementById("message");

testButton.addEventListener("click", function () {
  message.textContent = "按鈕測試成功，JavaScript 運作正常。";
});