# Contributing

## Development

Clone the development environment and server, then create the virtual machine with [Vagrant][vagrant]:

```
$ git clone git@github.com:christophercliff/mke-bus-env.git
$ cd ./mke-bus-env/
$ git clone git@github.com:christophercliff/mke-bus.git
$ vagrant up && vagrant ssh
```

Once you're in the virtual machine, run the tests and start the server in development mode:

```
$ cd /mke-bus/ && npm test && npm run dev
```

Now you can access the server on port `8000` of the host machine, e.g. [http://127.0.0.1:8000/get/all/routes](http://127.0.0.1:8000/get/all/routes).

[vagrant]: http://www.vagrantup.com/
