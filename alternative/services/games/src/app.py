from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('db_conn') + '/game'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_size': 100,
                                           'pool_recycle': 280}
db = SQLAlchemy(app)
CORS(app)


class Game(db.Model):
    __tablename__ = 'game'
    game_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    platform = db.Column(db.String(10), nullable=False)
    price = db.Column(db.Float(precision=2), nullable=False)
    stock = db.Column(db.Integer)

    def __init__(self, title, platform, price, stock):
        self.title = title
        self.platform = platform
        self.price = price
        self.stock = stock

    def to_dict(self):
        return {
            "game_id": self.game_id,
            "title": self.title,
            "platform": self.platform,
            "price": self.price,
            "stock": self.stock
        }


@app.route("/health")
def health_check():
    return jsonify(
        {
            "message": "Service is healthy."
        }
    ), 200


@app.route("/games")
def get_all():
    game_list = Game.query.all()
    if len(game_list) != 0:
        return jsonify(
            {
                "data": {
                    "games": [game.to_dict() for game in game_list]
                }
            }
        ), 200
    return jsonify(
        {
            "message": "There are no games."
        }
    ), 404


@app.route("/games/<int:game_id>")
def find_by_id(game_id):
    game = Game.query.filter_by(game_id=game_id).first()
    if game:
        return jsonify(
            {
                "data": game.to_dict()
            }
        ), 200
    return jsonify(
        {
            "message": "Game not found."
        }
    ), 404


@app.route("/games", methods=['POST'])
def new_game():
    try:
        data = request.get_json()
        game = Game(**data)
        db.session.add(game)
        db.session.commit()
    except Exception as e:
        return jsonify(
            {
                "message": "An error occurred creating the game.",
                "error": str(e)
            }
        ), 500
    return jsonify(
        {
            "data": game.to_dict()
        }
    ), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
