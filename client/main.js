import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';

$(document).ready(function() {

  $('[data-toggle="collapse"]').click(function() {
    $('#navbarColor01').toggleClass('toggle');
  });
}); 

Router.route('/', function () {
  this.render('Home');
});

Router.route('about', function () {
  this.render('about');
});

//Router.route('Projects', function () { // removed for now 
//  this.render('Projects');
//});

Router.route('resume', function () {
  this.render('resume');
});

Router.route('issues', function () {
  this.render('issues');
});


CreatedIssues = new Mongo.Collection('CreatedIssues');

if (Meteor.isClient) {
	Template.issues.helpers({
		issueslistDefault: function() {
			var allSort = false;
			var dateSort = false;
			var projectSort = "View All Projects";

			if (Session.get('sortAll')) {allSort = true;}
			if (Session.get('sortDate')) {dateSort = true;}
			if (Session.get('sortProject')) {projectSort = Session.get('sortProject');}
			// Remeber to have all multi condionals first...
			if (projectSort === "View All Projects") {
				if (allSort && dateSort) {  
					return CreatedIssues.find({}, {sort:{date:1}}); 

				} else if (allSort) { 
					return CreatedIssues.find({}, {sort:{date:-1}});

				} else if (dateSort) { 
					return CreatedIssues.find({status: {$in: ['Not Yet Started', 'In Progress']}});

				} else {
					return CreatedIssues.find({status: {$in: ['Not Yet Started', 'In Progress']}}, {sort:{date:-1}});
				}	
			} else if (projectSort === "Website") {
				if (allSort && dateSort) {  
					return CreatedIssues.find({project: {$in: ['Website']}}, {sort:{date:1}}); 

				} else if (allSort) { 
					return CreatedIssues.find({project: {$in: ['Website']}}, {sort:{date:-1}});

				} else if (dateSort) { 
					return CreatedIssues.find({project: {$in: ['Website']}, status: {$in: ['Not Yet Started', 'In Progress']}});

				} else {
					return CreatedIssues.find({project: {$in: ['Website']}, status: {$in: ['Not Yet Started', 'In Progress']}}, {sort:{date:-1}});
				}	
			} else if (projectSort === "Monopoly") {
				if (allSort && dateSort) {  
					return CreatedIssues.find({project: {$in: ['Monopoly']}}, {sort:{date:1}}); 

				} else if (allSort) { 
					return CreatedIssues.find({project: {$in: ['Monopoly']}}, {sort:{date:-1}});

				} else if (dateSort) { 
					return CreatedIssues.find({project: {$in: ['Monopoly']}, status: {$in: ['Not Yet Started', 'In Progress']}});

				} else {
					return CreatedIssues.find({project: {$in: ['Monopoly']}, status: {$in: ['Not Yet Started', 'In Progress']}}, {sort:{date:-1}});
				}	
			}
									
		}
	});

	Template.issues.events({
		'submit .new-Issue': function(event){
			var title = event.target.title.value;
			var project = event.target.project.value;
			var details = event.target.details.value;
			var status = "Not Yet Started";
			var date = new Date();
			if (title.length > 0 && project.length > 0) {
				CreatedIssues.insert({
				title: title,
				project: project,
				details: details,
				hours: 0,
				status: status,
				date: date,
				createdAt: new Date(),
			});
				event.target.title.value = "";		
				event.target.project.value = "";		
				event.target.details.value = "";
			}
	
			return false;
		},

		'change .sort-Date': function(event){
			Session.set('sortDate', event.target.checked);
		},

		'change .sort-All': function(event){
			Session.set('sortAll', event.target.checked);
		},

		'click .sort-Project': function(event){
			var selectProject = document.getElementById("sortProject");
			var selectProjectResult = selectProject.selectedIndex;
			var projectSort = selectProject.options[selectProjectResult].text;
			Session.set('sortProject', projectSort);
		},

		'click .complete': function(event){ 
			CreatedIssues.update(this._id, {$set: ({isComplete: !this.isComplete})});
			if (!this.isComplete) {
				CreatedIssues.update(this._id, {$set: ({status: "Complete"})});
			}
			if (this.isComplete && this.hours == 0) {
				CreatedIssues.update(this._id, {$set: ({status: "Not Yet Started"})});
			} else if (this.isComplete && this.hours != 0) {
				CreatedIssues.update(this._id, {$set: ({status: "In Progress"})});
			}
		},

		'click .addHours': function(event){
			if (this.hours == 0 && !this.isComplete) {
				CreatedIssues.update(this._id, {$set: ({status: "In Progress"})});
				CreatedIssues.update(this._id, {$set: ({hours: this.hours + 1})});
			} else {
				CreatedIssues.update(this._id, {$set: ({hours: this.hours + 1})});
			}	
				
		},

		'click .subtractHours': function(event){
			if (this.hours == 0) {
				alert("Cannot Have Negative Values");
			} else if (this.hours == 1 && !this.isComplete) {
				CreatedIssues.update(this._id, {$set: ({status: "Not Yet Started"})});
				CreatedIssues.update(this._id, {$set: ({hours: this.hours - 1})});
			} else {
				CreatedIssues.update(this._id, {$set: ({hours: this.hours - 1})});
			}	
		},

		'click .delete': function(){
			CreatedIssues.remove(this._id);
		}
	});

	Accounts.ui.config({
		passwordSignupFields: "USERNAME_ONLY"
	});

	Accounts.config({
	  forbidClientAccountCreation: true
	});

	Meteor.users.deny({
		update: function(){
			return true;
		}
	});
}









