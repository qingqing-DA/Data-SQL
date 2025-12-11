const resultDiv = document.getElementById("result");

function displayResults(data) {
  if (!Array.isArray(data) || data.length === 0) {
    resultDiv.innerHTML = "<p>No results found.</p>";
    return;
  }

  let table = "<table><tr>";
  for (let key in data[0]) {
    table += `<th>${key}</th>`;
  }
  table += "</tr>";

  data.forEach(row => {
    table += "<tr>";
    for (let key in row) {
      table += `<td>${row[key]}</td>`;
    }
    table += "</tr>";
  });

  table += "</table>";
  resultDiv.innerHTML = table;
}

function searchByFirstname() {
  const firstname = document.getElementById("firstname").value;
  fetch(`http://localhost:5050/searchByFirstname?firstname=${encodeURIComponent(firstname)}`)
    .then(res => res.json())
    .then(displayResults)
    .catch(err => console.error(err));
}

function searchByUserid() {
  const userid = document.getElementById("userid").value;
  fetch(`http://localhost:5050/searchByUserid?userid=${encodeURIComponent(userid)}`)
    .then(res => res.json())
    .then(displayResults)
    .catch(err => console.error(err));
}

function searchBySalary() {
  const min = document.getElementById("minSalary").value;
  const max = document.getElementById("maxSalary").value;
  fetch(`http://localhost:5050/searchBySalary?min=${min}&max=${max}`)
    .then(res => res.json())
    .then(displayResults)
    .catch(err => console.error(err));
}

function searchByAge() {
  const min = document.getElementById("minAge").value;
  const max = document.getElementById("maxAge").value;
  fetch(`http://localhost:5050/searchByAge?min=${min}&max=${max}`)
    .then(res => res.json())
    .then(displayResults)
    .catch(err => console.error(err));
}

function searchAfterJohn() {
  fetch("http://localhost:5050/searchAfterJohn")
    .then(res => res.json())
    .then(displayResults)
    .catch(err => console.error(err));
}

function searchSameDayJohn() {
  fetch("http://localhost:5050/searchSameDayJohn")
    .then(res => res.json())
    .then(displayResults)
    .catch(err => console.error(err));
}

function searchRegisteredToday() {
  fetch("http://localhost:5050/searchRegisteredToday")
    .then(res => res.json())
    .then(displayResults)
    .catch(err => console.error(err));
}

function searchNeverSignedIn() {
  fetch("http://localhost:5050/searchNeverSignedIn")
    .then(res => res.json())
    .then(displayResults)
    .catch(err => console.error(err));
}
