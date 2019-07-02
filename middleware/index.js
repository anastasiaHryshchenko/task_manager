var  Project  = require("../models/project"),
     Task     = require("../models/task");

var middlewareObj = {};

middlewareObj.checkProjectOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Project.findById(req.params.id, function(err, foundProject) {
            if(err){
                req.flash("error", "Project not found");
                console.log(err);
                res.redirect("back");
            }else{
                //does user own the Project?
                if(foundProject.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkTaskOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        Task.findById(req.params.task_id, function(err, foundTask) {
            if(err){
                req.flash("error", "Task not found");
                console.log(err);
                res.redirect("back");
            }else{
                //does user own the task?
                if(foundTask.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
   if(req.isAuthenticated()){
       return next();
   }
   req.flash("error", "You need to be logged in to do that");
   res.redirect("/login");
};

module.exports = middlewareObj;