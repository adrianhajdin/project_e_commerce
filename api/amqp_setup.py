import pika
from os import environ ###

# These module-level variables are initialized whenever a new instance of python interpreter imports the module;
# In each instance of python interpreter (i.e., a program run), the same module is only imported once (guaranteed by the interpreter).

hostname = environ.get('rabbit_host') or 'localhost' ###
port = environ.get('rabbit_port') or 5672 ###
# connect to the broker and set up a communication channel in the connection
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host=hostname, port=port,
        heartbeat=3600, blocked_connection_timeout=3600, # these parameters to prolong the expiration time (in seconds) of the connection
))
    # Note about AMQP connection: various network firewalls, filters, gateways (e.g., SMU VPN on wifi), may hinder the connections;
    # If "pika.exceptions.AMQPConnectionError" happens, may try again after disconnecting the wifi and/or disabling firewalls.
    # If see: Stream connection lost: ConnectionResetError(10054, 'An existing connection was forcibly closed by the remote host', None, 10054, None)
    # - Try: simply re-run the program or refresh the page.
    # For rare cases, it's incompatibility between RabbitMQ and the machine running it,
    # - Use the Docker version of RabbitMQ instead: https://www.rabbitmq.com/download.html
channel = connection.channel()
# Set up the exchange if the exchange doesn't exist
# - use a 'topic' exchange to enable interaction
exchangename= "order_topic" #?##
exchangetype= "topic" #?##
channel.exchange_declare(exchange=exchangename, exchange_type=exchangetype, durable=True)
    # 'durable' makes the exchange survive broker restarts

# Here can be a place to set up all queues needed by the microservices,
# - instead of setting up the queues using RabbitMQ UI.

############   Error queue   #############
#delcare Error queue
queue_name = 'Error' #?##
channel.queue_declare(queue=queue_name, durable=True) 
    # 'durable' makes the queue survive broker restarts

routing_key = '*.error' #?##
#bind Error queue
channel.queue_bind(exchange=exchangename, queue=queue_name, routing_key=routing_key) 
    # bind the queue to the exchange via the key
    # any routing_key with two words and ending with '.error' will be matched

############   Activity_Log queue    #############
#delcare Activity_Log queue
queue_name = 'Activity_Log' #?##
channel.queue_declare(queue=queue_name, durable=True)
    # 'durable' makes the queue survive broker restarts

#bind Activity_Log queue
channel.queue_bind(exchange=exchangename, queue=queue_name, routing_key='#') #?##
    # bind the queue to the exchange via the key
    # 'routing_key=#' => any routing_key would be matched
    

"""
This function in this module sets up a connection and a channel to a local AMQP broker,
and declares a 'topic' exchange to be used by the microservices in the solution.
"""
def check_setup():
    # The shared connection and channel created when the module is imported may be expired, 
    # timed out, disconnected by the broker or a client;
    # - re-establish the connection/channel is they have been closed
    global connection, channel, hostname, port, exchangename, exchangetype

    if not is_connection_open(connection):
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=hostname, port=port, heartbeat=3600, blocked_connection_timeout=3600))
    if channel.is_closed:
        channel = connection.channel()
        channel.exchange_declare(exchange=exchangename, exchange_type=exchangetype, durable=True) ###


def is_connection_open(connection):
    # For a BlockingConnection in AMQP clients,
    # when an exception happens when an action is performed,
    # it likely indicates a broken connection.
    # So, the code below actively calls a method in the 'connection' to check if an exception happens
    try:
        connection.process_data_events()
        return True
    except pika.exceptions.AMQPError as e:
        print("AMQP Error:", e)
        print("...creating a new connection.")
        return False
