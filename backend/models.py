from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)

    timer_settings = db.relationship("TimerSettings", backref="user", lazy=True)
    timer_data = db.relationship("TimerData", backref="user", lazy=True)
    topics = db.relationship("Topics", backref="user", lazy=True)
    sound_setting = db.relationship("SoundSettings", backref="user", uselist=False, lazy=True) 

class TimerSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pomodoro = db.Column(db.Integer, default=25)
    short_break = db.Column(db.Integer, default=5)
    long_break = db.Column(db.Integer, default=10)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

class Topics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

class TimerData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_name = db.Column(db.String(100), nullable=False)
    elapsed_time = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class SoundSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    selected_sound = db.Column(db.String(100), nullable=False, default="default") 
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)  
