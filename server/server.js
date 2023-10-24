// importing all the needed models
const UsersModel = require("./models/users");
const Product = require("./models/products");
const Admin = require("./models/admin");
const Booking = require("./models/bookings");
const Cancellation = require("./models/cancellations");
const DeclinedCancellation = require("./models/declinedcancellations");

// express 
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
require("./db/connection");
const twilio = require("twilio");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// db connection success
app.get("/", (req, res) => {
  res.send("Success..!");
});


// multer disk storage for storing vehicles images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// uploading the vehicle image to the storage
const upload = multer({ storage });

app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, priceId } = req.body;
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    const product = new Product({
      name,
      description,
      price,
      priceId,
      image: image.filename,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// user registration
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, phone, state, pincode, country } =
      req.body;

    const existingUser = await UsersModel.findOne({ phone });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    const user = new UsersModel({
      username,
      email,
      password,
      phone,
      state,
      pincode,
      country,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// fetch all users to the admin panel
app.get("/users", async (req, res) => {
  try {
    const users = await UsersModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// user deletion accoriding to the phone number
app.delete("/users/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;

    const deletedUser = await UsersModel.findOneAndRemove({ phone: phone });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await Booking.deleteMany({ userName: deletedUser.username });

    res.json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// sending otp to the phone
app.post("/sendOTP", async (req, res) => {
  const accountSid = "ACe3e8a0c5012984c57f28389d766dc89d";
  const authToken = "aaf04779563a61e1aab0e4acf9d07abf";
  const client = twilio(accountSid, authToken);
  const { phoneNumber } = req.body;

  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const formattedPhoneNumber = `+91${phoneNumber}`;
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: "+18083536054",
      to: formattedPhoneNumber,
    });

    res.json({ success: true, otp });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, error: "Failed to send OTP" });
  }
});


// user login to the user-dashboard
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UsersModel.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  if (password === user.password) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});


// admin login
app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin by username in the database
    const admin = await Admin.findOne({ username });

    // If admin is not found, return an error
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await (password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Create a JSON Web Token (JWT) for the admin
    

    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// fetching the admin details
app.get('/admin-details/:admin', async (req, res) => {
  try {
    const adminName = req.params.admin;
    
    // Use the adminName to fetch the admin details from the database
    const adminDetails = await Admin.findOne({ username: adminName },);
    // Exclude the 'password' field from the response for security reasons

    if (adminDetails) {
      res.json(adminDetails);
      console.log(adminDetails);
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// editing admin profile
app.put('/admin-details/:adminname', async (req, res) => {
  const adminName = req.params.adminname;

  try {
    // Find the admin by username and update the fields you want to change
    const updatedAdmin = await Admin.findOneAndUpdate(
      { username: adminName },
      {
        username: req.body.username,
        password: req.body.password,
        // Add other fields here
      },
      { new: true } // This option returns the updated admin object
    );

    if (!updatedAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    // Get the admin's username from the request (you may need to change how it's sent in the request)
    const adminUsername = req.body.username;

    // Find the admin by username and update the image field
    const admin = await Admin.findOne({ username: adminUsername });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Update the admin's image URL
    admin.image = imageUrl;

    // Save the updated admin document
    await admin.save();

    return res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Image upload failed' });
  }
});



// adding new product to the database
app.post("/products", async (req, res) => {
  try {
    const { name, description, price, image, priceId, quantity } = req.body;
    const product = new Product({
      name,
      description,
      price,
      image,
      quantity,
      priceId,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// fetch all items to the admin-panel
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// fetching all the available items to the user-dashboard
app.get("/products-user", async (req, res) => {
  try {
    const products = await Product.find({ quantity: { $gt: 0 } });
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// updating a single item in the database
app.delete("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    await Product.findByIdAndRemove(productId);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// fetchig the selected product details to the checkout page
app.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// updating a product in the database 
app.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, priceId, quantity } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(productId, {
      name,
      description,
      price,
      priceId,
      quantity,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



//  stripe auth key
const stripe = require("stripe")("sk_test_51O1DHFSENxkdHNp7UIpMFr6JFZF1OVYrY60cdGCby6oe2DZeJKEjEEmz0YzzNALoLXrKKEdUuGhsY2Z7M3wiH1cj00iivjlrVM");
// variable for storing the session id
let storedSessionId;
// creating stripe payments
app.post("/create-checkout-session", async (req, res) => {
  const { product, priceId, quantity } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/Success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/checkout",
    });
    storedSessionId = session.id;
    console.log("Stored Session ID:", storedSessionId);
    res.json({ url: session.url, session_id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Session creation failed" });
  }
});

// cancelling an order in the stripe
app.delete("/delete-booking/:bookingId", async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid ObjectID" });
    }
    const deletedBooking = await Booking.findByIdAndRemove(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// fetching payment intent id from the session
app.get("/get-payment-intent/:session_id", async (req, res) => {
  const sessionId = req.params.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntentId = session.payment_intent;
    res.json({ paymentIntentId: paymentIntentId });
  } catch (error) {
    console.error("Error fetching Payment Intent ID:", error);
    res.status(500).json({ error: "Payment Intent retrieval failed" });
  }
});

//  adding new bookings to the database and updating the quantity of th eproduct
app.post("/new-booking", async (req, res) => {
  const {
    productId,
    productName,
    price,
    userName,
    shippingAddress,
    paymentIntentId,
  } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.quantity > 0) {
      product.quantity--;
      await product.save();
      const booking = new Booking({
        productId,
        productName,
        price,
        userName,
        shippingAddress,
        paymentIntentId,
        
      });
      await booking.save();
      res.status(201).json({ message: "Product booked and quantity updated" });
    } else {
      res.status(400).json({ error: "Product is out of stock" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// fetching all the booking in the database to the admin-panel
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching booking data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// fetching all the booking made by the logged in user
app.get("/cart/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const bookings = await Booking.find({ userName: username });
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
  
});











// cancelling the stripe order
app.post("/cancel-booking/:paymentIntentId", async (req, res) => {
  const paymentIntentId = req.params.paymentIntentId;
  try {
    // Find the booking with the given paymentIntentId
    const booking = await Booking.findOne({ paymentIntentId: paymentIntentId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Fetch the productId from the booking
    const productId = booking.productId;

    // Find the corresponding product in the Product table by its `_id`
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increment the quantity of the product
    const updatedQuantity = parseInt(product.quantity) + 1;

    // Update the quantity in the Product table
    await Product.findOneAndUpdate(
      { _id: productId },
      { quantity: updatedQuantity }
    );

    // Create a refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    if (refund.status === "succeeded") {
      // Update the booking status to "canceled"
      await Booking.findOneAndUpdate(
        { paymentIntentId: paymentIntentId },
        { status: "canceled" }
      );

      // Delete the booking entry
      await Booking.findOneAndDelete({ paymentIntentId: paymentIntentId });

      // Delete the cancellation entry
      await Cancellation.findOneAndDelete({
        paymentIntentId: paymentIntentId,
      });

      return res
        .status(200)
        .json({ message: "Order canceled and refunded successfully" });
    } else {
      return res.status(500).json({ error: "Refund failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});










// sending reuest to the admin to cancel the order
app.post("/cancellation-requests", async (req, res) => {
  try {
    const { paymentIntentId, price, userName } = req.body;
    const existingCancellation = await Cancellation.findOne({ paymentIntentId });
    if (existingCancellation) {
      return res.status(400).json({ message: "Cancellation request already exists for this paymentIntentId" });
    }
    const booking = await Booking.findOne({ paymentIntentId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const cancellationRequest = new Cancellation({
      paymentIntentId: paymentIntentId,
      price: price,
      userName: userName,
    });
    const savedCancellation = await cancellationRequest.save();
    res.json({
      success: true,
      message: "Cancellation request saved successfully",
      data: savedCancellation,
    });
    console.log("data:", savedCancellation);
  } catch (error) {
    console.error("Error saving cancellation request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// fetching all the cancellation request
app.get("/cancellation-requests", async (req, res) => {
  try {
    const cancellationRequests = await Cancellation.find();
    res.json(cancellationRequests);
  } catch (error) {
    console.error("Error fetching cancellation requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//  adding declined cancellation to the database
app.post("/decline-cancellation", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const declinedCancellation = new DeclinedCancellation({
      paymentIntentId,
    });
    const savedDeclinedCancellation = await declinedCancellation.save();
    await Cancellation.findOneAndDelete({ paymentIntentId: paymentIntentId });
    res.json({
      success: true,
      message: "Cancellation request declined and saved to declined cancellations",
      data: savedDeclinedCancellation,  
    });
  } catch (error) {
    console.error("Error declining cancellation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// listen port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
