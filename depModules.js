var distModules = [
  'ui.router',
  'ngResource',
  'oc.lazyLoad',
  'highcharts-ng',
  'ui.bootstrap'

];
var modules = [
];

var depModules = angular.module('depModules',distModules.concat(modules));
var baseUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
