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

[vagrant]: http://www.vagrantup.com/
