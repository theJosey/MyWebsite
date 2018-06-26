import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

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

Router.route('resume', function () {
  this.render('resume');
});

// Template.fileList.helpers({
//   files: function () {
//     return Files.find();
//   }
// });