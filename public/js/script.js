// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

function toggleChat() {
  const box = document.getElementById("chatbox");
  box.style.display = box.style.display === "none" ? "flex" : "none";
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;

  const messagesDiv = document.getElementById("messages");

  // USER MESSAGE
  messagesDiv.innerHTML += `<div class="user-msg">${message}</div>`;

  // LOADER
  messagesDiv.innerHTML += `<div class="ai-msg" id="typing">Typing...</div>`;

  const res = await fetch("/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  // REMOVE LOADER
  document.getElementById("typing").remove();

  // AI MESSAGE
  messagesDiv.innerHTML += `
    <div class="ai-msg">🤖 ${data.reply.replace(/\n/g, "<br>")}</div>
  `;

  input.value = "";

  // AUTO SCROLL
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function generateDesc() {
  const res = await fetch("/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Generate a short attractive Airbnb description for a cozy room"
    })
  });

  const data = await res.json();

  document.getElementById("description").value = data.reply;
}

function toggleChat() {
  const box = document.getElementById("chatbox");
  box.style.display = box.style.display === "none" ? "flex" : "none";
}