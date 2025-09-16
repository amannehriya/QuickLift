const express  = require('express');
const app = express();
const dotenv  = require('dotenv');
dotenv.config();

const port  = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);

const { initializeSocket } = require('./socket');
const userRoutes = require('./routes/user-routes');
const mapRoutes = require('./routes/maps-routes')
const captainRoute = require('./routes/captain-routes');
const  rideRoutes = require('./routes/ride-routes');
const connectToDb = require('./config/mongoose-connection');
const cookieParser = require('cookie-parser');
const cors = require('cors');

initializeSocket(server);
connectToDb()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.send("jai shree ganesh")
})
app.use('/user',userRoutes)
app.use('/captain',captainRoute)
app.use('/maps',mapRoutes)
app.use('/ride',rideRoutes)


server.listen(port,()=>{
    console.log(`server is listening on port ${port}`)
})