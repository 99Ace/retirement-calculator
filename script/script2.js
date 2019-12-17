$(function () {
  let retireFundNeeded = localStorage.getItem ('retireFundNeeded')
  let totalAsset = localStorage.getItem ('totalAsset')
  let requiredFunds = localStorage.getItem ('requiredFunds')

  $('#total-funds-required').text(retireFundNeeded)
  $('#total-current-funds-available').text(totalAsset)
  $('#shortfall').text(requiredFunds)

  showChart();

  function showChart() {
    let myChart = document.getElementById('myChart').getContext('2d');
    //Global Options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 15;
    Chart.defaults.global.defaultFontColor = 'white';
    console.log(retireFundNeeded)
    let massPopChart = new Chart(myChart, {
      type : 'bar', // bar, horizontalBar, pie, line, doughnut, radar, PolcarArea
      data : {
        labels :['Funds Required','Funds Available','Gap'],
        datasets : [{
          // label : 'Gold Medals',
          data : [
            parseFloat(retireFundNeeded),
            parseFloat(totalAsset),
            parseFloat(requiredFunds),
            
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
})

