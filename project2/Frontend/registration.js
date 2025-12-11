document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const salary = document.getElementById("salary").value;
    const age = document.getElementById("age").value;

    fetch("http://localhost:5050/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, firstname, lastname, salary, age }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Server response:", data);
        alert("User registered successfully!");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Registration failed.");
      });
  });
});
