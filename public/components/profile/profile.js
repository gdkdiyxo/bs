angular.module('controllers')

.controller( 'ProfileCtrl', [ '$scope', '$http', '$window',
  function( $scope, $http, $window ) {

      $scope.username = 'Whitney';
      $http.get('/api/profile/info')
      .then( res => {
          $scope.username = res.data.username;
          $scope.id = res.data.id;
          $scope.picture = 'https://graph.facebook.com/' + $scope.id + '/picture?height=200&width=200';
          $http.get('/api/search/users/' + $scope.id).then( res => {
            $scope.books = res.data;
          })
          .catch( err => {
            console.log(err[0]);
          });
       })
      .catch( err => { console.log( err[0] ); });

      $http.get('/api/profile/borrowing')
      .then( res => {
        $scope.borrowing = res.data;
      })
      .catch( err => {
        console.log(err[0]);
      });

  }
]);