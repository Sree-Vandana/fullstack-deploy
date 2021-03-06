angular.module('authServices',[])

.factory('Auth',function($http,AuthToken){

    authFactory={};
   console.log('testing auth services');

    authFactory.login = function(loginData) {
        return $http.post('/api/authenticate', loginData).then(function(data) {
            AuthToken.setToken(data.data.token); // Endpoint will return a token to set
            return data;
        });
    };

    authFactory.isLoggedIn = function() {
        
        if (AuthToken.getToken()) {
            console.log('user is loggedin')
            return true; 
        } else {
            console.log('user is not loggedin')
            return false; 
        }
    };

     // Function to get current user's data
    authFactory.getUser = function() {
        // Check first if user has a token
        if (AuthToken.getToken()) {
            return $http.post('/api/me'); // Return user's data
        } else {
            $q.reject({ message: 'User has no token' }); // Reject if no token exists
        }
    };

    // Function to logout the user
    authFactory.logout = function() {
        AuthToken.setToken(); // Removes token from local storage
    };

    return authFactory;

})


.factory('AuthToken', function($window) {
    var authTokenFactory = {}; 

    authTokenFactory.setToken = function(token) {
        
        if (token) {
            $window.localStorage.setItem('token', token); 
        } else {
            $window.localStorage.removeItem('token'); 
        }
    };

    authTokenFactory.getToken = function() {
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory; 
})

// Factory: AuthInterceptors is used to configure headers with token (passed into config, app.js file)
.factory('AuthInterceptors', function(AuthToken) {
    var authInterceptorsFactory = {}; // Create factory object

    // Function to check for token in local storage and attach to header if so
    authInterceptorsFactory.request = function(config) {
        var token = AuthToken.getToken(); // Check if a token is in local storage
        if (token) config.headers['x-access-token'] = token; //If exists, attach to headers

        return config; // Return config object for use in app.js (config file)
    };
    return authInterceptorsFactory; // Return factory object

});