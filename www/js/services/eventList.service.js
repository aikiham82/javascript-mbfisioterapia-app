app.service('EventList', function ($ionicModal, $timeout, ) {
    var self = this;
    this.events = undefined;
    this.setGroupedEvent = function (groupedEvent) {
        self.groupedEvent = groupedEvent;
        //Se borran objetos recursivos que causan que se quede pillado el popup de la lista de eventos
        for (var i = 0; i < self.groupedEvent.events.length; i++) {
            delete self.groupedEvent.events[i].events;
            delete self.groupedEvent.events[i].source;
        }
        self.events = self.groupedEvent.events;
    }

})