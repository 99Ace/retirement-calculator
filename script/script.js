$(function () {
    let answer = 0;
    let yearlyExpense = 0
    let yearsToRetirement = 0
    let retireFundNeeded = 0
    let retirementSaving = 0
    let interestRate = 0
    let inflationRate = 0
    let totalAssetsValue = 0

    function currencyFormat(num) {
      return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } 
    function yearToRetire(){ 
        let retireAge = $("#retire-age").val();
        let currentAge = $("#current-age").val();
        yearsToRetirement = ( parseInt(retireAge) - parseInt(currentAge) ) ;
        if (Number.isNaN(yearsToRetirement) == true){
          $("#year-to-retire").text("__");
        }
        else {
          $("#year-to-retire").text(yearsToRetirement);
        }
    }
    $("#monthly-expense").change(function(){
      // alert('change');
      let monthlyExpense = parseInt( $("#monthly-expense").val() ) ;
      yearlyExpense = monthlyExpense * 12
      $('#yearly-expense').text(currencyFormat(yearlyExpense))

    });

    $("#current-age").change(function(){
      yearToRetire()
    });
    $("#retire-age").change(function(){
      yearToRetire()
    });

    function retireSum() {
      inflationRate = parseFloat( $('#inflation-rate').val() ) / 100
      interestRate = parseFloat( $('#interest-rate').val() ) / 100
      lifespan = parseFloat( $('#expect-lifespan').val() ) 

      if ( (Number.isNaN(answer) == true)||(Number.isNaN(inflationRate) == true)||(Number.isNaN(interestRate) == true)||(Number.isNaN(lifespan) == true)   ) {
          $("#retire-sum").text("0.00");
          // alert('NAN found')
      }
      else { 
        let yearlyExpenseFirstYear = (Math.pow ((1+inflationRate), yearsToRetirement)*yearlyExpense).toFixed(2)

        let Rz = (1+interestRate)/(1+inflationRate)-1
        let Rzb = 1+Rz
        let Rzn = Math.pow(Rzb,-lifespan)
        
        if ((interestRate == 0 && inflationRate == 0) || (interestRate == inflationRate)) {
          retireFundNeeded = yearlyExpenseFirstYear * lifespan
        }
        else {
          retireFundNeeded = (yearlyExpenseFirstYear * (1-Rzn)/Rz*Rzb)
        }
        $("#retire-sum").text(currencyFormat(retireFundNeeded));
      }
    }
    $('#expect-lifespan').change(function(){
      retireSum()
    });      
    $('#inflation-rate').change(function(){
      retireSum()
    });      
    $('#interest-rate').change(function(){
      retireSum()
    });

    // Annual Income Section Calculation
    function retireSaving () {
      let annualIncome = $('#annual-income').val()
      
      if (interestRate == 0) {
        retirementSaving = annualIncome * yearsToRetirement
        alert('rate=0')
      }
      else {
        retirementSaving = annualIncome * (1+interestRate) * (Math.pow((1+interestRate),yearsToRetirement) - 1 ) / (interestRate)   
        alert('calculating retirement saving') 
        alert(retirementSaving)   
      }
      
      $("#retire-saving").text(currencyFormat(retirementSaving));
    }

    $('#annual-income').change(function(){
      retireSaving()
    })

    // Total Assets Calculation
    function totalAssets () {
      let insuranceValue = 0
      let cpfValue = 0
      let otherAssets = 0
      insuranceValue = parseInt( $('#value-insurance').val() )
      cpfValue = parseInt( $('#value-cpf').val() )
      otherAssets = parseInt( $('#value-other-assets').val() )

      if (Number.isNaN(insuranceValue) == true){
        insuranceValue = 0
      }
      if (Number.isNaN(cpfValue) == true){
        cpfValue = 0
      }
      if (Number.isNaN(otherAssets) == true){
        otherAssets = 0
      }

      totalAssetsValue = retirementSaving+insuranceValue + cpfValue + otherAssets
      let requiredFunds = totalAssetsValue - retireFundNeeded
      let message = ''
      if (requiredFunds < 0) {
        message = `( ${currencyFormat(requiredFunds)})`
      }
      else {
        message = `${currencyFormat(requiredFunds)}`
      }
      $('#total-assets').text(message)
    }

    $('#value-insurance').change(function(){
      totalAssets()
    })

    $('#value-cpf').change(function(){
      totalAssets()
    });

    $('#value-other-assets').change(function(){
      totalAssets()
    });

})

    
    
    