import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
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

Router.route('Projects', function () {
  this.render('Projects');
});

Router.route('resume', function () {
  this.render('resume');
});

