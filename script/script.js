$(function () {
    let data = {
      currentAge : 0,
      retireAge : 0,
      yearsToRetirement : 0,

      yearlyExpense : 0,

      inflationRate : 0,
      interestRate : 0,
      lifespan : 0,

      projectedRetireSaving : 0,

      retireFundNeeded : 0,
      totalAsset : 0,
      requiredFunds : 0,
    }
  // Function to convert the value into Currency display with commas (solution found online)
  function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  } 
  
// Redirect the page to show-chart.html to display the bar-chart with the data keyed in
// $('#show-chart').on('click',function() {
//   window.location.href = "show-chart.html";
//   $('#shortfall').text('Linked')
// });
    
  // Calculate the [ Number Of Years to Retirement ] based on User input
  function yearToRetire(){ 
    data.retireAge = $("#retire-age").val();
    data.currentAge = $("#current-age").val();
    data.yearsToRetirement = ( parseInt(data.retireAge) - parseInt(data.currentAge) ) ;
    
    // if the result is NaN, nothing will be displayed in the text area
    if ( (Number.isNaN(data.yearsToRetirement) == true) || data.yearsToRetirement <= 0 ){ 
      $(".year-to-retire").text("__");
      if (data.yearsToRetirement < 0) {
        alert ('Retirement age must be more than Current Age')
      }
    }
    // else the value will be displayed in the text area
    else {
      $(".year-to-retire").text(data.yearsToRetirement);
    }
    retireSumRequired();
  }
  
  // Calculate the [ Yearly Expenses Required ] based on User input for monthly requirement
  function calYearlyExpense() {
    let monthlyExpense = parseInt( $("#monthly-expense").val() );
    data.yearlyExpense = monthlyExpense * 12
    if ( (data.yearlyExpense <=0) || (Number.isNaN(data.yearlyExpense)) ){
      $('#yearly-expense').text('0.00')
    }
    else {
      $('#yearly-expense').text(currencyFormat(data.yearlyExpense))
    }
    retireSumRequired();
  }

  function retireSumRequired() {
    // get the value of the various field
    data.inflationRate = parseFloat( $('#inflation-rate').val() ) / 100
    data.interestRate = parseFloat( $('#interest-rate').val() ) / 100
    data.lifespan = parseInt( $('#expect-lifespan').val() ) 

    // if either of the values are not valid, it will not perform any calculation and return '0.00' to the html 
    if( (Number.isNaN(data.inflationRate)) || (Number.isNaN(data.interestRate)) 
      || (Number.isNaN(data.lifespan)) || (Number.isNaN(data.yearsToRetirement)) 
      || (Number.isNaN(data.yearlyExpense)) || (data.yearsToRetirement <= 0) || (data.yearlyExpense < 0) ) {
      $("#retire-fund-needed").text("0.00");
      // alert ('no change')
    }
    // else perform the calculation 
    else {
      // given formulas from Excel sheets
      let yearlyExpenseFirstYear = (Math.pow ((1+data.inflationRate), data.yearsToRetirement)*data.yearlyExpense).toFixed(2)
      let Rz = (1+data.interestRate)/(1+data.inflationRate)-1
      let Rzb = 1+Rz
      let Rzn = Math.pow(Rzb,-data.lifespan)

      // check if the inflation rate and interest rate is 0 or are the same, will perform simple calculation
      if ((data.interestRate == 0 && data.inflationRate == 0) || (data.interestRate == data.inflationRate)) {
        data.retireFundNeeded = yearlyExpenseFirstYear * data.lifespan
        console.log(data)  
      }
      // else perform the calculation using the interest rate and inflation rate
      else {
        data.retireFundNeeded = (yearlyExpenseFirstYear * (1-Rzn)/Rz*Rzb)
      }
      // send the value to the html 
      $("#retire-fund-needed").text(currencyFormat(data.retireFundNeeded));
    }
    retireSaving();  
  }
  
  function retireSaving() {
    let annualIncome = $('#annual-income').val()
    if (Number.isNaN(annualIncome) || (annualIncome <=0 ) || Number.isNaN(data.interestRate) 
        || (Number.isNaN(data.yearsToRetirement)) || (data.yearsToRetirement <= 0) ){
      data.projectedRetireSaving = 0  
    }
    else {
      // if interest rate is 0, do simple calculation
      if (data.interestRate == 0) {
        data.projectedRetireSaving = annualIncome * data.yearsToRetirement
      }
      // else factor in the interest rate for the growth of the funds over xx no of years
      else {
        data.projectedRetireSaving = annualIncome * (1+data.interestRate) * (Math.pow((1+data.interestRate),data.yearsToRetirement) - 1 ) / (data.interestRate)   
      }
    }
    $("#retire-saving").text(currencyFormat(data.projectedRetireSaving));
    totalAssetValue();
  }

  function totalAssetValue () {
    let insuranceValue = 0
    let cpfValue = 0
    let otherAssets = 0
    insuranceValue = parseInt( $('#value-insurance').val() )
    cpfValue = parseInt( $('#value-cpf').val() )
    otherAssets = parseInt( $('#value-other-assets').val() )

    if (Number.isNaN(insuranceValue)){
      insuranceValue = 0
    }
    if (Number.isNaN(cpfValue)){
      cpfValue = 0
    }
    if (Number.isNaN(otherAssets)){
      otherAssets = 0
    }
    data.totalAsset = data.projectedRetireSaving + insuranceValue + cpfValue + otherAssets
    amountToRetire()
  }

  function amountToRetire () {
    let message = ''
    if ( (Number.isNaN('data.totalAsset')) || (Number.isNaN('data.retireFundNeeded')) ) {
      message = `0.00`  
    }
    else {
      data.requiredFunds = data.totalAsset - data.retireFundNeeded
      if (data.requiredFunds < 0) {
        message = `( ${currencyFormat(data.requiredFunds)} )`
      }
      else {
        message = `${currencyFormat(data.requiredFunds)}`
      }
    }
    $('#require-funds').text(message)
    localStorage.setItem ('retireFundNeeded', data.retireFundNeeded)
    localStorage.setItem ('totalAsset', data.totalAsset)
    localStorage.setItem ('requiredFunds', data.requiredFunds)
  }

  /* Detect for change in the input for current-age and retire-age and update the values accordingly
  It will trigger the function yearToRetire() to calculate the value and pass into the html */
  $("#current-age , #retire-age").on('change',function(){
    yearToRetire();
  });

  // Calculate and update text for yearly expenses in html when User enter the monthly expense 
  $("#monthly-expense").on('change',function(){
    calYearlyExpense()
  });

  // Detect for change in either of the following, will trigger the function 'retireSum()' to calculate the retirement sum
  $('#expect-lifespan, #inflation-rate, #interest-rate').on('change',function(){
    retireSumRequired()
  });    

  // Detect for change in either of the following, will trigger the function 'retireSaving()' to calculate the retirement saving amount
  $('#annual-income,  #interest-rate').on('change',function(){ // #interest-rate'
    retireSaving()
  })

  // Detect for change in either of the following, will trigger the function 'totalAssetValue()' to calculate the total assets saving
  $('#value-insurance, #value-cpf, #value-other-assets').on('change',function(){
    totalAssetValue()
  })

})