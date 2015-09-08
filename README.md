# rma-ss15

Installation des Servers:

Im /server Verzeichnis "npm install" aufrufen (ein SQL Client muss im NODE_PATH installiert sein)
Der Server benötigt zudem eine Konfigurations-Datei,
ein Beispiel ist in der Datei /server/app/config.example.js gegeben.

Anschließeng kann der Server einfach über "npm start" gestartet werden.

Der Client kann ganz normal von Cordova verarbeitet werden, man sollte allerdings vorher
im www Ordner "bower install" aufrufen um die Abhängigkeiten (Phaser, etc) zu installieren.

Achtung: auch hier wird eine Konfigurationsdateo bebötigt!