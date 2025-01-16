from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import cross_origin
from models import db, Users, TimerData
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
def register():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    password = data.get('password')

    if not first_name or not last_name or not email or not password:
        return jsonify({'error': 'Please fill out all fields'}), 400

    if Users.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400

    hashed_password = generate_password_hash(password)
    new_user = Users(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
def login():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = Users.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/save-timer', methods=['POST'])
@jwt_required()
def save_timer():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        project_name = data.get('project_name')
        elapsed_time = data.get('elapsed_time')

        if not isinstance(project_name, str) or not project_name:
            return jsonify({'msg': 'project_name must be a string'}), 422
        if not isinstance(elapsed_time, int) or elapsed_time < 0:
            return jsonify({'msg': 'elapsed_time must be a non-negative integer'}), 422

        new_timer_data = TimerData(
            project_name=project_name,
            elapsed_time=elapsed_time,
            user_id=int(user_id),
            timestamp=datetime.utcnow()
        )
        db.session.add(new_timer_data)
        db.session.commit()

        return jsonify({'message': 'Timer data saved successfully'}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500


@auth_bp.route('/get-timer-data', methods=['GET', 'OPTIONS'])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@jwt_required()
def get_timer_data():
    try:
        user_id = get_jwt_identity()

       
        timer_data = TimerData.query.filter_by(user_id=user_id).all()

       
        result = [
            {
                "project_name": data.project_name,
                "elapsed_time": data.elapsed_time,
                "timestamp": data.timestamp.isoformat()
            }
            for data in timer_data
        ]

        return jsonify({"timer_data": result}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)}), 500


@auth_bp.route('/check-auth', methods=['GET'])
@jwt_required(optional=True) 
def check_auth():
    user_id = get_jwt_identity()
    if user_id:
        return jsonify({'logged_in': True, 'user_id': user_id}), 200
    else:
        return jsonify({'logged_in': False}), 200
