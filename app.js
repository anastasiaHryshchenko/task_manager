var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),    
    User           = require("./models/user");

//requiring routes
var taskRoutes    = require("./routes/tasks"),
    projectRoutes = require("./routes/projects"),
    authRoutes       = require("./routes/auth");
    
var url = "mongodb://nastyona:a22i22m06@ds347467.mlab.com:47467/task_manager";

//var url =  "mongodb://localhost:27017/task_manager";
mongoose.connect(url, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("partials"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I love my world!!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", authRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/tasks", taskRoutes);

// ========================

app.listen(process.env.PORT, function() {
    console.log("The Server Has Started!");
});