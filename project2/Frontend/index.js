// This is the frontEnd that modifies the HTML page directly
// event-based programming,such as document load, click a button

/*
What is a Promise in Javascript? 

A Promise can be in one of three states:

    - Pending: The initial state; the promise is neither fulfilled nor rejected.

    - Fulfilled: The operation completed successfully, and the promise has a 
      resulting value.

    - Rejected: The operation failed, and the promise has a reason for the failure.

Promises have two main methods: then and catch.

    - The then method is used to handle the successful fulfillment of a promise. 
    It takes a callback function that will be called when the promise is resolved, 
    and it receives the resulting value.

    - The catch method is used to handle the rejection of a promise. It takes a 
    callback function that will be called when the promise is rejected, and it 
    receives the reason for the rejection.

What is a promise chain? 
    The Promise chain starts with some asyncOperation1(), which returns a promise, 
    and each subsequent ``then`` is used to handle the result of the previous Promise.

    The catch is used at the end to catch any errors that might occur at any point 
    in the chain.

    Each then returns a new Promise, allowing you to chain additional ``then`` calls to 
    handle subsequent results.

What is an arrow function?

    An arrow function in JavaScript is a concise way to write anonymous function 
    expressions.

    Traditional function syntax: 
        const add = function(x, y) {
           return x + y;
        };

    Arrow function syntax:
        const add = (x, y) => x + y;
    
    
Arrow functions have a few notable features:

    - Shorter Syntax: Arrow functions eliminate the need for the function keyword, 
      curly braces {}, and the return keyword in certain cases, making the syntax 
      more concise.

    - Implicit Return: If the arrow function consists of a single expression, it is 
      implicitly returned without needing the return keyword.

    - Lexical this: Arrow functions do not have their own this context; instead, they 
      inherit this from the surrounding code. This can be beneficial in certain situations,
      especially when dealing with callbacks and event handlers.
*/


// fetch call is to call the backend
document.addEventListener('DOMContentLoaded', function() {
    // one can point your browser to http://localhost:5050/getAll to check what it returns first.
    fetch('http://localhost:5050/getAll')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-user-btn');
    const searchUseridBtn = document.getElementById('search-userid-btn');
    const searchUsernameBtn = document.getElementById('search-username-btn'); 
    const searchAgeBtn = document.getElementById('search-age-btn');  
    const updateBtn = document.getElementById('update-row-btn');
    const searchSalaryBtn = document.getElementById('search-salary-btn');
    const searchAfterJohnBtn = document.getElementById('search-after-john-btn');
    const searchSameJohnBtn = document.getElementById('search-same-john-btn');
    const searchRegisteredTodayBtn = document.getElementById('search-registered-today-btn');
    const searchNeverSignedBtn = document.getElementById('search-never-signed-btn');
    // ... other buttons as needed
    const table = document.getElementById('table');
    const searchInput = document.getElementById('search-username-input');
    const searchUserIdInput = document.getElementById('search-userid-input');
    const searchMinAgeInput = document.getElementById('search-minage-input');
    const searchMaxAgeInput = document.getElementById('search-maxage-input');
    const searchMinSalaryInput = document.getElementById('search-minsalary-input');
    const searchMaxSalaryInput = document.getElementById('search-maxsalary-input');
    const searchAfterJohnInput = document.getElementById('search-after-john-input'); 
    const searchSameJohnInput = document.getElementById('search-same-john-input');
    const searchRegisteredTodayInput = document.getElementById('search-registered-today-input');
    const searchNeverSignedInput = document.getElementById('search-signedin-input');
    // ... other inputs as needed
    // ... other elements as needed

    // duplicate declaration removed

    if (addBtn) addBtn.addEventListener('click', () => {
        // when the addBtn is clicked
        const usernameInput = document.querySelector('#login-username');
        const passwordInput = document.querySelector('#password-input');
        const firstnameInput = document.querySelector('#firstname-input');
        const lastnameInput = document.querySelector('#lastname-input');
        const salaryInput = document.querySelector('#salary-input');
        const ageInput = document.querySelector('#age-input');      
        const username = usernameInput.value;
        const password = passwordInput.value;
        const firstname = firstnameInput.value;
        const lastname = lastnameInput.value;
        const salary = salaryInput.value;
        const age = ageInput.value;       
        usernameInput.value = "";
        passwordInput.value = "";
        firstnameInput.value = "";
        lastnameInput.value = "";
        salaryInput.value = "";
        ageInput.value = "";    

        fetch('http://localhost:5050/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
                firstname: firstname,
                lastname: lastname,
                salary: salary,
                age: age

            })
        })
        .then(response => response.json())
        .then(data => insertRowIntoTable(data['data']));
    });

    if (searchUsernameBtn) searchUsernameBtn.addEventListener('click', () => {
        const usernameValue = searchInput ? searchInput.value.trim() : '';
        console.log('search-username clicked, input=', usernameValue);
        if (!usernameValue) {
            alert('username required for search');
            return;
        }

        const url = 'http://localhost:5050/search/' + encodeURIComponent(usernameValue);
        console.log('fetch URL:', url);

        fetch(url)
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Server returned non-OK:', res.status, text);
                throw new Error('Server error: ' + res.status);
            }
            return res.json();
        })
        .then(json => {
            const payload = json && (json.data ?? json);
            const rows = Array.isArray(payload) ? payload : (payload ? [payload] : []);
            console.log('search-by-username rows:', rows);
            loadHTMLTable(rows);
        })
        .catch(err => {
            console.error('search by username failed:', err);
            alert('Error:' + err.message);
        });
    });

    if (searchUseridBtn) searchUseridBtn.addEventListener('click', () => {
        const idValue = searchUserIdInput ? searchUserIdInput.value.trim() : '';
        if (!idValue) {
            alert('userid required for search');
            return;
        }

        const url = 'http://localhost:5050/searchuserid/' + encodeURIComponent(idValue);
        console.log('Search by userid URL:', url);

        fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Server error:', response.status, text);
                    throw new Error('Server returned ' + response.status);
                });
            }
            return response.json();
        })
        .then(json => {
            // handle both {data: ...} and [...] responses
            const payload = json && (json.data ?? json);
            const rows = Array.isArray(payload) ? payload : (payload ? [payload] : []);
            console.log('search rows:', rows);
            loadHTMLTable(rows);
        })
        .catch(err => {
            console.error('search by userid failed:', err);
            alert('Error:' + err.message);
        });
    });

    if (searchAgeBtn) searchAgeBtn.addEventListener('click', () => {
        const userMinageValue = searchMinAgeInput ? searchMinAgeInput.value.trim() : '';
        const userMaxageValue = searchMaxAgeInput ? searchMaxAgeInput.value.trim() : '';
        console.log('search by age clicked, input=', userMinageValue, userMaxageValue);
        if (!userMinageValue) {
            alert('Min age required for search');
            return;
        }
        // default max to min if not provided
        const maxVal = userMaxageValue || userMinageValue;
        const url = 'http://localhost:5050/searchuserage/' + encodeURIComponent(userMinageValue) + '/' + encodeURIComponent(maxVal);
        console.log('fetch URL:', url);

        fetch(url)
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Server returned non-OK:', res.status, text);
                throw new Error('Server error: ' + res.status);
            }
            return res.json();
        })
        .then(json => {
            const payload = json && (json.data ?? json);
            const rows = Array.isArray(payload) ? payload : (payload ? [payload] : []);
            console.log('search-by-userage rows:', rows);
            loadHTMLTable(rows);
        })
        .catch(err => {
            console.error('search by userage failed:', err);
            alert('Error:' + err.message);
        });
    });

    if (searchSalaryBtn) searchSalaryBtn.addEventListener('click', () => {
        const userMinsalaryValue = searchMinSalaryInput ? searchMinSalaryInput.value.trim() : '';
        const userMaxsalaryValue = searchMaxSalaryInput ? searchMaxSalaryInput.value.trim() : '';
        console.log('search by salary clicked, input=', userMinsalaryValue, userMaxsalaryValue);    
        if (!userMinsalaryValue) {
            alert('Min salary required for search');
            return;
        }
        // default max to min if not provided
        const maxVal = userMaxsalaryValue || userMinsalaryValue;
        const url = 'http://localhost:5050/searchusersalary/' + encodeURIComponent(userMinsalaryValue) + '/' + encodeURIComponent(maxVal);
        console.log('fetch URL:', url); 
        fetch(url)
        .then(async (res) => {
            if (!res.ok) {  
                const text = await res.text();
                console.error('Server returned non-OK:', res.status, text);
                throw new Error('Server error: ' + res.status);
            }
            return res.json();
        })
        .then(json => {
            const payload = json && (json.data ?? json);
            const rows = Array.isArray(payload) ? payload : (payload ? [payload] : []);
            console.log('search-by-usersalary rows:', rows);
            loadHTMLTable(rows);
        })
        .catch(err => {
            console.error('search by usersalary failed:', err);
            alert('Error:' + err.message);
        });
    });

     if (searchAfterJohnBtn) searchAfterJohnBtn.addEventListener('click', () => {
        const AfterusernameValue = searchAfterJohnInput ? searchAfterJohnInput.value.trim() : '';
        console.log('search-after-john clicked, input=', AfterusernameValue);
        if (!AfterusernameValue) {
            alert('username required for search');
            return;
        }

        // : New route: /searchafterjohn/:username
        const url = 'http://localhost:5050/searchafterjohn/' + encodeURIComponent(AfterusernameValue);
        console.log('fetch URL:', url);

        fetch(url)
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Server returned non-OK:', res.status, text);
                throw new Error('Server error: ' + res.status);
            }
            return res.json();
        })
        .then(json => {
            const payload = json && (json.data ?? json);
            const rows = Array.isArray(payload) ? payload : (payload ? [payload] : []);
            console.log('search-by-username rows:', rows);
            loadHTMLTable(rows);
        })
        .catch(err => {
            console.error('search by username failed:', err);
            alert('Error:' + err.message);
        });
    });

     if (searchSameJohnBtn) searchSameJohnBtn.addEventListener('click', () => {
        const SameusernameValue = searchSameJohnInput ? searchSameJohnInput.value.trim() : '';
        console.log('search-same-john clicked, input=', SameusernameValue);
        if (!SameusernameValue) {
            alert('username required for search');
            return;
        }

        // : New route: /searchsamejohn/:username
        const url = 'http://localhost:5050/searchsamejohn/' + encodeURIComponent(SameusernameValue);
        console.log('fetch URL:', url);

        fetch(url)
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Server returned non-OK:', res.status, text);
                throw new Error('Server error: ' + res.status);
            }
            return res.json();
        })
        .then(json => {
            const payload = json && (json.data ?? json);
            const rows = Array.isArray(payload) ? payload : (payload ? [payload] : []);
            console.log('search-by-username rows:', rows);
            loadHTMLTable(rows);
        })
        .catch(err => {
            console.error('search by username failed:', err);
            alert('Error' + err.message);
        });
    });

    // ...existing code inside DOMContentLoaded...
    if (searchRegisteredTodayBtn) searchRegisteredTodayBtn.addEventListener('click', () => {
        console.log('search-registered-today clicked');
        const url = 'http://localhost:5050/searchregisteredtoday';
        fetch(url)
        .then(async (res) => {
            if (!res.ok) {
                const text = await res.text();
                console.error('Server returned non-OK:', res.status, text);
                throw new Error('Server error: ' + res.status);
            }
            return res.json();
        })
        .then(json => {
            const payload = json && (json.data ?? json);
            const rows = Array.isArray(payload) ? payload : (payload ? [payload] : []);
            console.log('search-by-registered-today rows:', rows);
            loadHTMLTable(rows);
        })
        .catch(err => {
            console.error('search registered today failed:', err);
            alert('Error:' + err.message);
        });
    });

    if (searchNeverSignedBtn) searchNeverSignedBtn.addEventListener('click', () => {
        console.log('search never signed clicked');
        fetch('http://localhost:5050/searchneversigned')
        .then(async res => {
            console.log('status', res.status);
            if (!res.ok) {
                const txt = await res.text();
                console.error('server error:', res.status, txt);
                throw new Error('Server returned ' + res.status);
            }
            return res.json();
        })
        .then(json => {
            const payload = json && (json.data ?? json);
            const rows = Array.isArray(payload) ? payload : (payload ? [payload] : []);
            console.log('search-by-never-signed rows:', rows);
            loadHTMLTable(rows);
        })
        .catch(err => {
            console.error('search never signed failed:', err);
            alert('Error:' + err.message);
        });
    });
    // ...existing code inside DOMContentLoaded...
});


// when the delete button is clicked, since it is not part of the DOM tree, we need to do it differently
document.querySelector('table tbody').addEventListener('click', 
      function(event){
        if(event.target.className === "delete-row-btn"){

            deleteRowById(event.target.dataset.id);   
            rowToDelete = event.target.parentNode.parentNode.rowIndex;    
            debug("delete which one:");
            debug(rowToDelete);
        }   
        if(event.target.className === "edit-row-btn"){
            showEditRowInterface(event.target.dataset.id); // display the edit row interface
        }
      }
);

function deleteRowById(id){
    // debug(id);
    fetch('http://localhost:5050/delete/' + id,
       { 
        method: 'DELETE'
       }
    )
    .then(response => response.json())
    .then(
         data => {
             if(data.success){
                document.getElementById("table").deleteRow(rowToDelete);
                // location.reload();
             }
         }
    );
}

let idToUpdate = 0;

//function showEditRowInterface(id){
   // debug("id clicked: ");
   // debug(id);
   // document.querySelector('#update-name-input').value = ""; // clear this field
    //const updateSetction = document.querySelector("#update-row");  
  //  updateSetction.hidden = false;
    // we assign the id to the update button as its id attribute value
  //  idToUpdate = id;
  //  debug("id set!");
  //  debug(idToUpdate+"");
    //}


// this function is used for debugging only, and should be deleted afterwards
function debug(data)
{
    fetch('http://localhost:5050/debug', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({debug: data})
    })
}

// Replace insertRowIntoTable and loadHTMLTable and remove unsafe listener

// safe delegated listener: only attach if tbody exists
const maybeTbody = document.querySelector('table tbody');
if (maybeTbody) {
  maybeTbody.addEventListener('click', function(event){
    if(event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id);
        rowToDelete = event.target.parentNode.parentNode.rowIndex;
        debug("delete which one:");
        debug(rowToDelete);
    }
    if(event.target.className === "edit-row-btn"){
        showEditRowInterface(event.target.dataset.id);
    }
  });
} else {
  console.warn('table tbody not found - click listener not attached (safe)');
}

function insertRowIntoTable(data){
   debug("index.js: insertRowIntoTable called: ");
   debug(data);

   const table = document.querySelector('table tbody');
   debug(table);

   const isTableData = table.querySelector('.no-data');

   let tableHtml = "<tr>";

   // pick id-like and username-like fields safely
   const idValue = data.id ?? data.userid ?? data.userId ?? data.username;
   for(const key in data){
      if(Object.prototype.hasOwnProperty.call(data, key)){
            let value = data[key];
            if(key === 'dateAdded' || key === 'date_added' || key === 'registerday' ){
                value = new Date(value).toLocaleString();
            }
            tableHtml += `<td>${value}</td>`;
      }
   }

   //tableHtml += `<td><button class="delete-row-btn" data-id="${idValue}">Delete</button></td>`;
   //tableHtml += `<td><button class="edit-row-btn" data-id="${idValue}">Edit</button></td>`;
   //tableHtml += "</tr>";

    if(isTableData){
       debug("case 1");
       table.innerHTML = tableHtml;
    }
    else {
        debug("case 2");
        const newrow = table.insertRow();
        newrow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data){
    console.log('loadHTMLTable called. raw data:', data);

    // ensure a table tbody exists; if not, create a table#table and tbody
    let tableEl = document.getElementById('table') || document.querySelector('table');
    let tbody = tableEl ? tableEl.querySelector('tbody') : null;
    if (!tbody) {
        console.warn('table tbody not found - creating table/tbody dynamically');
        if (!tableEl) {
            tableEl = document.createElement('table');
            tableEl.id = 'table';
            document.querySelector('main')?.appendChild(tableEl);
        }
        tbody = document.createElement('tbody');
        tableEl.appendChild(tbody);
    }

    if (!Array.isArray(data) || data.length === 0) {
        console.log('loadHTMLTable: no rows to render');
        tbody.innerHTML = "<tr><td class='no-data' colspan='8'>No Data</td></tr>";
        return;
    }

    console.log('loadHTMLTable: rendering', data.length, 'rows');
    let tableHtml = "";
    data.forEach(function (row){
         const id = row.id ?? row.userid ?? row.userId ?? '';
         const username = row.username ?? row.name ?? '';
         const firstname = row.firstname ?? row.first_name ?? '';
         const lastname = row.lastname ?? row.last_name ?? '';
         const salary = row.salary ?? '';
         const age = row.age ?? '';
         const dateAdded = row.date_added ?? row.dateAdded ?? row.registerday ?? '';
            const signintime = row.signintime ?? row.signin_time ?? ''; 
         tableHtml += "<tr>";
         tableHtml +=`<td>${id}</td>`;
         tableHtml +=`<td>${username}</td>`;
         tableHtml +=`<td>${firstname}</td>`;
         tableHtml +=`<td>${lastname}</td>`;
         tableHtml +=`<td>${salary}</td>`;
         tableHtml +=`<td>${age}</td>`;
         tableHtml +=`<td>${dateAdded ? new Date(dateAdded).toLocaleString() : ''}</td>`;
         tableHtml +=`<td>${signintime}</td>`;
         tableHtml += "</tr>";
    });

    tbody.innerHTML = tableHtml;
}

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) loginBtn.addEventListener('click', () => {
        // use the login form inputs from index.html
        const usernameInput = document.querySelector('#login-username-input');
        const passwordInput = document.querySelector('#login-password-input');
         const username = usernameInput ? usernameInput.value.trim() : '';
         const password = passwordInput ? passwordInput.value : '';
         console.log('login clicked, user=', username);
 
         if (!username || !password) {
             alert('Username and password required');
             return;
         }
 
         fetch('http://localhost:5050/login', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ username, password })
         })
         .then(async res => {
             const text = await res.text();
             try { return JSON.parse(text); }
             catch (e) { throw new Error('Invalid JSON from server: ' + text); }
         })
         .then(json => {
             if (!json.success) throw new Error(json.error || 'Login failed');
             alert('Successfully，signintime updated');
             return fetch('http://localhost:5050/getAll').then(r => r.json()).then(d => loadHTMLTable(d.data ?? d));
         })
         .catch(err => {
             console.error('login failed:', err);
             alert('  Error  ：' + err.message);
         });
     });
