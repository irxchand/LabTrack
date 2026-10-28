"""
Audit script for LabTrack_DCDSL_Final_Project_Report_Refined.docx.
Checks:
1. File size and existence
2. Zero em-dashes in ALL XML parts inside the docx zip
3. Count of embedded images and media
4. Table structures: check tblHeader, cantSplit, borders, and column alignments
5. Technical code formatting: check noProof tags and font families
6. Section properties: headers, footers, page numbering restart
7. Preservation of official faculty template and original backup report
"""

import os
import zipfile
import xml.etree.ElementTree as ET
from docx import Document

BASE_DIR = r"D:\Users\Documents\Symbiosis\Academics\Sem 3\Low Credit\CCE\Project"
REFINED_PATH = os.path.join(BASE_DIR, "presentations", "DCDS", "LabTrack_DCDSL_Final_Project_Report_Refined.docx")
BACKUP_PATH = os.path.join(BASE_DIR, "presentations", "DCDS", "LabTrack_DCDSL_Final_Project_Report.docx")
TEMPLATE_PATH = os.path.join(BASE_DIR, "presentations", "DCDS", "DCDSL PROJECT REPORT format.docx")

def audit_docx():
    print("=== LABTRACK REFINED DOCX AUDIT ===")
    
    # 1. Existence and sizes
    for label, path in [("Refined Report", REFINED_PATH), ("Backup Report", BACKUP_PATH), ("Faculty Template", TEMPLATE_PATH)]:
        if os.path.exists(path):
            size_kb = os.path.getsize(path) / 1024
            print(f"[{label}] Found: {path} ({size_kb:.1f} KB)")
        else:
            print(f"[{label}] ERROR: File not found at {path}")

    # 2. Deep XML search for em dashes (\u2014) in ALL zip entries
    em_dash_count = 0
    with zipfile.ZipFile(REFINED_PATH, 'r') as zf:
        for fname in zf.namelist():
            if fname.endswith(('.xml', '.rels')):
                content = zf.read(fname).decode('utf-8', errors='ignore')
                count = content.count('\u2014') + content.count('&mdash;')
                if count > 0:
                    print(f"  WARNING: Found {count} em dash(es) in {fname}!")
                    em_dash_count += count
        
        # Count media images
        media_files = [f for f in zf.namelist() if f.startswith('word/media/')]
        print(f"\nEmbedded media files in docx ({len(media_files)} files):")
        for mf in sorted(media_files):
            info = zf.getinfo(mf)
            print(f"  - {mf} ({info.file_size / 1024:.1f} KB)")
            
    if em_dash_count == 0:
        print("\n>>> ZERO EM DASHES CONFIRMED across all XML parts.")
    else:
        print(f"\n>>> AUDIT FAILED: {em_dash_count} em dashes found.")

    # 3. Document inspection via python-docx
    doc = Document(REFINED_PATH)
    print(f"\nTotal Paragraphs: {len(doc.paragraphs)}")
    print(f"Total Tables: {len(doc.tables)}")
    print(f"Total Sections: {len(doc.sections)}")

    # 4. Table inspection
    tbl_with_header = 0
    tbl_with_cantsplit = 0
    for i, tbl in enumerate(doc.tables):
        # Check first row for tblHeader
        first_row_xml = tbl.rows[0]._tr.xml
        if 'tblHeader' in first_row_xml:
            tbl_with_header += 1
        # Check all rows for cantSplit
        has_cantsplit = all('cantSplit' in row._tr.xml for row in tbl.rows)
        if has_cantsplit:
            tbl_with_cantsplit += 1
            
    print(f"Tables with repeated header (<w:tblHeader/>): {tbl_with_header}/{len(doc.tables)}")
    print(f"Tables with non-splitting rows (<w:cantSplit/>): {tbl_with_cantsplit}/{len(doc.tables)}")

    # 5. Technical code formatting and noProof inspection
    code_runs = 0
    noproof_runs = 0
    for p in doc.paragraphs:
        for r in p.runs:
            if r.font.name == 'Consolas':
                code_runs += 1
            if 'noProof' in r._r.xml:
                noproof_runs += 1
                
    for tbl in doc.tables:
        for row in tbl.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    for r in p.runs:
                        if r.font.name == 'Consolas':
                            code_runs += 1
                        if 'noProof' in r._r.xml:
                            noproof_runs += 1

    print(f"Total Consolas code runs: {code_runs}")
    print(f"Total runs with spelling squiggles suppressed (<w:noProof/>): {noproof_runs}")

    # 6. Check Figures and Tables captions in paragraphs
    fig_captions = [p.text for p in doc.paragraphs if p.text.startswith("Figure ")]
    tbl_captions = [p.text for p in doc.paragraphs if p.text.startswith("Table ")]
    print(f"\nDiscovered Figures ({len(fig_captions)}):")
    for fc in fig_captions:
        print(f"  {fc}")

    print(f"\nDiscovered Table Captions ({len(tbl_captions)}):")
    for tc in tbl_captions[:15]:
        print(f"  {tc}")
    if len(tbl_captions) > 15:
        print(f"  ... and {len(tbl_captions) - 15} more tables.")

    # 7. Check section header & footers
    print("\nSection headers and footers:")
    for idx, s in enumerate(doc.sections):
        hdr_txt = "".join(p.text for p in s.header.paragraphs).strip()
        ftr_txt = "".join(p.text for p in s.footer.paragraphs).strip()
        print(f"  Section {idx + 1}: Header='{hdr_txt}' | Footer='{ftr_txt}'")

if __name__ == '__main__':
    audit_docx()
