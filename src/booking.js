'use strict';

/*!
 * Booking.js
 * Version: 1.0.0
 * http://booking.timekit.io
 *
 * Copyright 2015 Timekit, Inc.
 * Timekit Booking.js is freely distributable under the MIT license.
 *
 */

// JS dependencies
var utils = require('./utils');
var timekit = require('timekit-js-sdk');
var fullcalendar = require('fullcalendar');
var moment = require('moment');
var $ = require('jquery');

// CSS dependencies
require('../node_modules/fullcalendar/dist/fullcalendar.css');
require('./fullcalendar-theme.css');
require('./booking.css');

function TimekitBooking() {

  var TB = {};
  var calendarTarget = '';

  // Default config and constants
  var config = {
    targetEl: '#timekit-booking',
    email: '',
    apiToken: '',
    calendar: '',
    name: '',
    avatar: '',
    timekitConfig: {
      app: 'sign-up'
    },
    findTime: {
      filters: {
        'and': [
          { 'business_hours': {'timezone': 'America/Los_angeles'}},
          { 'exclude_weekend': {'timezone': 'America/Los_angeles'}}
        ],
        'or': [
          { 'specific_day_and_time': {'day': 'Monday', 'start': 10, 'end': 12, 'timezone': 'America/Los_angeles'}},
          { 'specific_day_and_time': {'day': 'Monday', 'start': 16, 'end': 17, 'timezone': 'America/Los_angeles'}},
          { 'specific_day_and_time': {'day': 'Tuesday', 'start': 15, 'end': 18, 'timezone': 'America/Los_angeles'}},
          { 'specific_day_and_time': {'day': 'Tuesday', 'start': 11, 'end': 12, 'timezone': 'America/Los_angeles'}},
          { 'specific_day_and_time': {'day': 'Wednesday', 'start': 15, 'end': 18, 'timezone': 'America/Los_angeles'}},
          { 'specific_day_and_time': {'day': 'Thursday', 'start': 10, 'end': 12, 'timezone': 'America/Los_angeles'}},
          { 'specific_day_and_time': {'day': 'Friday', 'start': 10, 'end': 11, 'timezone': 'America/Los_angeles'}}
        ]
      },
      future: '3 weeks',
      duration: '1 hour'
    },
    createEvent: {
      invite: true
    },
    fullCalendar: {
      header: {
        left: 'today',
        center: '',
        right: 'prev, next'
      },
      views: {
        basic: {
          columnFormat: 'dddd M/D',
          timeFormat: 'h:mm a'
        },
        agenda: {
          timeFormat: 'h:mm a'
        }
      },
      allDaySlot: false,
      scrollTime: '08:00:00',
      //minTime: '08:00:00',
      //maxTime: '19:00:00',
      timezone: 'local',
      defaultDate: '2015-10-25'
    },
    localization: {
      showTimezoneHelper: true,
      dateFormat: 'D. MMMM YYYY',
      timeFormat: 'h:mm a'
    }
  };

  // Setup the Timekit SDK with correct credentials
  var timekitSetup = function() {
    var args = {};

    $.extend(args, config.timekitConfig);

    timekit.configure(args);

    timekit.setUser(
      config.email,
      config.apiToken
    );
  };

  // Fetch availabile time through Timekit SDK
  var timekitFindTime = function(callback) {
    var args = { emails: [config.email] };

    $.extend(args, config.findTime);

    timekit.findTime(args)
    .then(function(response){
      callback(response);
    }).catch(function(response){
      utils.log('An error with FindTime occured');
      utils.log(response);
    });
  };

  // Calculate and display timezone helper
  var renderTimezoneHelper = function() {
    var localTzOffset = (new Date()).getTimezoneOffset()/60*-1;
    var localTzFormatted = (localTzOffset > 0 ? "+" : "") + localTzOffset;
    el = $(
      '<div class="timekit-booking-timezonehelper">' +
        '<span>Showing timeslots in your timezone (UTC ' + localTzFormatted + ')</span>' +
      '</div>'
    );
    $(config.targetEl).append(el);
  };

  // Setup and render FullCalendar
  var initializeCalendar = function() {

    var defaultView = 'agendaWeek';
    var height = 600;
    var deviceWidth = $(window).width();

    if (deviceWidth < 480) {
      defaultView = 'basicDay';
      height = 530; //1132
    }

    var args = {
      defaultView: defaultView,
      height: height,
      eventClick: clickCalendarTimeslot
    };

    $.extend(args, config.fullCalendar);

    calendarTarget = $('<div class="timekit-booking-calendar">');
    $(config.targetEl).append(calendarTarget);
    calendarTarget.fullCalendar(args);
  };

  // Render the supplied calendar events in FullCalendar
  var renderCalendarEvents = function(eventData) {
    calendarTarget.fullCalendar( 'addEventSource', {
      events: eventData
    });
  };

  var renderBookingPage = function() {

  };

  var showBookingPage = function() {

  };

  var hideBookingPage = function() {

  };

  // Event handler when a timeslot is clicked in FullCalendar
  var clickCalendarTimeslot = function(calEvent, jsEvent, view) {
    // $('#bookmeform_start').val(moment(calEvent.start).format());
    // $('#bookmeform_end').val(moment(calEvent.end).format());
    // $('#chosendate').text(moment(calEvent.start).format('D. MMMM YYYY'));
    // $('#chosentime').text(moment(calEvent.start).format('h:mm a') + ' to ' + moment(calEvent.end).format('h:mm a'));
    // $('.bookme_create').show().css('opacity','1');
    showBookingPage();
  };

  var submitBookingForm = function() {

  };

  // Create new event through Timekit SDK
  var timekitCreateEvent = function(data, callback) {
    var args = {
      start: data.start,
      end: data.end,
      what: config.name + ' x '+ data.name,
      where: data.where,
      calendar_id: config.calendar,
      participants: [
        data.email,
        config.email
      ]
    };

    $.extend(args, config.createEvent);

    timekit.createEvent(args)
    .then(function(response){
      callback(response);
    }).catch(function(response){
      utils.log('An error with CreateEvent occured');
      utils.log(response);
    });
  };

  // Render the booking completed page when booking was successful
  var renderBookingCompleted = function() {
    // $('#bookmeform_block .w-form-done').show();
    // $('#bookmeform_block .w-form-fail').hide();
    // $('#bookmeform').hide();
  };

  // Exposed initilization method
  TB.init = function(suppliedConfig) {

    // Check whether a config is supplied
    if(suppliedConfig == undefined || typeof suppliedConfig !== 'object') {
      utils.log('No configuration was supplied. Please supply a config object upon library initialization');
      return;
    }

    // Extend the default config with supplied settings
    $.extend(config, suppliedConfig);

    // Initialize FullCalendar
    initializeCalendar();

    // Setup Timekit SDK config
    timekitSetup();

    // Get availability through Timekit SDK
    timekitFindTime(function(response){
      // Render available timeslots in FullCalendar
      renderCalendarEvents(response.data);
    });

    // Show timezone helper if enabled
    if (config.localization.showTimezoneHelper) {
      renderTimezoneHelper();
    }

  };

  return TB;

};

module.exports = new TimekitBooking();