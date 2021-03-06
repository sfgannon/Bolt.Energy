angular.module("boltprofiles", ["ngAnimate", "ngTouch", "ui.router", "ngResource", "ProjectModule", "ProfileModule", "CertificationModule"])
  .config(function ($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/templates/home.html',
        controller: 'HomeController'
    })
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/templates/login_template.html',
        controller: 'LoginController'
    })
    $stateProvider.state('images', {
        url: '/images',
        templateUrl: '/templates/images_template.html',
        controller: 'CarouselController'
    })
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: '/templates/signup.html',
        controller: 'SignupController'
    })
})
  .controller('HeaderController', ['$rootScope', '$scope', 'LoginService', function ($rootScope, $scope, LoginService) {
        $rootScope.authenticated = LoginService.authenticated();
        $scope.logout = function () {
            LoginService.logout();
            $rootScope.authenticated = LoginService.authenticated();
        }
    }])
  .controller('HomeController', ['$scope', 'CertificationFactory', 'ProfileFactory', 'ProjectFactory', function ($scope, CertificationFactory, ProfileFactory, ProjectFactory) {
        $scope.certifications = CertificationFactory.query();
        $scope.profiles = ProfileFactory.query(function (data) {
            console.log(data);
        });
        $scope.projects = ProjectFactory.query();
    }])
  .controller('LoginController', ['$rootScope', '$scope', 'LoginService', '$state', function ($rootScope, $scope, LoginService, $state) {
        $rootScope.authenticated = LoginService.authenticated();
        $scope.login = function () {
            var result = LoginService.login($scope.username, $scope.password);
            result.then(function (responseData) {
                alert('Login Successful.');
                $rootScope.authenticated = LoginService.authenticated();
                $state.go('home');
            }, function (status) {
                alert('Login Unsuccessful.');
                $state.go('home');
            })
        }
        $scope.logout = function () {
            var result = LoginService.logout();
            $state.go('home');
        }
    }])
  .service('ConfigService', ['$http', '$q', function ($http, $q) {
        return {
            appRoot: function () {
                var url = 'http://localhost:3002';
                return url;
            },
            appPort: function () {
                var port = 3002;
                return port;
            }
        }
    }])
  .service('LoginService', ['$http', '$q', '$window', 'ConfigService', function ($http, $q, $window, ConfigService) {
        return {
            login: function (username, password) {
                var $return = $q.defer();
                $return.promise = $http({
                    method: 'POST',
                    url: ConfigService.appRoot() + '/data/authenticate',
                    data: {
                        email: username,
                        password: password
                    }
                }).then(function (responseData) {
                    $window.localStorage.setItem('BoltToken', responseData.data.token);
                    $window.localStorage.setItem('BoltTokenExp', Date.now() + 10080000);
                    $return.resolve({
                        token: responseData.data.token
                    });
                }, function (httpError) {
                    $return.reject({
                        status: httpError.status
                    })
                })
                return $return.promise;
            },
            logout: function () {
                try {
                    $window.localStorage.removeItem('BoltToken');
                    $window.localStorage.removeItem('BoltTokenExp');
                }
                catch (e) {
                    console.log(e);
                }
            },
            authenticated: function () {
                if (($window.localStorage.getItem('BoltToken') != 'undefined') && ($window.localStorage.getItem('BoltToken') != null)) {
                    var exp = $window.localStorage.getItem('BoltTokenExp');
                    if (exp > Date.now()) {
                        return true;
                    }
                    else {
                        $window.localStorage.removeItem('BoltToken');
                        $window.localStorage.removeItem('BoltTokenExp');
                        return false;
                    }
                }
                else {
                    return false;
                }
            },
            register: function (firstname, lastname, email, password) {
                //Register a new user account
                var $return = $q.defer();
                $return.promise = $http({
                    method: 'POST',
                    url: ConfigService.appRoot() + '/data/register',
                    data: {
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        username: email,
                        password: password
                    }
                }).then(function (responseData) {
                    $window.localStorage.setItem('BoltToken', responseData.data.token);
                    $window.localStorage.setItem('BoltTokenExp', Date.now() + 10080000);
                    $return.resolve({
                        token: responseData.data.token
                    });
                }, function (status) {
                    $return.reject({
                        status: status.status
                    });
                })
                return $return.promise;
            }
        }
    }])
  .service('ImagesService', ['$http', '$q', '$window', 'ConfigService', function ($http, $q, $window, ConfigService) {
        return {
            getAll: function () {
                var ret = $q.defer();
                ret.promise = $http({
                    method: 'GET',
                    url: ConfigService.appRoot() + "/data/images",
                }).then(function (responseData) {
                    //Image paths returned
                    console.log(responseData.data);
                    ret.resolve({ images: responseData.data });
                }, function (err) {
                    //error
                    console.log("Error getting images: %o", err);
                    ret.reject({ error: err });
                })
                return ret.promise;
            },
            uploadfile : function (files) {
                var fd = new FormData();
                var url = ConfigService.appRoot() + "/data/images";
                var data = [];
                angular.forEach(files, function (file) {
                    fd.append('files', file);
                    data.push({
                        fileName: file.name,
                        contentType: file.type
                    })
                });
                fd.append('data', JSON.stringify(data));
                var ret = $q.defer();
                ret.promise = $http({
                    method: 'POST',
                    url: url,
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    }
                }).then(function (responseData) {
                    ret.resolve({ message: 'File(s) uploaded.', data: responseData.data });
                }, function (err) {
                    ret.reject({ message: 'File(s) failed to upload.', error: err });
                })
                return ret.promise;
            }
        }
    }])
  .controller('CarouselController', ['$state', '$scope', 'ConfigService', 'ImagesService', function ($state, $scope, ConfigService, ImagesService) {
        
        ImagesService.getAll().then(function (response) {
            $scope.images = response.images;
            $scope.slides = [];
            angular.forEach(response.images, function(image) {
                $scope.slides.push({ fileName: image.fileName, description: image.contentType });
            })
        }, function (err) {
            console.log("Could not get images.");
        });
        
        $scope.uploadedFile = function (element) {
            $scope.$apply(function ($scope) {
                $scope.files = element.files;
            });
        }
        
        $scope.root = "/temp/";
        
        $scope.addFile = function () {
            var upload = ImagesService.uploadfile($scope.files);
            upload.then(function (response) {
                alert(response.message);
            }, function (response) {
                alert(response.message);
            })
        }
        $scope.direction = 'left';
        $scope.currentIndex = 0;

        $scope.setCurrentSlideIndex = function (index) {
            $scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
            $scope.currentIndex = index;
        };

        $scope.isCurrentSlideIndex = function (index) {
            return $scope.currentIndex === index;
        };

        $scope.prevSlide = function () {
            $scope.direction = 'left';
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.direction = 'right';
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };

    }])
   .controller('SignupController', function ($rootScope, $scope, LoginService, $state) {
    $rootScope.authenticated = LoginService.authenticated();
    $scope.signup = function () {
        LoginService.register($scope.firstname, $scope.lastname, $scope.email, $scope.password)
            .then(function (rd) {
                $rootScope.authenticated = LoginService.authenticated();
                $state.go('home');
        })
    }
    $scope.logout = function () {
        //  var result = LoginService.logout();
        $state.go('home');
    }
    })
.animation('.slide-animation', function () {
    return {
        addClass: function (element, className, done) {
            var scope = element.scope();
            element = $(element);

            if (className == 'ng-hide') {
                var finishPoint = element.parent().width();
                if(scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
            }
            else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope();
            element = $(element);
            if (className == 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = element.parent().width();
                if(scope.direction === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.set(element, { left: startPoint });
                TweenMax.to(element, 0.5, {left: 0, onComplete: done });
            }
            else {
                done();
            }
        }
    };
    });