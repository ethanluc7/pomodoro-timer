from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import cross_origin
from models import db, Users, TimerData
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

# Register endpoint
@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
def register():
    if request.method == 'OPTIONS':
        return '', 200  # Respond to OPTIONS requests

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

# Login endpoint
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

# Save timer data
# @auth_bp.route('/save-timer', methods=['POST'])
# @jwt_required()
# def save_timer():
#     data = request.get_json()
#     print("Received data:", data)  # Log the incoming data
    
#     project_name = data.get('project_name')
#     elapsed_time = data.get('elapsed_time')

#     if not isinstance(project_name, str) or not project_name:
#         return jsonify({'msg': 'project_name must be a string'}), 422
#     if not isinstance(elapsed_time, int) or elapsed_time < 0:
#         return jsonify({'msg': 'elapsed_time must be an integer'}), 422

#     user_id = get_jwt_identity()
#     new_timer_data = TimerData(
#         project_name=project_name,
#         elapsed_time=elapsed_time,
#         user_id=user_id
#     )
#     db.session.add(new_timer_data)
#     db.session.commit()
#     return jsonify({'message': 'Timer data saved successfully'}), 200

@auth_bp.route('/save-timer', methods=['POST'])
#@jwt_required()

def save_timer():
    try:
        # Parse incoming JSON data
        data = request.get_json()

        # Validate the data
        project_name = data.get('project_name')
        elapsed_time = data.get('elapsed_time')
        user_id = data.get('user_id')  # Add `user_id` to the JSON payload if JWT is disabled

        if not isinstance(project_name, str) or not project_name:
            return jsonify({'msg': 'project_name must be a non-empty string'}), 422
        if not isinstance(elapsed_time, int) or elapsed_time < 0:
            return jsonify({'msg': 'elapsed_time must be a non-negative integer'}), 422
        if not isinstance(user_id, int) or user_id <= 0:
            return jsonify({'msg': 'user_id must be a positive integer'}), 422

        # Save to the database
        new_timer_data = TimerData(
            project_name=project_name,
            elapsed_time=elapsed_time,
            timestamp=datetime.utcnow(),
            user_id=user_id  # Use this or `get_jwt_identity()` if JWT is enabled
        )
        db.session.add(new_timer_data)
        db.session.commit()

        return jsonify({'message': 'Timer data saved successfully'}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({'status': 'error', 'error': str(e)}), 500
