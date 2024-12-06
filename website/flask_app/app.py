from flask import Flask, jsonify, request
from flask_cors import CORS 
import requests
import random
from pymongo import MongoClient, errors
import datetime
import json

app = Flask(__name__)
CORS(app) 

GENIUS_API_KEY = ''

GENIUS_API_URL = 'https://api.genius.com'
@app.route('/get-comments', methods=['GET'])
def get_comments():
   
    connection_string = ""
    client = MongoClient(connection_string)
    db = client["music-dash"]
    collection = db["comments"]

    comments_cursor = collection.find({}) 
    comments_list = []

  
    for comment in comments_cursor:
        comment['_id'] = str(comment['_id']) 
        comments_list.append(comment)

  
    return jsonify(comments_list)

@app.route('/submit-comment', methods=['POST'])
def submit_comment():
 

    data = request.get_json()
    name = data.get('name')
    comment = data.get('comment')
    connection_string = ""
    now = datetime.date.today()

    formatted_string = now.strftime("%Y-%m-%d %H:%M:%S")
    client = MongoClient(connection_string)
    db = client["music-dash"] 
    collection = db["comments"] 
    data_dict = {'name': name, 'comment': comment, 'date':formatted_string}
    collection.insert_one(data_dict)
    
    return jsonify(comment)

@app.route('/music-recs', methods=['GET'])
def get_three_random():
    num_songs = 0
    songs_info = []
    while num_songs < 3:
        random_id = random.randint(1, 250000)
        song_url = f"{GENIUS_API_URL}/songs/{random_id}"
        headers = {"Authorization": f"Bearer {GENIUS_API_KEY}"}
        
        # Send GET request to Genius API
        response = requests.get(song_url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            
            song = data['response']['song']
            
            song_title = song['title']
            song_artist = song['primary_artist']['name']
            song_url = song['url']
            song_image = song['song_art_image_thumbnail_url']
            
            song_dict = {
                'id': num_songs,
                'title': song_title,
                'artist': song_artist,
                'url': song_url,
                'image' : song_image
            }
            connection_string = ""
            now = datetime.date.today()

            formatted_string = now.strftime("%Y-%m-%d %H:%M:%S")
            client = MongoClient(connection_string)
            db = client["music-dash"] 
            collection = db["comments"] 
            
            collection.insert_one(song_dict)
            songs_info.append(song_dict)
           
            num_songs += 1
    for song in songs_info:
        if '_id' in song:
            del song['_id']
    return jsonify(songs_info)

if __name__ == '__main__':
    app.run(debug=True)  # Start Flask server
