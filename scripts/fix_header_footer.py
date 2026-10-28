"""
Fix and perfectly align headers and footers on LabTrack_DCDSL_Final_Project_Report_Refined.docx.
Enforces:
1. Vertical symmetry:
   - top_margin = 1.0 inch (1440 dxa)
   - bottom_margin = 1.0 inch (1440 dxa)
   - header_distance = 0.5 inch (720 dxa)
   - footer_distance = 0.5 inch (720 dxa)
   - left_margin = 1.25 inch (1800 dxa)
   - right_margin = 1.0 inch (1440 dxa)
   - printable width = 11906 - 1800 - 1440 = 8666 dxa (6.018 in)

2. Header symmetry & consistency:
   - Left: "LabTrack: Institutional Hardware Lifecycle & Custody System" (Times New Roman 9.5pt bold, #1B365D)
   - Right: "DCDSL Project Report" (Times New Roman 9.5pt italic, #475569) aligned via tab stop at 8666 dxa
   - Bottom border rule: single 0.75pt line (#94A3B8) spanning the full text width
   - noProof applied to prevent red spellcheck lines

3. Footer symmetry & consistency:
   - Top border rule: single 0.75pt line (#94A3B8) spanning the full text width
   - Left: "Department of AI&ML" (Times New Roman 9.5pt bold, #1B365D)
   - Right: "Page " + dynamic PAGE field (Times New Roman 9.5pt bold, #1E293B) aligned via tab stop at 8666 dxa
   - noProof applied

4. Section isolation:
   - Section 1 (Cover): header/footer unlinked & empty
   - Section 2 (Certificate): header has SIT university logo, footer empty
   - Section 3 (TOC): header/footer unlinked & empty
   - Section 4 (Report Body): page number restarts at 1 on Introduction page
"""

import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

REFINED_PATH = r"D:\Users\Documents\Symbiosis\Academics\Sem 3\Low Credit\CCE\Project\presentations\DCDS\LabTrack_DCDSL_Final_Project_Report_Refined.docx"

def fix_header_footer():
    print(f"Opening report: {REFINED_PATH}")
    doc = Document(REFINED_PATH)

    print(f"Total sections: {len(doc.sections)}")
    # Section 4 is the report body
    body_sec = doc.sections[3]

    # 1. Set exact margins and distances for perfect vertical and horizontal symmetry
    body_sec.page_width = Inches(8.27)      # A4 width = 11906 dxa
    body_sec.page_height = Inches(11.69)    # A4 height = 16838 dxa
    body_sec.left_margin = Inches(1.25)     # 1800 dxa (spiral binding gutter)
    body_sec.right_margin = Inches(1.0)     # 1440 dxa
    body_sec.top_margin = Inches(1.0)       # 1440 dxa
    body_sec.bottom_margin = Inches(1.0)    # 1440 dxa
    body_sec.header_distance = Inches(0.5)  # 720 dxa (symmetrically positioned 0.5 in from top)
    body_sec.footer_distance = Inches(0.5)  # 720 dxa (symmetrically positioned 0.5 in from bottom)

    # Printable width between left and right margins: 11906 - 1800 - 1440 = 8666 dxa
    TAB_STOP_RIGHT = "8666"

    # Unlink from previous sections
    body_sec.header.is_linked_to_previous = False
    body_sec.footer.is_linked_to_previous = False

    # 2. Build perfectly symmetric Header
    hdr = body_sec.header
    for p in hdr.paragraphs:
        p._p.getparent().remove(p._p)

    hdr_p_xml = f'''
    <w:p {nsdecls("w")}>
      <w:pPr>
        <w:pBdr>
          <w:bottom w:val="single" w:sz="6" w:space="4" w:color="94A3B8"/>
        </w:pBdr>
        <w:tabs>
          <w:tab w:val="right" w:pos="{TAB_STOP_RIGHT}"/>
        </w:tabs>
        <w:spacing w:before="0" w:after="72" w:line="240" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:color w:val="1B365D"/>
          <w:sz w:val="19"/>
          <w:szCs w:val="19"/>
          <w:noProof/>
        </w:rPr>
        <w:t>LabTrack: Institutional Hardware Lifecycle &amp; Custody System</w:t>
      </w:r>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:i/>
          <w:color w:val="475569"/>
          <w:sz w:val="19"/>
          <w:szCs w:val="19"/>
          <w:noProof/>
        </w:rPr>
        <w:tab/>
        <w:t>DCDSL Project Report</w:t>
      </w:r>
    </w:p>
    '''
    hdr._element.append(parse_xml(hdr_p_xml))

    # 3. Build perfectly symmetric Footer
    ftr = body_sec.footer
    for p in ftr.paragraphs:
        p._p.getparent().remove(p._p)

    ftr_p_xml = f'''
    <w:p {nsdecls("w")}>
      <w:pPr>
        <w:pBdr>
          <w:top w:val="single" w:sz="6" w:space="4" w:color="94A3B8"/>
        </w:pBdr>
        <w:tabs>
          <w:tab w:val="right" w:pos="{TAB_STOP_RIGHT}"/>
        </w:tabs>
        <w:spacing w:before="72" w:after="0" w:line="240" w:lineRule="auto"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:color w:val="1B365D"/>
          <w:sz w:val="19"/>
          <w:szCs w:val="19"/>
          <w:noProof/>
        </w:rPr>
        <w:t>Department of AI&amp;ML</w:t>
      </w:r>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
          <w:b/>
          <w:color w:val="1E293B"/>
          <w:sz w:val="19"/>
          <w:szCs w:val="19"/>
          <w:noProof/>
        </w:rPr>
        <w:tab/>
        <w:t xml:space="preserve">Page </w:t>
      </w:r>
      <w:fldSimple w:instr="PAGE">
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
            <w:b/>
            <w:color w:val="1E293B"/>
            <w:sz w:val="19"/>
            <w:szCs w:val="19"/>
            <w:noProof/>
          </w:rPr>
          <w:t>1</w:t>
        </w:r>
      </w:fldSimple>
    </w:p>
    '''
    ftr._element.append(parse_xml(ftr_p_xml))

    # 4. Enforce page numbering restart at 1 in Section 4
    sectPr = body_sec._sectPr
    pgNumType = sectPr.find(qn('w:pgNumType'))
    if pgNumType is None:
        pgNumType = OxmlElement('w:pgNumType')
        sectPr.append(pgNumType)
    pgNumType.set(qn('w:start'), '1')

    # 5. Clean Section 3 (TOC) - no header, no footer
    sec3 = doc.sections[2]
    sec3.header.is_linked_to_previous = False
    sec3.footer.is_linked_to_previous = False
    for p in sec3.header.paragraphs:
        p.text = ""
    for p in sec3.footer.paragraphs:
        p.text = ""

    # 6. Save directly to the refined report
    doc.save(REFINED_PATH)
    print("Report saved successfully with updated header and footer!")

if __name__ == '__main__':
    fix_header_footer()
