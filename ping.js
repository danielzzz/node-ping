#!/opt/nodejs/v0.1.103/bin/node


var sys = require("sys"),
    pcap = require("pcap"), pcap_session;
    
//var addr = "google.es";
//var addr = "213.251.187.191"; //pluto
//var addr = "10.100.0.1";

var addr = process.argv[3];

setInterval(function() {probe(addr)}, 1000);


function probe(addr) {
    sys.puts('sending a probe to ' + addr);
    var dgram = require('dgram');
    var message = new Buffer("Some bytes");
    var client = dgram.createSocket("udp4");
    client.send(message, 0, message.length, 21111, addr);
    client.close(); 
}

// create a pcap session
pcap_session = pcap.createSession(process.argv[2] || 'eth1', "");


// listen for packets, decode them, and feed the simple printer
pcap_session.addListener('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
    //if (packet.link.ip && packet.link.ip.protocol_name=="ICMP") {
        //sys.puts(sys.inspect(packet, 4));
        packet.link && packet.link.ip && sys.puts(packet.link.ip.saddr + " is alive");
        sys.puts(pcap.print.packet(packet));
    //}
});

