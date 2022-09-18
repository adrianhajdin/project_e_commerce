#!/usr/bin/env python3

import json
import os

import amqp_setup

monitorBindingKey='*.error'

def receiveError():
  amqp_setup.check_setup()
    
  queue_name = "Error"  

  amqp_setup.channel.basic_consume(queue=queue_name, on_message_callback=callback, auto_ack=True)
  amqp_setup.channel.start_consuming() 

def callback(channel, method, properties, body):
  print("\nReceived an error by " + __file__)
  processError(body)
  print() 

def processError(errorMsg):
  print("Printing the error message:")
  try:
    error = json.loads(errorMsg)
    print("--JSON:", error)
  except Exception as e:
    print("--NOT JSON:", e)
    print("--DATA:", errorMsg)
  print()


if __name__ == "__main__": 
  print("\nThis is " + os.path.basename(__file__), end='')
  print(": monitoring routing key '{}' in exchange '{}' ...".format(monitorBindingKey, amqp_setup.exchangename))
  receiveError()
