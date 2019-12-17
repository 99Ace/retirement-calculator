
$(function () {
  let retireFundNeeded = parseFloat(localStorage.getItem ('retireFundNeeded'))
  let totalAsset = parseFloat(localStorage.getItem ('totalAsset'))
  let requiredFunds = parseFloat(localStorage.getItem ('requiredFunds'))
  
  // Function to convert the value into Currency display with commas (solution found online)
  function currencyFormat(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  } 
  
  //
  $('#total-funds-required').text( currencyFormat(retireFundNeeded) )
  $('#total-current-funds-available').text(currencyFormat(totalAsset))
  // Change the title of the Section to EXCESS if the sum is positive 
  if (requiredFunds >= 0) {
    $('#shortfall-header').text('Excess');
    $('#shortfall').text(currencyFormat(requiredFunds));
  }
  // Change the title of the Section to SHORTFALL if the sum is positive 
  else {
    $('#shortfall-header').text('Shortfall');
    $('#shortfall').text(currencyFormat(-requiredFunds));
  }

  // When User click on <close>  button, this function will clear the data of the local storage and return to index.html
  $("#return-to-index").on('click', function(){
    // Close and return to index.html
    window.location.href = "index.html";
    // Reset the localStorage
    localStorage.setItem ('retireFundNeeded', 0)
    localStorage.setItem ('totalAsset', 0)
    localStorage.setItem ('requiredFunds', 0)
  })
  
  // 
  showChart();

  function showChart() {
    let myChart = document.getElementById('myChart').getContext('2d');

    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 15;
    Chart.defaults.global.defaultFontColor = 'white';
    let massPopChart = new Chart(myChart, {
      type : 'bar', 
      data : {
        labels :['Funds Required','Funds Available','Gap'],
        datasets : [{
          data : [
            // Set all data to 2 decimal using toFixed()
            retireFundNeeded.toFixed(2),
            totalAsset.toFixed(2),
            // To convert the value to positive for graph display
            Math.abs(requiredFunds).toFixed(2),
            
          ],
          // Set the background color of each graph
          backgroundColor : [
            '#9caba4',
            '#1087bb',
            '#fba623',
          ],
          hoverBorderWidth: 3,
          hoverBorderColor: 'white'
        }]  
      },
      options : {
        legend : {
          display : false,
          },
        layout : {
            padding : {
              left : 75,
              right : 75,
              top : 0,
              bottom : 0,
            }
          },
          // Addition tooltips to show value when hover over graph
          tooltips : {
            enabled : true 
          },
          // Setting the X and Y Axis details
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
                    beginAtZero: true,   // minimum value will be 0.
                }
            }]
          }
      
      }

    });
  }
})

