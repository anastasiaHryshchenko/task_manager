var express     = require("express");
var router     = express.Router({mergeParams: true});
var  Project  = require("../models/project"),
     Task     = require("../models/task");
var middleware   = require("../middleware");
// ========================
// TASKS ROUTE
// ========================

//tasks new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Project.findById(req.params.id, function(err, project) {
        if(err){
            console.log(err);
        } else {
            res.render("tasks/new", {project: project});
        }
    });
});

//create tasks
router.post("/", middleware.isLoggedIn, function(req, res) {
    Project.findById(req.params.id, function(err, project) {
        if (err) {
            console.log(err);
            res.redirect("/projects");
        } else {
            Task.create(req.body.task, function(err, task) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    task.author.id = req.user._id;
                    task.author.username = req.user.username;
                    task.save();
                    project.tasks.push(task);
                    project.save();
                    req.flash("success", "Successfully added task!");
                    res.redirect("/projects/" + project._id);
                }
            });
        }
    });
});

//EDIT TASK
router.get("/:task_id/edit", middleware.checkTaskOwnership, function(req, res) {
    Task.findById(req.params.task_id, function(err, foundTask) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("tasks/edit", {project_id: req.params.id, task: foundTask});
        }
    });
});

//UPDATE TASK
router.put("/:task_id", middleware.checkTaskOwnership, function(req, res) {
   Task.findByIdAndUpdate(req.params.task_id, req.body.task, function(err, updatedTask) {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/projects/" + req.params.id);
       }
   });
});

//DESTROY TASK ROUTE
router.delete("/:task_id", middleware.checkTaskOwnership, function(req, res) {
    Task.findByIdAndRemove(req.params.task_id, function(err) {
        if(err){
            req.flash("error", "Task doesn't remove, something wrong!");
            res.redirect("back");
        }else{
            req.flash("success", "Task deleted!");
            res.redirect("/projects/" + req.params.id);
        }
    });
});

module.exports = router;