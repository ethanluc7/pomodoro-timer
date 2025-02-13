from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from flask_cors import cross_origin
from models import db, Users, TimerData, TimerSettings, Topics, SoundSettings
from datetime import datetime

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST", "OPTIONS"])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
def register():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json()
    first_name = data.get("firstName")
    last_name = data.get("lastName")
    email = data.get("email")
    password = data.get("password")

    if not first_name or not last_name or not email or not password:
        return jsonify({"error": "Please fill out all fields"}), 400

    if Users.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    hashed_password = generate_password_hash(password)
    new_user = Users(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=hashed_password,
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST", "OPTIONS"])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
def login():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = Users.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token}), 200


@auth_bp.route("/save-timer", methods=["POST"])
@jwt_required()
def save_timer():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        project_name = data.get("project_name")
        elapsed_time = data.get("elapsed_time")

        if not isinstance(project_name, str) or not project_name:
            return jsonify({"msg": "project_name must be a string"}), 422
        if not isinstance(elapsed_time, int) or elapsed_time < 0:
            return jsonify({"msg": "elapsed_time must be a non-negative integer"}), 422

        new_timer_data = TimerData(
            project_name=project_name,
            elapsed_time=elapsed_time,
            user_id=int(user_id),
            timestamp=datetime.utcnow(),
        )
        db.session.add(new_timer_data)
        db.session.commit()

        return jsonify({"message": "Timer data saved successfully"}), 200

    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500


@auth_bp.route("/get-timer-data", methods=["GET", "OPTIONS"])
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
                "timestamp": data.timestamp.isoformat(),
            }
            for data in timer_data
        ]

        return jsonify({"timer_data": result}), 200

    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500


@auth_bp.route("/check-auth", methods=["GET"])
@jwt_required(optional=True)
def check_auth():
    user_id = get_jwt_identity()
    if user_id:
        return jsonify({"logged_in": True, "user_id": user_id}), 200
    else:
        return jsonify({"logged_in": False}), 200


@auth_bp.route("save-timer-settings", methods=["POST"])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@jwt_required()
def save_timer_settings():
    user_id = get_jwt_identity()
    data = request.get_json()

    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    timer_settings = TimerSettings.query.filter_by(user_id=user_id).first()
    if not timer_settings:
        timer_settings = TimerSettings(
            pomodoro=data["pomodoro"],
            short_break=data["shortBreak"],
            long_break=data["longBreak"],
            user_id=user_id,
        )
        db.session.add(timer_settings)
    else:
        timer_settings.pomodoro = data["pomodoro"]
        timer_settings.short_break = data["shortBreak"]
        timer_settings.long_break = data["longBreak"]

    db.session.commit()
    return jsonify({"message": "Timer settings saved successfully"})


@auth_bp.route("/add-topic", methods=["POST"])
@jwt_required()
def add_topic():
    user_id = get_jwt_identity()
    data = request.get_json()

    new_topic = Topics(name=data["name"], user_id=int(user_id))
    db.session.add(new_topic)
    db.session.commit()

    return jsonify({"id": new_topic.id, "name": new_topic.name})


@auth_bp.route("/get-topics", methods=["GET", "OPTIONS"])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@jwt_required()
def get_topics():
    try:
        user_id = get_jwt_identity()

        topics = Topics.query.filter_by(user_id=user_id).all()

        result = [{"id": topic.id, "name": topic.name} for topic in topics]

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500


@auth_bp.route("/get-timer-settings", methods=["GET", "OPTIONS"])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@jwt_required()
def get_timer_settings():
    try:
        user_id = get_jwt_identity()

        timer_settings = TimerSettings.query.filter_by(user_id=user_id).first()

        if not timer_settings:
            return (
                jsonify(
                    {
                        "pomodoro": 25,
                        "short_break": 5,
                        "long_break": 10,
                        "message": "Default timer settings returned as no settings were found.",
                    }
                ),
                200,
            )

        return (
            jsonify(
                {
                    "pomodoro": timer_settings.pomodoro,
                    "short_break": timer_settings.short_break,
                    "long_break": timer_settings.long_break,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500


@auth_bp.route("/delete-topic/<int:topic_id>", methods=["DELETE"])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@jwt_required()
def delete_topic(topic_id):
    user_id = get_jwt_identity()

    topic = Topics.query.filter_by(id=topic_id, user_id=user_id).first()
    if not topic:
        return jsonify({"error": "Topic not found or unauthorized"}), 404

    try:
        db.session.delete(topic)
        db.session.commit()
        return jsonify({"message": "Topic deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/save-sound-settings", methods=["POST", "OPTIONS"])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@jwt_required()
def save_sound_settings():
    user_id = get_jwt_identity()
    data = request.get_json()

    valid_sounds = ["chime", "success"]

    if "selected_sound" not in data:
        return jsonify({"error": "selected_sound is required"}), 400

    selected_sound = data["selected_sound"]

    if selected_sound not in valid_sounds:
        return jsonify({"error": f"Invalid sound. Choose from {valid_sounds}"}), 400

    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    sound_setting = user.sound_setting
    if sound_setting:
        sound_setting.selected_sound = selected_sound
    else:
        sound_setting = SoundSettings(user_id=user.id, selected_sound=selected_sound)
        db.session.add(sound_setting)

    db.session.commit()

    return (
        jsonify(
            {
                "message": "Sound setting updated successfully",
                "selected_sound": selected_sound,
            }
        ),
        200,
    )


@auth_bp.route("/get-sound-settings", methods=["GET", "OPTIONS"])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@jwt_required()
def get_sound_settings():

    user_id = get_jwt_identity()

    user = Users.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    sound_setting = user.sound_setting
    selected_sound = sound_setting.selected_sound if sound_setting else "chime"

    return jsonify({"selected_sound": selected_sound}), 200
