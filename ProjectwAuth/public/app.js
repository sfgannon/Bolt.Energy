angular.module("boltprofiles", ["naif.base64", "ngAnimate", "ngTouch", "ui.router", "ngResource","UserModule", "ProjectModule", "ProfileModule", "CertificationModule","toastr","ProducerProfileModule"])
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
        templateUrl: '/templates/user/user_registration.html',
        controller: 'SignupController'
    })
})
  .controller('HeaderController', function ($rootScope, $scope, LoginService, $state, $window) {
        $rootScope.currentUserId = $window.localStorage.getItem('BoltUser') || '';
        $rootScope.authenticated = LoginService.authenticated();
        $scope.logout = function () {
            LoginService.logout();
            $rootScope.authenticated = LoginService.authenticated();
            $state.go('home');
        }
    })
  .controller('HomeController', function ($scope, CertificationFactory, ProfileFactory, ProjectFactory) {
        $scope.certifications = CertificationFactory.query();
        $scope.profiles = ProfileFactory.query(function (data) {
            console.log(data);
        });
        $scope.projects = ProjectFactory.query();
    })
  .controller('LoginController', function ($rootScope, $scope, LoginService, $state, toastr, $http) {
        $rootScope.authenticated = LoginService.authenticated();
        $scope.login = function () {
					var result = LoginService.login($scope.email, $scope.password);
					result.then(function (responseData) {
						$http.defaults.headers.common.Authorization = responseData.token;
						$rootScope.authenticated = LoginService.authenticated();
						$rootScope.currentUserId = responseData.user._id;
						$state.go('home');
						toastr.success("Welcome to Bolt, " + responseData.user.firstName, "Login Successful");
					}, function (status) {
						toastr.error("Error logging in.", "Login Failed");
						$state.go('home');
					})
        }
        $scope.logout = function () {
            $http.defaults.headers.common.Authorization = null;
            var result = LoginService.logout();
            $state.go('home');
        }
    })
  .service('ConfigService', function ($http, $q, $window) {
        return {
            appRoot: function () {
                //var url = 'http://localhost:3002';
                //var url = 'https://bolt-test-sgannonumd.c9users.io';
                var url = '';
                if ($window.location.href.indexOf('c9users') > -1) {
                    url = 'https://bolt-test-sgannonumd.c9users.io';
                } else {
                    url = 'http://localhost:3002';
                }
                return url;
            }
        }
    })
  .service('LoginService', ['$http', '$q', '$window', 'ConfigService', function ($http, $q, $window, ConfigService) {
        return {
            login: function (email, password) {
                var $return = $q.defer();
                $return.promise = $http({
                    method: 'POST',
                    url: ConfigService.appRoot() + '/data/authenticate',
                    data: {
                        email: email,
                        password: password
                    }
                }).then(function (responseData) {
                    $window.localStorage.setItem('BoltToken', responseData.data.token);
                    $window.localStorage.setItem('BoltUser', responseData.data.user._id);
                    $window.localStorage.setItem('BoltTokenExp', Date.now() + 10080000);
                    $return.resolve({
                        token: responseData.data.token,
                        user: responseData.data.user
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
                    $window.localStorage.removeItem('BoltUser');
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
            register: function (firstname, lastname, email, password, type) {
                //Register a new user account
                var $return = $q.defer();
                $return.promise = $http({
                    method: 'POST',
                    url: ConfigService.appRoot() + '/data/register',
                    data: {
                        firstName: firstname,
                        lastName: lastname,
                        email: email,
                        password: password,
                        accountType: type
                    }
                }).then(function (responseData) {
                    $window.localStorage.setItem('BoltToken', responseData.data.token);
                    $window.localStorage.setItem('BoltTokenExp', Date.now() + 10080000);
                    $return.resolve({
                        token: responseData.data.token,
                        user: responseData.data.user
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
            getByItem: function(itemId) {
              var $ret = $q.defer();
              $ret.promise = $http({
                  method: 'GET',
                  url: ConfigService.appRoot() + "/data/images/" + itemId
              }).then(function(responseData) {
                  $ret.resolve({ images: responseData.data.images });
              }, function(error) {
                  $ret.reject({ error: error });
              });
              return $ret.promise;
            },
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
            uploadfile : function (files, imageData) {
                var fd = new FormData();
                var url = ConfigService.appRoot() + "/data/images";
                var data = [];
                angular.forEach(files, function (file) {
                    fd.append('files', file);
                    data.push({
                        fileName: file.name,
                        contentType: file.type,
                        description: imageData.description,
                        primaryImage: imageData.primaryImage,
                        item: imageData.item
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
  .controller('CarouselController', function ($state, $scope, ConfigService, ImagesService, toastr) {
        //TODO - this needs to be updated to reflect image storage as base64 and display as data url
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
                toastr.success("Upload successful.", "Success");
            }, function (response) {
                toastr.error("Upload failed.", "Error");
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

    })
   .controller('SignupController', function ($rootScope, $scope, LoginService, $state, toastr) {
    $rootScope.authenticated = LoginService.authenticated();
    $scope.register = function () {
        LoginService.register($scope.firstname, $scope.lastname, $scope.email, $scope.password, $scope.type)
            .then(function (rd) {
                $rootScope.currentUserId = rd.user._id;
                $rootScope.authenticated = LoginService.authenticated();
                $state.go('home');
        }, function(error) {
            toastr.error("Error logging in: " + JSON.stringify(error));
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