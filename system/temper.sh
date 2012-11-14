#!/bin/sh

LOG=/var/log/temper
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin


INNER=`pcsensor_inner -c`
if [ "$?" -ne 0 ]
then
exit 1
fi
OUTA=`pcsensor_outher_a -c`
if [ "$?" -ne 0 ]
then
exit 1
fi
OUTB=`pcsensor_outher_b -c`
if [ "$?" -ne 0 ]
then
exit 1
fi



RESULT="inner: "$INNER"C°\r\nouther-a: "$OUTA"C°\r\nouther-b: "$OUTB"C°"

echo >$LOG
echo $RESULT>$LOG
