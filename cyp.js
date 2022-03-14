
var quiz = {
  currentStep: 1,
  totalSteps: 1,
  steps: null,
  level: null,
  currentTheme: 0,
  themes: [],
  init: function() {
    quiz.totalSteps = $('.cyp-container').length;
    quiz.steps = $('.cyp-container');
    var step1 = $(quiz.steps[quiz.totalSteps-quiz.currentStep]);
    step1.addClass('animate__zoomIn');
    step1.css('opacity',100);
    step1[0].addEventListener('animationend', function(){
      step1.removeClass('animate__zoomIn');
    });
    $('.js-percent').resize(function(){
      var percentFull = Math.round((parseInt($('.js-percent').css('width'))/parseInt($('.js-percent-bar').css('width')))*100);
      $('.js-percent-number').text(percentFull+"%");
      if (percentFull == 100) {
        $('.js-percent-bar').hide();
        $('.js-configure-btn').show();
      }
    });
    $('.back').on('click', function(){
      quiz.previous();
    });
    $('.js-option').on('click', function(){
    	$(this).parent().find('.js-option').removeClass('active');
      $(this).addClass('active');
      quiz.next();
    });
    $('.js-select-level').on('click', function(){
    	quiz.level = $(this).data('skill-level');
    });
    
    $('.js-love-btn').on('click', function(){
			var themeImg = quiz.getCurrentTheme();
      quiz.themes.push(themeImg.data('theme'));
      themeImg.addClass('animate__rollOut');
      quiz.nextTheme();
    });
    $('.js-nope-btn').on('click', function(){
      quiz.getCurrentTheme().addClass("animate__fadeOut");
      quiz.nextTheme();
    });
  },
  getCurrentTheme: function(){
    return $($('.js-select-theme')[quiz.currentTheme]);
  },
  nextTheme: function() {
    var theme = quiz.getCurrentTheme();
    theme[0].addEventListener('animationend', function(){
      if (quiz.currentTheme == $('.js-select-theme').length) {
        quiz.next();
      }
    });
    quiz.currentTheme++;
    theme = quiz.getCurrentTheme();
    theme.addClass("animate__delayQuick animate__fadeIn");
    theme[0].addEventListener('animationend', function(){
      $(this).removeClass('animate__delayQuick');
    });
  },
  next: function(){
    var currentStep = quiz.getCurrentStep();
    currentStep.addClass('animate__fadeOutLeft');
    currentStep[0].addEventListener('animationend', function(){
      $(this).removeClass('');
    });
    quiz.currentStep++;
    currentStep = quiz.getCurrentStep();
    currentStep.removeClass('animate__fadeInRight animate__fadeOutRight');
    currentStep.addClass('animate__fadeInRight animate__delayQuick');
    currentStep[0].addEventListener('animationend', function(){
      $(this).removeClass('animate__delayQuick');
    });
    quiz.setProgressBar();
    $('html,body').scrollTop(0);
    $('#step').text(quiz.currentStep);
    quiz.checkStep();
    if (quiz.currentStep != 1) {
      $('.back').fadeIn();
    }
  },
  getCurrentStep: function(){
    return $(quiz.steps[quiz.totalSteps-quiz.currentStep]);
  },
  previous: function(){
    var currentStep = quiz.getCurrentStep();
    currentStep.addClass('animate__fadeOutRight');
    quiz.currentStep--;
    currentStep = quiz.getCurrentStep();
    currentStep.removeClass('animate__fadeOutLeft animate__fadeInRight');
    currentStep.addClass('animate__fadeInLeft animate__delayQuick');
    currentStep[0].addEventListener('animationend', function(){
      $(this).removeClass('animate__delayQuick');
    });
    quiz.setProgressBar();
    $('html,body').scrollTop(0);
    $('#step').text(quiz.currentStep);
    quiz.checkStep();
    
    if (quiz.currentStep == 1) {
      $('.back').fadeOut();
    }
    
  },
  checkStep: function(){
    var currentStep = quiz.getCurrentStep();
    if (currentStep.data('configure-plan')) {
      quiz.configurePlan();
    }
    if (currentStep.data('pick-themes')) {
      quiz.pickThemes();
    }
    $('.js-cyp-title').text(currentStep.data('title'));

    $('.cyp-container').css('z-index',9);
    currentStep.css('z-index', 10);
  },
  pickThemes: function(){
  	var themes = $('.js-select-theme');
    quiz.currentTheme = 0;
    $(themes[quiz.currentTheme]).fadeIn();
    quiz.themes = [];
  },
  configurePlan: function(){
    setTimeout(function(){
      quiz.configurePlanProgress(0,70,43);
    },1500);
  },
  configurePlanProgress: function(start,end,interval){
    var intervalId = setInterval(function(){
        start++;
        if (start == end){
          clearInterval(intervalId);
          if (end == 70) {
            setTimeout(function(){
              quiz.configurePlanProgress(70,98,80);
            },300);  
          }
          if (end == 98) {
            setTimeout(function(){
              quiz.configurePlanProgress(98,100,300);
            },80);  
          }
          if (end == 100){
            setTimeout(function(){
              quiz.finishPlanProgress();
            },300);
          }
        }
        quiz.setConfigurePlanProgress(start);
      },interval);
  },
  setConfigurePlanProgress: function(progress){
    $('.js-percent').css({"width":progress+"%"});
    $('.js-percent-number').text(progress+"%");
  },
  setProgressBar: function(){
    $('.cyp-progress').css('width',Math.round(((quiz.currentStep-1)*1.0/quiz.totalSteps)*100) + "%");
  },
  finishPlanProgress: function(){
    $('.js-configure-plan-container').hide();
    $('.js-configure-plan-btn').fadeIn();
  }
};

$(function(){
 $(window).bind("pageshow", function(event) {
   if (event.originalEvent.persisted) {
     $('#loading').hide();
   }
 });
 $('#loading').hide();
 quiz.init();
 $('.js-btn-cyp').on('click', function(){
   $('#loading').css('display','flex');
   var variant_id = $(this).data('shopifyVariantId');
   var unit = $(this).data('unit');
   var frequency = $(this).data('frequency');
   $.ajax({
     url: 'https://app.completingthepuzzle.com/checkout/create?shopify_variant_id='+variant_id+'&level='+quiz.level+'&themes='+quiz.themes.join(',')+'&unit='+unit+'&frequency='+frequency,
     success: function(result){
       var str = "";
       try {
         str = "&" + ga.getAll()[0].get('linkerParam');
       } catch(e){
       }
       window.location = result.redirect_url + str;
       
     },
     error: function(e){
       alert('an unknown error occured, please try again. If the problem persists please email us at support@completingthepuzzle.com. We want to fix this!');
       $('#loading').hide();
     }
   });
 });
});

