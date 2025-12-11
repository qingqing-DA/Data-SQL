// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

// create
app.post('/insert', (request, response) => {
    console.log("app: insert a row.");
    // console.log(request.body); 

    const {username, password, firstname, lastname, salary, age} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.insertNewUser(username, password, firstname, lastname, salary, age);
 
    // note that result is a promise
    result 
    .then(data => response.json({data: data})) // return the newly added row to frontend, which will show it
   // .then(data => console.log({data: data})) // debug first before return by response
   .catch(err => console.log(err));
});




// read 
app.get('/getAll', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.getAllData(); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});


app.get('/search/:username', async (request, response) => {
    const { username } = request.params;
    if (!username) return response.status(400).json({ error: 'username required' });

    const db = dbService.getDbServiceInstance();
    try {
        const data = await db.searchByUsername(username);
        return response.json({ data });
    } catch (err) {
        console.error('/search error:', err);
        return response.status(500).json({ error: err.message || 'Internal server error' });
    }
});

app.get('/searchuserid/:userid', (request, response) => { // we can debug by URL
    
    const {userid} = request.params;
    console.log(userid);

    const db = dbService.getDbServiceInstance();        
    const result =  db.searchByuserId(userid); // call a DB function
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));    
});

app.get('/searchuserage/:min/:max', async (request, response) => {
    const { min, max } = request.params;
    const minNum = parseInt(min, 10);
    const maxNum = parseInt(max, 10);
    if (isNaN(minNum) || isNaN(maxNum)) return response.status(400).json({ error: 'min and max must be numbers' });

    const db = dbService.getDbServiceInstance();
    try {
        const data = await db.searchByAge(minNum, maxNum);
        return response.json({ data });
    } catch (err) {
        console.error('/searchuserage error:', err);
        return response.status(500).json({ error: err.message || 'Internal server error' });
    }
});

app.get('/searchusersalary/:min/:max', async (request, response) => {
    const { min, max } = request.params;
    const minNum = parseInt(min, 10);
    const maxNum = parseInt(max, 10);
    if (isNaN(minNum) || isNaN(maxNum)) return response.status(400).json({ error: 'min and max must be numbers' });

    const db = dbService.getDbServiceInstance();
    try {
        const data = await db.searchBySalary(minNum, maxNum);
        return response.json({ data });
    } catch (err) {
        console.error('/searchusersalary error:', err);
        return response.status(500).json({ error: err.message || 'Internal server error' });
    }
});

app.get('/searchAfterusername/:username', (request, response) => { // we can debug by URL
    
    const {username} = request.params;
    console.log(username);

    const db = dbService.getDbServiceInstance();        
    const result =  db.searchByuserAfter(username); // call a DB function
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));    
});

app.get('/searchafterjohn/:username', async (request, response) => {
    const { username } = request.params;
    if (!username) return response.status(400).json({ error: 'username required' });

    const db = dbService.getDbServiceInstance();
    try {
        const data = await db.searchRegisteredAfter(username);
        return response.json({ data });
    } catch (err) {
        console.error('/searchafterjohn error:', err);
        return response.status(500).json({ error: err.message || 'Internal server error' });
    }
});

app.get('/searchsamejohn/:username', async (request, response) => {
    const { username } = request.params;
    if (!username) return response.status(400).json({ error: 'username required' });

    const db = dbService.getDbServiceInstance();
    try {
        const data = await db.searchRegisteredSame(username);
        return response.json({ data });
    } catch (err) {
        console.error('/searchafterjohn error:', err);
        return response.status(500).json({ error: err.message || 'Internal server error' });
    }
});

app.get('/searchregisteredtoday', async (request, response) => {
    const db = dbService.getDbServiceInstance();
    try {
        const data = await db.searchRegisteredToday();
        return response.json({ data });
    } catch (err) {
        console.error('/searchregisteredtoday error:', err);
        return response.status(500).json({ error: err.message || 'Internal server error' });
    }
});

app.get('/searchneversigned', async (request, response) => {
    const db = dbService.getDbServiceInstance();
    try {
        const data = await db.searchNeverSigned();
        return response.json({ data });
    } catch (err) {
        console.error('/searchneversigned error:', err);
        return response.status(500).json({ error: err.message || 'Internal server error' });
    }
});

// update
app.patch('/update', 
     (request, response) => {
          console.log("app: update is called");
          //console.log(request.body);
          const{id, name} = request.body;
          console.log(id);
          console.log(name);
          const db = dbService.getDbServiceInstance();

          const result = db.updateNameById(id, name);

          result.then(data => response.json({success: true}))
          .catch(err => console.log(err)); 

     }
);

// delete service
app.delete('/delete/:id', 
     (request, response) => {     
        const {id} = request.params;
        console.log("delete");
        console.log(id);
        const db = dbService.getDbServiceInstance();

        const result = db.deleteRowById(id);

        result.then(data => response.json({success: true}))
        .catch(err => console.log(err));
     }
)   

// debug function, will be deleted later
app.post('/debug', (request, response) => {
    // console.log(request.body); 

    const {debug} = request.body;
    console.log(debug);

    return response.json({success: true});
});   

// debug function: use http://localhost:5050/testdb to try a DB function
// should be deleted finally
app.get('/testdb', (request, response) => {
    
    const db = dbService.getDbServiceInstance();

    
    const result =  db.deleteById("14"); // call a DB function here, change it to the one you want

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.post('/login', async (request, response) => {
    try {
        const { username, password } = request.body;
        if (!username || !password) return response.status(400).json({ error: 'username and password required' });

        const db = dbService.getDbServiceInstance();
        // get user by username
        const rows = await db.searchByUsername(username);
        const user = Array.isArray(rows) && rows.length ? rows[0] : null;
        if (!user) return response.status(401).json({ success: false, error: 'Invalid credentials' });

        // naive password check (replace with hashed compare in production)
        if (user.password !== password) return response.status(401).json({ success: false, error: 'Invalid credentials' });

        // update signintime and return updated user
        const updatedUser = await db.setSignInTimeByUsername(username);
        return response.json({ success: true, data: updatedUser });
    } catch (err) {
        console.error('/login error:', err);
        return response.status(500).json({ success: false, error: err.message || 'Internal server error' });
    }
});

// set up the web server listener
// if we use .env to configure
/*
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
*/

// if we configure here directly
app.listen(5050, 
    () => {
        console.log("I am listening on the fixed port 5050.")
    }
)