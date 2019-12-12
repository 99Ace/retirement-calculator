$(function () {
    let yearlyExpense = 0
    let yearsToRetirement = 0

    let retirementSaving = 0
    let interestRate = 0
    let inflationRate = 0
 
    let retireFundNeeded = 350000
    let totalAssetsValue = 300000

    // Redirect the page to show-chart.html to display the bar-chart with the data keyed in
    $('#show-chart').on('click',function() {
      window.location.href = "show-chart.html";
    });
    
    // Function to convert the value into Currency display with commas (solution found online)
    function currencyFormat(num) {
      return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } 

    // Calculate the number of years to retirement based on User input
    function yearToRetire(){ 
      let retireAge = $("#retire-age").val();
      let currentAge = $("#current-age").val();
      yearsToRetirement = ( parseInt(retireAge) - parseInt(currentAge) ) ;
      
      // if the result is NaN, nothing will be displayed in the text area
      if (Number.isNaN(yearsToRetirement) == true){ 
        $("#year-to-retire").text("__");
      }
      // else the value will be displayed in the text area
      else {
        $(".year-to-retire").text(yearsToRetirement);
      }
    }
    /* Detect for change in the input for current-age and retire-age and update the values accordingly
       It will trigger the function yearToRetire() to calculate the value and pass into the html*/
    $("#current-age , #retire-age").on('change',function(){
      yearToRetire();
      retireSaving();
    });
    
    /* Calculate and update text for yearly expenses in html when User enter the monthly expense */ 
    $("#monthly-expense").on('change',function(){
      let monthlyExpense = parseInt( $("#monthly-expense").val() ) ;
      yearlyExpense = monthlyExpense * 12
      $('#yearly-expense').text(currencyFormat(yearlyExpense))
      retireSum()
    });
    
    // Function to calculate the retirement fund required based on the number of years to retirement and entry
    function retireSum() {
      // get the value of the various field
      inflationRate = parseFloat( $('#inflation-rate').val() ) / 100
      interestRate = parseFloat( $('#interest-rate').val() ) / 100
      lifespan = parseFloat( $('#expect-lifespan').val() ) 

      // if either of the values are not valid, it will not perform any calculation and return '0.00' to the html 
      if ( (Number.isNaN(inflationRate)) || (Number.isNaN(interestRate)) || (Number.isNaN(lifespan)) || (yearsToRetirement < 0) ) {
        $("#retire-sum").text("0.00");
      }
      // perform the calculation 
      else { 
        // given formulas from Excel sheets
        let yearlyExpenseFirstYear = (Math.pow ((1+inflationRate), yearsToRetirement)*yearlyExpense).toFixed(2)
        let Rz = (1+interestRate)/(1+inflationRate)-1
        let Rzb = 1+Rz
        let Rzn = Math.pow(Rzb,-lifespan)
        // check if the inflation rate and interest rate is 0 or are the same, will perform simple calculation
        if ((interestRate == 0 && inflationRate == 0) || (interestRate == inflationRate)) {
          retireFundNeeded = yearlyExpenseFirstYear * lifespan
        }
        // else perform the calculation using the interest rate and inflation rate
        else {
          retireFundNeeded = (yearlyExpenseFirstYear * (1-Rzn)/Rz*Rzb)
        }
        // send the value to the html 
        $("#retire-sum").text(currencyFormat(retireFundNeeded));
      }
    }
    // Detect for change in either of the following, will trigger the function 'retireSum()' to calculate the retirement sum
    $('#expect-lifespan, #inflation-rate, #interest-rate').on('change',function(){
      retireSum()
    });    

    // Annual Income Section Calculation
    function retireSaving() {
      let annualIncome = $('#annual-income').val()
      if (Number.isNaN(annualIncome) || Number.isNaN(interestRate) || (yearsToRetirement < 0) ){
        retireSaving = 0  
        alert ('retire saving 0? ')

      }
      else {
        alert ('calculating')
       // if interest rate is 0, do simple calculation
        if (interestRate == 0) {
          retirementSaving = annualIncome * yearsToRetirement
        }
        // else factor in the interest rate for the growth of the funds over xx no of years
        else {
          retirementSaving = annualIncome * (1+interestRate) * (Math.pow((1+interestRate),yearsToRetirement) - 1 ) / (interestRate)   
        }
      }
 
      
      $("#retire-saving").text(currencyFormat(retirementSaving));
    }
    // Detect for change in either of the following, will trigger the function 'retireSaving()' to calculate the retirement saving amount
    $('#annual-income, #interest-rate').on('change',function(){
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
        message = `( ${currencyFormat(requiredFunds)} )`
      }
      else {
        message = `${currencyFormat(requiredFunds)}`
      }
      $('#total-assets').text(message)
    }

    $('#value-insurance, #value-cpf, #value-other-assets').on('change',function(){
      totalAssets()
    })

    function showChart() {
      let myChart = document.getElementById('myChart').getContext('2d');
      //Global Options
      Chart.defaults.global.defaultFontFamily = 'Lato';
      Chart.defaults.global.defaultFontSize = 15;
      Chart.defaults.global.defaultFontColor = 'white';

      let massPopChart = new Chart(myChart, {
        type : 'bar', // bar, horizontalBar, pie, line, doughnut, radar, PolcarArea
        data : {
          labels :['Funds Required','Funds Available','Gap'],
          datasets : [{
            // label : 'Gold Medals',
            data : [
              retireFundNeeded,
              totalAssetsValue,
              (retireFundNeeded-totalAssetsValue),
            ],
            // backgroundColor : 'lightblue',
            backgroundColor : [
              '#bdc6c2',
              '0f95c2',
              'fcad48',
            ],
            // borderWidth  : 1,
            // borderColor: 'white',
            hoverBorderWidth: 3,
            hoverBorderColor: 'white'
          }]  
        },
        options : {
          title : {
            display : 'true',
            text : 'Seagames Results - Number of Gold',
            fontSize : 25,
          },
          legend : {
            display : false,
            position : 'right',
            labels : {
              fontColor : 'white',
              backgroundColor : 'brown',

            }
            },
            layout : {
              padding : {
                left : 100,
                right : 50,
                top : 0,
                bottom : 0,
              }
            },
            tooltips : {
              enabled : true // true or false..  display the value when hover over the bar
            },
            
            scales: {
              
            xAxes: [{
              gridLines: { 
                zeroLineColor: 'white',
                color: 'rgba(0,0,0,0.0)', 
              }
            }],
            yAxes: [{
                display: true,
                gridLines: { 
                  zeroLineColor: 'white',
                  color: 'rgba(0,0,0,0.0)', 

                },
                ticks: {
                    suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                    // OR //
                    beginAtZero: true   // minimum value will be 0.
                }
            }]
            }
    
        
        }

      });
    }
    showChart();
    
})