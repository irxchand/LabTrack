"""Generate authoritative master data Excel workbook for LabTrack.
Adheres strictly to SIT Pune PRN conventions, Manoj Sir's faculty/staff contracts,
and Floor 4 (CSE), Floor 5 (AIML & CSE), Floor 6 (RA) lab topologies.
"""
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

os.makedirs("public/data", exist_ok=True)
os.makedirs("utilities", exist_ok=True)

wb = openpyxl.Workbook()
# Remove default sheet
wb.remove(wb.active)

# Color palettes (Clean Institutional Cupertino / Midnight Navy)
HEADER_FILL = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
HEADER_FONT = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
DATA_FONT = Font(name="Segoe UI", size=10)
BORDER_THIN = Border(
    left=Side(style='thin', color="E2E8F0"),
    right=Side(style='thin', color="E2E8F0"),
    top=Side(style='thin', color="E2E8F0"),
    bottom=Side(style='thin', color="E2E8F0")
)

def style_sheet(ws, headers, rows):
    ws.append(headers)
    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    ws.row_dimensions[1].height = 28

    for r_idx, row in enumerate(rows, start=2):
        ws.append(row)
        for col_idx in range(1, len(row) + 1):
            cell = ws.cell(row=r_idx, column=col_idx)
            cell.font = DATA_FONT
            cell.border = BORDER_THIN
            if isinstance(row[col_idx - 1], int) or (isinstance(row[col_idx - 1], str) and row[col_idx - 1].isdigit()):
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(vertical="center")
        ws.row_dimensions[r_idx].height = 20

    for col in ws.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

# ==============================================================================
# 1. LABS (Floors 4, 5, 6 — CSE, AIML, RA)
# ==============================================================================
LABS_DATA = [
    # 4th Floor - CSE Labs
    ["PPSL-CSE", "Programming and Problem Solving Lab", 4, "A Wing", "4th Floor (4CL-01)", "CSE", "T100451", "Dr. Nitin Sharma"],
    ["OSTL-CSE", "Open Source Tools Lab", 4, "A Wing", "4th Floor (4CL-02)", "CSE", "T100452", "Dr. Rajesh Kulkarni"],
    ["CC1-CSE", "Computer Center 1", 4, "B Wing", "4th Floor (4CC-01)", "CSE", "T100453", "Prof. Amit Verma"],
    ["CC2-CSE", "Computer Center 2", 4, "B Wing", "4th Floor (4CC-02)", "CSE", "T100453", "Prof. Amit Verma"],
    ["DSL-CSE", "Data Structure Lab (CL-06)", 4, "C Wing", "4th Floor, Computer Lab 6 (CL-06)", "CSE", "T100454", "Dr. Sneha Joshi"],
    ["PL-CSE", "Project Lab (CL-7)", 4, "C Wing", "4th Floor, Computer Lab 7 (C Wing) (CL-07)", "CSE", "T100455", "Dr. Anand Deshmukh"],
    ["DMAL-CSE", "Database Management and Analytics Lab (CL-9)", 4, "B Wing", "4th Floor, Computer Lab 9 (B Wing) (CL-09)", "CSE", "T100456", "Dr. Preeti Shinde"],

    # 5th Floor - AIML & CSE Labs
    ["MTECH-CSE", "M.Tech Research Lab", 5, "A Wing", "Fifth Floor Computer Lab 1 (A Wing) (5CL-01)", "CSE", "T100457", "Dr. Vikram Gaikwad"],
    ["DV-AIML", "Data Visualization Lab (Workstation)", 5, "A Wing", "Fifth Floor Computer Lab 2 (A Wing) (5CL-02)", "AIML", "T100458", "Dr. Meenakshi Sharma"],
    ["CV-AIML", "Computer Vision Lab (iMac Lab)", 5, "A Wing", "Fifth Floor Computer Lab 3 (A Wing) (5CL-03)", "AIML", "T100458", "Dr. Meenakshi Sharma"],
    ["DSA-CSE", "Data Structure and Algorithm Lab", 5, "B Wing", "Fifth Floor Computer Lab 4 (B Wing) (5CL-04)", "CSE", "T100459", "Prof. Rakesh Gupta"],
    ["MDL-AIML", "Machine and Deep Learning Lab", 5, "B Wing", "Fifth Floor Computer Lab 5 (B Wing) (5CL-05)", "AIML", "T100460", "Dr. Manoj Patil"],
    ["NLP-AIML", "Natural Language Processing Lab", 5, "B Wing", "Fifth Floor Computer Lab 6 (B Wing) (5CL-06)", "AIML", "T100460", "Dr. Manoj Patil"],
    ["CCL-AIML", "Cloud Computing Lab", 5, "B Wing", "Fifth Floor Computer Lab 7 (B Wing) (5CL-07)", "AIML", "T100461", "Dr. Sandeep Shinde"],
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", 5, "B Wing", "Fifth Floor Computer Lab 8 (B Wing) (5CL-08)", "AIML", "T100462", "Dr. Swati Ghangale"],
    ["DPA-CSE", "Data Processing and Analytics Lab", 5, "B Wing", "Fifth Floor Computer Lab 9 (B Wing) (5CL-09)", "CSE", "T100463", "Prof. Meera Nair"],
    ["DS-AIML", "Data Science Lab", 5, "D Wing", "Fifth Floor Computer Lab 10 (D Wing) (5CL-10)", "AIML", "T100464", "Dr. Harish Salve"],
    ["AI-AIML", "AI Project Lab", 5, "D Wing", "Fifth Floor Computer Lab 11 (D Wing) (5CL-11)", "AIML", "T100465", "Dr. Poonam Sonawane"],

    # 6th Floor - RA Labs (Robotics & Automation)
    ["MIOT-RA", "Mechatronics and IoT Lab", 6, "A Wing", "6th Floor, Mechatronics Wing (6RA-01)", "RA", "T100466", "Dr. Vinay Tambe"],
    ["MRL-RA", "Mobile Robotics Lab", 6, "B Wing", "6th Floor, Robotics Wing (6RA-02)", "RA", "T100467", "Dr. Chetan Jagtap"]
]

ws_labs = wb.create_sheet(title="Labs")
style_sheet(ws_labs, ["Lab ID", "Lab Name", "Floor", "Wing", "Location Description", "Branch", "In-Charge Faculty ID", "In-Charge Faculty Name"], LABS_DATA)

# ==============================================================================
# 2. USERS (30+ Students, 20+ Faculty, 6 Assistants, 3 HoDs, 1 Admin)
# ==============================================================================
USERS_DATA = [
    # ── 3 HoDs (Requested by User) ───────────────────────────────────────────
    ["T100101", "Dr. Sumit Kumar", "hod.aiml@sitpune.edu.in", "HOD", "AIML", "Head of Department & Professor", None, None, None, None, "+91 98220 11001", "", "", True],
    ["T100102", "Dr. Sonali Kothari", "hod.cse@sitpune.edu.in", "HOD", "CSE", "Head of Department & Professor", None, None, None, None, "+91 98220 11002", "", "", True],
    ["T100103", "Dr. Arunkumar Bongale", "hod.ra@sitpune.edu.in", "HOD", "RA", "Head of Department & Professor", None, None, None, None, "+91 98220 11003", "", "", True],

    # ── 1 System Admin ──────────────────────────────────────────────────────
    ["AD10001", "SIT IT System Administrator", "admin@sitpune.edu.in", "ADMIN", "CENTRAL", "Chief System Architect", None, None, None, None, "+91 98220 00001", "", "", True],

    # ── 20 Faculty (Including 12 Designated Lab In-Charges) ──────────────────
    ["T100451", "Dr. Nitin Sharma", "nitin.sharma@sitpune.edu.in", "FACULTY", "CSE", "Professor & Lab In-Charge", None, None, None, None, "+91 98231 22001", "PPSL-CSE", "", True],
    ["T100452", "Dr. Rajesh Kulkarni", "rajesh.kulkarni@sitpune.edu.in", "FACULTY", "CSE", "Associate Professor & Lab In-Charge", None, None, None, None, "+91 98231 22002", "OSTL-CSE", "", True],
    ["T100453", "Prof. Amit Verma", "amit.verma@sitpune.edu.in", "FACULTY", "CSE", "Assistant Professor & CC In-Charge", None, None, None, None, "+91 98231 22003", "CC1-CSE, CC2-CSE", "", True],
    ["T100454", "Dr. Sneha Joshi", "sneha.joshi@sitpune.edu.in", "FACULTY", "CSE", "Associate Professor & Lab In-Charge", None, None, None, None, "+91 98231 22004", "DSL-CSE", "", True],
    ["T100455", "Dr. Anand Deshmukh", "anand.deshmukh@sitpune.edu.in", "FACULTY", "CSE", "Associate Professor & Project Lab In-Charge", None, None, None, None, "+91 98231 22005", "PL-CSE", "", True],
    ["T100456", "Dr. Preeti Shinde", "preeti.shinde@sitpune.edu.in", "FACULTY", "CSE", "Professor & Analytics In-Charge", None, None, None, None, "+91 98231 22006", "DMAL-CSE", "", True],
    ["T100457", "Dr. Vikram Gaikwad", "vikram.gaikwad@sitpune.edu.in", "FACULTY", "CSE", "Professor & Research Lab In-Charge", None, None, None, None, "+91 98231 22007", "MTECH-CSE", "", True],
    ["T100458", "Dr. Meenakshi Sharma", "meenakshi.sharma@sitpune.edu.in", "FACULTY", "AIML", "Associate Professor & Vision/DV In-Charge", None, None, None, None, "+91 98231 22008", "DV-AIML, CV-AIML", "", True],
    ["T100459", "Prof. Rakesh Gupta", "rakesh.gupta@sitpune.edu.in", "FACULTY", "CSE", "Assistant Professor & DSA In-Charge", None, None, None, None, "+91 98231 22009", "DSA-CSE", "", True],
    ["T100460", "Dr. Manoj Patil", "manoj.patil@sitpune.edu.in", "FACULTY", "AIML", "Professor & DL/NLP Lab In-Charge", None, None, None, None, "+91 98231 22010", "MDL-AIML, NLP-AIML", "", True],
    ["T100461", "Dr. Sandeep Shinde", "sandeep.shinde@sitpune.edu.in", "FACULTY", "AIML", "Associate Professor & Cloud In-Charge", None, None, None, None, "+91 98231 22011", "CCL-AIML", "", True],
    ["T100462", "Dr. Swati Ghangale", "swati.ghangale@sitpune.edu.in", "FACULTY", "AIML", "Assistant Professor & Sensor In-Charge", None, None, None, None, "+91 98231 22012", "MSA-AIML", "", True],
    ["T100463", "Prof. Meera Nair", "meera.nair@sitpune.edu.in", "FACULTY", "CSE", "Assistant Professor & DPA In-Charge", None, None, None, None, "+91 98231 22013", "DPA-CSE", "", True],
    ["T100464", "Dr. Harish Salve", "harish.salve@sitpune.edu.in", "FACULTY", "AIML", "Associate Professor & Data Science In-Charge", None, None, None, None, "+91 98231 22014", "DS-AIML", "", True],
    ["T100465", "Dr. Poonam Sonawane", "poonam.sonawane@sitpune.edu.in", "FACULTY", "AIML", "Associate Professor & AI Lab In-Charge", None, None, None, None, "+91 98231 22015", "AI-AIML", "", True],
    ["T100466", "Dr. Vinay Tambe", "vinay.tambe@sitpune.edu.in", "FACULTY", "RA", "Professor & Mechatronics In-Charge", None, None, None, None, "+91 98231 22016", "MIOT-RA", "", True],
    ["T100467", "Dr. Chetan Jagtap", "chetan.jagtap@sitpune.edu.in", "FACULTY", "RA", "Associate Professor & Robotics In-Charge", None, None, None, None, "+91 98231 22017", "MRL-RA", "", True],
    ["T100468", "Dr. Radhika Kulkarni", "radhika.kulkarni@sitpune.edu.in", "FACULTY", "AIML", "Assistant Professor & Mentor", None, None, None, None, "+91 98231 22018", "", "", True],
    ["T100469", "Prof. Abhijit More", "abhijit.more@sitpune.edu.in", "FACULTY", "CSE", "Assistant Professor & Mentor", None, None, None, None, "+91 98231 22019", "", "", True],
    ["T100470", "Dr. Sunita Borole", "sunita.borole@sitpune.edu.in", "FACULTY", "RA", "Associate Professor & Mentor", None, None, None, None, "+91 98231 22020", "", "", True],

    # ── 6 Lab Assistants (Staff N-IDs) ──────────────────────────────────────
    ["N10021", "Suresh Pawar", "suresh.pawar.staff@sitpune.edu.in", "ASSISTANT", "CSE", "Senior Lab Technician (Floor 4)", None, None, None, None, "+91 97654 33001", "", "PPSL-CSE, OSTL-CSE, CC1-CSE, CC2-CSE", True],
    ["N10022", "Ramesh Patil", "ramesh.patil.staff@sitpune.edu.in", "ASSISTANT", "CSE", "Lab Technician (Floor 4)", None, None, None, None, "+91 97654 33002", "", "DSL-CSE, PL-CSE, DMAL-CSE", True],
    ["N10023", "Ganesh Shinde", "ganesh.shinde.staff@sitpune.edu.in", "ASSISTANT", "AIML", "Senior Hardware Specialist (Floor 5)", None, None, None, None, "+91 97654 33003", "", "MTECH-CSE, DV-AIML, CV-AIML, DSA-CSE", True],
    ["N10024", "Mahesh Jadhav", "mahesh.jadhav.staff@sitpune.edu.in", "ASSISTANT", "AIML", "Lab Technician (Floor 5)", None, None, None, None, "+91 97654 33004", "", "MDL-AIML, NLP-AIML, CCL-AIML, MSA-AIML", True],
    ["N10025", "Santosh Kadam", "santosh.kadam.staff@sitpune.edu.in", "ASSISTANT", "AIML", "Lab Technician (Floor 5)", None, None, None, None, "+91 97654 33005", "", "DPA-CSE, DS-AIML, AI-AIML", True],
    ["N10026", "Dilip Sawant", "dilip.sawant.staff@sitpune.edu.in", "ASSISTANT", "RA", "Mechatronics Lab Superintendent (Floor 6)", None, None, None, None, "+91 97654 33006", "", "MIOT-RA, MRL-RA", True],

    # ── 34 Students (PRN Contract: Batch[2] + 07012 + Branch[1] + Roll[3]) ──
    # AIML (Branch 6)
    ["25070126076", "Ishaan Chand", "ishaan.chand.btech2025@sitpune.edu.in", "STUDENT", "AIML", "Student (SE Lead)", 2025, 2, "AIML", "076", "+91 98111 01076", "", "", True],
    ["25070126001", "Aarav Sharma", "aarav.sharma.btech2025@sitpune.edu.in", "STUDENT", "AIML", "Student (SE)", 2025, 2, "AIML", "001", "+91 98111 01001", "", "", True],
    ["25070126014", "Diya Kapoor", "diya.kapoor.btech2025@sitpune.edu.in", "STUDENT", "AIML", "Student (SE)", 2025, 2, "AIML", "014", "+91 98111 01014", "", "", True],
    ["25070126028", "Kabir Mehta", "kabir.mehta.btech2025@sitpune.edu.in", "STUDENT", "AIML", "Student (SE)", 2025, 2, "AIML", "028", "+91 98111 01028", "", "", True],
    ["24070126005", "Rohan Joshi", "rohan.joshi.btech2024@sitpune.edu.in", "STUDENT", "AIML", "Student (TE Lead)", 2024, 3, "AIML", "005", "+91 98111 01005", "", "", True],
    ["24070126019", "Ananya Deshmukh", "ananya.deshmukh.btech2024@sitpune.edu.in", "STUDENT", "AIML", "Student (TE)", 2024, 3, "AIML", "019", "+91 98111 01019", "", "", True],
    ["24070126033", "Varun Nair", "varun.nair.btech2024@sitpune.edu.in", "STUDENT", "AIML", "Student (TE)", 2024, 3, "AIML", "033", "+91 98111 01033", "", "", True],
    ["24070126047", "Tanvi Bhatia", "tanvi.bhatia.btech2024@sitpune.edu.in", "STUDENT", "AIML", "Student (TE)", 2024, 3, "AIML", "047", "+91 98111 01047", "", "", True],
    ["23070126012", "Aryan Saxena", "aryan.saxena.btech2023@sitpune.edu.in", "STUDENT", "AIML", "Student (BE Lead)", 2023, 4, "AIML", "012", "+91 98111 01012", "", "", True],
    ["23070126025", "Sneha Kulkarni", "sneha.kulkarni.btech2023@sitpune.edu.in", "STUDENT", "AIML", "Student (BE)", 2023, 4, "AIML", "025", "+91 98111 01025", "", "", True],
    ["23070126038", "Aditya Verma", "aditya.verma.btech2023@sitpune.edu.in", "STUDENT", "AIML", "Student (BE)", 2023, 4, "AIML", "038", "+91 98111 01038", "", "", True],
    ["25070126085", "Meera Pillai", "meera.pillai.btech2025@sitpune.edu.in", "STUDENT", "AIML", "Student (SE)", 2025, 2, "AIML", "085", "+91 98111 01085", "", "", True],

    # CSE (Branch 2)
    ["25070122045", "Raghavendra Joshi", "raghavendra.joshi.btech2025@sitpune.edu.in", "STUDENT", "CSE", "Student (SE Lead)", 2025, 2, "CSE", "045", "+91 98111 02045", "", "", True],
    ["25070122002", "Pooja Hegde", "pooja.hegde.btech2025@sitpune.edu.in", "STUDENT", "CSE", "Student (SE)", 2025, 2, "CSE", "002", "+91 98111 02002", "", "", True],
    ["25070122018", "Nikhil Rao", "nikhil.rao.btech2025@sitpune.edu.in", "STUDENT", "CSE", "Student (SE)", 2025, 2, "CSE", "018", "+91 98111 02018", "", "", True],
    ["25070122031", "Rhea Sengupta", "rhea.sengupta.btech2025@sitpune.edu.in", "STUDENT", "CSE", "Student (SE)", 2025, 2, "CSE", "031", "+91 98111 02031", "", "", True],
    ["24070122009", "Siddharth Menon", "siddharth.menon.btech2024@sitpune.edu.in", "STUDENT", "CSE", "Student (TE Lead)", 2024, 3, "CSE", "009", "+91 98111 02009", "", "", True],
    ["24070122022", "Kavya Iyer", "kavya.iyer.btech2024@sitpune.edu.in", "STUDENT", "CSE", "Student (TE)", 2024, 3, "CSE", "022", "+91 98111 02022", "", "", True],
    ["24070122036", "Gaurav Malhotra", "gaurav.malhotra.btech2024@sitpune.edu.in", "STUDENT", "CSE", "Student (TE)", 2024, 3, "CSE", "036", "+91 98111 02036", "", "", True],
    ["23070122011", "Harsh Vardhan", "harsh.vardhan.btech2023@sitpune.edu.in", "STUDENT", "CSE", "Student (BE Lead)", 2023, 4, "CSE", "011", "+91 98111 02011", "", "", True],
    ["23070122029", "Shruti Shrivastava", "shruti.shrivastava.btech2023@sitpune.edu.in", "STUDENT", "CSE", "Student (BE)", 2023, 4, "CSE", "029", "+91 98111 02029", "", "", True],
    ["23070122041", "Manish Pandey", "manish.pandey.btech2023@sitpune.edu.in", "STUDENT", "CSE", "Student (BE)", 2023, 4, "CSE", "041", "+91 98111 02041", "", "", True],
    ["25070122058", "Neha Tiwari", "neha.tiwari.btech2025@sitpune.edu.in", "STUDENT", "CSE", "Student (SE)", 2025, 2, "CSE", "058", "+91 98111 02058", "", "", True],

    # RA (Robotics & Automation - Branch 7)
    ["25070127003", "Chirag Singhania", "chirag.singhania.btech2025@sitpune.edu.in", "STUDENT", "RA", "Student (SE Lead)", 2025, 2, "RA", "003", "+91 98111 03003", "", "", True],
    ["25070127016", "Isha Nambiar", "isha.nambiar.btech2025@sitpune.edu.in", "STUDENT", "RA", "Student (SE)", 2025, 2, "RA", "016", "+91 98111 03016", "", "", True],
    ["25070127029", "Pranav Anand", "pranav.anand.btech2025@sitpune.edu.in", "STUDENT", "RA", "Student (SE)", 2025, 2, "RA", "029", "+91 98111 03029", "", "", True],
    ["24070127008", "Kunal Gokhale", "kunal.gokhale.btech2024@sitpune.edu.in", "STUDENT", "RA", "Student (TE Lead)", 2024, 3, "RA", "008", "+91 98111 03008", "", "", True],
    ["24070127021", "Ritika Roy", "ritika.roy.btech2024@sitpune.edu.in", "STUDENT", "RA", "Student (TE)", 2024, 3, "RA", "021", "+91 98111 03021", "", "", True],
    ["24070127035", "Tushar Agrawal", "tushar.agrawal.btech2024@sitpune.edu.in", "STUDENT", "RA", "Student (TE)", 2024, 3, "RA", "035", "+91 98111 03035", "", "", True],
    ["24070127048", "Priya Chawla", "priya.chawla.btech2024@sitpune.edu.in", "STUDENT", "RA", "Student (TE)", 2024, 3, "RA", "048", "+91 98111 03048", "", "", True],
    ["23070127014", "Deepak Solanki", "deepak.solanki.btech2023@sitpune.edu.in", "STUDENT", "RA", "Student (BE Lead)", 2023, 4, "RA", "014", "+91 98111 03014", "", "", True],
    ["23070127027", "Aishwarya Mane", "aishwarya.mane.btech2023@sitpune.edu.in", "STUDENT", "RA", "Student (BE)", 2023, 4, "RA", "027", "+91 98111 03027", "", "", True],
    ["23070127039", "Rajat Bansal", "rajat.bansal.btech2023@sitpune.edu.in", "STUDENT", "RA", "Student (BE)", 2023, 4, "RA", "039", "+91 98111 03039", "", "", True],
    ["25070127052", "Sanjana Ghosh", "sanjana.ghosh.btech2025@sitpune.edu.in", "STUDENT", "RA", "Student (SE)", 2025, 2, "RA", "052", "+91 98111 03052", "", "", True]
]

ws_users = wb.create_sheet(title="Users")
style_sheet(ws_users, ["User ID", "Full Name", "Email", "User Type", "Department", "Designation", "Batch", "Year of Study", "Branch", "Roll Number", "Phone", "In-Charge Labs", "Managed Labs", "Active"], USERS_DATA)

# ==============================================================================
# 3. ITEMS (34 Components: 15 Assets & 19 Consumables)
# ==============================================================================
ITEMS_DATA = [
    # ── 15 Serialized Assets ─────────────────────────────────────────────────
    ["DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", "ASSET", "Microprocessors", "NVIDIA Corporation", "128-core Maxwell GPU, Quad-core ARM A57, 4GB LPDDR4, MIPI-CSI", "Embedded AI inference edge kit", "Tier 2 Intermediate", "/images/hardware/jetson-nano.jpg"],
    ["DEV-JET-02", "NVIDIA Jetson Orin Nano Developer Kit (8GB)", "ASSET", "Microprocessors", "NVIDIA Corporation", "40 TOPS AI compute, 1024-core Ampere GPU, 8GB 128-bit LPDDR5", "Next-gen edge robotics compute module", "Tier 3 Advanced", "/images/hardware/jetson-nano.jpg"],
    ["SBC-RPI-05", "Raspberry Pi 5 Model B 8GB RAM", "ASSET", "Microprocessors", "Raspberry Pi Foundation", "Broadcom BCM2712 Quad-core ARM Cortex-A76 @ 2.4GHz, PCIe 2.0", "Flagship single board computer with active cooler", "Tier 2 Intermediate", "/images/hardware/raspberry-pi-5.jpg"],
    ["SBC-RPI-04", "Raspberry Pi 4 Model B 4GB RAM", "ASSET", "Microprocessors", "Raspberry Pi Foundation", "Broadcom BCM2711 Quad-core Cortex-A72 @ 1.5GHz, Dual 4K HDMI", "Robust embedded Linux target for IoT gateways", "Tier 1 Standard", "/images/hardware/raspberry-pi-5.jpg"],
    ["CAM-INT-01", "Intel RealSense Depth Camera D435i", "ASSET", "Sensors", "Intel Corporation", "Stereo RGB-D depth sensor, integrated Bosch BMI055 6-DOF IMU", "3D spatial mapping and SLAM vision unit", "Tier 3 Advanced", "/images/hardware/realsense-camera.jpg"],
    ["LID-OUS-01", "Ouster OS1-32 Gen 2 LiDAR Sensor", "ASSET", "Sensors", "Ouster Inc.", "32 channels, 120m range, 360-deg horizontal FOV, IP68 rated", "High precision 3D point cloud scanner", "Tier 4 High Value", "/images/hardware/turtlebot-robot.jpg"],
    ["ROB-TB3-01", "TurtleBot 3 Burger Mobile Robot", "ASSET", "Motors", "ROBOTIS & Open Robotics", "Raspberry Pi 4, OpenCR 1.0, 360 LDS-02 LiDAR, DYNAMIXEL XL430", "ROS 2 educational mobile ground vehicle", "Tier 3 Advanced", "/images/hardware/turtlebot-robot.jpg"],
    ["ROB-TB4-01", "TurtleBot 4 Standard Mobile Robot", "ASSET", "Motors", "Clearpath Robotics", "iRobot Create 3 base, Raspberry Pi 4 4GB, OAK-D-PRO Camera, RPLIDAR A1", "Modern ROS 2 mobile research platform", "Tier 4 High Value", "/images/hardware/turtlebot-robot.jpg"],
    ["ARM-DOB-01", "Dobot Magician 4-DOF Robotic Arm", "ASSET", "Motors", "Shenzhen Yuejiang Tech", "0.2mm repeatability, 500g payload, pneumatic gripper & 3D writing", "Desktop robotic educational arm", "Tier 3 Advanced", "/images/hardware/robotic-arm.jpg"],
    ["ARM-KIN-01", "Kinova Gen3 Lite Robotic Arm", "ASSET", "Motors", "Kinova Inc.", "6-DOF ultra-lightweight manipulator, integrated high-res vision, 1kg payload", "Advanced research industrial manipulator", "Tier 4 High Value", "/images/hardware/robotic-arm.jpg"],
    ["PLC-SIE-01", "Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC", "ASSET", "Microcontrollers", "Siemens AG", "14 DI / 10 DQ, 2 AI, PROFINET interface, integrated PID controller", "Industrial programmable automation trainer", "Tier 3 Advanced", "/images/hardware/relay-module.jpg"],
    ["OSC-RIG-01", "Rigol DS1054Z 50MHz Digital Oscilloscope", "ASSET", "Misc", "Rigol Technologies", "4 analog channels, 1 GSa/s real-time sample rate, 24 Mpts memory", "Precision bench signal analysis oscilloscope", "Tier 2 Intermediate", "/images/hardware/oscilloscope.jpg"],
    ["MET-DIG-01", "Digital Multimeter MAS830L with Test Leads", "ASSET", "Misc", "Mastech", "DC/AC voltage, DC current, resistance, diode test & continuity buzzer", "Handheld digital circuit measurement instrument", "Tier 1 Standard", "/images/hardware/digital-multimeter.jpg"],
    ["CAM-FLI-01", "FLIR Lepton 3.5 Radiometric LWIR Thermal Camera", "ASSET", "Sensors", "Teledyne FLIR", "160x120 thermal resolution, calibrated radiometric temperature output", "Infrared thermal imaging analysis module", "Tier 3 Advanced", "/images/hardware/realsense-camera.jpg"],
    ["DIS-OLD-01", "0.96\" I2C OLED Display Module (128x64)", "ASSET", "Misc", "Solomon Systech", "128x64 pixels, monochrome blue, SSD1306 driver, I2C interface", "High contrast graphical status readout display", "Tier 1 Standard", "/images/hardware/oled-display.jpg"],

    # ── 24 Quantity-Tracked Consumables ───────────────────────────────────────
    ["SEN-DHT-01", "DHT11 Digital Temperature & Humidity Sensor", "CONSUMABLE", "Sensors", "Aosong Electronics", "0 to 50 deg C (+/-2C), 20-90% RH (+/-5% RH), single-wire digital", "Cost-effective ambient temperature and humidity sensor", "Tier 1 Standard", "/images/hardware/dht11-sensor.jpg"],
    ["SEN-UST-01", "Ultrasonic Distance Sensor HC-SR04", "CONSUMABLE", "Sensors", "ElecFreaks", "2cm to 400cm range, 5V DC, 15-deg measuring angle", "Standard sonar distance ranging sensor", "Tier 1 Standard", "/images/hardware/hcsr04-ultrasonic.jpg"],
    ["SEN-PIR-01", "PIR Motion Sensor Module HC-SR501", "CONSUMABLE", "Sensors", "ElecFreaks", "3m to 7m range, 100-deg cone, 5V-20V DC, adjustable trigger", "Passive infrared motion detection module", "Tier 1 Standard", "/images/hardware/pir-motion-sensor.jpg"],
    ["SEN-IRS-01", "Infrared Obstacle Avoidance Sensor Module", "CONSUMABLE", "Sensors", "Waveshare", "2cm to 30cm detection range, 35-deg angle, LM393 comparator", "Active infrared proximity and obstacle detector", "Tier 1 Standard", "/images/hardware/ir-sensor-module.jpg"],
    ["SEN-PZO-01", "Piezoelectric Vibration & Knock Sensor", "CONSUMABLE", "Sensors", "Generic", "Ceramic piezo disc 27mm, analog voltage output proportional to impact", "Vibration, knock, and shock detection disc", "Tier 1 Standard", "/images/hardware/piezo-sensor.jpg"],
    ["SEN-BMP-01", "BMP280 Barometric Pressure Sensor", "CONSUMABLE", "Sensors", "Bosch Sensortec", "300 to 1100 hPa (+/-1 hPa), I2C/SPI interface, 3.3V", "Altimeter and atmospheric pressure module", "Tier 1 Standard", "/images/hardware/bmp280-sensor.jpg"],
    ["SEN-IMU-01", "MPU6050 6-Axis Gyro & Accelerometer Module", "CONSUMABLE", "Sensors", "TDK InvenSense", "3-axis gyro (+/-2000 dps), 3-axis accel (+/-16g), I2C interface", "Motion tracking inertial measurement unit", "Tier 1 Standard", "/images/hardware/bmp280-sensor.jpg"],
    ["SEN-LIN-01", "TCRT5000 5-Channel Infrared Line Tracking Array", "CONSUMABLE", "Sensors", "Waveshare", "5-channel reflective optical sensor, digital output, adjustable sensitivity", "Robotics line-following tracker board", "Tier 1 Standard", "/images/hardware/ir-sensor-module.jpg"],
    ["MCU-UNO-01", "Arduino Uno Rev3 DIP Microcontroller", "CONSUMABLE", "Microcontrollers", "Arduino LLC", "ATmega328P 16MHz, 32KB Flash, 14 Digital IO, 6 PWM, 6 ADC", "Standard prototyping microcontroller platform", "Tier 1 Standard", "/images/hardware/arduino-uno-r3.jpg"],
    ["MCU-ESP-01", "ESP32-WROOM-32 Wi-Fi + BLE Development Board", "CONSUMABLE", "Microcontrollers", "Espressif Systems", "Dual-core Xtensa 32-bit LX6 @ 240MHz, 802.11 b/g/n, Bluetooth v4.2 BR/EDR & BLE", "High-performance IoT controller", "Tier 1 Standard", "/images/hardware/esp32-wroom.jpg"],
    ["MCU-RP2-01", "Raspberry Pi Pico W", "CONSUMABLE", "Microcontrollers", "Raspberry Pi Foundation", "RP2040 Dual-core ARM Cortex-M0+ @ 133MHz, Infineon CYW43439 Wi-Fi 4", "Low cost wireless micro-controller", "Tier 1 Standard", "/images/hardware/arduino-uno-r3.jpg"],
    ["COM-GPS-01", "U-Blox Neo-6M GPS Module with Active Antenna", "CONSUMABLE", "Communication Modules", "u-blox", "50-channel GPS engine, UART TTL output, EEPROM backup, PPS indicator", "Satellite navigation and positioning module", "Tier 1 Standard", "/images/hardware/esp32-wroom.jpg"],
    ["COM-NRF-01", "nRF24L01+ 2.4GHz Wireless RF Transceiver", "CONSUMABLE", "Communication Modules", "Nordic Semiconductor", "2.4GHz ISM band, 250kbps to 2Mbps, SPI interface, ultra low power", "Wireless point-to-point data telemetry link", "Tier 1 Standard", "/images/hardware/esp32-wroom.jpg"],
    ["MOT-SRV-01", "TowerPro SG90 9g Micro Servo Motor", "CONSUMABLE", "Motors", "TowerPro", "180-degree rotation, 1.8 kg-cm torque @ 4.8V, nylon gears", "Lightweight robotic steering & pan-tilt servo", "Tier 1 Standard", "/images/hardware/sg90-servo.jpg"],
    ["MOT-SRV-02", "MG996R High Torque Metal Gear Servo Motor", "CONSUMABLE", "Motors", "TowerPro", "180-degree rotation, 11 kg-cm torque @ 6V, all metal gear train", "Heavy duty robotic joint actuator", "Tier 1 Standard", "/images/hardware/sg90-servo.jpg"],
    ["MOT-STP-01", "NEMA 17 Bipolar Stepper Motor (1.5A 42mm)", "CONSUMABLE", "Motors", "StepperOnline", "1.8 deg step angle (200 steps/rev), 45 Ncm holding torque, 4-wire lead", "Precision CNC and 3D printing drive motor", "Tier 1 Standard", "/images/hardware/nema17-stepper.jpg"],
    ["DRV-MOT-01", "L298N Dual H-Bridge Motor Driver Module", "CONSUMABLE", "Motors", "STMicroelectronics", "Dual 2A H-bridge driver, 5V to 35V drive voltage, opto-isolated", "Dual DC motor and stepper motor driver", "Tier 1 Standard", "/images/hardware/l298n-motor-driver.jpg"],
    ["PWR-9VB-01", "9V Heavy Duty Alkaline Battery", "CONSUMABLE", "Batteries", "Hi-Watt / Duracell", "Standard 9V 6F22 primary power cell with snap terminals", "Portable DC power for microcontrollers and sensors", "Tier 1 Standard", "/images/hardware/9v-battery.jpg"],
    ["PWR-ION-01", "Samsung 18650 Li-ion Cell 3.7V 2600mAh", "CONSUMABLE", "Batteries", "Samsung SDI", "3.7V nominal, 2600mAh capacity, rechargeable flat-top cylindrical cell", "Standard rechargeable power cell for field nodes", "Tier 1 Standard", "/images/hardware/18650-battery.jpg"],
    ["PWR-LIP-01", "11.1V 3S LiPo Battery Pack 2200mAh 30C", "CONSUMABLE", "Batteries", "Orange Power", "3S1P 11.1V, 2200mAh capacity, 30C discharge, XT60 connector", "High discharge battery pack for mobile robots", "Tier 1 Standard", "/images/hardware/18650-battery.jpg"],
    ["PRT-BRD-01", "830-Tie Point Solderless Breadboard", "CONSUMABLE", "Misc", "Generic High Quality", "830 tie points (630 IC points + 200 power bus rails), standard 2.54mm pitch", "Solderless electronic circuit prototype board", "Tier 1 Standard", "/images/hardware/breadboard-830.jpg"],
    ["PRT-JMP-01", "40-Pin Multi-Color Jumper Wires (M-to-F 20cm)", "CONSUMABLE", "Misc", "Generic", "40-conductor ribbon cable, Male-to-Female 2.54mm pitch, 20cm length", "Essential lab circuit prototyping patch wires", "Tier 1 Standard", "/images/hardware/jumper-wires.jpg"],
    ["RLY-MOD-01", "4-Channel 5V Relay Module with Optocoupler", "CONSUMABLE", "Misc", "Songle", "4x SPDT 10A 250VAC / 30VDC relays, active low trigger, status LEDs", "High-voltage AC/DC circuit switching board", "Tier 1 Standard", "/images/hardware/relay-module.jpg"],
    ["DIS-LCD-01", "16x2 Character LCD Display Module", "CONSUMABLE", "Misc", "Hitachi / Generic", "16 characters x 2 lines, blue backlight, 5V HD44780 controller", "Alphanumeric character readout display", "Tier 1 Standard", "/images/hardware/lcd-1602.jpg"]
]

ws_items = wb.create_sheet(title="Items")
style_sheet(ws_items, ["Item ID", "Item Name", "Kind", "Category", "Manufacturer / Brand", "Sub-Specifications", "Description", "Cost Tier", "Image URL"], ITEMS_DATA)

# ==============================================================================
# 4. STOCK (Composite PK: lab_id, item_id)
# ==============================================================================
STOCK_DATA = [
    # PPSL-CSE (4th Floor)
    ["PPSL-CSE", "Programming and Problem Solving Lab", "MCU-UNO-01", "Arduino Uno Rev3 DIP Microcontroller", 25, 2, 27],
    ["PPSL-CSE", "Programming and Problem Solving Lab", "PRT-BRD-01", "830-Tie Point Solderless Breadboard", 30, 3, 33],
    ["PPSL-CSE", "Programming and Problem Solving Lab", "PRT-JMP-01", "40-Pin Multi-Color Jumper Wires (M-to-F 20cm)", 50, 4, 54],
    ["PPSL-CSE", "Programming and Problem Solving Lab", "PWR-9VB-01", "9V Heavy Duty Alkaline Battery", 30, 0, 30],

    # OSTL-CSE (4th Floor)
    ["OSTL-CSE", "Open Source Tools Lab", "SBC-RPI-04", "Raspberry Pi 4 Model B 4GB RAM", 8, 1, 9],
    ["OSTL-CSE", "Open Source Tools Lab", "MCU-ESP-01", "ESP32-WROOM-32 Wi-Fi + BLE Development Board", 20, 2, 22],
    ["OSTL-CSE", "Open Source Tools Lab", "SEN-UST-01", "Ultrasonic Distance Sensor HC-SR04", 15, 1, 16],
    ["OSTL-CSE", "Open Source Tools Lab", "SEN-IRS-01", "Infrared Obstacle Avoidance Sensor Module", 20, 1, 21],

    # DSL-CSE (4th Floor)
    ["DSL-CSE", "Data Structure Lab (CL-06)", "MCU-RP2-01", "Raspberry Pi Pico W", 30, 2, 32],
    ["DSL-CSE", "Data Structure Lab (CL-06)", "PRT-BRD-01", "830-Tie Point Solderless Breadboard", 35, 1, 36],
    ["DSL-CSE", "Data Structure Lab (CL-06)", "DIS-LCD-01", "16x2 Character LCD Display Module", 20, 1, 21],

    # PL-CSE (4th Floor)
    ["PL-CSE", "Project Lab (CL-7)", "SBC-RPI-05", "Raspberry Pi 5 Model B 8GB RAM", 10, 0, 10],
    ["PL-CSE", "Project Lab (CL-7)", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", 6, 1, 7],
    ["PL-CSE", "Project Lab (CL-7)", "OSC-RIG-01", "Rigol DS1054Z 50MHz Digital Oscilloscope", 3, 0, 3],
    ["PL-CSE", "Project Lab (CL-7)", "COM-GPS-01", "U-Blox Neo-6M GPS Module with Active Antenna", 12, 0, 12],
    ["PL-CSE", "Project Lab (CL-7)", "RLY-MOD-01", "4-Channel 5V Relay Module with Optocoupler", 18, 1, 19],
    ["PL-CSE", "Project Lab (CL-7)", "SEN-PIR-01", "PIR Motion Sensor Module HC-SR501", 15, 1, 16],
    ["PL-CSE", "Project Lab (CL-7)", "DIS-OLD-01", "0.96\" I2C OLED Display Module (128x64)", 15, 1, 16],

    # DMAL-CSE (4th Floor)
    ["DMAL-CSE", "Database Management and Analytics Lab (CL-9)", "SBC-RPI-05", "Raspberry Pi 5 Model B 8GB RAM", 8, 0, 8],
    ["DMAL-CSE", "Database Management and Analytics Lab (CL-9)", "SEN-DHT-01", "DHT11 Digital Temperature & Humidity Sensor", 20, 2, 22],

    # MTECH-CSE (5th Floor)
    ["MTECH-CSE", "M.Tech Research Lab", "DEV-JET-02", "NVIDIA Jetson Orin Nano Developer Kit (8GB)", 5, 0, 5],
    ["MTECH-CSE", "M.Tech Research Lab", "CAM-INT-01", "Intel RealSense Depth Camera D435i", 3, 0, 3],
    ["MTECH-CSE", "M.Tech Research Lab", "MET-DIG-01", "Digital Multimeter MAS830L with Test Leads", 4, 0, 4],

    # DV-AIML (5th Floor)
    ["DV-AIML", "Data Visualization Lab (Workstation)", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", 8, 1, 9],
    ["DV-AIML", "Data Visualization Lab (Workstation)", "MET-DIG-01", "Digital Multimeter MAS830L with Test Leads", 6, 0, 6],

    # CV-AIML (5th Floor)
    ["CV-AIML", "Computer Vision Lab (iMac Lab)", "CAM-INT-01", "Intel RealSense Depth Camera D435i", 6, 0, 6],
    ["CV-AIML", "Computer Vision Lab (iMac Lab)", "CAM-FLI-01", "FLIR Lepton 3.5 Radiometric LWIR Thermal Camera", 4, 0, 4],
    ["CV-AIML", "Computer Vision Lab (iMac Lab)", "MET-DIG-01", "Digital Multimeter MAS830L with Test Leads", 12, 0, 12],

    # MDL-AIML (5th Floor)
    ["MDL-AIML", "Machine and Deep Learning Lab", "DEV-JET-02", "NVIDIA Jetson Orin Nano Developer Kit (8GB)", 10, 0, 10],
    ["MDL-AIML", "Machine and Deep Learning Lab", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", 12, 2, 14],
    ["MDL-AIML", "Machine and Deep Learning Lab", "SEN-IMU-01", "MPU6050 6-Axis Gyro & Accelerometer Module", 25, 3, 28],

    # NLP-AIML (5th Floor)
    ["NLP-AIML", "Natural Language Processing Lab", "SBC-RPI-05", "Raspberry Pi 5 Model B 8GB RAM", 12, 1, 13],
    ["NLP-AIML", "Natural Language Processing Lab", "MCU-ESP-01", "ESP32-WROOM-32 Wi-Fi + BLE Development Board", 30, 2, 32],

    # CCL-AIML (5th Floor)
    ["CCL-AIML", "Cloud Computing Lab", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", 10, 1, 11],
    ["CCL-AIML", "Cloud Computing Lab", "SBC-RPI-04", "Raspberry Pi 4 Model B 4GB RAM", 15, 2, 17],
    ["CCL-AIML", "Cloud Computing Lab", "MCU-ESP-01", "ESP32-WROOM-32 Wi-Fi + BLE Development Board", 35, 3, 38],
    ["CCL-AIML", "Cloud Computing Lab", "SEN-BMP-01", "BMP280 Barometric Pressure Sensor", 20, 1, 21],
    ["CCL-AIML", "Cloud Computing Lab", "DIS-OLD-01", "0.96\" I2C OLED Display Module (128x64)", 15, 1, 16],

    # MSA-AIML (5th Floor)
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", "SEN-UST-01", "Ultrasonic Distance Sensor HC-SR04", 40, 4, 44],
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", "SEN-DHT-01", "DHT11 Digital Temperature & Humidity Sensor", 35, 2, 37],
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", "SEN-IMU-01", "MPU6050 6-Axis Gyro & Accelerometer Module", 30, 2, 32],
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", "SEN-BMP-01", "BMP280 Barometric Pressure Sensor", 25, 1, 26],
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", "COM-GPS-01", "U-Blox Neo-6M GPS Module with Active Antenna", 15, 1, 16],
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", "SEN-PIR-01", "PIR Motion Sensor Module HC-SR501", 20, 1, 21],
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", "SEN-IRS-01", "Infrared Obstacle Avoidance Sensor Module", 25, 2, 27],
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", "SEN-PZO-01", "Piezoelectric Vibration & Knock Sensor", 15, 1, 16],
    ["MSA-AIML", "Multimodal Sensor Analytics Lab", "DIS-LCD-01", "16x2 Character LCD Display Module", 20, 1, 21],

    # AI-AIML (5th Floor)
    ["AI-AIML", "AI Project Lab", "DEV-JET-02", "NVIDIA Jetson Orin Nano Developer Kit (8GB)", 8, 0, 8],
    ["AI-AIML", "AI Project Lab", "ROB-TB3-01", "TurtleBot 3 Burger Mobile Robot", 4, 0, 4],
    ["AI-AIML", "AI Project Lab", "CAM-INT-01", "Intel RealSense Depth Camera D435i", 5, 0, 5],
    ["AI-AIML", "AI Project Lab", "OSC-RIG-01", "Rigol DS1054Z 50MHz Digital Oscilloscope", 2, 0, 2],

    # MIOT-RA (6th Floor)
    ["MIOT-RA", "Mechatronics and IoT Lab", "PLC-SIE-01", "Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC", 8, 0, 8],
    ["MIOT-RA", "Mechatronics and IoT Lab", "ARM-DOB-01", "Dobot Magician 4-DOF Robotic Arm", 5, 0, 5],
    ["MIOT-RA", "Mechatronics and IoT Lab", "MOT-SRV-01", "TowerPro SG90 9g Micro Servo Motor", 60, 5, 65],
    ["MIOT-RA", "Mechatronics and IoT Lab", "MOT-SRV-02", "MG996R High Torque Metal Gear Servo Motor", 30, 2, 32],
    ["MIOT-RA", "Mechatronics and IoT Lab", "MOT-STP-01", "NEMA 17 Bipolar Stepper Motor (1.5A 42mm)", 25, 1, 26],
    ["MIOT-RA", "Mechatronics and IoT Lab", "DRV-MOT-01", "L298N Dual H-Bridge Motor Driver Module", 40, 3, 43],
    ["MIOT-RA", "Mechatronics and IoT Lab", "PWR-LIP-01", "11.1V 3S LiPo Battery Pack 2200mAh 30C", 20, 2, 22],
    ["MIOT-RA", "Mechatronics and IoT Lab", "PWR-ION-01", "Samsung 18650 Li-ion Cell 3.7V 2600mAh", 50, 4, 54],
    ["MIOT-RA", "Mechatronics and IoT Lab", "PWR-9VB-01", "9V Heavy Duty Alkaline Battery", 30, 0, 30],
    ["MIOT-RA", "Mechatronics and IoT Lab", "SEN-PZO-01", "Piezoelectric Vibration & Knock Sensor", 20, 2, 22],

    # MRL-RA (6th Floor)
    ["MRL-RA", "Mobile Robotics Lab", "ROB-TB3-01", "TurtleBot 3 Burger Mobile Robot", 6, 0, 6],
    ["MRL-RA", "Mobile Robotics Lab", "ROB-TB4-01", "TurtleBot 4 Standard Mobile Robot", 3, 0, 3],
    ["MRL-RA", "Mobile Robotics Lab", "ARM-KIN-01", "Kinova Gen3 Lite Robotic Arm", 2, 0, 2],
    ["MRL-RA", "Mobile Robotics Lab", "LID-OUS-01", "Ouster OS1-32 Gen 2 LiDAR Sensor", 2, 0, 2],
    ["MRL-RA", "Mobile Robotics Lab", "SEN-LIN-01", "TCRT5000 5-Channel Infrared Line Tracking Array", 30, 2, 32],
    ["MRL-RA", "Mobile Robotics Lab", "COM-NRF-01", "nRF24L01+ 2.4GHz Wireless RF Transceiver", 40, 3, 43]
]

ws_stock = wb.create_sheet(title="Stock")
style_sheet(ws_stock, ["Lab ID", "Lab Name", "Item ID", "Item Name", "Good Quantity", "Bad Quantity", "Total Physical Quantity"], STOCK_DATA)

# ==============================================================================
# 5. ASSETS (36 Individually Serialized Physical Units)
# ==============================================================================
ASSETS_DATA = [
    # Jetson Nanos (CCL-AIML & PL-CSE)
    ["SIT-AIML-5CL07-0041", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", "CCL-AIML", "JN-041", "CPR/2024/0891", "NV-JN-88301", "AVAILABLE", None],
    ["SIT-AIML-5CL07-0042", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", "CCL-AIML", "JN-042", "CPR/2024/0891", "NV-JN-88302", "AVAILABLE", None],
    ["SIT-AIML-5CL07-0043", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", "CCL-AIML", "JN-043", "CPR/2024/0891", "NV-JN-88303", "IN_USE", "25070126076"],
    ["SIT-AIML-5CL07-0044", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", "CCL-AIML", "JN-044", "CPR/2024/0891", "NV-JN-88304", "AVAILABLE", None],
    ["SIT-CSE-4CL07-0045", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", "PL-CSE", "JN-045", "CPR/2024/0892", "NV-JN-88305", "AVAILABLE", None],
    ["SIT-CSE-4CL07-0046", "DEV-JET-01", "NVIDIA Jetson Nano 4GB B01 Developer Kit", "PL-CSE", "JN-046", "CPR/2024/0892", "NV-JN-88306", "DEFECTIVE", None],

    # Jetson Orin Nanos (AI-AIML & MDL-AIML)
    ["SIT-AIML-5CL11-0061", "DEV-JET-02", "NVIDIA Jetson Orin Nano Developer Kit (8GB)", "AI-AIML", "JON-061", "CPR/2024/1142", "NV-JON-99411", "AVAILABLE", None],
    ["SIT-AIML-5CL11-0062", "DEV-JET-02", "NVIDIA Jetson Orin Nano Developer Kit (8GB)", "AI-AIML", "JON-062", "CPR/2024/1142", "NV-JON-99412", "AVAILABLE", None],
    ["SIT-AIML-5CL05-0063", "DEV-JET-02", "NVIDIA Jetson Orin Nano Developer Kit (8GB)", "MDL-AIML", "JON-063", "CPR/2024/1142", "NV-JON-99413", "IN_USE", "24070126005"],
    ["SIT-AIML-5CL05-0064", "DEV-JET-02", "NVIDIA Jetson Orin Nano Developer Kit (8GB)", "MDL-AIML", "JON-064", "CPR/2024/1142", "NV-JON-99414", "AVAILABLE", None],

    # Raspberry Pi 5 (PL-CSE & DMAL-CSE)
    ["SIT-CSE-4CL07-0081", "SBC-RPI-05", "Raspberry Pi 5 Model B 8GB RAM", "PL-CSE", "RP5-081", "CPR/2024/0301", "RPI5-8G-002194", "AVAILABLE", None],
    ["SIT-CSE-4CL07-0082", "SBC-RPI-05", "Raspberry Pi 5 Model B 8GB RAM", "PL-CSE", "RP5-082", "CPR/2024/0301", "RPI5-8G-002195", "AVAILABLE", None],
    ["SIT-CSE-4CL07-0083", "SBC-RPI-05", "Raspberry Pi 5 Model B 8GB RAM", "PL-CSE", "RP5-083", "CPR/2024/0301", "RPI5-8G-002196", "IN_USE", "25070122045"],
    ["SIT-CSE-4CL09-0084", "SBC-RPI-05", "Raspberry Pi 5 Model B 8GB RAM", "DMAL-CSE", "RP5-084", "CPR/2024/0302", "RPI5-8G-002197", "AVAILABLE", None],

    # Intel RealSense Depth Cameras (CV-AIML & AI-AIML)
    ["SIT-AIML-5CL03-0101", "CAM-INT-01", "Intel RealSense Depth Camera D435i", "CV-AIML", "RS-101", "CPR/2023/0740", "INT-RS-55210", "AVAILABLE", None],
    ["SIT-AIML-5CL03-0102", "CAM-INT-01", "Intel RealSense Depth Camera D435i", "CV-AIML", "RS-102", "CPR/2023/0740", "INT-RS-55211", "AVAILABLE", None],
    ["SIT-AIML-5CL11-0103", "CAM-INT-01", "Intel RealSense Depth Camera D435i", "AI-AIML", "RS-103", "CPR/2023/0741", "INT-RS-55212", "IN_USE", "25070126076"],

    # LiDAR (MRL-RA)
    ["SIT-RA-6RA02-0121", "LID-OUS-01", "Ouster OS1-32 Gen 2 LiDAR Sensor", "MRL-RA", "LID-121", "CPR/2023/0995", "OUS-32-11002", "AVAILABLE", None],
    ["SIT-RA-6RA02-0122", "LID-OUS-01", "Ouster OS1-32 Gen 2 LiDAR Sensor", "MRL-RA", "LID-122", "CPR/2023/0995", "OUS-32-11003", "RESERVED", None],

    # TurtleBot 3 Burger (MRL-RA & AI-AIML)
    ["SIT-RA-6RA02-0141", "ROB-TB3-01", "TurtleBot 3 Burger Mobile Robot", "MRL-RA", "TB3-141", "CPR/2024/0410", "ROB-TB3-77401", "AVAILABLE", None],
    ["SIT-RA-6RA02-0142", "ROB-TB3-01", "TurtleBot 3 Burger Mobile Robot", "MRL-RA", "TB3-142", "CPR/2024/0410", "ROB-TB3-77402", "AVAILABLE", None],
    ["SIT-AIML-5CL11-0143", "ROB-TB3-01", "TurtleBot 3 Burger Mobile Robot", "AI-AIML", "TB3-143", "CPR/2024/0411", "ROB-TB3-77403", "IN_USE", "24070127008"],

    # TurtleBot 4 (MRL-RA)
    ["SIT-RA-6RA02-0161", "ROB-TB4-01", "TurtleBot 4 Standard Mobile Robot", "MRL-RA", "TB4-161", "CPR/2024/1205", "CP-TB4-00109", "AVAILABLE", None],
    ["SIT-RA-6RA02-0162", "ROB-TB4-01", "TurtleBot 4 Standard Mobile Robot", "MRL-RA", "TB4-162", "CPR/2024/1205", "CP-TB4-00110", "AVAILABLE", None],

    # Dobot Magician Robotic Arm (MIOT-RA)
    ["SIT-RA-6RA01-0181", "ARM-DOB-01", "Dobot Magician 4-DOF Robotic Arm", "MIOT-RA", "DOB-181", "CPR/2023/1080", "DOB-MAG-33901", "AVAILABLE", None],
    ["SIT-RA-6RA01-0182", "ARM-DOB-01", "Dobot Magician 4-DOF Robotic Arm", "MIOT-RA", "DOB-182", "CPR/2023/1080", "DOB-MAG-33902", "AVAILABLE", None],

    # Kinova Gen3 Lite (MRL-RA)
    ["SIT-RA-6RA02-0201", "ARM-KIN-01", "Kinova Gen3 Lite Robotic Arm", "MRL-RA", "KIN-201", "CPR/2023/1350", "KIN-G3L-00441", "AVAILABLE", None],

    # Siemens S7-1200 PLC (MIOT-RA)
    ["SIT-RA-6RA01-0221", "PLC-SIE-01", "Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC", "MIOT-RA", "PLC-221", "CPR/2023/0620", "SIE-S7-882101", "AVAILABLE", None],
    ["SIT-RA-6RA01-0222", "PLC-SIE-01", "Siemens SIMATIC S7-1200 CPU 1214C DC/DC/DC", "MIOT-RA", "PLC-222", "CPR/2023/0620", "SIE-S7-882102", "AVAILABLE", None],

    # Rigol Oscilloscopes (PL-CSE & AI-AIML)
    ["SIT-CSE-4CL07-0241", "OSC-RIG-01", "Rigol DS1054Z 50MHz Digital Oscilloscope", "PL-CSE", "OSC-241", "CPR/2022/1501", "RIG-DS-99104", "AVAILABLE", None],
    ["SIT-AIML-5CL11-0242", "OSC-RIG-01", "Rigol DS1054Z 50MHz Digital Oscilloscope", "AI-AIML", "OSC-242", "CPR/2022/1502", "RIG-DS-99105", "AVAILABLE", None],

    # Digital Multimeters (CV-AIML, DV-AIML & MTECH-CSE)
    ["SIT-AIML-5CL03-0261", "MET-DIG-01", "Digital Multimeter MAS830L with Test Leads", "CV-AIML", "DMM-261", "CPR/2024/0115", "MAS-830-771101", "AVAILABLE", None],
    ["SIT-AIML-5CL03-0262", "MET-DIG-01", "Digital Multimeter MAS830L with Test Leads", "CV-AIML", "DMM-262", "CPR/2024/0115", "MAS-830-771102", "AVAILABLE", None],
    ["SIT-AIML-5CL02-0281", "MET-DIG-01", "Digital Multimeter MAS830L with Test Leads", "DV-AIML", "DMM-281", "CPR/2024/0220", "MAS-830-55101", "AVAILABLE", None],
    ["SIT-CSE-5CL01-0282", "MET-DIG-01", "Digital Multimeter MAS830L with Test Leads", "MTECH-CSE", "DMM-282", "CPR/2024/0220", "MAS-830-55102", "AVAILABLE", None],

    # FLIR Thermal Camera (CV-AIML)
    ["SIT-AIML-5CL03-0301", "CAM-FLI-01", "FLIR Lepton 3.5 Radiometric LWIR Thermal Camera", "CV-AIML", "FLI-301", "CPR/2023/1188", "FLI-LEP-22019", "AVAILABLE", None]
]

ws_assets = wb.create_sheet(title="Assets")
style_sheet(ws_assets, ["Barcode", "Item ID", "Item Name", "Lab ID", "Default ID", "Bill Number", "Serial Number", "State", "Custody Holder PRN"], ASSETS_DATA)

# ==============================================================================
# 6. PROJECTS & MEMBERS (8 Capstone Projects across AIML, CSE, RA)
# ==============================================================================
PROJECTS_DATA = [
    ["PROJ-000001", "Autonomous Quadruped Vision Robot", "SLAM navigation and stereo depth perception on Jetson Nano", "25070126076", "Ishaan Chand", "T100460", "Dr. Manoj Patil", "AIML"],
    ["PROJ-000002", "Distributed Edge AI Camera Node", "High-throughput object detection using Raspberry Pi 5 and Intel RealSense", "25070122045", "Raghavendra Joshi", "T100455", "Dr. Anand Deshmukh", "CSE"],
    ["PROJ-000003", "Precision Sorting Robotic Arm", "Pick and place sorting using Dobot Magician and visual servoing", "25070127003", "Chirag Singhania", "T100466", "Dr. Vinay Tambe", "RA"],
    ["PROJ-000004", "Campus IoT Environmental Telemetry Grid", "Multi-hop LoRa / Wi-Fi air quality sensing array across academic buildings", "24070126005", "Rohan Joshi", "T100461", "Dr. Sandeep Shinde", "AIML"],
    ["PROJ-000005", "Autonomous Mobile Warehouse AGV", "LiDAR-based obstacle avoidance and autonomous docking robot", "24070127008", "Kunal Gokhale", "T100467", "Dr. Chetan Jagtap", "RA"],
    ["PROJ-000006", "Smart Laboratory Access & Component Dispenser", "Automated RFID locker dispensing system with Siemens PLC integration", "24070122009", "Siddharth Menon", "T100454", "Dr. Sneha Joshi", "CSE"],
    ["PROJ-000007", "Multi-Spectral Crop Health UAV Drone", "Thermal LWIR and RGB-D vision analysis for precision agricultural diagnostics", "23070126012", "Aryan Saxena", "T100458", "Dr. Meenakshi Sharma", "AIML"],
    ["PROJ-000008", "High-Speed Industrial Quality Inspection Cell", "Industrial visual flaw detection using high-speed camera and pneumatic rejector", "23070127014", "Deepak Solanki", "T100466", "Dr. Vinay Tambe", "RA"]
]

ws_projects = wb.create_sheet(title="Projects")
style_sheet(ws_projects, ["Project ID", "Project Name", "Description", "Lead PRN", "Lead Name", "Mentor Faculty ID", "Mentor Name", "Department"], PROJECTS_DATA)

PROJECT_MEMBERS_DATA = [
    # PROJ-000001
    ["PROJ-000001", "25070126076", "Ishaan Chand", "LEAD"],
    ["PROJ-000001", "25070126001", "Aarav Sharma", "MEMBER"],
    ["PROJ-000001", "25070126014", "Diya Kapoor", "MEMBER"],
    ["PROJ-000001", "25070122045", "Raghavendra Joshi", "COLLABORATOR"],

    # PROJ-000002
    ["PROJ-000002", "25070122045", "Raghavendra Joshi", "LEAD"],
    ["PROJ-000002", "25070122002", "Pooja Hegde", "MEMBER"],
    ["PROJ-000002", "25070122018", "Nikhil Rao", "MEMBER"],

    # PROJ-000003
    ["PROJ-000003", "25070127003", "Chirag Singhania", "LEAD"],
    ["PROJ-000003", "25070127016", "Isha Nambiar", "MEMBER"],
    ["PROJ-000003", "25070127029", "Pranav Anand", "MEMBER"],

    # PROJ-000004
    ["PROJ-000004", "24070126005", "Rohan Joshi", "LEAD"],
    ["PROJ-000004", "24070126019", "Ananya Deshmukh", "MEMBER"],
    ["PROJ-000004", "24070126033", "Varun Nair", "MEMBER"],

    # PROJ-000005
    ["PROJ-000005", "24070127008", "Kunal Gokhale", "LEAD"],
    ["PROJ-000005", "24070127021", "Ritika Roy", "MEMBER"],
    ["PROJ-000005", "24070127035", "Tushar Agrawal", "MEMBER"],

    # PROJ-000006
    ["PROJ-000006", "24070122009", "Siddharth Menon", "LEAD"],
    ["PROJ-000006", "24070122022", "Kavya Iyer", "MEMBER"],

    # PROJ-000007
    ["PROJ-000007", "23070126012", "Aryan Saxena", "LEAD"],
    ["PROJ-000007", "23070126025", "Sneha Kulkarni", "MEMBER"],

    # PROJ-000008
    ["PROJ-000008", "23070127014", "Deepak Solanki", "LEAD"],
    ["PROJ-000008", "23070127027", "Aishwarya Mane", "MEMBER"]
]

ws_members = wb.create_sheet(title="Project_Members")
style_sheet(ws_members, ["Project ID", "Student PRN", "Student Name", "Project Role"], PROJECT_MEMBERS_DATA)

# Save Workbook
excel_path = "public/data/labtrack_master_data.xlsx"
alt_path = "public/data/labtrack_master_data_updated.xlsx"
try:
    wb.save(excel_path)
    print(f"[OK] Master Data Excel successfully generated at: {excel_path}")
    if os.path.exists(alt_path):
        try:
            os.remove(alt_path)
        except Exception:
            pass
except PermissionError:
    wb.save(alt_path)
    print(f"[WARN] '{excel_path}' is locked by Excel. Saved latest master data to '{alt_path}'.")

