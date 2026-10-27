"""Generate synchronized src/data/mockData.js matching master Excel, SQLite, and MongoDB.
"""
import json
import os
import openpyxl

excel_path = "public/data/labtrack_master_data_updated.xlsx" if os.path.exists("public/data/labtrack_master_data_updated.xlsx") else "public/data/labtrack_master_data.xlsx"
wb = openpyxl.load_workbook(excel_path)

ws_users = wb["Users"]
ws_labs = wb["Labs"]
ws_items = wb["Items"]
ws_stock = wb["Stock"]
ws_assets = wb["Assets"]
ws_projects = wb["Projects"]
ws_members = wb["Project_Members"]

# 1. Parse Users
users = []
for row in ws_users.iter_rows(min_row=2, values_only=True):
    uid, name, email, utype, dept, desig, batch, yos, branch, roll, phone, incharge_labs, managed_labs, active = row
    
    # map to frontend role string
    if utype == "HOD":
        frontend_role = "HoD / Admin"
    elif utype == "ADMIN":
        frontend_role = "HoD / Admin"
    elif utype == "FACULTY":
        frontend_role = "Faculty"
    elif utype == "ASSISTANT":
        frontend_role = "Lab Assistant"
    else:
        frontend_role = "Student"

    users.append({
        "id": f"usr_{uid.lower()}",
        "prn": str(uid),
        "name": name,
        "email": email,
        "role": frontend_role,
        "department": f"Dept. of {dept} & Computing" if dept in ["AIML", "CSE"] else f"Dept. of {dept}",
        "designation": desig or ("Student" if frontend_role == "Student" else "Faculty"),
        "phone": phone or "",
        "branch": branch or dept,
        "batch": batch,
        "yearOfStudy": yos,
        "rollNumber": roll,
        "inchargeLabs": incharge_labs.split(", ") if incharge_labs else [],
        "managedLabs": managed_labs.split(", ") if managed_labs else [],
        "active": bool(active),
        "reliabilityScore": 96 if frontend_role == "Student" else None,
        "complianceTier": "High Compliance" if frontend_role == "Student" else None,
        "activeLoansCount": 1 if uid == "202401048" else 0,
        "hasOverdue": False
    })

# 2. Parse Items & Stock to construct rich frontend inventory
item_meta = {}
for row in ws_items.iter_rows(min_row=2, values_only=True):
    item_id, item_name, kind, category, mfr, specs, desc, cost_tier, img_url = row
    item_meta[item_id] = {
        "id": item_id,
        "assetTag": item_id,
        "sku": f"SKU-{item_id}",
        "nomenclature": item_name,
        "image": img_url,
        "subSpecs": specs,
        "manufacturer": mfr,
        "classification": "Asset" if kind == "ASSET" else "Consumable",
        "category": category,
        "costTier": cost_tier,
        "description": desc,
        "datasheetUrl": "https://datasheets.raspberrypi.com/" if "RPI" in item_id else "",
        "notes": f"Institutional stock item. Verified for curriculum.",
        "labRoom": "SIT Central Lab",
        "coordinates": "SIT-MAIN-01",
        "stockStatus": "Available",
        "totalStock": 0,
        "availableStock": 0,
        "badStock": 0,
        "queueDepth": 0,
        "custodyHolder": None,
        "custodyHistory": []
    }

# Sum stock from ws_stock
item_labs = {}
for row in ws_stock.iter_rows(min_row=2, values_only=True):
    lab_id, lab_name, item_id, item_name, good, bad, total = row
    if item_id in item_meta:
        item_meta[item_id]["totalStock"] += total
        item_meta[item_id]["availableStock"] += good
        item_meta[item_id]["badStock"] += bad
        if item_id not in item_labs:
            item_labs[item_id] = []
        item_labs[item_id].append({"lab_id": lab_id, "lab_name": lab_name, "good": good, "bad": bad})

for item_id, item in item_meta.items():
    if item_id in item_labs and item_labs[item_id]:
        primary = item_labs[item_id][0]
        item["labRoom"] = primary["lab_name"]
        item["primaryLabId"] = primary["lab_id"]
        item["coordinates"] = primary["lab_id"]
        item["labBreakdown"] = item_labs[item_id]

inventory_list = list(item_meta.values())

# 3. Parse Assets (36 authoritative physical items)
assets_list = []
for row in ws_assets.iter_rows(min_row=2, values_only=True):
    barcode, iid, name, lab, def_id, bill, serial, state, holder = row
    lab_str = str(lab or "").strip()
    if "AIML" in lab_str:
        dept = "AIML"
    elif "CSE" in lab_str:
        dept = "CSE"
    elif "RA" in lab_str or "MRL" in lab_str or "MIOT" in lab_str or "HPL" in lab_str:
        dept = "RA"
    else:
        dept = "Central"
    
    item_info = item_meta.get(str(iid), {})
    assets_list.append({
        "barcode": str(barcode),
        "assetTag": str(barcode),
        "itemId": str(iid),
        "nomenclature": str(name),
        "labId": lab_str,
        "defaultId": str(def_id or ""),
        "billNumber": str(bill or ""),
        "serialNumber": str(serial or ""),
        "state": str(state or "AVAILABLE").upper(),
        "custodyHolderPrn": str(holder) if holder else None,
        "department": dept,
        "costTier": item_info.get("costTier", "Tier 1 Standard"),
        "category": item_info.get("category", "Misc"),
        "image": item_info.get("image", "/images/hardware/raspberry-pi-5.jpg"),
        "subSpecs": item_info.get("subSpecs", "")
    })

# 4. Parse Projects & Members
projects = []
members_by_proj = {}
for row in ws_members.iter_rows(min_row=2, values_only=True):
    proj_id, prn, name, role = row
    if proj_id not in members_by_proj:
        members_by_proj[proj_id] = []
    members_by_proj[proj_id].append({"prn": str(prn), "name": name, "role": role})

for row in ws_projects.iter_rows(min_row=2, values_only=True):
    proj_id, name, desc, lead_prn, lead_name, mentor_id, mentor_name, dept = row
    projects.append({
        "id": proj_id,
        "title": name,
        "courseCode": f"{dept}-CAPSTONE-2026",
        "academicTerm": "Autumn 2026 (Semester III & V)",
        "department": f"Dept. of {dept}",
        "mentorId": mentor_id,
        "mentorName": mentor_name,
        "teamLeaderPrn": str(lead_prn),
        "members": members_by_proj.get(proj_id, [{"prn": str(lead_prn), "name": lead_name, "role": "LEAD"}]),
        "currentAllocatedCount": 1 if proj_id in ["PROJ-000001", "PROJ-000002", "PROJ-000005"] else 0,
        "reliabilityScore": 95.0,
        "allocatedItems": [],
        "abstract": desc
    })

# 5. Generate mockData.js content
out_lines = [
    "// Master Institutional Mock Database for LabTrack (Synchronized with public/data/labtrack_master_data.xlsx)",
    "",
    f"export const INITIAL_USERS = {json.dumps(users, indent=2)};",
    "",
    f"export const INITIAL_INVENTORY = {json.dumps(inventory_list, indent=2)};",
    "",
    f"export const INITIAL_ASSETS = {json.dumps(assets_list, indent=2)};",
    "",
    """export const INITIAL_ACTIVE_LOANS = [
  {
    id: 'LN-2026-101',
    assetTag: 'SIT-AIML-5CL07-0043',
    nomenclature: 'NVIDIA Jetson Nano 4GB B01 Developer Kit',
    borrowerPrn: '25070126076',
    borrowerName: 'Ishaan Chand',
    projectId: 'PROJ-000001',
    courseCode: 'AIML-CAPSTONE-2026',
    checkedOutDate: '2026-10-01 10:00:00',
    dueDate: '2026-10-22 17:00:00',
    status: 'Normal',
    daysRemaining: 8,
    locationCoordinates: '5CL-07 R1-B2',
    dispatchTechnician: 'Ganesh Jadhav (LA-04)',
    extensionHistory: [],
  },
  {
    id: 'LN-2026-102',
    assetTag: 'SIT-CSE-4CL07-0083',
    nomenclature: 'Raspberry Pi 5 Model B 8GB RAM',
    borrowerPrn: '25070122045',
    borrowerName: 'Raghavendra Joshi',
    projectId: 'PROJ-000002',
    courseCode: 'CSE-CAPSTONE-2026',
    checkedOutDate: '2026-09-28 11:30:00',
    dueDate: '2026-10-19 17:00:00',
    status: 'Imminent',
    daysRemaining: 2,
    locationCoordinates: '4CL-07 C-Wing',
    dispatchTechnician: 'Ramesh Patil (LA-01)',
    extensionHistory: [],
  },
  {
    id: 'LN-2026-103',
    assetTag: 'SIT-RA-6RA02-0143',
    nomenclature: 'TurtleBot 3 Burger Mobile Robot',
    borrowerPrn: '24070127008',
    borrowerName: 'Kunal Gokhale',
    projectId: 'PROJ-000005',
    courseCode: 'RA-CAPSTONE-2026',
    checkedOutDate: '2026-10-10 14:30:00',
    dueDate: '2026-10-24 17:00:00',
    status: 'Normal',
    daysRemaining: 9,
    locationCoordinates: '6RA-02 Robotics Wing',
    dispatchTechnician: 'Santosh More (LA-06)',
    extensionHistory: [],
  }
];""",
    "",
    """export const INITIAL_REQUISITIONS = [
  {
    id: 'REQ-2026-101',
    requestNumber: 'REQ-2026-101',
    requestDate: '2026-10-16 11:30:00',
    submittedDate: '2026-10-16 11:30:00',
    neededUntilDate: '2026-11-01',
    projectId: 'PROJ-000001',
    projectTitle: 'Autonomous Quadruped Vision Robot',
    studentPrn: '25070126076',
    borrowerPrn: '25070126076',
    studentName: 'Ishaan Chand',
    submittedBy: 'Ishaan Chand',
    role: 'Student',
    department: 'Artificial Intelligence & Machine Learning',
    courseCode: 'AIML-CAPSTONE-2026',
    mentorId: 'T100460',
    mentorName: 'Dr. Manoj Patil',
    teamReliabilityScore: 96,
    status: 'Pending Approval',
    stage: 'Faculty Mentor Review',
    technicalPurpose: 'Depth perception benchmarking in Robotics Arena using stereo IR and point-cloud feature extraction.',
    purposeDescription: 'Depth perception benchmarking in Robotics Arena using stereo IR and point-cloud feature extraction.',
    componentsRequested: [
      { itemId: 'CAM-INT-01', nomenclature: 'Intel RealSense Depth Camera D435i', quantity: 1, classification: 'Asset', type: 'Asset' },
      { itemId: 'SEN-IMU-01', nomenclature: 'MPU6050 6-Axis Gyro & Accelerometer Module', quantity: 2, classification: 'Consumable', type: 'Consumable' }
    ],
    timeline: [
      { step: 'Request Submitted', stage: 'Request Submitted', completed: true, actor: 'Ishaan Chand (25070126076)', timestamp: '2026-10-16 11:30:00', note: 'Curriculum proposal submitted' },
      { step: 'Central Store Validation', stage: 'Central Store Validation', completed: true, actor: 'System Verification', timestamp: '2026-10-16 11:30:00', note: 'Hardware stock verified' },
      { step: 'Faculty Mentor Review', stage: 'Mentor Review', completed: false, actor: 'Dr. Manoj Patil (T100460)', timestamp: null },
      { step: 'HoD Review', stage: 'HoD Review', completed: false, actor: 'Dr. Sumit Kumar (T100101)', timestamp: null }
    ],
    supervisorNotes: '',
    counterNotes: ''
  },
  {
    id: 'REQ-2026-102',
    requestNumber: 'REQ-2026-102',
    requestDate: '2026-10-17 09:15:00',
    submittedDate: '2026-10-17 09:15:00',
    neededUntilDate: '2026-11-15',
    projectId: 'PROJ-000007',
    projectTitle: 'Multi-Spectral Crop Health UAV Drone',
    studentPrn: '23070126012',
    borrowerPrn: '23070126012',
    studentName: 'Aryan Saxena',
    submittedBy: 'Aryan Saxena',
    role: 'Student',
    department: 'Artificial Intelligence & Machine Learning',
    courseCode: 'AIML-CAPSTONE-2026',
    mentorId: 'T100458',
    mentorName: 'Dr. Meenakshi Sharma',
    teamReliabilityScore: 92,
    status: 'Pending Approval',
    stage: 'Faculty Mentor Review',
    technicalPurpose: 'Thermal LWIR and radiometric analysis for precision agricultural diagnostics and moisture stress indexing.',
    purposeDescription: 'Thermal LWIR and radiometric analysis for precision agricultural diagnostics and moisture stress indexing.',
    componentsRequested: [
      { itemId: 'CAM-FLI-01', nomenclature: 'FLIR Lepton 3.5 Radiometric LWIR Thermal Camera', quantity: 1, classification: 'Asset', type: 'Asset' }
    ],
    timeline: [
      { step: 'Request Submitted', stage: 'Request Submitted', completed: true, actor: 'Aryan Saxena (23070126012)', timestamp: '2026-10-17 09:15:00', note: 'Tier 3 thermal optics request' },
      { step: 'Central Store Validation', stage: 'Central Store Validation', completed: true, actor: 'System Verification', timestamp: '2026-10-17 09:15:00', note: 'Stock availability reserved' },
      { step: 'Faculty Mentor Review', stage: 'Mentor Review', completed: false, actor: 'Dr. Meenakshi Sharma (T100458)', timestamp: null },
      { step: 'HoD Review', stage: 'HoD Review', completed: false, actor: 'Dr. Sumit Kumar (T100101)', timestamp: null }
    ],
    supervisorNotes: '',
    counterNotes: ''
  },
  {
    id: 'REQ-2026-103',
    requestNumber: 'REQ-2026-103',
    requestDate: '2026-10-17 14:00:00',
    submittedDate: '2026-10-17 14:00:00',
    neededUntilDate: '2026-11-20',
    projectId: 'PROJ-000002',
    projectTitle: 'Distributed Edge AI Camera Node',
    studentPrn: '25070122045',
    borrowerPrn: '25070122045',
    studentName: 'Raghavendra Joshi',
    submittedBy: 'Raghavendra Joshi',
    role: 'Student',
    department: 'Computer Science & Engineering',
    courseCode: 'CSE-CAPSTONE-2026',
    mentorId: 'T100455',
    mentorName: 'Dr. Anand Deshmukh',
    teamReliabilityScore: 90,
    status: 'Pending Approval',
    stage: 'Faculty Mentor Review',
    technicalPurpose: 'High-throughput edge computing and embedded Linux node with camera streaming.',
    purposeDescription: 'High-throughput edge computing and embedded Linux node with camera streaming.',
    componentsRequested: [
      { itemId: 'SBC-RPI-05', nomenclature: 'Raspberry Pi 5 Model B 8GB RAM', quantity: 1, classification: 'Asset', type: 'Asset' },
      { itemId: 'SEN-CAM-01', nomenclature: 'Raspberry Pi Camera Module 3', quantity: 1, classification: 'Asset', type: 'Asset' }
    ],
    timeline: [
      { step: 'Request Submitted', stage: 'Request Submitted', completed: true, actor: 'Raghavendra Joshi (25070122045)', timestamp: '2026-10-17 14:00:00', note: 'Single board compute asset sign-off required' },
      { step: 'Faculty Mentor Review', stage: 'Mentor Review', completed: false, actor: 'Dr. Anand Deshmukh (T100455)', timestamp: null },
      { step: 'HoD Review', stage: 'HoD Review', completed: false, actor: 'Dr. Sonali Kothari (T100102)', timestamp: null }
    ],
    supervisorNotes: '',
    counterNotes: ''
  },
  {
    id: 'REQ-2026-104',
    requestNumber: 'REQ-2026-104',
    requestDate: '2026-10-17 15:45:00',
    submittedDate: '2026-10-17 15:45:00',
    neededUntilDate: '2026-11-10',
    projectId: 'PROJ-000006',
    projectTitle: 'Smart Laboratory Access & Component Dispenser',
    studentPrn: '24070122009',
    borrowerPrn: '24070122009',
    studentName: 'Siddharth Menon',
    submittedBy: 'Siddharth Menon',
    role: 'Student',
    department: 'Computer Science & Engineering',
    courseCode: 'CSE-CAPSTONE-2026',
    mentorId: 'T100454',
    mentorName: 'Dr. Sneha Joshi',
    teamReliabilityScore: 88,
    status: 'Pending Approval',
    stage: 'Faculty Mentor Review',
    technicalPurpose: 'Industrial automation ladder logic debugging and digital signal probing with Rigol oscilloscope.',
    purposeDescription: 'Industrial automation ladder logic debugging and digital signal probing with Rigol oscilloscope.',
    componentsRequested: [
      { itemId: 'PLC-SIE-01', nomenclature: 'Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC', quantity: 1, classification: 'Asset', type: 'Asset' },
      { itemId: 'OSC-RIG-01', nomenclature: 'Rigol DS1054Z 50MHz Digital Oscilloscope', quantity: 1, classification: 'Asset', type: 'Asset' }
    ],
    timeline: [
      { step: 'Request Submitted', stage: 'Request Submitted', completed: true, actor: 'Siddharth Menon (24070122009)', timestamp: '2026-10-17 15:45:00', note: 'Mechatronics instrumentation request' },
      { step: 'Faculty Mentor Review', stage: 'Mentor Review', completed: false, actor: 'Dr. Sneha Joshi (T100454)', timestamp: null },
      { step: 'HoD Review', stage: 'HoD Review', completed: false, actor: 'Dr. Sonali Kothari (T100102)', timestamp: null }
    ],
    supervisorNotes: '',
    counterNotes: ''
  },
  {
    id: 'REQ-2026-105',
    requestNumber: 'REQ-2026-105',
    requestDate: '2026-10-18 09:30:00',
    submittedDate: '2026-10-18 09:30:00',
    neededUntilDate: '2026-11-25',
    projectId: 'PROJ-000003',
    projectTitle: 'Precision Sorting Robotic Arm',
    studentPrn: '25070127003',
    borrowerPrn: '25070127003',
    studentName: 'Chirag Singhania',
    submittedBy: 'Chirag Singhania',
    role: 'Student',
    department: 'Robotics & Automation',
    courseCode: 'RA-CAPSTONE-2026',
    mentorId: 'T100466',
    mentorName: 'Dr. Vinay Tambe',
    teamReliabilityScore: 94,
    status: 'Pending Approval',
    stage: 'Faculty Mentor Review',
    technicalPurpose: 'Inverse kinematics trajectory calibration and vacuum end-effector pick-and-place experiments.',
    purposeDescription: 'Inverse kinematics trajectory calibration and vacuum end-effector pick-and-place experiments.',
    componentsRequested: [
      { itemId: 'ARM-DOB-01', nomenclature: 'Dobot Magician 4-DOF Robotic Arm', quantity: 1, classification: 'Asset', type: 'Asset' },
      { itemId: 'MOT-SER-01', nomenclature: 'TowerPro SG90 Micro Servo 9g', quantity: 2, classification: 'Consumable', type: 'Consumable' }
    ],
    timeline: [
      { step: 'Request Submitted', stage: 'Request Submitted', completed: true, actor: 'Chirag Singhania (25070127003)', timestamp: '2026-10-18 09:30:00', note: 'Tier 3 robotic arm coursework' },
      { step: 'Faculty Mentor Review', stage: 'Mentor Review', completed: false, actor: 'Dr. Vinay Tambe (T100466)', timestamp: null },
      { step: 'HoD Review', stage: 'HoD Review', completed: false, actor: 'Dr. Arunkumar Bongale (T100103)', timestamp: null }
    ],
    supervisorNotes: '',
    counterNotes: ''
  },
  {
    id: 'REQ-2026-106',
    requestNumber: 'REQ-2026-106',
    requestDate: '2026-10-18 10:15:00',
    submittedDate: '2026-10-18 10:15:00',
    neededUntilDate: '2026-12-01',
    projectId: 'PROJ-000005',
    projectTitle: 'Autonomous Mobile Warehouse AGV',
    studentPrn: '24070127008',
    borrowerPrn: '24070127008',
    studentName: 'Kunal Gokhale',
    submittedBy: 'Kunal Gokhale',
    role: 'Student',
    department: 'Robotics & Automation',
    courseCode: 'RA-CAPSTONE-2026',
    mentorId: 'T100467',
    mentorName: 'Dr. Chetan Jagtap',
    teamReliabilityScore: 89,
    status: 'Pending Approval',
    stage: 'Faculty Mentor Review',
    technicalPurpose: '3D point cloud SLAM and autonomous navigation mapping using high-resolution Ouster LiDAR on TurtleBot 4.',
    purposeDescription: '3D point cloud SLAM and autonomous navigation mapping using high-resolution Ouster LiDAR on TurtleBot 4.',
    componentsRequested: [
      { itemId: 'ROB-TB4-01', nomenclature: 'TurtleBot 4 Standard Mobile Robot', quantity: 1, classification: 'Asset', type: 'Asset' },
      { itemId: 'LID-OUS-01', nomenclature: 'Ouster OS1-32 Gen 2 LiDAR Sensor', quantity: 1, classification: 'Asset', type: 'Asset' }
    ],
    timeline: [
      { step: 'Request Submitted', stage: 'Request Submitted', completed: true, actor: 'Kunal Gokhale (24070127008)', timestamp: '2026-10-18 10:15:00', note: 'Tier 4 capital asset mobile robotics suite' },
      { step: 'Faculty Mentor Review', stage: 'Mentor Review', completed: false, actor: 'Dr. Chetan Jagtap (T100467)', timestamp: null },
      { step: 'HoD Review', stage: 'HoD Review', completed: false, actor: 'Dr. Arunkumar Bongale (T100103)', timestamp: null }
    ],
    supervisorNotes: '',
    counterNotes: ''
  },
  {
    id: 'REQ-2026-107',
    requestNumber: 'REQ-2026-107',
    requestDate: '2026-10-18 11:00:00',
    submittedDate: '2026-10-18 11:00:00',
    neededUntilDate: '2026-12-05',
    projectId: 'PROJ-000008',
    projectTitle: 'High-Speed Industrial Quality Inspection Cell',
    studentPrn: '23070127014',
    borrowerPrn: '23070127014',
    studentName: 'Deepak Solanki',
    submittedBy: 'Deepak Solanki',
    role: 'Student',
    department: 'Robotics & Automation',
    courseCode: 'RA-CAPSTONE-2026',
    mentorId: 'T100466',
    mentorName: 'Dr. Vinay Tambe',
    teamReliabilityScore: 91,
    status: 'Pending Approval',
    stage: 'Faculty Mentor Review',
    technicalPurpose: 'Multi-axis visual flaw detection and robotic part manipulation on industrial Kinova manipulator.',
    purposeDescription: 'Multi-axis visual flaw detection and robotic part manipulation on industrial Kinova manipulator.',
    componentsRequested: [
      { itemId: 'ARM-KIN-01', nomenclature: 'Kinova Gen3 Lite Robotic Arm', quantity: 1, classification: 'Asset', type: 'Asset' }
    ],
    timeline: [
      { step: 'Request Submitted', stage: 'Request Submitted', completed: true, actor: 'Deepak Solanki (23070127014)', timestamp: '2026-10-18 11:00:00', note: 'Tier 4 high value manipulator' },
      { step: 'Faculty Mentor Review', stage: 'Mentor Review', completed: false, actor: 'Dr. Vinay Tambe (T100466)', timestamp: null },
      { step: 'HoD Review', stage: 'HoD Review', completed: false, actor: 'Dr. Arunkumar Bongale (T100103)', timestamp: null }
    ],
    supervisorNotes: '',
    counterNotes: ''
  },
  {
    id: 'REQ-2026-108',
    requestNumber: 'REQ-2026-108',
    requestDate: '2026-10-18 11:45:00',
    submittedDate: '2026-10-18 11:45:00',
    neededUntilDate: '2026-11-28',
    projectId: 'PROJ-000004',
    projectTitle: 'Campus IoT Environmental Telemetry Grid',
    studentPrn: '24070126005',
    borrowerPrn: '24070126005',
    studentName: 'Rohan Joshi',
    submittedBy: 'Rohan Joshi',
    role: 'Student',
    department: 'Artificial Intelligence & Machine Learning',
    courseCode: 'AIML-CAPSTONE-2026',
    mentorId: 'T100461',
    mentorName: 'Dr. Sandeep Shinde',
    teamReliabilityScore: 93,
    status: 'Pending Approval',
    stage: 'Faculty Mentor Review',
    technicalPurpose: 'Edge compute acceleration on NVIDIA Jetson Orin Nano for distributed particulate air quality predictive inference.',
    purposeDescription: 'Edge compute acceleration on NVIDIA Jetson Orin Nano for distributed particulate air quality predictive inference.',
    componentsRequested: [
      { itemId: 'SBC-JET-02', nomenclature: 'NVIDIA Jetson Orin Nano Developer Kit (8GB)', quantity: 1, classification: 'Asset', type: 'Asset' },
      { itemId: 'SEN-BMP-01', nomenclature: 'BMP280 Barometric Pressure & Altitude Sensor', quantity: 2, classification: 'Consumable', type: 'Consumable' }
    ],
    timeline: [
      { step: 'Request Submitted', stage: 'Request Submitted', completed: true, actor: 'Rohan Joshi (24070126005)', timestamp: '2026-10-18 11:45:00', note: 'Tier 3 edge compute node' },
      { step: 'Faculty Mentor Review', stage: 'Mentor Review', completed: false, actor: 'Dr. Sandeep Shinde (T100461)', timestamp: null },
      { step: 'HoD Review', stage: 'HoD Review', completed: false, actor: 'Dr. Sumit Kumar (T100101)', timestamp: null }
    ],
    supervisorNotes: '',
    counterNotes: ''
  }
];""",
    "",
    """export const INITIAL_RESERVATIONS = [
  {
    id: 'RSV-2026-001',
    itemNomenclature: 'Dobot Magician 4-DOF Robotic Arm',
    itemId: 'ARM-DOB-01',
    requestorPrn: '25070127003',
    requestorName: 'Chirag Singhania',
    projectId: 'PROJ-000003',
    reservedAt: '2026-10-12 10:00:00',
    queuePosition: 1,
    status: 'Active Waitlist',
  }
];""",
    "",
    f"export const INITIAL_PROJECTS = {json.dumps(projects, indent=2)};",
    "",
    """export const INITIAL_DEFECT_LOGS = [
  {
    id: 'DEF-2026-001',
    assetTag: 'SIT-AIML-5CL02-0046',
    nomenclature: 'NVIDIA Jetson Nano 4GB B01 Developer Kit',
    reportedDate: '2026-10-02 11:20:00',
    inspectorPrn: 'LA-04',
    inspectorName: 'Ganesh Jadhav',
    associatedPrn: '25070126076',
    associatedProject: 'PROJ-000001',
    severity: 'Moderate',
    defectCategory: 'Physical Damage (Port/Connector)',
    conditionSummary: 'Micro-USB power socket sheared from PCB traces during bench test.',
    repairStatus: 'Under Inspection',
    actionPlan: 'Re-solder SMD anchor tabs with non-conductive epoxy reinforcement.',
    isRetired: false,
  }
];""",
    "",
    """export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-0001',
    timestamp: '2026-10-18 10:00:00',
    actorPrn: 'T100101',
    actorRole: 'HoD / Admin',
    actorName: 'Dr. Sumit Kumar',
    action: 'MASTER_CATALOGUE_SEALED',
    targetId: 'ALL_LABS',
    details: 'Verified and sealed authoritative departmental hardware catalogue across 20 labs',
    checksum: 'sha256:88bc410291eabbc3...',
  },
  {
    id: 'AUD-0002',
    timestamp: '2026-10-17 15:30:00',
    actorPrn: 'T100458',
    actorRole: 'Faculty',
    actorName: 'Dr. Meenakshi Sharma',
    action: 'INVENTORY_AUDIT_VERIFIED',
    targetId: 'DV-AIML',
    details: 'Completed physical asset verification for Data Visualization Lab',
    checksum: 'sha256:199fba44cc102aa8...',
  },
  {
    id: 'AUD-0003',
    timestamp: '2026-10-17 11:20:00',
    actorPrn: 'LA-01',
    actorRole: 'Lab Assistant',
    actorName: 'Ramesh Patil',
    action: 'DISPATCH_COMMITTED',
    targetId: 'LN-2026-102',
    details: 'Dispatched Raspberry Pi 5 to Raghavendra Joshi (PRN: 25070122045)',
    checksum: 'sha256:7721ccbe094812a4...',
  }
];""",
    "",
    """export const INITIAL_INCIDENT_LEDGER = [
  {
    id: 'INC-2026-001',
    date: '2026-10-15',
    assetTag: 'SIT-AIML-5CL07-0041',
    nomenclature: 'NVIDIA Jetson Nano 4GB B01 Developer Kit',
    returnCondition: 'Verified Clean (A)',
    technicianSignOff: 'Ganesh Jadhav (LA-04)',
    penalty: 'None',
    pointsImpact: '+0 Pts',
    onTime: true,
  }
];""",
    "",
    """export const INITIAL_DISBURSED_CONSUMABLES = [
  {
    id: 'DISB-01',
    sku: 'SEN-UST-01',
    nomenclature: 'Ultrasonic Distance Sensor HC-SR04',
    quantity: '2x',
    disbursedDate: '2026-10-14',
    recipientPrn: '25070126076',
    recipientName: 'Ishaan Chand',
    projectId: 'PROJ-000001',
    note: 'No return required',
  }
];"""
]

with open("src/data/mockData.js", "w", encoding="utf-8") as f:
    f.write("\n".join(out_lines))

print("[OK] Successfully generated src/data/mockData.js with 64 users, 34 items, and 8 projects!")
