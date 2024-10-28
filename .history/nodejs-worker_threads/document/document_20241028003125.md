# Libuv -  worker_threads

<br>
NodeJs work in single core and this mean what if one user going to get
big data from server the second user can't get nothing from server because
thread is busy and after this big data will be send the other users can send  the req to server and this is bad and from this you can know what sing core is bad but in Libuv have a decision this is worker threads this mean what cou can 
create the many threads and share big data between other threads in result
the server will work non-blocking and if one user will send the req to get big data for this will create other thread from Libuv and this resolve the global NodeJs problem 
