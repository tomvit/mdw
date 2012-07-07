#!/bin/sh
# Simple protocol start up script

# set the base path
EXAMPLES_HOME="$(dirname $0)/../protocols"

# test if the class exist
if [ ! -f  $EXAMPLES_HOME/src/com/vitvar/ctu/mdw/SimpleProtocol.class ]; then
	javac $EXAMPLES_HOME/src/com/vitvar/ctu/mdw/SimpleProtocol.java
fi
java -cp $EXAMPLES_HOME/src com.vitvar.ctu.mdw.SimpleProtocol
