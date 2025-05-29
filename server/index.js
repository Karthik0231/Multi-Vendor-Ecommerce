const express=require("express")
const app=express();
app.use(express.json())
const cors=require('cors')
const path = require('path');

const connectToMongo=require("./DB.js")
connectToMongo()

app.use(cors())

const port=9000;
app.listen(port,()=>{
    console.log("................................")
    console.log("Server is running on port,"+port)
})

app.use("/customer", require("./routes/CustomerRoute"));
app.use("/uploads/customer", express.static("./uploads/customer"));

app.use("/admin", require("./routes/AdminRoute"));
app.use("/uploads/admin", express.static("./uploads/admin"));

app.use("/vendor", require("./routes/VendorRoute")); // Note the leading slash
app.use("/uploads/vendor", express.static("./uploads/vendor"));

// Add this line to serve product images
app.use("/uploads/products", express.static(path.join(__dirname, "uploads/products")));