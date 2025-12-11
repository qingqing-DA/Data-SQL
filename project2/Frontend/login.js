document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5050/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Login successful! Welcome " + data.username);
        } else {
          alert("Login failed: " + data.error);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Login failed due to server error.");
      });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); 
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    
    fetch("http://localhost:5050/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Login successful! Welcome " + data.user.firstname);
          console.log("Logged in user:", data.user);
        } else {
          alert("Login failed: " + data.message);
        }
      });
  });
});
