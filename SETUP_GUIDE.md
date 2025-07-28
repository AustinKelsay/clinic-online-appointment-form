
# CoolClinic Setup Guide

## Google Sheets Integration Setup

To enable the appointment form to save data to Google Sheets, follow these steps:

### 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "CoolClinic Appointments" (or any name you prefer)
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### 2. Create a Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it
4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create
5. Create a key for the service account:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key" > "JSON"
   - Download the JSON file

### 3. Share the Google Sheet
1. Open your Google Sheet
2. Click "Share" button
3. Add the service account email (found in the JSON file as "client_email")
4. Give it "Editor" permissions

### 4. Configure Replit Secrets
1. In your Replit project, open the Secrets tab (🔒 icon in the sidebar)
2. Add these secrets:
   - **GOOGLE_SERVICE_ACCOUNT_KEY**: Paste the entire contents of the downloaded JSON file
   - **GOOGLE_SHEET_ID**: Paste the spreadsheet ID from step 1

### 5. Install Dependencies and Run
1. The dependencies will be automatically installed when you run the project
2. Click the "Run" button to start the Flask server
3. Your clinic appointment page will be available at the provided URL

## Testing the Integration
1. Fill out the appointment form on your website
2. Submit the form
3. Check your Google Sheet - the appointment data should appear as a new row

## Troubleshooting
- Make sure the service account email has been added to the Google Sheet with Editor permissions
- Verify that the Google Sheets API is enabled in your Google Cloud project
- Check that both secrets are correctly set in Replit
- Look at the console logs for any error messages

## Customization
- You can modify the time slots in `index.html`
- Adjust the styling in `style.css`
- Add more form fields by updating the HTML, CSS, and backend code
