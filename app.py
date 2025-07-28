
from flask import Flask, request, jsonify, send_from_directory
import json
import os
from google.oauth2.service_account import Credentials
import gspread
from datetime import datetime

app = Flask(__name__)

# Initialize Google Sheets client
def get_sheets_client():
    try:
        # Get service account credentials from environment variable
        creds_json = os.environ.get('GOOGLE_SERVICE_ACCOUNT_KEY')
        if not creds_json:
            raise ValueError("GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set")
        
        creds_dict = json.loads(creds_json)
        
        # Define the scope
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/drive'
        ]
        
        # Create credentials
        creds = Credentials.from_service_account_info(creds_dict, scopes=scope)
        
        # Initialize the client
        client = gspread.authorize(creds)
        return client
    except Exception as e:
        print(f"Error initializing Google Sheets client: {e}")
        return None

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/submit-appointment', methods=['POST'])
def submit_appointment():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'phone', 'appointmentDate', 'timeSlots', 'reason']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get Google Sheets client
        client = get_sheets_client()
        if not client:
            return jsonify({'error': 'Unable to connect to Google Sheets'}), 500
        
        # Get the spreadsheet (you'll need to create this and share it with the service account)
        spreadsheet_id = os.environ.get('GOOGLE_SHEET_ID')
        if not spreadsheet_id:
            return jsonify({'error': 'Google Sheet ID not configured'}), 500
        
        try:
            sheet = client.open_by_key(spreadsheet_id).sheet1
        except gspread.SpreadsheetNotFound:
            return jsonify({'error': 'Spreadsheet not found or not accessible'}), 500
        
        # Prepare the row data
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        time_slots_str = ', '.join(data['timeSlots']) if isinstance(data['timeSlots'], list) else data['timeSlots']
        
        row_data = [
            timestamp,
            data['name'],
            data['phone'],
            data['appointmentDate'],
            time_slots_str,
            data['reason']
        ]
        
        # Add headers if the sheet is empty
        if len(sheet.get_all_records()) == 0:
            headers = ['Timestamp', 'Name', 'Phone', 'Appointment Date', 'Preferred Time Slots', 'Reason for Visit']
            sheet.insert_row(headers, 1)
        
        # Append the new appointment data
        sheet.append_row(row_data)
        
        return jsonify({'success': True, 'message': 'Appointment submitted successfully'})
        
    except Exception as e:
        print(f"Error submitting appointment: {e}")
        return jsonify({'error': 'An error occurred while submitting your appointment'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
