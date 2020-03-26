# API
All REST endpoints exposed to the outside are implemented inside this directory. 
The router.js module is the base router which captures all REST calls and route to the respective router based on the base of the URL. 

Middleware such as authentication and authorization will be applied inside the base router. 

Each sub directory here contains two modules; A router and a model. The router as explained above, will capture the api calls forwarded from the base router. 

Each endpoint defined in a router must have a corresponding method in the router class. This method may then call one or more methods from the corresponding model(only). 

Methods in the model class can call dao modules, client modules, service modules or even model modules of other packages. 