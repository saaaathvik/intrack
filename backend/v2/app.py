from flask import Flask, request, jsonify
import gspread
from flask_cors import CORS
import pytesseract
from pdf2image import convert_from_path
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2.service_account import Credentials
import os

app = Flask(__name__)

CORS(app, supports_credentials=True)

SHEET_ID = "ID"

SCOPES = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPES)
client = gspread.authorize(creds)

drive_service = build("drive", "v3", credentials=creds)

DRIVE_FOLDER_ID = "ID"

@app.route("/get_student", methods=["GET"])
def get_student():    
    reg_no = request.args.get("regNo")
    sheet = client.open_by_key(SHEET_ID).worksheet("2nd_Year_2022_2026")

    data = sheet.get_all_records()
    for row in data:
        if str(row["Register Number"]) == reg_no:
            return jsonify(row)

    return jsonify({"error": "Student not found"}), 404

@app.route("/update_student", methods=["POST"])
def update_student():
    try:
        data = request.form.to_dict()
        file = request.files.get("offerLetterButton")

        reg_no = str(data.get("regNo"))
        if not reg_no:
            return jsonify({"error": "Register Number is required"}), 400

        sheet = client.open_by_key(SHEET_ID).worksheet("2nd_Year_2022_2026")
        all_values = sheet.get_all_values()
        
        headers = [
            "regNo",
            "studentName",
            "phoneNo",
            "section",
            "obtainedInternship",
            "title",
            "period",
            "startDate",
            "endDate",
            "companyName",
            "placementSource",
            "stipend",
            "internshipType",
            "location",
            "permissionLetter",
            "completionCertificate",
            "internshipReport",
            "studentFeedback",
            "employerFeedback",
            "uploadFile"
        ]
        
        row_index = None

        for i, row in enumerate(all_values[1:], start=2):
            if str(row[0]) == reg_no:
                row_index = i
                break

        if row_index is None:
            return jsonify({"error": "Student not found"}), 404

        file_link = None
        if file:
            file_ext = os.path.splitext(file.filename)[1] 
            new_filename = f"{reg_no[-4:]}{file_ext}"

            temp_path = f"/tmp/{new_filename}"
            file.save(temp_path)

            images = convert_from_path(temp_path)
            extracted_text = " ".join([pytesseract.image_to_string(img) for img in images])
            
            required_fields = ["studentName", "startDate", "endDate"]
            missing_fields = [field for field in required_fields if str(data.get(field)) not in extracted_text]
            
            if missing_fields:
                os.remove(temp_path)
                return jsonify({
                    "success": False,
                    "message": f"File not uploaded. Missing fields: {', '.join(missing_fields)}"
                })

            file_metadata = {"name": new_filename, "parents": [DRIVE_FOLDER_ID]}
            media = MediaFileUpload(temp_path, resumable=True)

            uploaded_file = drive_service.files().create(
                body=file_metadata, media_body=media, fields="id"
            ).execute()

            file_link = f"https://drive.google.com/file/d/{uploaded_file['id']}/view"

            os.remove(temp_path)

            data["uploadFile"] = file_link
            
            checkbox_headers = [
                "permissionLetter",
                "completionCertificate",
                "internshipReport",
                "studentFeedback",
                "employerFeedback",
            ]

            for header in checkbox_headers:
                data[header] = "Yes" if data.get(header) == "true" else "No"

        updated_row = [data.get(header) for header in headers]
        sheet.update([updated_row], f"A{row_index}:U{row_index}")

        return jsonify({
            "success": True,
            "message": "Student data updated successfully!",
            "file_link": file_link
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_full_data", methods=["GET"])
def get_full_data():
    try:
        sheet = client.open_by_key(SHEET_ID).worksheet("2nd_Year_2022_2026")
        data = sheet.get_all_records()

        if not data:
            return jsonify({
                "success": False,
                "error": "No records found",
                "data": []
            }), 404
        
        return jsonify({
            "success": True,
            "count": len(data),
            "data": data
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": "Failed to fetch data",
            "message": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)