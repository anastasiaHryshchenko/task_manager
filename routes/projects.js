var express     = require("express");
var router     = express.Router();
var Project  = require("../models/project");
var middleware   = require("../middleware");
     
// ========================
// Projects ROUTE
// ========================

//INDEX - show all Projects
router.get("/", function(req, res) {
    Project.find({}, function(err, allProjects) {
        if(err){
            console.log(err);
        }else{
            res.render("projects/index", {projects: allProjects});
        }
    });
});

// CREATE - add new Project to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;    
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newProject = {name: name, image: image, description: desc, author: author};
    Project.create(newProject, function(err, newlyCreated) {
        if(err){
            console.log(err);
        }else{
            res.redirect("/projects");
        }
    });
});

//NEW - show form to create new Project
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("projects/new");
});

//SHOW - shows more info about one Project
router.get("/:id", function(req, res) {
    Project.findById(req.params.id).populate("tasks").exec(function(err, foundProject) {
        if(err){
            console.log(err);
        }else{
            res.render("projects/show", {project: foundProject}); 
        }
    });
});

//EDIT Project ROUTE
router.get("/:id/edit", middleware.checkProjectOwnership, function(req, res) {
    Project.findById(req.params.id, function(err, foundProject) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("projects/edit", {project: foundProject});
        }
    });
});

//UPDATE Project ROUTE
router.put("/:id", middleware.checkProjectOwnership, function(req, res) {
    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedProject) {
        if (err) {
            console.log(err);
            res.redirect("/projects");
        } else {
            res.redirect("/projects/" + req.params.id);
        }
    });
});

//DESTROY Project ROUTE
router.delete("/:id", middleware.checkProjectOwnership, function(req, res) {
    Project.findByIdAndRemove(req.params.id, function(err) {
        if(err){
            res.redirect("/projects");
        }else{
            res.redirect("/projects");
        }
    });
});


module.exports = router;