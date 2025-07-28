
# CoolClinic Setup Guide

## Complete Google Sheets Integration Setup

This guide will show you how to set up a dynamic appointment system that can pull available time slots from Google Sheets and automatically post new appointments.

### Part 1: Basic Google Sheets Integration

#### 1. Create Your Google Sheets Structure

You'll need **two Google Sheets** in the same spreadsheet:

1. **Sheet 1: "Appointments"** - This stores all booked appointments
2. **Sheet 2: "Available_Slots"** - This defines available time slots and dates

#### 2. Set Up Your Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "CoolClinic System"
3. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

#### 3. Configure Sheet 1: "Appointments"
- Rename the first sheet to "Appointments"
- Add these headers in row 1:
  ```
  A1: Timestamp
  B1: Name
  C1: Phone
  D1: Appointment Date
  E1: Preferred Time Slots
  F1: Reason for Visit
  G1: Status
  ```

#### 4. Create Sheet 2: "Available_Slots"
- Create a second sheet and name it "Available_Slots"
- Set up the structure as follows:

**Column A: Date** (format: YYYY-MM-DD)
```
A1: Date
A2: 2024-01-15
A3: 2024-01-16
A4: 2024-01-17
```

**Columns B-G: Time Slots** with availability status
```
B1: 9:00 AM - 10:00 AM
C1: 10:00 AM - 11:00 AM
D1: 11:00 AM - 12:00 PM
E1: 2:00 PM - 3:00 PM
F1: 3:00 PM - 4:00 PM
G1: 4:00 PM - 5:00 PM
```

**Row 2 onwards: Availability Status**
- Use "AVAILABLE" for open slots
- Use "BOOKED" for taken slots
- Use "BLOCKED" for unavailable times

Example:
```
    A              B           C           D           E           F           G
1   Date           9:00 AM-    10:00 AM-   11:00 AM-   2:00 PM-    3:00 PM-    4:00 PM-
                   10:00 AM    11:00 AM    12:00 PM    3:00 PM     4:00 PM     5:00 PM
2   2024-01-15     AVAILABLE   AVAILABLE   BOOKED      AVAILABLE   AVAILABLE   BLOCKED
3   2024-01-16     AVAILABLE   BOOKED      AVAILABLE   AVAILABLE   BOOKED      AVAILABLE
4   2024-01-17     BLOCKED     AVAILABLE   AVAILABLE   AVAILABLE   AVAILABLE   AVAILABLE
```

### Part 2: Google Cloud Setup

#### 1. Create a Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API" and enable it
4. Create a service account:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name it "coolclinic-scheduler" and create
5. Create a key for the service account:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key" > "JSON"
   - Download the JSON file

#### 2. Share the Google Sheets
1. Open your "CoolClinic System" spreadsheet
2. Click "Share" button
3. Add the service account email (found in the JSON file as "client_email")
4. Give it "Editor" permissions

### Part 3: Replit Configuration

#### 1. Configure Replit Secrets
1. In your Replit project, open the Secrets tab (🔒 icon in the sidebar)
2. Add these secrets:
   - **GOOGLE_SERVICE_ACCOUNT_KEY**: Paste the entire contents of the downloaded JSON file
   - **GOOGLE_SHEET_ID**: Paste the spreadsheet ID from Part 1, step 3

#### 2. Update Your Flask Application

Your `app.py` is already configured for basic functionality. To add dynamic scheduling, you'll need to enhance it with these endpoints:

- `GET /api/available-dates` - Returns available dates
- `GET /api/available-slots/<date>` - Returns available time slots for a specific date
- `POST /submit-appointment` - Books appointment and updates availability

### Part 4: Dynamic Scheduling Implementation

The current system saves appointments to the "Appointments" sheet. To make it fully dynamic:

#### 1. Frontend Updates Needed
- Modify the date picker to only show available dates
- Update time slot checkboxes to only show available times for selected date
- Add real-time availability checking

#### 2. Backend Enhancements Needed
- Add endpoint to fetch available dates from "Available_Slots" sheet
- Add endpoint to get available time slots for specific dates
- Update appointment submission to mark slots as "BOOKED"
- Add appointment confirmation/cancellation features

### Part 5: Testing Your Setup

#### 1. Test Basic Integration
1. Run your Flask app using the "Run Flask App" workflow
2. Fill out the appointment form
3. Check the "Appointments" sheet - data should appear

#### 2. Test Dynamic Scheduling (after implementation)
1. Add dates and availability to "Available_Slots" sheet
2. Verify the frontend only shows available dates
3. Book an appointment and confirm the slot gets marked as "BOOKED"

### Part 6: Advanced Features

#### Optional Enhancements:
1. **Auto-cleanup**: Remove past dates from available slots
2. **Recurring availability**: Automatically generate weekly schedules
3. **Email notifications**: Send confirmation emails via Gmail API
4. **Admin dashboard**: View and manage all appointments
5. **Appointment reminders**: Send SMS/email reminders

### Part 7: Maintenance & Updates

#### Daily Tasks:
- Update "Available_Slots" sheet with new dates (can be automated)
- Review new appointments in "Appointments" sheet

#### Weekly Tasks:
- Clean up past dates from availability sheet
- Review appointment patterns and adjust time slots

### Troubleshooting

#### Common Issues:
1. **"Spreadsheet not found"**: Check service account has access to the sheet
2. **"API not enabled"**: Ensure Google Sheets API is enabled in Google Cloud
3. **"Permission denied"**: Verify service account email is added to sheet with Editor permissions
4. **"Invalid credentials"**: Check that GOOGLE_SERVICE_ACCOUNT_KEY secret is correctly formatted JSON

#### Debug Steps:
1. Check Replit console for error messages
2. Verify both secrets are set correctly
3. Test Google Sheets access manually through Google Sheets interface
4. Ensure your spreadsheet has both "Appointments" and "Available_Slots" sheets

### Security Notes

- Never share your service account JSON file
- The service account only has access to sheets you explicitly share with it
- Regularly review who has access to your Google Sheets
- Consider setting up separate service accounts for production vs development

### Next Steps

Once basic integration is working:
1. Implement the dynamic scheduling endpoints in `app.py`
2. Update the frontend JavaScript to use real availability data
3. Add appointment status management
4. Consider adding authentication for admin features

For advanced implementations, you can extend this system to include patient management, doctor scheduling, and automated reminder systems.
