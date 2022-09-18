#!/usr/bin/env python3

import json
import os

import amqp_setup

monitorBindingKey='#'

def receiveOrderLog():
  amqp_setup.check_setup()
      
  queue_name = 'Order_Log'
  
  amqp_setup.channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
  amqp_setup.channel.start_consuming()

def callback(channel, method, properties, body):
  print("\nReceived an order log by " + __file__)
  processOrderLog(json.loads(body))
  print()

def processOrderLog(order):
  print("Recording an order log:")
  print(order)


if __name__ == "__main__":
  print("\nThis is " + os.path.basename(__file__), end='')
  print(": monitoring routing key '{}' in exchange '{}' ...".format(monitorBindingKey, amqp_setup.exchangename))
  receiveOrderLog()
