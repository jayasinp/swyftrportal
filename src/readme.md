# Source Root

All js files in this directory will be transpiled to be able to run on NodeJs V6. 
Currently the root contains 4 modules, as described below.
    
#### server.js
This module creates the https nodejs server and listen on port specified in platform config specific to the running environment. 
This also kickstarts the daemon services and the expressJs application. 

#### app.js
This module defines the expressJs app configurations. All global express middleware will be used within this module.
Apart from that required modification of nodejs core module prototypes should also be done inside this module.

#### daemon.js
Services that are running independent of the expressJs app should be initialized within this module. However, these services might be consumed by the expressJs app at any time.

#### .eslintrc
This module defines all the lint rules specific to the sources root. 