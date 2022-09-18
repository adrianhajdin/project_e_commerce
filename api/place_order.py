from flask import Flask, request, jsonify
from flask_cors import CORS

import os, sys

import requests
from invokes import invoke_http

import amqp_setup
import pika
import json

app = Flask(__name__)
CORS(app)

order_log_URL = "http://localhost:5001/order_log"


@app.route("/place_order", methods=['POST'])
def place_order():

    if request.is_json:
        try:
            order = request.get_json()
            print("\nReceived an order in JSON:", order)
            result = processPlaceOrder(order)
            print('\n------------------------')
            print('\nresult: ', result)
            return jsonify(result), result["code"]

        except Exception as e:
            exc_type, exc_obj, exc_tb = sys.exc_info()
            fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
            ex_str = str(e) + " at " + str(exc_type) + ": " + fname + ": line " + str(exc_tb.tb_lineno)
            print(ex_str)

            return jsonify({
                "code": 500,
                "message": "place_order.py internal error: " + ex_str
            }), 500

    return jsonify({
        "code": 400,
        "message": "Invalid JSON input: " + str(request.get_data())
    }), 400


def processPlaceOrder(order):
  print('\n-----Invoking order microservice-----')
  order_result = invoke_http(order_log_URL, method='POST', json=order)
  print('order_result:', order_result)

  code = order_result["code"]
  message = json.dumps(order_result)

  if code not in range(200, 300):
    print('\n\n-----Publishing the (order error) message with routing_key=order.error-----')

    amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="order.error", body=message, properties=pika.BasicProperties(delivery_mode = 2))     
    print("\nOrder status ({:d}) published to the RabbitMQ Exchange:".format(code), order_result)

    return {
      "code": 500,
      "data": {"order_result": order_result},
      "message": "Order creation failure sent for error handling."
    }

  else:
    print('\n\n-----Publishing the (order info) message with routing_key=order.info-----')        
    amqp_setup.channel.basic_publish(exchange=amqp_setup.exchangename, routing_key="order.info",body=message)
  
  print("\nOrder published to RabbitMQ Exchange.\n")

if __name__ == "__main__":
  print("This is flask " + os.path.basename(__file__) + " for placing an order...")
  app.run(host="0.0.0.0", port=5100, debug=True)
