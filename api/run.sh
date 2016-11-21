#!/bin/sh
RUNNING_USER=root
 
stop() {
	psids=`ps aux | grep server.js | awk '{print $2}'`
	for pid in $psids; do
		echo "kill -9 $pid"
		su - $RUNNING_USER -c "kill -9 $pid"
	done
}

start() {
	nohup node server.js >> server.log &
}

restart() {
	stop
	start
}

status() {
	ps aux | grep server.js
}


case "$1" in  
	'start')
	start
	;;
	'stop')
	stop
	;;
	'restart')
	stop
	start
	;;
	'status')
	status
	;;
	*)
	echo "Usage: $0 {start|stop|restart|status}"
	exit 1
esac
exit 0