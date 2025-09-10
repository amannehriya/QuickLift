const express  = require('express');
const app = express();
const dotenv  = require('dotenv');
dotenv.config();
const port  = process.env.PORT || 3000;
const userRoutes = require('./routes/user-routes');
const captainRoute = require('./routes/captain-routes');
const connectToDb = require('./config/mongoose-connection');
const cookieParser = require('cookie-parser');


connectToDb()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.send("jai shree ganesh")
})
app.use('/user',userRoutes)
app.use('/captain',captainRoute)

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
})