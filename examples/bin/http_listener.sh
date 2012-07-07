#!/bin/sh
# http listener start up script 

# set the base path
EXAMPLES_HOME="$(dirname $0)/.."
CP="$EXAMPLES_HOME/protocols/src:$EXAMPLES_HOME/libs/jetty-all-7.0.2.v20100331.jar:$EXAMPLES_HOME/libs/servlet-api-2.5.jar"

# test if the class exist
if [ ! -f  $EXAMPLES_HOME/protocols/src/com/vitvar/ctu/mdw/HttpListener.class ]; then
	javac -cp $EXAMPLES_HOME/libs $EXAMPLES_HOME/src/com/vitvar/ctu/mdw/HttpListener.java
fi
java -cp $CP com.vitvar.ctu.mdw.HttpListener
