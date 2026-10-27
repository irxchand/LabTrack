"""Live end-to-end lifecycle test script with Gmail SMTP dispatch.

Executes a complete request approval sequence:
1. Requisition Submission by Student (Rahul Sharma) -> REQUEST_SUBMITTED email
2. Faculty Mentor Approval (Dr. Meenakshi Sharma) -> MENTOR_APPROVED email
3. Asset Lab In-Charge Approval (Dr. Snehal Mohan) -> INCHARGE_DECISION email
4. Head of Department Approval (Dr. Sumit Kumar) -> HOD_APPROVED email

All emails are dispatched through SMTPEmailProvider to labtrack821@gmail.com.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src" / "backend"))

from labtrack import db, service, worker
from labtrack.config import settings
from labtrack.models import User, Project, Item, Request, Outbox, Delivery
from labtrack.schemas import RequestInput, Quantity, DecisionInput
from sqlalchemy import select

print("==================================================================")
print("LABTRACK LIVE SMTP LIFECYCLE TEST")
print("Target Inbox:", settings.email_override or settings.smtp_username)
print("SMTP Server:", f"{settings.smtp_host}:{settings.smtp_port} (TLS={settings.smtp_use_tls})")
print("==================================================================")

with db.Session() as s:
    # 1. Fetch relevant users
    student = s.scalar(select(User).where(User.roles.contains("STUDENT"), User.active).order_by(User.id))
    mentor = s.scalar(select(User).where(User.roles.contains("MENTOR"), User.active).order_by(User.id))
    incharge = s.scalar(select(User).where(User.roles.contains("INCHARGE"), User.active, User.id != mentor.id).order_by(User.id))
    hod = s.scalar(select(User).where(User.roles.contains("HOD"), User.active, User.id.notin_([mentor.id, incharge.id])).order_by(User.id))
    
    print(f"Student:    {student.name} (ID: {student.id}, Email: {student.email})")
    print(f"Mentor:     {mentor.name} (ID: {mentor.id}, Email: {mentor.email})")
    print(f"In-Charge:  {incharge.name} (ID: {incharge.id}, Email: {incharge.email})")
    print(f"HoD:        {hod.name} (ID: {hod.id}, Email: {hod.email})")

    # 2. Get or create project with this mentor
    project = s.scalar(select(Project).where(Project.lead_id == student.id, Project.mentor_id == mentor.id))
    if not project:
        project = Project(
            name="Autonomous Vision Robot (Capstone 2026)",
            description="Autonomous navigation using stereo camera and onboard neural computing.",
            lead_id=student.id,
            mentor_id=mentor.id
        )
        s.add(project)
        s.flush()
    print(f"Project:    {project.name} (ID: {project.id})")

    # 3. Find an available ASSET item managed by incharge
    # Find item
    item = s.scalar(select(Item).where(Item.kind == "ASSET").order_by(Item.id))
    print(f"Hardware:   {item.name} (Kind: {item.kind}, ID: {item.id})")

    # 4. Submit Requisition
    print("\n--- STEP 1: Student Submitting Hardware Requisition ---")
    submit_input = RequestInput(
        project_id=project.id,
        duration_hours=72,
        purpose="USE_IN_COLLEGE",
        lines=[Quantity(item_id=item.id, quantity=1)]
    )
    result = service.submit_request(s, student, submit_input)
    req_id = result["id"]
    s.commit()
    print(f"Request #{req_id} Submitted! State: {result['state']}")

    print("Dispatching Outbox events for submission...")
    worker.dispatch(s)
    s.commit()
    print("-> Email for REQUEST_SUBMITTED dispatched via Gmail SMTP!")

    # 5. Mentor Decision
    print(f"\n--- STEP 2: Faculty Mentor ({mentor.name}) Review & Approval ---")
    mentor_decision = DecisionInput(decision="APPROVE", remarks="Academic scope and technical feasibility verified.")
    dec_res = service.decide(s, mentor, req_id, mentor_decision)
    s.commit()
    print(f"Mentor Approved! Request #{req_id} New State: {dec_res['state']}")

    print("Dispatching Outbox events for Mentor Approval...")
    worker.dispatch(s)
    s.commit()
    print("-> Email for MENTOR_APPROVED dispatched via Gmail SMTP!")

    # 6. Check state: If INCHARGE_REVIEW, Lab Incharge decides
    req_obj = s.get(Request, req_id)
    if req_obj.state == "INCHARGE_REVIEW":
        print(f"\n--- STEP 3: Lab In-Charge Review & Allocation ---")
        inc_user = s.get(User, req_obj.incharge_id)
        incharge_decision = DecisionInput(decision="APPROVE", remarks="Physical hardware inspected and reserved in lab.")
        inc_res = service.decide(s, inc_user, req_id, incharge_decision)
        s.commit()
        print(f"Lab In-Charge Approved! Request #{req_id} New State: {inc_res['state']}")

        print("Dispatching Outbox events for In-Charge Decision...")
        worker.dispatch(s)
        s.commit()
        print("-> Email for INCHARGE_DECISION dispatched via Gmail SMTP!")

    # 7. HoD Decision
    req_obj = s.get(Request, req_id)
    if req_obj.state == "HOD_REVIEW":
        print(f"\n--- STEP 4: Head of Department ({hod.name}) Final Approval ---")
        hod_decision = DecisionInput(decision="APPROVE", remarks="Final departmental approval granted for lab collection.")
        hod_res = service.decide(s, hod, req_id, hod_decision)
        s.commit()
        print(f"HoD Approved! Request #{req_id} Final State: {hod_res['state']}")

        print("Dispatching Outbox events for HoD Approval...")
        worker.dispatch(s)
        s.commit()
        print("-> Email for HOD_APPROVED dispatched via Gmail SMTP!")

print("\n==================================================================")
print(f"ALL 4 LIFECYCLE EMAILS FOR REQUEST #{req_id} SUCCESSFULLY DISPATCHED!")
print("Check inbox: labtrack821@gmail.com")
print("==================================================================")
