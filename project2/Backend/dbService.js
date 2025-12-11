// database services, accessbile by DbService methods.

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 


// if you use .env to configure
console.log("HOST: " + process.env.HOST);
console.log("DB USER: " + process.env.DB_USER);
console.log("PASSWORD: " + process.env.PASSWORD);
console.log("DATABASE: " + process.env.DATABASE);
console.log("DB PORT: " + process.env.DB_PORT);

const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.DB_USER,        
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});


// if you configure directly in this file, there is a security issue, but it will work
/*
const connection = mysql.createConnection({
     host:"localhost",
     user:"root",        
     password:"",
     database:"web_app",
     port:3306
});
*/


connection.connect((err) => {
     if(err){
        console.log(err.message);
     }
     console.log('db ' + connection.state);    // to see if the DB is connected or not
});

// the following are database functions, 

class DbService{
    static getDbServiceInstance(){ // only one instance is sufficient
        if (!instance) instance = new DbService();
        return instance;
    }

   /*
     This code defines an asynchronous function getAllData using the async/await syntax. 
     The purpose of this function is to retrieve all data from a database table named 
     "names" using a SQL query.

     Let's break down the code step by step:
         - async getAllData() {: This line declares an asynchronous function named getAllData.

         - try {: The try block is used to wrap the code that might throw an exception 
            If any errors occur within the try block, they can be caught and handled in 
            the catch block.

         - const response = await new Promise((resolve, reject) => { ... });: 
            This line uses the await keyword to pause the execution of the function 
            until the Promise is resolved. Inside the await, there is a new Promise 
            being created that represents the asynchronous operation of querying the 
            database. resolve is called when the database query is successful, 
            and it passes the query results. reject is called if there is an error 
            during the query, and it passes an Error object with an error message.

         - The connection.query method is used to execute the SQL query on the database.

         - return response;: If the database query is successful, the function returns 
           the response, which contains the results of the query.

        - catch (error) {: The catch block is executed if an error occurs anywhere in 
           the try block. It logs the error to the console.

        - console.log(error);: This line logs the error to the console.   
    }: Closes the catch block.

    In summary, this function performs an asynchronous database query using await and a 
   Promise to fetch all data from the "names" table. If the query is successful, 
   it returns the results; otherwise, it catches and logs any errors that occur 
   during the process. It's important to note that the await keyword is used here 
   to work with the asynchronous nature of the connection.query method, allowing 
   the function to pause until the query is completed.
   */
    async getAllData(){
        try{
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
              {
                  const query = "SELECT * FROM users;";
                  connection.query(query, 
                       (err, results) => {
                             if(err) reject(new Error(err.message));
                             else resolve(results);
                       }
                  );
               }
            );
        
            // console.log("dbServices.js: search result:");
            // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
           console.log(error);
        }
   }


   async insertNewUser(username, password, firstname, lastname, salary, age){
         try{
            const now = new Date();
            // registerday and signintime set to current timestamp (adjust formatting if your schema expects DATE/TIME)
            const registerday = now;
            const signintime = now;

            const insertId = await new Promise((resolve, reject) => {
               const query = "INSERT INTO users (username, password, firstname, lastname, salary, age, registerday) VALUES (?, ?, ?, ?, ?, ?, ?);";
               const params = [username, password, firstname, lastname, salary, age, registerday, signintime];
               console.log('DB INSERT:', query, params);
               connection.query(query, params, (err, result) => {
                   if(err) {
                       console.error('insertNewUser SQL error:', err);
                       return reject(new Error(err.message));
                   }
                   resolve(result.insertId);
               });
            });

            console.log('Inserted id:', insertId);
            return {
                 userid: insertId,
                 username,
                 firstname,
                 lastname,
                 salary,
                 age,
                 dateAdded: now
            };
         } catch(error){
               console.error('insertNewUser caught:', error);
               throw error;
         }
   }




   async searchByuserName(username){
        try{
             const dateAdded = new Date();
             // use await to call an asynchronous function
             const response = await new Promise((resolve, reject) => 
                  {
                     const query = "SELECT * FROM users where username = ?;";
                     connection.query(query, [username], (err, results) => {
                         if(err) reject(new Error(err.message));
                         else resolve(results);
                     });
                  }
             );

             // console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
   }

   async searchByuserId(userid){
        try{
            const idNum = parseInt(userid, 10);
            // try search by userid column first, then fallback to id column if numeric
            const response = await new Promise((resolve, reject) => {
                const q1 = "SELECT * FROM users WHERE userid = ?;";
                console.log('searchByuserId: query', q1, 'params', [userid]);
                connection.query(q1, [userid], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    if (results && results.length > 0) {
                        return resolve(results);
                    }
                    // fallback to id column when userid returned nothing and input is numeric
                    if (!isNaN(idNum)) {
                        const q2 = "SELECT * FROM users WHERE id = ?;";
                        console.log('searchByuserId: fallback query', q2, 'params', [idNum]);
                        connection.query(q2, [idNum], (err2, results2) => {
                            if (err2) return reject(new Error(err2.message));
                            return resolve(results2 || []);
                        });
                    } else {
                        return resolve([]); // no matches
                    }
                });
            });

            console.log('searchByuserId: param=', userid, 'rows=', (response && response.length) || 0);
            return response;
        } catch(error){
            console.error('searchByuserId error:', error);
            throw error;
        }
   }

   async searchByuserage(userMinage, userMaxage){
        try{
            const min = Number(userMinage);
            const max = Number(userMaxage);
            if (isNaN(min) || isNaN(max)) return [];

            const response = await new Promise((resolve, reject) => {
                const q = "SELECT * FROM users WHERE age BETWEEN ? AND ?;";
                console.log('searchByuserage: query', q, 'params', [min, max]);
                connection.query(q, [min, max], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });

            console.log('searchByuserage: param=', userMinage, userMaxage, 'rows=', (response && response.length) || 0);
            return response;
        } catch(error){
            console.error('searchByuserage error:', error);
            throw error;
        }
   }

   async searchByuserSalary(userMinsalary, userMaxsalary){
        try{
            const min = Number(userMinsalary);
            const max = Number(userMaxsalary);
            if (isNaN(min) || isNaN(max)) return [];

            const response = await new Promise((resolve, reject) => {
                const q = "SELECT * FROM users WHERE salary BETWEEN ? AND ?;";
                console.log('searchByuserSalary: query', q, 'params', [min, max]);
                connection.query(q, [min, max], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });

            console.log('searchByuserSalary: params=', userMinsalary, userMaxsalary, 'rows=', (response && response.length) || 0);
            return response;
        } catch(error){
            console.error('searchByuserSalary error:', error);
            throw error;
        }
   }

   async deleteRowById(id){
         try{
              id = parseInt(id, 10);
              // use await to call an asynchronous function
              const response = await new Promise((resolve, reject) => 
                  {
                     const query = "DELETE FROM users WHERE id = ?;";
                     connection.query(query, [id], (err, result) => {
                          if(err) reject(new Error(err.message));
                          else resolve(result.affectedRows);
                     });
                  }
               );

               console.log(response);  // for debugging to see the result of select
               return response === 1? true: false;

         }  catch(error){
              console.log(error);
         }
   }

  
  async updateNameById(id, newName){
      try{
           console.log("dbService: ");
           console.log(id);
           console.log(newName);
           id = parseInt(id, 10);
           // use await to call an asynchronous function
           const response = await new Promise((resolve, reject) => 
               {
                  const query = "UPDATE users SET username = ? WHERE id = ?;";
                  connection.query(query, [newName, id], (err, result) => {
                       if(err) reject(new Error(err.message));
                       else resolve(result.affectedRows);
                  });
               }
            );

            // console.log(response);  // for debugging to see the result of select
            return response === 1? true: false;
      }  catch(error){
         console.log(error);
      }
  }

  async searchByUsername(username){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE username = ?;";
                console.log('searchByUsername: query', query, 'params', [username]);
                connection.query(query, [username], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });
            console.log('searchByUsername: rows=', (response && response.length) || 0);
            return response;
        } catch (error) {
            console.error('searchByUsername error:', error);
            throw error;
        }
    }

    async searchByAge(minAge, maxAge){
        try{
            const rows = await new Promise((resolve, reject) => {
                const q = "SELECT * FROM users WHERE age BETWEEN ? AND ?;";
                console.log('searchByAge query', q, 'params', [minAge, maxAge]);
                connection.query(q, [minAge, maxAge], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });
            console.log('searchByAge rows=', (rows && rows.length) || 0);
            return rows;
        } catch (error) {
            console.error('searchByAge error:', error);
            throw error;
        }
    }

    async searchBySalary(minSalary, maxSalary){
        try{
            const rows = await new Promise((resolve, reject) => {
                const q = "SELECT * FROM users WHERE salary BETWEEN ? AND ?;";
                console.log('searchBySalary query', q, 'params', [minSalary, maxSalary]);
                connection.query(q, [minSalary, maxSalary], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });
            console.log('searchBySalary rows=', (rows && rows.length) || 0);
            return rows;
        } catch (error) {
            console.error('searchBySalary error:', error);
            throw error;
        }
    }

    async searchByUserAfter(username){
        try{
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE registerday > (SELECT registerday FROM users WHERE firstname = 'John' LIMIT 1);";
                console.log('searchByUserAfter: query', query, 'params', [username]);
                connection.query(query, [username], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });
            console.log('searchByUsername: rows=', (response && response.length) || 0);
            return response;
        } catch (error) {
            console.error('searchByUsername error:', error);
            throw error;
        }
    }

    async searchRegisteredAfter(username){
        try{
            // use username to find the registerday (take the earliest match)
            const refDate = await new Promise((resolve, reject) => {
                const q = "SELECT registerday FROM users WHERE username = ? ORDER BY registerday ASC LIMIT 1;";
                console.log('searchRegisteredAfter - find ref date:', q, [username]);
                connection.query(q, [username], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    if (!results || results.length === 0) return resolve(null);
                    resolve(results[0].registerday);
                });
            });

            if (!refDate) {
                console.log('searchRegisteredAfter: no reference date found for', username);
                return [];
            }

            // find users registered after that date
            const rows = await new Promise((resolve, reject) => {
                const q = "SELECT * FROM users WHERE registerday > ? ORDER BY registerday ASC;";
                console.log('searchRegisteredAfter - query users after:', q, [refDate]);
                connection.query(q, [refDate], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });

            console.log('searchRegisteredAfter: found rows=', (rows && rows.length) || 0);
            return rows;
        } catch (error){
            console.error('searchRegisteredAfter error:', error);
            throw error;
        }
    }

    async searchRegisteredSame(username){
        try{
            // use username to find the registerday (take the earliest match)
            const refDate = await new Promise((resolve, reject) => {
                const q = "SELECT registerday FROM users WHERE username = ? ORDER BY registerday ASC LIMIT 1;";
                console.log('searchRegisteredSame - find ref date:', q, [username]);
                connection.query(q, [username], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    if (!results || results.length === 0) return resolve(null);
                    resolve(results[0].registerday);
                });
            });

            if (!refDate) {
                console.log('searchRegisteredSame: no reference date found for', username);
                return [];
            }

            // find users registered on that date
            const rows = await new Promise((resolve, reject) => {
                const q = "SELECT * FROM users WHERE registerday = ? ORDER BY registerday ASC;";
                console.log('searchRegisteredSame - query users with same date:', q, [refDate]);
                connection.query(q, [refDate], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });

            console.log('searchRegisteredSame: found rows=', (rows && rows.length) || 0);
            return rows;
        } catch (error){
            console.error('searchRegisteredSame error:', error);
            throw error;
        }
    }

    async searchRegisteredToday(){
        try{
            const rows = await new Promise((resolve, reject) => {
                const q = "SELECT * FROM users WHERE DATE(registerday) = CURDATE();";
                console.log('searchRegisteredToday query', q);
                connection.query(q, (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });
            console.log('searchRegisteredToday rows=', (rows && rows.length) || 0);
            return rows;
        } catch (error){
            console.error('searchRegisteredToday error:', error);
            throw error;
        }
    }

    async searchNeverSigned(){
        try{
            const rows = await new Promise((resolve, reject) => {
                const q = "SELECT * FROM users WHERE signintime IS NULL;";
                console.log('searchNeverSigned query', q);
                connection.query(q, (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results || []);
                });
            });
            console.log('searchNeverSigned rows=', (rows && rows.length) || 0);
            return rows;
        } catch (error){
            console.error('searchNeverSigned error:', error);
            throw error;
        }
    }

    async setSignInTimeByUsername(username){
        try{
            // set signintime to current timestamp then return the updated row
            await new Promise((resolve, reject) => {
                const q = "UPDATE users SET signintime = NOW() WHERE username = ?;";
                console.log('setSignInTimeByUsername query', q, 'params', [username]);
                connection.query(q, [username], (err, result) => {
                    if (err) return reject(new Error(err.message));
                    resolve(result);
                });
            });

            const updated = await new Promise((resolve, reject) => {
                const q2 = "UPDATE users SET signintime = NOW() WHERE username = ?";
                connection.query(q2, [username], (err, results) => {
                    if (err) return reject(new Error(err.message));
                    resolve(results && results[0] ? results[0] : null);
                });
            });

            return updated;
        } catch(error){
            console.error('setSignInTimeByUsername error:', error);
            throw error;
        }
    }
}

module.exports = DbService;