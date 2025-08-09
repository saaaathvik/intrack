from flask import Flask, request, jsonify
import gspread
from flask_cors import CORS, cross_origin
from google.oauth2.service_account import Credentials

app = Flask(__name__)

CORS(app, supports_credentials=True)

SHEET_ID = "ID"

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPES)
client = gspread.authorize(creds)

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
        data = request.get_json()
        reg_no = str(data.get("Register Number"))
        
        if not reg_no:
            return jsonify({"error": "Register Number is required"}), 400
        
        sheet = client.open_by_key(SHEET_ID).worksheet("2nd_Year_2022_2026")

        all_values = sheet.get_all_values()
        headers = all_values[0]
        
        row_index = None
        for i, row in enumerate(all_values[1:], start=2):
            if str(row[1]) == reg_no:
                row_index = i
                break
        
        if row_index is None:
            return jsonify({"error": "Student not found"}), 404

        updated_row = [data.get(header, row[idx]) for idx, header in enumerate(headers)]

        sheet.update(f"A{row_index}:U{row_index}", [updated_row])
        
        return jsonify({"success": True, "message": "Student data updated successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)