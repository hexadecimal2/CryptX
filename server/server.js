const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({origin : 'http://localhost:3000', credentials : true}))


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password : 'Thisisapassword1',
    database : 'usersdb',
    port : 3306
}).promise();


const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.clearCookie('token');
        return res.status(403).send({ Response: 'Access denied, no token provided.' });
        
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.clearCookie('token');
            return res.status(403).send({ Response: 'Invalid token.' });
        }
        req.Name = decoded.Name; // Attach user information to the request object
        next(); // Call the next middleware or route handler
    });
};



app.post('/api/signup', async (req, res) => {


 //validate the signup

 const userInfo =  req.body;

 //email check
 const check = await pool.query(`SELECT Email FROM userdata WHERE Email = '${userInfo.Email}'`)


 //error checking
 if (userInfo.Name === '' || userInfo.Email === '' || userInfo.Password === '' ){
    return res.status(403).send({Message : 'Please fill in all the fields!'});
  } 
 if (!String(userInfo.Email).includes('@gmail.com')){
    return res.status(403).send({Message : 'Invalid Email!'})
  }
 
  if (check[0].length > 0){
      return res.status(403).send({Message : 'Already registered!'});
  }
  
 if (String(userInfo.Password).length < 8 || ! /[A-Z]/.test(userInfo.Password) || ! /[0-9]/.test(userInfo.Password)){
   return res.status(403).send({Message : 'Password not valid!'}) 
 } 


 const hash = await bcrypt.hash(userInfo.Password, 10);

 pool.query(`INSERT INTO userdata (Name, Email, Password) VALUES ('${userInfo.Name}', '${userInfo.Email}', '${hash}')`)

 return res.status(201).send({Message : 'Success!'});



});

app.post('/api/login', async (req,res)  => {
   
    const userLoginData = req.body;

    const EmailCheck = await pool.query(`SELECT Password FROM userdata WHERE Email = '${userLoginData.Email}'`) 
  

    if (EmailCheck[0].length > 0) {
        
        const confirm = await bcrypt.compare(userLoginData.Password, EmailCheck[0][0].Password)
        const name = (await pool.query(`SELECT Name FROM userdata WHERE Email = '${userLoginData.Email}'`))[0][0].Name        

        console.log(name);

        if (confirm){


            const token = jwt.sign({Name : name}, process.env.JWT_SECRET, {expiresIn: '1h'})
            
            const cookieOptions = {
                httpOnly : true,
                secure: false, //change this later
                maxAge: 3600000
            };

            res.cookie('token', token, cookieOptions);
            return res.status(200).send({Response : 'Success!'}) 

        }
        else{
            
            return res.status(403).send({Response : 'Invalid Email / Password'})
        }
    
    } 
    else
    {

    return res.status(403).send({Response : 'User does not exist'});
    
}
});

app.get('/api/dashboard', verifyToken, async (req, res) => {

    const Name = req.Name;
    res.status(200).send({Response : 'Success!', Name : Name})

})

app.get('/api/getBTCprices', async (req, res) => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=180&interval=daily');
        const data = await response.json();
        
        res.status(200).send(data); // Send data to the frontend
      } catch (error) {
        console.error("Error fetching data from CoinGecko:", error);
        res.status(500).send({ error: 'Error fetching BTC prices' });
      }
});

app.listen(5000, () => {
    console.log('Server started at port 5000');
})