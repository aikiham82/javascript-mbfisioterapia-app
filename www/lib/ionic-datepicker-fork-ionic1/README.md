[![bitHound Score](https://www.bithound.io/github/rajeshwarpatlolla/ionic-datepicker/badges/score.svg)](https://www.bithound.io/github/rajeshwarpatlolla/ionic-datepicker)

##Introduction:

This is an Ionic date picker, but also week and month picker, as a bower component, which can be used in any Ionic framework's application. No additional plugins required for this component.
This plugin is completely open source. 

OSAMES' fork intends to add some features, supporting ionic v1 for now.
Indeed, the original author wasn't interested by our addition of week and month picking.

Hence the bower package name `ionic-datepicker-fork-ionic1`.
But the angular module name remains `ionic-datepicker`.

OSAMES forked from version 1.2.1, starting with first release as version 1.3.0.


##Remark
For ionic v2, this component is under development by the original author. 
You can check it [here](https://github.com/rajeshwarpatlolla/ionic2-datepicker)

##Prerequisites.

* node.js, npm
* ionic
* bower
* gulp

##How to use:

1) In your project folder, please install this plugin using bower

`bower install ionic-datepicker-fork-ionic1 --save`

This will install the latest version of this plugin. If you wish to install any specific version(eg : 1.3.0) then

`bower install ionic-datepicker-fork-ionic1#1.3.0 --save`

2) Specify the path of  `ionic-datepicker.bundle.min.js` in your `index.html` file.

````html
<!-- path to ionic -->
<script src="lib/ionic-datepicker-fork-ionic1/dist/ionic-datepicker.bundle.min.js"></script>
````

3) In your application's main module, inject the dependency `ionic-datepicker`, in order to work with this plugin
````javascript
angular.module('mainModuleName', ['ionic', 'ionic-datepicker']){
//
}
````

4) You can configure this date picker at application level in the config method using the `ionicDatePicker` provider.
Your config method may look like this if you wish to setup the configuration. But this is not mandatory step.

````javascript
.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: [],
      selectMode: 'day'
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })
````
In the above code I am not configuring all the properties, but you can configure as many properties as you can.

The properties you can configure are as follows.

**a) inputDate**(Optional) : This is the date object we can pass to the component. You can give any date object to this property. Default value is `new Date()`.

**b) titleLabel**(Optional) : Optional title for the popup or modal. If omitted or set to `null`, title will default to currently selected day in format `MMM dd, yyyy`

**c) setLabel**(Optional) : The label for `Set` button. Default value is `Set`

**d) todayLabel**(Optional) : The label for `Today` button. Default value is `Today`

**e) closeLabel**(Optional) : The label for `Close` button. Default value is `Close`

**f) mondayFirst**(Optional) : Set `true` if you wish to show monday as the first day. Default value is `false`, which will show Sunday as the first day of the week.

**g) weeksList**(Optional) : This is an array with a list of all week days. You can use this if you want to show months in some other language or format or if you wish to use the modal instead of the popup for this component, you can define the `weekDaysList` array in your controller as shown below.
````javascript
  ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];
````
 The default values are
````javascript
  ["S", "M", "T", "W", "T", "F", "S"];
````

**h) monthsList**(Optional) : This is an array with a list of all months. You can use this if you want to show months in some other language or format. You can create an array like below.
````javascript
  ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
````
 The default values are
````javascript
  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
````

**i) disabledDates**(Optional) : If you have a list of dates to disable, you can create an array like below. Default value is an empty array.
````javascript
  var disabledDates = [
      new Date(1437719836326),
      new Date(),
      new Date(2016, 7, 10), //Months are 0-based, this is August, 10th.
      new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
      new Date("08-14-2016"), //Short format
      new Date(1439676000000) //UNIX format
  ];
````

**j) templateType**(Optional) : This is string type which takes two values i.e. `modal` or `popup`. Default value is `modal`. If you wish to open in a popup, you can specify the value as `popup` or else you can ignore it.

**k) from**(Optional) : This is a date object, from which you wish to enable the dates. You can use this property to disable **previous dates** by specifying `from: new Date()`. By default all the dates are enabled. Please note that months are 0 based.

**l) to**(Optional) : This is a date object, to which you wish to enable the dates. You can use this property to disable **future dates** by specifying `to: new Date()`. By default all the dates are enabled. Please note that months are 0 based.

**m) dateFormat**(Optional) : This is date format used in template. Defaults to `dd-MM-yyyy`. For how to format date, see: http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15

**n) showTodayButton**(Optional) : Boolean to specify whether to show the `Today` button or not. The default values is `false`.

**o) closeOnSelect**(Optional) : Boolean to indicate whether date picker popup/modal will be closed after selection. If set to `true`, `Set` button will be hidden. The default value is `false`.

**p) disableWeekdays**(Optional) : Accepts array of numbers starting from 0(Sunday) to 6(Saturday). If you specify any values for this array, then it will disable that week day in the whole calendar. For example if you pass [0,6], then all the Sundays and Saturdays will be disabled.

**q) selectMode**(Optional): This is a string type which takes three values i.e. `day`, `week` or `month`. Default value is `day`. 
If you wish the whole week to be selected rather than the day, and the first day of week to be the datepicker's value, set it to `week`.
If you wish the whole month to be selected rather than the day, and the first day of month to be the datepicker's value, set it to `month`.
Note: in `week` or `month` mode, the callback doesn't get the same return value from date picker.

5) Inject `ionicDatePicker` in the controller, where you wish to use this component. Then using the below method you can call the datepicker.

````javascript
.controller('HomeCtrl', function ($scope, ionicDatePicker) {

    var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        // Note: when selectMode is 'week' or 'month', the returned object has "start" and "end" keys with the start and end times.
      },
      disabledDates: [            //Optional
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ],
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup',      //Optional
      selectMode: 'day'           //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };
};
````

Apart from the config method, you can re configure all options in the controller also. If you again set any of the properties, they will be overridden by the values mentioned in the controller. This will be useful if there are multiple date pickers in the app, which has different properties.

In all the above steps the only mandatory thing is the `callback` where you will get the selected date value or period start and end values.


##Screen Shots:

Once you are successfully done with the above steps, you should be able to use this plugin.

The first screen shot shows the popup and the second shows the modal of this plugin.

### iOS :
<img src="https://lh3.googleusercontent.com/F9gGrtafX2G6sIO2Fi62R_SVPBb0dRACiksw-4wNX7lcIbuI40AAodBbko72VMZ8YD5ecg5sCXi6soWWgWuVMtuwd21nRlU8dnkPHR3P8Xw-OZ19Ryt3VBNItI7UP7acA1SJZQPpp-wzPBRaYh-CAAExJ0TCgMT_05h7_OzWS5gTjxk81jqzGL0uE_L0SLq0u57orjzgBWIm1PfcKmczNIU_Dhgqp01yWEP-6ytgJOrKVrr9OXlfrBKm_urdF6W8qg1RrkH_IRDS0hv3sRi2co1doLUMDxZyAO5JUYnRf4WVTttffFdNMSq1LFVldMdwjU7PRWft-_I9lLHX5IvOyYiOhYu9vvkJE29MF3GMW7rYZMf11qABKL8lYWPCJ4GZfG0NJI6u2n52tXd9ZVUl1s_p2H2CnWdlnaSyrfevQDRfO0ej2C6-NceeMAwX16m24GzMnD5xgO7hk6XMG0rZuBNfGvFextvIzOyj6L8W4VRXzaUYlUelM84zDSU5Av8jXHVr-4A8ymqJZniQlYpDsUHIHbFddemlIuIxh4kTSQA0iifTwJ_pGTFESyzrAIGiGQS8=w382-h678-no" width="320" height="568" />
<img src="https://lh3.googleusercontent.com/qFdG5Gvj0hh_a4C1P-oLO1Ju4qjjGRtyFq27rP1khClavBfVD0LtGfpEqi82xTLR_XHH-8Dj8xOAWv4NMAI5FuG-8Gs13IhcEJC6EObRq82oUSqjzHoV59x335FFKFtXKI8a10NXLtkHBr2MdVa2mb0ktdIjsxis1Y4UNoaEQUnjPX7khdHhdqJZm-R6GyIMixOdFLyOUMPUYdGntZBm87J77BfnFuIz7-t3UF6vHgVZPi0buRbWSUQpFutDGIs6S4YF0hHL8dMefbRG9NhArqn-JMMJKOCWAKpojJmOjPbq9G5O1IQi-nIsfSnogX9vn5xjhozkywf3f4wxQ-0CN4MorldgF-PDEXmfWpFS4XFfBuDkUrtI9Q7MVtTJXLUK1fO01_1ljOUitTnrTPeooOT3Xh7bRcJPPoSsg-QwzeUYCnI6a1IW3bWgxWTM3Ijrn2zBJcxup-SS5-SBBEREhIhZrv30gfN6Z5OkzXInN8a6TQL5EgeC73G0o-sUjSpxOuYwfDKggK__8esm2JZocajDZaQVrpFFZ-Mz0ts10HeNeeCTYBSTwU5vKkHp_O3raUHo=w382-h678-no" width="320" height="568" />

### Android :
<img src="https://lh3.googleusercontent.com/iMB88WThVW9om9EwFTaXprMWCXjbm9dm5A9aGjC497seWtX37rjzxynRrnVRYgXN9ORy5gjzhKilgdlt-eB53cXIAovFgqicuJ4UXn-HkLNZflkenUM6_k-sbK-GkNCzCfB1rd3wD5m0zgJ5dhJ3CniDUNKygQbo5f4W7JldSz93nVzdOb3OLqgcmZFeSY-FeWdovQi6zYttUPOaem5_47vF2ikt-ZW6H5UL0FI4WGcJSeAdu7wNsdoE5KY_oQfBTpsbl24eUrTxYPXhoNpcUNxRXjGnF31tDWD-jTEOJZZ9lqTnEK3OZ0g4Rci5jeq_wDmOfT0A11HXICbyL9asAPvB6TNrcOWj_qGUIrJtPeiaRDDgk8GYM2gVBY23xiOW3K5lERIfn6HTSNsZCbQciV0oFBROL3wHNuNGA-3mot_jP9ZJgyHz7f0VrWg5fytot3nDB2Gp4bMWsjXk-VOWoCP3lHc75vOvhOZb1ybemB95JI0RiYCdJMaytjzFWPsS5i3J1yEk0FS4PMyH1HEhYPPB48Et9ullJodL9nxDLvpTxJYzf8yqwC_V-pic-WHNgm9f=w382-h678-no" width="360" height="640" />
<img src="https://lh3.googleusercontent.com/GzTwRh3IHzF9UieGIJTbQwTIosA101q32OSXEcgDFj7GdG7vHvs9Vj5DpWLj0HOny-zqM6zNRdqAkWlgZv_CnpqLEZNX9EP86xFkknkdtFczd6_63XmlsPgbCiArWAqtVpzjZuhfxPujbm_b52hfyAEBBvNOTrd7VcHmVsZYiwoqVggRYyaOxvEobVxTOF7eB0iXiNIBSnOIFcwla8y9nDFJp2ilgBiMCuI7gEuVW95axHlouFOhyOBILG1u-tO28oLXvqxBnWbZDjjciaKJtB8xBZLH5TsIxyH477dMjTr6SYaykZA1tBHHFlgM9AwrWsnCmaPyP1hNIanCEeuemy9Stt5_2Y5u3el7AwUqGQ7C2ZSYs9nJ0ezHhfTJnF7bpONNWVhHE3G6XpuwKOStUdTli70_mWV8Hx_Ennwdh5FrnjLTnltUve4VCtv3sWNxBxN9_rcwymLneeWIB8X1y8E_ulzxQcMG6YJ3Cf-1WrMRTOR-3SQBgm4R0MQjSau1hgYie6u35dIb0h2FirT540xs4EvUWzT8w4Pv6r9Cze5EsgSHAK54F1In8SG8VtBUCQj4=w382-h678-no" width="360" height="640" />


### Week selection :
<img src="screenshots/week_selection_modal.png" width="576" height="286">
<img src="screenshots/week_selection_popup.png" width="253" height="368">

### Month selection :
<img src="screenshots/month_selection_modal.png" width="576" height="286">
<img src="screenshots/month_selection_popup.png" width="253" height="367">

##CSS Classes:

###popup
<img src="https://lh3.googleusercontent.com/O4DlaheQZM_s-xC85sF-AJIGmSpNFRuZFEtNClCimRDRnrk3zGEfumJrn9J75jtS5A53PMi5FiinH-S-D7nMwe4XdHbwPnWvGGuECdMA5aUPt5vB1_wMVa9kDZhf7BHJ3rxGORqIhKk5LcyOMuMj5dN5tB80KPgJ4YjQvk3P4EI8HMpP9FRhTBCfDqQzxNbl9qLFaos89YJzuwL6w30-GIFYhuHzO8I7s-kR5NZ5ocbVuhCGWqlnkcGJUUApOvll5410RBQmIUIdJg2goxDZatITYiBSpuzPFgSST1LqphZwpjnxcNYqvHNqScqyGWvLLqbpeQ5_a6JrtOSo0EtTrfh7C_lDIcg_RA9gatAo5_4WfJiTZw6tHVAXItUvr8aBIokjVebn6XXP6PUWOp1oj30_PgQ-XGe56mE2RSAYfiEWIefHixJrqwg3IEQ60JFeHUxnwWY-rptVew6s3SF2m81p1_Z3A1x-cuZrUmwHPLcDV2s7mxTQxyt7QeEWXbAd4foznBvpBeIH1n2iuAvFUG16QrMptpwxigkPi1R8kmhCWDRqMox14ZWe7-5IJuMFlAab=w382-h678-no" width="360" height="640" />

#### 1) prev_btn_section
#### 2) next_btn_section
#### 3) select_section
#### 4) month_select
#### 5) year_select
#### 6) calendar_grid
#### 7) weeks_row
#### 8) selected_date
#### 9) date_col
#### 10) today

###modal
<img src="https://lh3.googleusercontent.com/tbNgGKK0QtKxVBfRr8NlYhQy6iSKDtagbDispAMNoE8a72Eyq102Bn2qnX5mQmmgxZGho5xWK0fx6ZoG0lPKYiG-pGzzhBE8NLeGH8lCu1tTVrk8FiyRaOmyycBRJft1gURavyCA0nLFd_tFrHdmVyxOXD7IIy2mncc7tnMQIIDXTH99Rb1Hkd0GOF9-UvCLMjEld361VDZsmZUamJ79dlv_u4gyPmBMfG9Q6vmh2uOVai_mfKQ8M6mKRDzq9venYp-UEU-S9LVy3VI4kaftHYlNsSggVd0b1q2PWpCMjGEMGmdYY5XXcGYvumefmZypjBCmas_M_86IU9aZYU07Z9DKnIl1NBQNpFSAv_T0Z-urto5I-y6o6gz3BYn8jh_u5_YEgeva5iyOJIqJwg1cynjlmGoampRt2ajyGQb93GZkLjB1C7J-ERFZWgeXaXbHPmVVLGWFI7nH40QohHMQbAGB1JwmsbVP8qe1OnzlNXrEdy6jdphCP3rBqFSigkd1JMbejwcQcCfoP9xFFSPh0n6cUqBTukY7y0RskLVddwiNQLFbtRL_hebCQLqmUwsETUY9=w382-h678-no" width="360" height="640" />

#### 1) left_arrow
#### 2) right_arrow

Other classes are same as the popup classes. You can use any one of the below classes to customise popup and modal css respectively.  
####ionic_datepicker_popup
####ionic_datepicker_modal

The css class names for the buttons are as follows

a) For `Set` button the class name is `button_set`

b) For `Today` button the class name is `button_today`

c) For `Close` button the class name is `button_close`

##Versions:

### 1) v1.3.0, v1.3.1
First releases of fork: added ability to select a week or month in addition to select a day.

[Issue#1](https://github.com/OSAMES/ionic-datepicker/issues/1)
[Issue#2](https://github.com/OSAMES/ionic-datepicker/issues/2)

### 2) v1.4.0
[Issue#4](https://github.com/OSAMES/ionic-datepicker/issues/4)
[Issue#5](https://github.com/OSAMES/ionic-datepicker/issues/5)

### 3) v1.5.0
Synchronization with original project's master as of 27-03-2017.
Since some bug fixes were added that conflicted with my changes, work again on issues #4 and #5 as
[Issue#6](https://github.com/OSAMES/ionic-datepicker/issues/6)

### 4) v1.5.1
Swapped "Set" and "Close" buttons position, from user suggestion.

### 5) v1.6.0
Fixed correct limitation of pickable day with any "from"/"to" dates configuration.
A big thank you to Faustino Gagneten for requesting this implementation because most of the feature was unimplemented.
[Issue#7](https://github.com/OSAMES/ionic-datepicker/issues/7)

##License:
[MIT](https://github.com/OSAMES/ionic-datepicker/blob/master/LICENSE.MD "MIT")

##Contact (fork author):
https://github.com/OSAMES/ionic-datepicker

##Contact (original author):
Github : https://github.com/rajeshwarpatlolla
